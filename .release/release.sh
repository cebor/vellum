#!/usr/bin/env bash
# Cuts a release: checks, changelog, tag, and the two pushes that make it real.
#
# The theme is developed on GitLab and installed from github.com/cebor/vellum,
# and nothing is mirrored automatically. The registry reads the *latest tag* on
# GitHub, so a release that stops at GitLab is a release the theme site never
# sees — and a release nobody can install. That is the step this script exists
# to stop anyone from forgetting, together with the checks that have to pass
# before a tag is worth pushing at all.
#
# Usage, from anywhere:
#   .release/release.sh                # version from the commits since the last tag
#   .release/release.sh minor          # force a bump level
#   .release/release.sh 0.3.0          # force a version
#   .release/release.sh --dry-run      # run every check, print the section, write nothing
#
# Flags:
#   --dry-run               do everything up to the first write, then stop
#   --edit                  open the generated section in $EDITOR before it is used
#   --yes                   skip the confirmation prompt
#   --allow-unconventional  release even though some commits are unparseable
#   --allow-empty           release even though nothing user-visible changed
#
# Exit status: 0 released, 1 a check failed, 2 usage or environment error.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)" || exit 2
cd "$ROOT" || exit 2

DRY=0; YES=0; EDIT=0; ALLOW_UNCONV=0; ALLOW_EMPTY=0; WANT=""

for arg in "$@"; do
    case "$arg" in
        --dry-run)              DRY=1 ;;
        --edit)                 EDIT=1 ;;
        --yes|-y)               YES=1 ;;
        --allow-unconventional) ALLOW_UNCONV=1 ;;
        --allow-empty)          ALLOW_EMPTY=1 ;;
        major|minor|patch)      WANT="$arg" ;;
        [0-9]*.[0-9]*.[0-9]*|v[0-9]*.[0-9]*.[0-9]*) WANT="${arg#v}" ;;
        -h|--help)              sed -n '2,24p' "$0"; exit 0 ;;
        *) echo "unknown argument: $arg" >&2; exit 2 ;;
    esac
done

step() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nrelease: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------- preflight

step "Repository state"

BRANCH="$(git symbolic-ref --short -q HEAD)" || fail "detached HEAD; release from main"
[ "$BRANCH" = main ] || fail "on '$BRANCH'; releases are cut from main"
[ -z "$(git status --porcelain)" ] || fail "working tree is dirty; commit or stash first"

for remote in origin github; do
    git remote get-url "$remote" >/dev/null 2>&1 \
        || fail "no '$remote' remote; both are required — GitLab is where main is written, GitHub is what users install from"
done

git fetch --quiet --tags origin || fail "cannot reach origin"
behind="$(git rev-list --count HEAD..origin/main 2>/dev/null)" || behind=unknown
[ "$behind" = 0 ] || fail "origin/main has $behind commit(s) this checkout does not; pull first"

[ -f CHANGELOG.md ] || fail "no CHANGELOG.md to write into"

# .parity/ is tracked, so this is no longer a check for the right machine but for
# an intact checkout: the file is in the history and git carries its exec bit, so
# a miss here means it was deleted or unset locally. Releasing without it would
# ship the one thing PRODUCT.md calls binding, unchecked, so its absence stops
# the release rather than being skipped over. `git checkout -- .parity` restores it.
[ -x .parity/check.sh ] || fail ".parity/check.sh is missing or not executable; it is tracked, so restore it with 'git checkout -- .parity' — a release is not cut without the URL-parity check"

LAST_TAG="$(git describe --tags --abbrev=0 2>/dev/null)" || fail "no tag to release from"
COUNT="$(git rev-list --count --no-merges "$LAST_TAG..HEAD")"
[ "$COUNT" -gt 0 ] || fail "nothing since $LAST_TAG"
echo "    $LAST_TAG → HEAD: $COUNT commit(s)"

step "Registry fixtures"

# themes.gohugo.io reads these out of the tagged release; without them the theme
# gallery shows a placeholder, which is only visible on the theme site itself
# and so is exactly the kind of thing that goes unnoticed for a release or two.
# Dimensions come out of the PNG's IHDR chunk, at a fixed offset in every PNG.
#
# --endian is GNU od's, and macOS ships BSD od, which does not have it — so this
# check warned instead of running on exactly the machine releases are cut from,
# and a wrongly sized fixture would have reached the tag with a warning nobody
# reads. Homebrew installs GNU coreutils g-prefixed, so `god` is the one to reach
# for first; the bare name is right on Linux and in CI.
OD=od; command -v god >/dev/null && OD=god
png_size() { "$OD" -An -v -tu4 -j16 -N8 --endian=big "$1" 2>/dev/null | awk 'NF{print $1"x"$2; exit}'; }
check_png() { # check_png <path> <expected>
    [ -f "$1" ] || fail "$1 is missing; the theme gallery needs it in the tag"
    got="$(png_size "$1")"
    if [ -z "$got" ]; then echo "    warn: cannot read $1's dimensions here; expected $2"
    elif [ "$got" != "$2" ]; then fail "$1 is $got, must be $2 (the registry accepts 3:2 PNG/JPG only)"
    else echo "    $1 $got"; fi
}
check_png images/screenshot.png 1500x1000
check_png images/tn.png 900x600

step "Changelog"

command -v hugo >/dev/null || fail "hugo not on PATH"
hugo version | grep -q extended || fail "this theme requires Hugo extended"

WORK="$(mktemp -d "${TMPDIR:-/tmp}/vellum-release.XXXXXX")" || exit 2
trap 'rm -rf "$WORK"' EXIT
SECTION="$WORK/section.md"

# Version first, because the section header carries it. The bump is read off the
# same commits the section is: a footer that promises a breaking change and a
# version that does not admit to one is the failure worth preventing here.
range="$LAST_TAG..HEAD"
breaking=0; feat=0
git log --format='%s' --no-merges "$range" | grep -Eq '^[a-z]+(\([^)]*\))?!:' && breaking=1
git log --format='%b' --no-merges "$range" | grep -Eq '^BREAKING[ -]CHANGE:'   && breaking=1
git log --format='%s' --no-merges "$range" | grep -Eq '^feat(\(|!|:)'          && feat=1

cur="${LAST_TAG#v}"
IFS=. read -r MA MI PA <<<"$cur"

case "$WANT" in
    major|minor|patch) level="$WANT" ;;
    "") if [ "$MA" -eq 0 ]; then
            # Pre-1.0 the majors are free, so the signal is put in the minor:
            # a minor bump means "read the changelog before upgrading", and
            # everything else is a patch. Post-1.0 this becomes plain semver.
            level=$([ "$breaking" = 1 ] && echo minor || echo patch)
        else
            level=$([ "$breaking" = 1 ] && echo major || { [ "$feat" = 1 ] && echo minor || echo patch; })
        fi ;;
    *) level="" ;;
esac

case "$level" in
    major) VERSION="$((MA + 1)).0.0" ;;
    minor) VERSION="$MA.$((MI + 1)).0" ;;
    patch) VERSION="$MA.$MI.$((PA + 1))" ;;
    *)     VERSION="$WANT"
           [ "$(printf '%s\n%s\n' "$cur" "$VERSION" | sort -V | tail -1)" = "$VERSION" ] \
               && [ "$VERSION" != "$cur" ] || fail "$VERSION does not come after $cur" ;;
esac

if [ "$breaking" = 1 ]; then echo "    breaking changes in range → $LAST_TAG to v$VERSION"
else echo "    $LAST_TAG → v$VERSION"; fi

.release/changelog.sh "$VERSION" "$range" > "$SECTION"
rc=$?
case "$rc" in
    0) ;;
    3) [ "$ALLOW_UNCONV" = 1 ] \
           || fail "commits above are missing from the changelog; fix the history or pass --allow-unconventional" ;;
    4) [ "$ALLOW_EMPTY" = 1 ] \
           || fail "nothing user-visible since $LAST_TAG — a release with no feat/fix/perf is usually not worth cutting; pass --allow-empty if it is" ;;
    *) fail "changelog generation failed" ;;
esac

step "URL parity against $LAST_TAG"

# The binding commitment: consuming sites deploy with `rsync --delete`, so a
# path this build stopped emitting is a live 404 on every site that upgrades.
# check.sh builds both sides, so a green run is also proof the theme compiles.
.parity/check.sh "$LAST_TAG" || fail "URL parity failed — see the lost paths above; a release cannot take those away silently"

# ------------------------------------------------------------------ release

# The generator writes what the commits say. Where that is not yet the whole
# story — the run that first adopted the format, a group that reads better
# reordered — this is the one place to say it, before the section becomes both
# the changelog entry and the tag message.
if [ "$EDIT" = 1 ]; then
    # Unquoted on purpose: EDITOR conventionally carries flags ("code -w").
    ${EDITOR:-vi} "$SECTION" || fail "editor exited non-zero; nothing written"
    head -1 "$SECTION" | grep -q "^## " || fail "the section no longer starts with its '## [version]' heading"
fi

printf '\n----------------------------------------------------------------\n'
cat "$SECTION"
printf -- '----------------------------------------------------------------\n'

[ "$DRY" = 1 ] && { echo; echo "dry run: nothing written, nothing pushed."; exit 0; }

if [ "$YES" != 1 ]; then
    printf '\nRelease v%s and push to origin and github? [y/N] ' "$VERSION"
    read -r answer
    case "$answer" in y|Y|yes) ;; *) echo "aborted."; exit 0 ;; esac
fi

step "Writing CHANGELOG.md"

{
    awk '/^## /{exit} {print}' CHANGELOG.md   # preamble, up to the newest section
    cat "$SECTION"
    echo
    awk 'f || /^## /{f=1; print}' CHANGELOG.md
} > "$WORK/CHANGELOG.md" && mv "$WORK/CHANGELOG.md" CHANGELOG.md

git add CHANGELOG.md
git commit --quiet -m "chore(release): v$VERSION"

step "Tagging v$VERSION"

# The tag message is the changelog section: GitLab and GitHub both show it as
# the release body, and `git tag -n99` shows it to anyone working offline.
# --cleanup=verbatim because git otherwise strips every line starting with '#'
# as a comment, which is precisely the section's own headings.
{ printf 'vellum v%s\n\n' "$VERSION"; sed '1d' "$SECTION" | sed '/./,$!d'; } \
    | git tag -a "v$VERSION" --cleanup=verbatim -F - || fail "tagging failed"

step "Pushing"

git push --quiet origin main --follow-tags || fail "push to origin failed; the tag exists locally — re-run: git push origin main --follow-tags"
git push --quiet github main --follow-tags || fail "push to GitHub failed; the tag exists locally — re-run: git push github main --follow-tags"

step "Verifying the tag reached both remotes"

for remote in origin github; do
    url="$(git remote get-url "$remote")"
    git ls-remote --tags "$url" "refs/tags/v$VERSION" | grep -q . \
        || fail "v$VERSION is not on $remote; the release is not done"
    echo "    $remote ok"
done

printf '\nReleased v%s.\n' "$VERSION"
echo "themes.gohugo.io reads the latest tag on GitHub, so the listing follows on its own schedule."
echo "GitLab Pages redeploys the demo from main."

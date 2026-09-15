#!/usr/bin/env bash
# URL-parity guard: does this working tree still generate every path the theme
# generated at some earlier commit?
#
# Consuming sites deploy with `rsync --delete`, so a path the build stops
# emitting is deleted from the live host — a template dropped, an output format
# renamed or a taxonomy path moved is a live 404 for every site running the
# theme. That is binding commitment #1 in PRODUCT.md, and this is its check.
#
# Both sides are built on demand from git, so there is nothing frozen to go
# stale. This replaces an earlier pair of frozen fixture builds, which could not
# be regenerated once the themes that produced them were gone and had drifted
# into a permanently-red list of accepted deltas — a state in which no new
# regression could have been spotted. Do not reintroduce a checked-in baseline.
#
# Usage, from anywhere:
#   .parity/check.sh              # working tree vs HEAD
#   .parity/check.sh HEAD~3       # working tree vs three commits back
#   .parity/check.sh v0.1.2       # working tree vs a tag — what users install
#
#   .parity/check.sh v0.3.1 --accept-lost images/profile_hu_HASH.webp
#
# --accept-lost names one path, in the normalised form printed below, that this
# run is expected to lose and that is known not to be a moved URL. Repeatable.
# The case it exists for is a path that only exampleSite's own content produced:
# the demo swapped its profile.png for an SVG, so it stopped emitting the resized
# rasters of a file it no longer has, while `profile.html`'s raster branch — and
# therefore every consuming site with a raster profile — is untouched. This
# script compares built file lists and cannot tell those two apart; it was never
# able to. The flag is where a human says which one it is.
#
# It is typed on the command line, for one run, and is the whole reason this is
# not the checked-in baseline the note above forbids. Nothing is written, nothing
# outlives the invocation, and a path named here that the run did *not* lose
# fails the run — so a waiver cannot quietly sit in a release invocation after
# the delta it was written for has gone, covering the next path that goes for
# real. Not being able to say it had gone stale is exactly what was wrong with
# the frozen fixtures.
#
# A path is matched against the normalised line, so one --accept-lost covers
# every occurrence of it. The profile case emits two, one per language, which
# normalise to the same string.
#
# exampleSite is the reference site deliberately: it is the only site in this
# repo, it is what CI builds, and it exercises both languages, the taxonomy, the
# archive, the search index and a page bundle. A path it does not cover is a
# path this check cannot speak for — content that a template needs in order to
# be exercised belongs in exampleSite anyway.
set -u

REF=""
ACCEPT=""

while [ $# -gt 0 ]; do
    case "$1" in
        --accept-lost)
            [ $# -ge 2 ] || { echo "--accept-lost needs a path" >&2; exit 2; }
            ACCEPT="$ACCEPT$2
"
            shift 2 ;;
        --accept-lost=*)
            ACCEPT="$ACCEPT${1#--accept-lost=}
"
            shift ;;
        -h|--help) sed -n '2,45p' "$0"; exit 0 ;;
        -*) echo "unknown argument: $1" >&2; exit 2 ;;
        *)  [ -z "$REF" ] || { echo "only one ref: already have $REF" >&2; exit 2; }
            REF="$1"; shift ;;
    esac
done
REF="${REF:-HEAD}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)" || exit 1

command -v hugo >/dev/null || { echo "hugo not on PATH"; exit 2; }
git -C "$ROOT" rev-parse --verify --quiet "$REF^{commit}" >/dev/null \
    || { echo "not a commit: $REF"; exit 2; }

# Keep the scratch build under $HOME. Hugo is a snap on this machine and is
# confined away from /tmp: a build sourced there fails to load its mounts, and
# one written there lands in the snap's private tmp where nothing else can read
# it — silently, which is the worst way for a check to be wrong.
WORK="$HOME/.cache/vellum-parity"
BASE_OUT="$ROOT/.parity/base"
CAND_OUT="$ROOT/.parity/cand"

cleanup() {
    git -C "$ROOT" worktree remove --force "$WORK/vellum" 2>/dev/null
    rm -rf "$WORK"
}
trap cleanup EXIT

rm -rf "$WORK" "$BASE_OUT" "$CAND_OUT"
mkdir -p "$WORK"

# The worktree directory has to be named `vellum`: exampleSite/hugo.toml says
# `theme = "vellum"`, and --themesDir resolves the theme by directory name.
git -C "$ROOT" worktree add --detach --quiet "$WORK/vellum" "$REF" || exit 2

build() { # build <source-repo-root> <destination>
    hugo --gc --quiet --source "$1/exampleSite" --themesDir "$(dirname "$1")" \
        --destination "$2" || { echo "build failed: $1"; exit 2; }
}

build "$WORK/vellum" "$BASE_OUT"
build "$ROOT" "$CAND_OUT"

# Fingerprints and Hugo's content-hashed image names change whenever the bytes
# change, which is expected and is not a moved URL. Everything else is compared
# literally.
#
# LC_ALL=C on both the sort and the comm is load-bearing, not tidiness. A
# locale collation folds punctuation away, so en_US.UTF-8 sorts
# `cover_hu_HASH.webp` before `cover.png` while a byte comparison wants the
# reverse — and comm merges on the assumption that its input is ordered the way
# it compares. Where the two disagree, comm walks past a match and reports a
# path as lost that both builds emit: on this exampleSite, 11 of 103 paths
# mis-report that way under a single deletion, and the false positive is always
# the .png sitting next to the resized WebP it produced. That is a red parity
# check on a release that has broken nothing, and `.release/release.sh` refuses
# to release on one. Byte order on both sides makes the two agree, and makes
# the result the same on every checkout rather than a property of the
# maintainer's locale — which matters now that this script ships with the
# repo. (GNU comm compares with the locale and would have agreed with a locale
# sort; the uutils comm on this machine compares bytes. Pinning both ends the
# question either way.)
norm() {
    (cd "$1" 2>/dev/null && find . -type f \
        | sed -E 's|^\./||; s|\.[0-9a-f]{64}\.|.HASH.|; s|_hu_[0-9a-f]+\.|_hu_HASH.|' \
        | LC_ALL=C sort)
}

lost=$(LC_ALL=C comm -23 <(norm "$BASE_OUT") <(norm "$CAND_OUT"))
added=$(LC_ALL=C comm -13 <(norm "$BASE_OUT") <(norm "$CAND_OUT"))

# Split the losses against what was waived on the command line, and keep track
# of which waivers were used: an unused one is a failure in its own right, for
# the reason given at the head of this file.
unexpected=""; waived=""; stale=""

while IFS= read -r p; do
    [ -n "$p" ] || continue
    if printf '%s' "$ACCEPT" | grep -qxF -- "$p"; then
        waived="$waived$p
"
    else
        unexpected="$unexpected$p
"
    fi
done <<EOF
$lost
EOF

while IFS= read -r a; do
    [ -n "$a" ] || continue
    printf '%s' "$waived" | grep -qxF -- "$a" || stale="$stale$a
"
done <<EOF
$ACCEPT
EOF

short=$(git -C "$ROOT" rev-parse --short "$REF")
echo "### $REF ($short) → working tree, via exampleSite"

if [ -n "$unexpected" ]; then
    echo "### PATHS LOST — rsync --delete would remove these from a live site:"
    printf '%s' "$unexpected" | sed 's/^/    /'
else
    echo "### ok: no paths lost"
fi

[ -n "$waived" ] && {
    echo "### accepted by --accept-lost, lost on purpose:"
    printf '%s' "$waived" | sed 's/^/    /'
}

[ -n "$stale" ] && {
    echo "### --accept-lost named a path this run did not lose:"
    printf '%s' "$stale" | sed 's/^/    /'
    echo "    The waiver has outlived its delta. Drop it — left in place it would"
    echo "    cover the next path that goes for real."
}

[ -n "$added" ] && { echo "### new paths (fine, informational):"; echo "$added" | sed 's/^/    /'; }

# Builds are left in .parity/base and .parity/cand for inspection; both are
# regenerated on the next run.
{ [ -n "$unexpected" ] || [ -n "$stale" ]; } && exit 1
exit 0

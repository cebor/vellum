#!/usr/bin/env bash
# Renders one CHANGELOG section from the commit range, on stdout.
#
# Commits are the changelog source — that is the whole reason CONTRIBUTING.md
# fixes their format. This reads them back: `type(scope)!: summary`, grouped by
# what a user of the theme sees, with everything that is invisible to them
# (refactor, docs, build, ci, chore) left out.
#
# Usage, from anywhere:
#   .release/changelog.sh 0.2.0                 # last tag → HEAD
#   .release/changelog.sh 0.2.0 v0.1.2..HEAD    # an explicit range
#
# Exit status is a verdict on the range, not just on this script:
#   0  a section with entries
#   3  at least one commit's subject could not be parsed — it is missing from
#      the section, and the section is therefore incomplete
#   4  parsed fine, but nothing user-visible is in it
#   2  usage or repository error
#
# release.sh acts on 3 and 4; run this on its own to see what a release would
# say before cutting it.
set -u

VERSION="${1:-}"
[ -n "$VERSION" ] || { echo "usage: $(basename "$0") <version> [<range>]" >&2; exit 2; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)" || exit 2
cd "$ROOT" || exit 2

PREV="$(git describe --tags --abbrev=0 2>/dev/null)"
RANGE="${2:-${PREV:+$PREV..}HEAD}"
git rev-list --quiet "$RANGE" -- 2>/dev/null || { echo "not a range: $RANGE" >&2; exit 2; }

# The module path is the address users install from and file issues against, so
# it is also where a compare link has to point. Reading it from go.mod rather
# than hardcoding it keeps the two from drifting apart.
MODULE="$(awk '$1=="module"{print $2; exit}' go.mod)"
[ -n "$MODULE" ] || { echo "no module path in go.mod" >&2; exit 2; }

# Record separator 0x1e, field separator 0x1f: a commit body contains newlines
# and can contain anything else a shell would choke on, but not these.
git log --reverse --no-merges --format='%x1e%h%x1f%s%x1f%b' "$RANGE" \
| awk -v version="$VERSION" -v prev="$PREV" -v module="$MODULE" -v today="$(date +%F)" '
BEGIN {
    RS = sprintf("%c", 30); FS = sprintf("%c", 31)
    WIDTH = 100
    # Print order, which is also priority: what breaks a site comes first.
    n_groups = split("Breaking,Added,Fixed,Performance,Reverted", groups, ",")
}

function group_of(type) {
    if (type == "feat")   return "Added"
    if (type == "fix")    return "Fixed"
    if (type == "perf")   return "Performance"
    if (type == "revert") return "Reverted"
    return ""   # refactor, docs, build, ci, chore: invisible to a theme user
}

# Wraps text to WIDTH, first line prefixed p1, continuations p2.
function wrap(text, p1, p2,   words, n, i, cur, out, atstart) {
    n = split(text, words, /[ \t\n]+/)
    cur = p1; out = ""; atstart = 1
    for (i = 1; i <= n; i++) {
        if (words[i] == "") continue
        if (atstart)                                      { cur = cur words[i]; atstart = 0 }
        else if (length(cur) + 1 + length(words[i]) <= WIDTH) { cur = cur " " words[i] }
        else                                              { out = out cur "\n"; cur = p2 words[i] }
    }
    return out cur
}

# The BREAKING CHANGE footer, joined into one paragraph: everything from the
# marker to the next blank line. That paragraph is the upgrade instruction, so
# it is carried into the changelog verbatim rather than summarised.
function breaking_text(body,   lines, n, i, started, out) {
    n = split(body, lines, "\n")
    out = ""
    for (i = 1; i <= n; i++) {
        if (!started && lines[i] ~ /^BREAKING[ -]CHANGE:[ \t]*/) {
            started = 1
            sub(/^BREAKING[ -]CHANGE:[ \t]*/, "", lines[i])
            out = lines[i]
            continue
        }
        if (started) {
            if (lines[i] ~ /^[ \t]*$/) break
            out = out " " lines[i]
        }
    }
    return out
}

$0 == "" { next }   # the leading separator produces one empty record

{
    hash = $1; subject = $2; body = $3

    # The slash inside the class is escaped: a bare / closes an awk regex
    # literal even between brackets, so POSIX awk (macOS ships one) aborted the
    # whole program with "nonterminated character class" and no release on this
    # machine could render its section. gawk tolerates it, which is why it took
    # until now to show up.
    if (!match(subject, /^[a-z]+(\([a-zA-Z0-9._\/-]+\))?!?: /)) {
        printf "warn: unparseable subject, left out of the changelog: %s %s\n", hash, subject > "/dev/stderr"
        bad++
        next
    }

    head = substr(subject, 1, RLENGTH - 2)      # drop the ": "
    summary = substr(subject, RLENGTH + 1)
    bang = (head ~ /!$/); sub(/!$/, "", head)

    scope = ""
    if (match(head, /\([^)]*\)$/)) {
        scope = substr(head, RSTART + 1, RLENGTH - 2)
        type  = substr(head, 1, RSTART - 1)
    } else type = head

    breaking = (bang || body ~ /(^|\n)BREAKING[ -]CHANGE:/)
    group = breaking ? "Breaking" : group_of(type)
    if (group == "") next

    entry = (scope == "" ? "" : "**" scope ":** ") summary " (" hash ")"
    text = wrap(entry, "- ", "  ")

    if (breaking) {
        note = breaking_text(body)
        if (note != "") text = text "\n" wrap(note, "  ", "  ")
        else printf "warn: %s breaks something but carries no BREAKING CHANGE footer\n", hash > "/dev/stderr"
    }

    body_of[group] = body_of[group] text "\n"
    entries++
}

END {
    # An inline compare link rather than a link-definition block at the bottom:
    # a generated section then owns everything it needs and can be inserted
    # without touching the rest of the file.
    if (prev != "")
        printf "## [%s](https://%s/compare/%s...v%s) - %s\n", version, module, prev, version, today
    else
        printf "## [%s] - %s\n", version, today

    for (i = 1; i <= n_groups; i++) {
        g = groups[i]
        if (!(g in body_of)) continue
        printf "\n### %s\n\n%s", g, body_of[g]
    }

    if (entries == 0)
        print "\n_Maintenance only — no user-visible changes._"

    if (bad)          exit 3
    if (entries == 0) exit 4
}
'

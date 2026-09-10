+++
title = "Code and Terminal Output"
date = 2026-03-27T09:15:00+01:00
draft = false
tags = ["code", "reference"]
summary = "Fenced blocks are the substance of a technical post, not an inset in it — so they get first-class treatment."
translationKey = "code-and-terminal-output"
+++

The reading column in this theme is 92 characters wide for one reason: an 80-column terminal paste
should land in it without wrapping. Everything else about how code is set follows from that decision.

## Highlighting

Chroma emits class names rather than inline styles, which is what lets the syntax colours resolve
through the same `light-dark()` tokens as the rest of the page. Left to itself Hugo would bake a
palette into the markup instead — monokai by default, a dark box on a light sheet — so the theme
asks for class names on every block rather than asking the site to configure it:

```go-html-template
{{ $opts := merge .Options (dict "noClasses" false) }}
{{ transform.Highlight (printf "%s\n" .Inner) .Type $opts }}
```

Nothing to set, then. The one path this does not cover is Hugo's built-in
`{{</* highlight */>}}` shortcode, which bypasses render hooks and follows whatever the site's own
`[markup.highlight]` says.

## A worked example

Two lines are marked with `hl_lines`, and they are the two carrying the comment on purpose: a
highlighted line is a surface the syntax inks are read off, so `--hl-line` is an opaque token that
was checked against every one of them rather than an alpha wash over whatever sits underneath.

```go {hl_lines=["1-2"]}
// tokens.html parses six values out of 00-tokens.css at build time, because a
// sizes attribute is evaluated with no element context and cannot use var().
func measure(css string) (int, error) {
    m := regexp.MustCompile(`--content-width:\s*(\d+)px`).FindStringSubmatch(css)
    if m == nil {
        return 0, fmt.Errorf("--content-width not found: the layout and the "+
            "responsive images would silently disagree")
    }
    return strconv.Atoi(m[1])
}
```

Note the failure mode named in the error string. A missing token here would not crash anything — it
would quietly make every image advertise the wrong `sizes`, which is the kind of bug that survives
for months.

## Diffs

A `diff` fence is set from the same palette, with the added and removed lines banded rather than
coloured over:

```diff
--- a/assets/css/90-syntax.css
+++ b/assets/css/90-syntax.css
@@ -6,7 +6,9 @@
 .chroma .line {
     display: flex;
-}
+    width: max-content;
+    min-width: 100%;
+}
```

The bands are deliberately quiet — each sits about four points of lightness off the block it is in,
which is enough to group a run of lines without turning the block into a colour field. What tells
you which is which is the `+` and the `-` the diff already starts each line with, and that is the
point: a diff is legible in a terminal with no colour at all, so the band is grouping the lines
rather than carrying the meaning.

## Long output

An 80-column terminal paste, unwrapped:

```console
$ hugo --source exampleSite --themesDir ../.. --printPathWarnings
Start building sites …
hugo v0.165.0+extended linux/amd64 BuildDate=2026-08-12T14:26:28Z

                   │ EN │ DE
───────────────────┼────┼────
  Pages            │ 24 │ 21
  Paginator pages  │  2 │  1
  Non-page files   │  4 │  2
  Processed images │  6 │  6
  Aliases          │  4 │  3
  Cleaned          │  0 │  0

Total in 284 ms
```

When output runs to hundreds of lines, fold it with the `collapse` shortcode rather than trimming
it — a truncated log is the one thing a reader cannot reconstruct.

## Copy buttons

`ShowCodeCopyButtons = true` puts a copy control on every block. It appears on hover and on focus,
so it is reachable from the keyboard, and it is suppressed in print — a paper copy has nothing to
copy to.

> [!TIP]
> Inline code like `--themesDir ../..` is set in the same face as the blocks, one step down. It is
> deliberately not boxed: a box on every inline span turns a paragraph into a fence.

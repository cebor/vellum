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
through the same `light-dark()` tokens as the rest of the page. The consuming site has to opt in:

```toml
pygmentsUseClasses = true

[markup.highlight]
  noClasses = false
```

Without both, the code blocks ship a light-mode palette baked into the HTML and stay light on a dark
page.

## A worked example

```go
// tokens.html parses four values out of 00-tokens.css at build time, because a
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

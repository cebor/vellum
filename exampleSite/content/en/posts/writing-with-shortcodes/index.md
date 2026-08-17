+++
title = "Writing with Shortcodes"
date = 2026-02-19T14:30:00+01:00
draft = false
tags = ["reference", "markdown"]
summary = "Seven shortcodes, and why a theme whose Markdown is otherwise plain needs any at all."
+++

Goldmark's `unsafe` setting is off in this theme, so raw HTML written in a post is stripped rather
than rendered. That is the right default — a content file should not be able to smuggle a script
into the page — but it removes a few things that technical writing genuinely needs. The shortcodes
below are exactly those things, and nothing more.

## collapse

The load-bearing one. Long command output should be *present* — searchable, printable, copyable —
without occupying half the screen on the way past.

{{< collapse summary="Full build output" >}}
```console
$ hugo --gc --minify --printPathWarnings
Start building sites …
hugo v0.165.0+extended linux/amd64

                  │ EN │ DE
──────────────────┼────┼────
 Pages            │ 24 │ 21
 Paginator pages  │  2 │  1
 Non-page files   │  4 │  2
 Static files     │  0 │  0
 Processed images │  6 │  6
 Aliases          │  4 │  3

Total in 284 ms
```
{{< /collapse >}}

Written as:

````go-html-template
{{</* collapse summary="Full build output" */>}}
```console
…
```
{{</* /collapse */>}}
````

`details` is an alias of the same shortcode, under the name most people reach for first. Both take
`openByDefault="true"` if the fold should start open.

## figure

The image render hook resizes bundled images and gives them intrinsic dimensions, but it cannot
produce a caption. That is the only reason this shortcode exists.

{{< figure src="mark.svg" alt="A drawn mark on a ruled square" caption="A caption is the whole point. Without one, plain Markdown image syntax does the same job." >}}

```go-html-template
{{</* figure src="shot.png" alt="…" caption="…" link="…" */>}}
```

## audio

Takes a bundle resource or a plain URL. Nothing autoplays, here or in `video` — a reader who is
mid-task with a terminal open does not want sound.

{{< audio src="tone.wav" >}}

## video

Same shape, plus an optional poster frame:

```go-html-template
{{</* video src="clip.mp4" poster="still.png" muted="true" loop="true" */>}}
```

This demo ships no video file, so the shortcode is documented here rather than exercised.

## intextimg

An image set into a run of text and sized to the line rather than to the column — a glyph, a badge,
a status mark. The mark {{< intextimg url="mark.svg" alt="the drawn mark" height="1.1em" >}} sits on
the baseline of this sentence at `1.1em`, and moves with the type when the reader changes size.

## ai

Marks a passage as written with AI assistance, using the notation a drawing already has for an
altered region: a change bar down the edge, the sheet's AI mark flagged on the bar — the same nib the
title block stamps in its corner — and a number beside it resolving to a row in the revision note at
the foot of the sheet. The flag is a link — a reference that does not resolve is not a reference.

{{< ai note="Drafted from an outline, then edited by hand" >}}
A whole paragraph can be marked. The bar is dashed rather than solid, which is what separates it
from a block quotation in the same ink and what a drawing uses for a provisional line. Nothing here
is a colour: the mark reads the same in greyscale, on paper, and to a reader who cannot separate
the two inks.
{{< /ai >}}

A run inside a sentence takes `display="inline"` instead, so that
{{< ai display="inline" note="Translated, then checked against the source" >}}only the words that
warrant it{{< /ai >}} carry the mark rather than the whole paragraph around them.

```go-html-template
{{</* ai note="Drafted from an outline" */>}}
A whole paragraph.
{{</* /ai */>}}

… a sentence with {{</* ai display="inline" */>}}this run{{</* /ai */>}} in it.
```

The post-level counterpart is front matter, not a shortcode: `ai = true` puts a stamp in the corner
of the title block and the same mark in the index. This post carries no such stamp on purpose —
individual passages are marked, the sheet as a whole is not.

## rawhtml

A deliberate hole in `unsafe = false`. Everything inside is trusted exactly as far as the person who
wrote the post is, which is why it is the last one listed and should be the last one reached for.

> [!CAUTION]
> If a render hook or another shortcode can do the job, use that instead. `rawhtml` gives up the
> guarantee that a content file cannot inject markup.

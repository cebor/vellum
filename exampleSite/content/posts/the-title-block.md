+++
title = "Reading a Sheet"
date = 2026-01-15T10:00:00+01:00
draft = false
tags = ["reference", "typography"]
summary = "What the title block records, and why the reading column is wider than the usual advice."
+++

Every page in this theme is a drawing sheet. The ruled block under the title is the **title block**:
on a real drawing it states what the sheet is, who drew it, when, and at which revision. Here it
carries the same fields, as an actual bordered table rather than a grey caption line.

## The reading column

The column runs to roughly 83 characters, wider than the classic 65–75 advice. That is a deliberate
trade for technical writing, where the substance is command blocks and terminal output that should
not wrap:

```console
$ hugo --gc --minify
Start building sites …
Total in 68 ms
```

The line height is correspondingly generous, which is what keeps long prose lines trackable.

## Alerts

> [!NOTE]
> Written as a plain Markdown blockquote opening with `[!NOTE]`. No shortcode, because raw HTML in
> content is stripped by default.

> [!WARNING]
> Warnings and cautions carry the danger colour; notes and tips carry the signal amber.

## Tables

Wide tables scroll inside their own container rather than pushing the page sideways.

| Field | Source | Shown when |
|---|---|---|
| Issued | `date` | always |
| Revised | `Lastmod` | it differs from `date` by more than a day |
| Extent | reading time, word count | the toggles are on |
| Subject | `tags` | the post has tags |

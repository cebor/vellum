+++
title = "Multilingual by Design"
date = 2026-06-24T11:00:00+02:00
draft = false
tags = ["multilingual", "reference"]
summary = "Two languages, neither of them a translation layer over the other — and what that costs in configuration."
translationKey = "multilingual-by-design"

# The full form of the disclosure: a level, what was done, and with what.
[ai]
  level = "assisted"
  note = "German draft translated from the English, then checked line by line"
+++

This demo runs in English and German. Not English with a German veneer: each language has its own
content directory, its own menu, its own search index, its own feed, and its own set of tags. A post
may exist in one language and not the other, which is the normal case rather than an omission to be
apologised for.

## The shape of it

```toml
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = true

[languages.en]
  languageName = "English"
  contentDir = "content/en"
  weight = 1

[languages.de]
  languageName = "Deutsch"
  contentDir = "content/de"
  weight = 2
```

`defaultContentLanguageInSubdir` puts *every* language under a prefix, English included. Nothing
lands at the publish root — which is exactly why the theme ships a `ROOT404` output format, so the
web server still has an error document to serve.

> [!IMPORTANT]
> Add `ROOT404` to the default language only. Give it to both and they fight over `/404.html`, with
> the winner decided by build order.

## Pairing translations

Two posts become translations of each other by sharing a `translationKey`, which frees their
filenames and their URLs to be idiomatic in each language:

```toml
translationKey = "multilingual-by-design"
```

The title block then grows an **Also in** row, and the header's language switch points at this
page's counterpart rather than dumping the reader on the home page. Where there is no counterpart —
as on two of the posts in this demo — the switch falls back to that language's home page, which is
the honest answer.

## Per-language parameters

Anything under `[languages.xx.params]` reaches templates as `site.Params`, already resolved for the
current language. That is what makes a genuinely per-language `editPost` link possible:

```toml
[languages.de.params.editPost]
  URL = "https://example.org/-/edit/main/content/de"
  appendFilePath = true
```

`.File.Path` is relative to that language's `contentDir`, so a single site-wide URL could only ever
have been correct for one of the two.

## Dates

Set `DateFormat = ":date_long"` rather than a Go layout string. A layout like `January 2, 2006`
freezes the month name in one language and will cheerfully print *January* on a German page; the
shorthand resolves per language.

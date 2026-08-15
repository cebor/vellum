# Vellum

**A multilingual Hugo theme that sets every page as an engineering drawing sheet** — a drawn frame
with a zone rail down its left edge, and a ruled title block carrying the metadata a grey caption
line usually mumbles.

[![Hugo](https://img.shields.io/badge/Hugo-%E2%89%A5%200.158%20extended-ff4088?style=flat-square&logo=hugo&logoColor=white)](https://gohugo.io)
[![Licence](https://img.shields.io/badge/licence-MIT-blue?style=flat-square)](https://github.com/cebor/vellum/blob/main/LICENSE)

**[Live demo](https://pages.stkn.org/felix/vellum)** · **[Source](https://github.com/cebor/vellum)**

![Vellum](https://raw.githubusercontent.com/cebor/vellum/main/images/screenshot.png)

Built for technical writing that is mostly code. The reading column is wide — 800px, measuring
**92 characters** at the 20px body size — because terminal output and command blocks are the
substance, not an inset. The line height is correspondingly generous so a line that long stays
trackable.

| | |
|---|---|
| **Multilingual** | Per-language content, menus, profiles, feeds and search indexes |
| **Search** | Client-side, Fuse.js, built from the site's own JSON output |
| **Light / dark** | Follows the OS, or a toggle; works with JavaScript disabled |
| **Responsive images** | Bundle images auto-resized to a 480/800/1600 WebP ladder |
| **Self-hosted fonts** | Two variable faces, ~121 KB, no third-party requests |
| **Landing page** | Profile block, buttons, latest posts |
| **Post furniture** | Table of contents, reading time, breadcrumbs, share row, post nav, edit link |
| **Archives & taxonomies** | Year/month archive, tag pages |
| **SEO** | OpenGraph, Twitter cards, schema.org, RSS, canonical + hreflang |
| **Print** | A dedicated print stylesheet, not an afterthought |

## Contents

[Requirements](#requirements) · [Quick start](#quick-start) · [Configuration](#configuration) ·
[Content](#content) · [Icons](#icons) · [Customising](#customising) · [Development](#development) ·
[Licence](#licence)

## Requirements

- **Hugo extended ≥ 0.158.** Lower versions fail at render time, not with a friendly message.
- **Browsers:** Chrome 123+, Safari 17.5+, Firefox 120+ (CSS `light-dark()`). Older browsers get a
  plain light palette through an `@supports` fallback rather than a broken page.

The theme uses Hugo's flat layout structure — templates directly in `layouts/`, partials in
`layouts/_partials/`, render hooks in `layouts/_markup/`, shortcodes in `layouts/_shortcodes/`. There
is no `layouts/_default/` and no `layouts/partials/`; files placed there silently do nothing.

## Quick start

### 1. Add the theme

As a Hugo Module — the least fuss to keep updated:

```toml
[module]
  [[module.imports]]
    path = "github.com/cebor/vellum"
```

Then `hugo mod get -u` whenever you want the latest. Your own site has to be a module for
this; `hugo mod init github.com/you/your-site` if it is not one yet.

As a submodule instead:

```bash
git submodule add https://github.com/cebor/vellum.git themes/vellum
```

Copying the directory in works just as well. With a submodule or a copy — not with the module
import above, which names the theme itself — set it in your site config:

```toml
theme = "vellum"
```

### 2. Wire up what the theme cannot supply for itself

These three settings are **required**. Without them, search and syntax highlighting fail quietly.

```toml
[outputs]
  # The JSON output *is* the search index. Remove it and /search/ silently
  # stops finding anything.
  home = ["HTML", "RSS", "JSON"]

# Chroma emits class names instead of inline styles so the theme can map them
# onto its own light/dark syntax variables.
pygmentsUseClasses = true

[markup.highlight]
  noClasses = false
```

### 3. If you use `defaultContentLanguageInSubdir`

Nothing then lands at the publish root for a web server to use as its error document. Add:

```toml
[outputFormats.ROOT404]
  mediaType = "text/html"
  baseName = "404"
  notAlternative = true
  root = true

[languages.en.outputs]
  # Default language only — adding it to both makes them fight over /404.html.
  home = ["HTML", "RSS", "JSON", "ROOT404"]
```

> [!TIP]
> A full worked example lives in [`exampleSite/hugo.toml`](exampleSite/hugo.toml) — two languages,
> menus, profile, search and the root 404, all in one file. It is the fastest way to see how the
> pieces fit together.

## Configuration

Everything below is optional unless marked. **A key that is not listed here does nothing.**

### Identity

| Param | Type | Notes |
|---|---|---|
| `description` | string | Fallback meta description. |
| `keywords` | list | Fallback meta keywords. |
| `author` | string, list, or map | A map may carry `name` and `email`; the email is used in the feed. |
| `images` | list | Fallback social-card image, and the feed's channel image. |
| `label.text` | string | Header wordmark. Defaults to `site.Title`. |
| `label.icon` | string | Logo, resolved from `assets/`. |
| `label.iconSVG` | string | Raw inline SVG logo, used instead of `label.icon`. |
| `label.iconHeight` | int | Logo height in px. Default `24`. |
| `footer.text` | string | Replaces the copyright line. Markdown is rendered. |

### Behaviour

| Param | Type | Default | Notes |
|---|---|---|---|
| `env` | string | — | Set to `production` to enable analytics, OpenGraph, Twitter cards and schema. |
| `defaultTheme` | `auto`\|`light`\|`dark` | `auto` | `auto` follows the OS. |
| `disableThemeToggle` | bool | `false` | |
| `disableLangToggle` | bool | `false` | |
| `disableScrollToTop` | bool | `false` | |
| `displayFullLangName` | bool | `false` | Show `Deutsch` instead of `de` in the switcher. |
| `mainSections` | list | `["posts"]` | Sections that feed the landing page, archives and post nav. |
| `latestPosts` | int | `5` | Posts under the profile on the landing page; `0` hides the block. |
| `DateFormat` | string | `:date_long` | Go layout or Hugo shorthand. Set per language for a localised format. |

### Display toggles

All booleans, all `false` unless set, and **all overridable per page** in front matter.

| Param | Shows |
|---|---|
| `ShowReadingTime` | Estimated reading time in the title block. |
| `ShowWordCount` | Word count in the title block. |
| `ShowPostNavLinks` | Previous / next links under a post. |
| `ShowCodeCopyButtons` | A copy button on every code block. |
| `ShowBreadCrumbs` | The section trail above the title. |
| `ShowShareButtons` | The share row under a post. |
| `ShowToc` | Table of contents (appears whenever a page has ≥2 headings). |
| `TocOpen` | Renders that table of contents expanded. |
| `ShowFullTextinRSS` | Full post bodies in the feed instead of summaries. |
| `ShowAllPagesInArchive` | Every page in the archive, not just `mainSections`. |

### Landing page

```toml
[params.profile]
  title = "Your Name"
  subtitle = "tagline"
  image = "images/profile.png"   # relative to assets/, no leading slash
  imageAlt = "Your Name"
  imageWidth = 120

  [[params.profile.buttons]]
    name = "Posts"
    url = "posts"
```

### Social icons

```toml
[[params.socialIcons]]
  name = "github"                # must match an icon name — see Icons below
  url = "https://github.com/you"
  title = "GitHub"               # optional accessible name
```

### Share buttons

```toml
ShareButtons = ["mastodon", "bluesky", "reddit", "hackernews", "linkedin", "email"]
```

### Covers

```toml
[params.cover]
  linkFullImages = true          # clicking a cover opens the original
```

### Edit-post link

```toml
[params.editPost]
  URL = "https://github.com/you/site/edit/main/content"
  Text = "Suggest an edit"
  appendFilePath = true
  disabled = false
```

> [!IMPORTANT]
> On a multilingual site, set this per language. `.File.Path` is relative to that language's
> `contentDir`, so a single URL could only ever be right for one of them.

### Search

Passed straight to [Fuse.js](https://fusejs.io/api/options.html):

```toml
[params.fuseOpts]
  threshold = 0.4
  keys = ["title", "permalink", "summary", "content"]
```

### SEO and analytics

```toml
[params.schema]
  publisherType = "Person"       # or "Organization"
  sameAs = []                    # defaults to your socialIcons URLs

[params.social]
  twitter = "handle"             # twitter:site on cards

[params.analytics.google]
  SiteVerificationTag = "…"      # also .bing, .yandex
```

### Favicons

```toml
[params.assets]
  favicon = "/favicon.ico"
  favicon16x16 = "/favicon-16x16.png"
  favicon32x32 = "/favicon-32x32.png"
  apple_touch_icon = "/apple-touch-icon.png"
  safari_pinned_tab = "/safari-pinned-tab.svg"
```

## Content

### Front matter

```toml
+++
title = "Post Title"
date = 2026-04-23T11:05:31+02:00
draft = false
tags = ["tag-one", "tag-two"]
summary = "One sentence, shown in list views and OpenGraph."
+++
```

| Key | Effect |
|---|---|
| `toc = false` / `ShowToc = false` | Suppress the table of contents. It otherwise appears whenever a page has ≥2 headings. |
| `TocOpen = false` | Render the ToC collapsed. |
| `hidemeta = true` | Hide the title block. Useful on standalone pages. |
| `hideSummary = true` | Hide the summary in list views. |
| `searchHidden = true` | Keep the page out of the search index. |
| `hiddenInRss = true` | Keep the page out of the feeds. |
| `hiddenInHomeList = true` | Keep the page off the landing page. |
| `robotsNoIndex = true` | Emit `noindex, nofollow`. |
| `canonicalURL` | Override the canonical link. |
| `disableShare = true` | Hide the share row on this post. |
| `comments = true` | Render `_partials/comments.html` (an empty stub you override). |
| `hideFooter = true` | Drop the site footer. |
| `layout = "search"` | Render the search page. |
| `layout = "archives"` | Render the year/month archive. |
| `menus = "main"` | Put a standalone page in the nav. |
| `cover` | See [Covers](#covers-1). |

> [!WARNING]
> Two TOML traps. A date-only value must stay a **quoted string** (`date = "2026-03-27"`) — a bare
> TOML local date is not a `time.Time` and Hugo will not cast it reliably. And quote
> numeric-looking tags (`"403"`), or they reach templates as numbers.

### Index pages

The landing page, a section's `_index.md`, the tag index, a tag page, the archive and the search
page all take a `title`, an optional `description`, and an optional body. Each lands somewhere
different on the sheet:

| Field | Where it renders |
|---|---|
| `title` | The page title. |
| `description` | The standfirst, directly under the title and above the sheet stamp. |
| body | The **sheet note** — a general note under the stamp, set one voice quieter than the index it introduces and held to the standfirst's measure. |

Keep the two apart or the head says the same thing twice: the description states what the sheet
*is*, the note says what is *on* it. Either may be omitted. A note is ordinary Markdown, so alerts,
tables and code in one still render as they do in a post.

```toml
+++
title = "Posts"
description = "Every post in the demo, newest first."
+++

Nine posts across two languages, written to exercise the theme rather than to fill it.
```

### Covers

```toml
[cover]
  image = "cover.png"      # a page-bundle resource, or a path under assets/
  alt = "…"
  caption = "…"            # markdown, shown under the cover on the post
  hidden = false
  hiddenInList = false
  hiddenInSingle = false
```

With no `cover` block at all, a bundle resource named `cover.*` is picked up automatically. Covers
feed `og:image` and the Twitter card — which is why this theme overrides Hugo's internal OpenGraph
template rather than using it.

### Shortcodes

#### `collapse` (alias `details`)

Folds long command output away without hiding it from search or print. **Load-bearing:** Goldmark's
`unsafe` is off, so a raw `<details>` written in Markdown is stripped — this is the only way to get
one.

````markdown
{{</* collapse summary="Full output" */>}}
```console
…
```
{{</* /collapse */>}}
````

| Param | Default | Notes |
|---|---|---|
| `summary` | — | **Required.** Markdown is rendered. Also accepted positionally. |
| `openByDefault` | unset | Render the block already unfolded. |

#### `figure`

Overrides Hugo's built-in figure so the image goes through the same WebP ladder as everything else
and carries intrinsic dimensions. It exists only because the render hook cannot produce a caption.

```markdown
{{</* figure src="shot.png" alt="A terminal" caption="After the migration" */>}}
```

| Param | Notes |
|---|---|
| `src` | A page-bundle resource, or a path under `assets/`. |
| `alt` | Falls back to the plain-text `caption`. |
| `caption` | Markdown, rendered under the image. |
| `attr` | Attribution line, markdown. |
| `attrlink` | Wraps `attr` in a link. |
| `link` | Wraps the image in a link; `target` and `rel` go with it. |
| `class` | Extra class on the `<figure>`. |

#### `video`

Never autoplays — a reader mid-task does not want sound.

```markdown
{{</* video src="clip.mp4" poster="still.png" */>}}
```

| Param | Notes |
|---|---|
| `src` | A page-bundle resource or a plain URL. Also accepted positionally. |
| `poster` | Still frame; also resolved as a bundle resource. |
| `type` | Explicit MIME type on the `<source>`. |
| `loop`, `muted` | Set to enable. |

#### `audio`

```markdown
{{</* audio src="clip.mp3" */>}}
```

| Param | Notes |
|---|---|
| `src` | A page-bundle resource or a plain URL. Also accepted positionally. |

#### `intextimg`

An image set inline in a run of text — a glyph, a badge, a small mark — sized to the line rather
than the column.

```markdown
{{</* intextimg url="icon.svg" alt="the icon" height="1.1em" */>}}
```

| Param | Default | Notes |
|---|---|---|
| `url` (or `src`) | — | A page-bundle resource or a plain URL. |
| `alt` | — | |
| `height` | `1em` | Any CSS length. |

#### `rawhtml`

Emits its body verbatim — a deliberate hole in `unsafe = false`.

```markdown
{{</* rawhtml */>}}<abbr title="…">…</abbr>{{</* /rawhtml */>}}
```

> [!CAUTION]
> Everything inside is trusted exactly as far as whoever wrote the post is. Reach for a render hook
> or another shortcode first.

### Markdown extras

None of these need a shortcode.

- **Alerts.** A blockquote opening with `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or
  `[!CAUTION]` becomes a labelled callout.
- **Headings** get an anchor link on hover.
- **External links** get `rel="noopener noreferrer"`, a new tab, and a marker.
- **Tables** are wrapped in a focusable scroll container — Goldmark emits a bare `<table>` and a wide
  one would push the whole page sideways.
- **Images in a page bundle** are resized to a 480/800/1600 WebP ladder with `sizes` and intrinsic
  dimensions, so they neither shift the layout nor ship at source resolution. An image referenced
  from *outside* a bundle is passed through untouched and gets none of that — **always put post
  images in a page bundle.**

## Icons

UI glyphs, authored on a 24×24 grid with a 1.75 stroke:

`arrow-up` · `arrow-right` · `arrow-left` · `external` · `hash` · `search` · `pencil` ·
`chevron-right` · `check` · `moon` · `sun` · `rss` · `email`

Brand marks, from [Simple Icons](https://simpleicons.org) (CC0) as filled paths:

`github` · `bluesky` · `stackoverflow` · `reddit` · `mastodon` · `linkedin` · `x` · `telegram` ·
`whatsapp` · `ycombinator` · `gitlab` · `codeberg`

Unknown names fall back to a generic link glyph, so a typo in `socialIcons` is visible rather than
silent. Extend the set by adding a branch to `_partials/icon.html`.

## Customising

### Your own CSS

Add `assets/css/99-local.css` to your **site** — site assets join the theme's glob and land last, so
your rules win without forking anything.

`assets/css/` holds numerically prefixed files that are globbed, concatenated, minified and
fingerprinted into one stylesheet with an SRI hash. **The numeric prefix is the cascade order**, which
is why a local file wants a high number.

`00-tokens.css` is the single source of truth for colour, type, space and motion — override a token
there and the whole sheet follows. Sizes come from `--step--2` … `--step-5` for type and `--space-4xs`
… `--space-4xl` for spacing.

> [!IMPORTANT]
> Dim text by dropping to `--meta-soft` and a smaller step, never by lowering opacity. Every text
> token is contrast-checked at ≥4.5:1 against its surface in both schemes, and an `opacity: 0.6`
> silently undoes that.

Colours resolve through CSS `light-dark()`, so each is written once and the page themes correctly
with JavaScript disabled. Note that `light-dark()` only produces *colours* — a display swap like the
theme-toggle icon still needs a real `prefers-color-scheme` query.

### Template overrides

`_partials/extend-head.html`, `_partials/extend-footer.html`, `_partials/extend-post-content.html`
and `_partials/comments.html` are empty stubs. Create a file of the same name in your site's own
`layouts/_partials/` and it wins.

### Fonts

Two self-hosted variable faces, subset to latin and latin-ext, preloaded, `font-display: swap`:

- **Archivo** (SIL OFL) carries a width axis as well as a weight axis, so one file supplies both the
  reading face and the narrow tracked lettering the title blocks and labels are set in. A matching
  italic ships too, fetched only when a page actually sets italic text.
- **JetBrains Mono** (SIL OFL) for code, figures and tabular numerals. No italic: syntax comments are
  separated by colour instead, so a code block never pulls a second mono file.

Together they are ~121 KB on first load and cached thereafter — a deliberate trade for a theme whose
subject is code. To fall back to system stacks, drop the `@font-face` blocks in `10-base.css` and the
preloads in `_partials/head-assets.html`.

## Development

```bash
hugo server -D --source exampleSite --themesDir ../..
```

`exampleSite/` is a standalone site that exercises the theme, and is what every change is tested
against. [`DESIGN.md`](https://github.com/cebor/vellum/blob/main/DESIGN.md) records the visual
system behind the stylesheet — line weights, palette, motion, print — if you want to extend it in
keeping.

### Contributing

> [!NOTE]
> Please open issues and pull requests on **[GitHub](https://github.com/cebor/vellum)**.

Development happens on a self-hosted GitLab; the GitHub repository is a copy of it, pushed by hand.
So a pull request cannot simply be merged there — GitHub is not where `main` is written. Patches are
applied on GitLab instead and reach GitHub with the next push, authorship intact. In practice that
changes nothing about how you contribute: open the pull request, and treat the branch as the
contribution rather than the merge button.

## Licence

MIT — see [`LICENSE`](https://github.com/cebor/vellum/blob/main/LICENSE).

Bundled third-party assets and their licence texts live in
[`licenses/`](https://github.com/cebor/vellum/tree/main/licenses): Archivo and JetBrains Mono
(SIL OFL-1.1), Fuse.js (Apache-2.0), and Simple Icons paths (CC0).

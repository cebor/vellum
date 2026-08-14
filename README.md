# Vellum

A multilingual Hugo theme that sets every page as an **engineering drawing sheet**: a drawn frame
with a zone rail down its left edge, and a ruled **title block** carrying the metadata a grey caption
line usually mumbles — issued, revised, extent, by, subject, also in.

**[Demo](https://pages.stkn.org/felix/vellum)** · **[Source](https://gitlab.stkn.org/felix/vellum)**

Built for technical writing that is mostly code. The reading column is wide — 800px, which measures
**92 characters** at the 20px body size — because terminal output and command blocks are the
substance, not an inset; the line height is correspondingly generous so a line that long stays
trackable. Both numbers were measured from a rendered line rather than estimated.

Requires **Hugo extended ≥ 0.146** and uses Hugo's flat layout structure — templates directly in
`layouts/`, partials in `layouts/_partials/`, render hooks in `layouts/_markup/`, shortcodes in
`layouts/_shortcodes/`. There is no `layouts/_default/` and no `layouts/partials/`; files placed
there silently do nothing.

Browser baseline: **Chrome 123+, Safari 17.5+, Firefox 120+** (CSS `light-dark()`). Older browsers get
a plain light palette through an `@supports` fallback rather than a broken page.

## Install

```bash
git submodule add https://gitlab.stkn.org/felix/vellum.git themes/vellum
```

Set `theme = "vellum"` in your site config — copying the directory in works just as well as the
submodule. Then wire up the three settings the theme cannot supply for itself:

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

With `defaultContentLanguageInSubdir = true`, nothing lands at the publish root for a web server to
use as its error document. Add:

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

## Site parameters

Everything below is optional unless marked. A key that is not listed here does nothing.

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

`ShowReadingTime`, `ShowWordCount`, `ShowPostNavLinks`, `ShowCodeCopyButtons`, `ShowBreadCrumbs`,
`ShowShareButtons`, `ShowToc`, `TocOpen`, `ShowFullTextinRSS`, `ShowAllPagesInArchive` — all booleans,
all overridable per page.

### Blocks

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

[[params.socialIcons]]
  name = "github"                # must match an icon name below
  url = "https://github.com/you"
  title = "GitHub"               # optional accessible name

[params.cover]
  linkFullImages = true          # clicking a cover opens the original

[params.editPost]
  URL = "https://github.com/you/site/edit/main/content"
  Text = "Suggest an edit"
  appendFilePath = true
  disabled = false

[params.schema]
  publisherType = "Person"       # or "Organization"
  sameAs = []                    # defaults to your socialIcons URLs

[params.social]
  twitter = "handle"             # twitter:site on cards

[params.analytics.google]
  SiteVerificationTag = "…"      # also .bing, .yandex

[params.assets]
  favicon = "/favicon.ico"
  favicon16x16 = "/favicon-16x16.png"
  favicon32x32 = "/favicon-32x32.png"
  apple_touch_icon = "/apple-touch-icon.png"
  safari_pinned_tab = "/safari-pinned-tab.svg"

[params.fuseOpts]                # passed straight to Fuse.js
  threshold = 0.4
  keys = ["title", "permalink", "summary", "content"]

ShareButtons = ["mastodon", "bluesky", "reddit", "hackernews", "linkedin", "email"]
```

## Front matter

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
| `cover` | See below. |

A date-only value stays a **quoted string** (`date = "2026-03-27"`): a bare TOML local date is not a
`time.Time` and Hugo will not cast it reliably. Quote numeric-looking tags (`"403"`) — bare numbers
reach templates as numbers.

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

## Shortcodes

`figure`, `collapse` (alias `details`), `video`, `audio`, `rawhtml`, `intextimg`.

`collapse` is load-bearing: Goldmark's `unsafe` is off by default, so a raw `<details>` written in
Markdown is stripped and this is the only way to fold long command output.

```
{{< collapse summary="Full output" >}}
```console
…
```
{{< /collapse >}}
```

## Markdown extras

- **Alerts.** A blockquote opening with `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or
  `[!CAUTION]` becomes a labelled callout. Plain Markdown, no shortcode.
- **Headings** get an anchor link on hover from `_markup/render-heading.html`.
- **External links** get `rel="noopener noreferrer"`, a new tab, and a marker.
- **Tables** are wrapped in a focusable scroll container — Goldmark emits a bare `<table>` and a wide
  one would push the whole page sideways.
- **Images in a page bundle** are resized to a 480/800/1600 WebP ladder with `sizes` and intrinsic
  dimensions. An image referenced from outside a bundle is passed through untouched and gets none of
  that, so always put post images in a page bundle.

## Icons

UI glyphs, authored on a 24×24 grid with a 1.75 stroke: `arrow-up`, `arrow-right`, `arrow-left`,
`external`, `hash`, `search`, `pencil`, `chevron-right`, `check`, `moon`, `sun`, `rss`, `email`.

Brand marks, from [Simple Icons](https://simpleicons.org) (CC0) as filled paths: `github`, `bluesky`,
`stackoverflow`, `reddit`, `mastodon`, `linkedin`, `x`, `telegram`, `whatsapp`, `ycombinator`,
`gitlab`, `codeberg`.

Unknown names fall back to a generic link glyph, so a typo in `socialIcons` is visible rather than
silent. Extend by adding a branch to `_partials/icon.html`.

## Styling

`assets/css/` holds numerically prefixed files that are globbed, concatenated, minified and
fingerprinted into one stylesheet with an SRI hash. **The numeric prefix is the cascade order** —
`95-print.css` sits after `90-syntax.css` precisely so its `@media print` rules can override the
syntax colours.

`00-tokens.css` is the single source of truth for colour, type, space and motion, and nothing else in
the stylesheet may carry a bare hex, rem or duration. Three values are also parsed out of it at build
time by `_partials/tokens.html` — `--content-width`, `--sheet-gutter`, `--frame-collapse` and `--bg` —
because an image `sizes` attribute and a `theme-color` meta cannot use `var()`. Renaming any of them
fails the build loudly instead of shipping a stale value. `--content-width` is the reading column
itself, so the frame arithmetic must keep resolving to exactly that width.

Colours resolve through `light-dark()`, so each is written once. `color-scheme: light dark` on a bare
`:root` is what `data-theme="auto"` matches; the explicit `[data-theme]` rules override *only*
`color-scheme`, never the palette. The page therefore themes correctly with JavaScript disabled.
Two consequences: a rule that needs to *override* `color-scheme` must repeat the `[data-theme]`
selectors to win on specificity (see `95-print.css`), and a display swap like the theme-toggle icon
still needs a real `prefers-color-scheme` query because `light-dark()` only produces colours.

Every text token is contrast-checked at ≥4.5:1 against its surface in both schemes. Dim text by
dropping to `--meta-soft` and a smaller step, never by lowering opacity.

A site can add its own `assets/css/99-local.css`; site assets join the same glob and land last.

### Fonts

Two self-hosted variable faces, subset to latin and latin-ext, preloaded, `font-display: swap`:

- **Archivo** (SIL OFL) carries a width axis as well as a weight axis, so one file supplies both the
  reading face and the narrow tracked lettering the title blocks and labels are set in. A matching
  italic ships too, fetched only when a page actually sets italic text.
- **JetBrains Mono** (SIL OFL) for code, figures and tabular numerals. No italic: syntax comments are
  separated by colour instead, so a code block never pulls a second mono file.

Together they are ~121 KB on first load and cached thereafter. That is a deliberate trade for a theme
whose subject is code; drop the `@font-face` blocks in `10-base.css` and the preloads in
`_partials/head-assets.html` to fall back to system stacks.

## Extending without forking

`_partials/extend-head.html`, `_partials/extend-footer.html`, `_partials/extend-post-content.html`
and `_partials/comments.html` are empty stubs. Create a file of the same name in your site's own
`layouts/_partials/` and it wins.

## Licence

MIT. Bundles Fuse.js (Apache-2.0), Archivo and JetBrains Mono (SIL OFL-1.1), and Simple Icons paths
(CC0).

# Vellum

**A multilingual Hugo theme that sets every page as an engineering drawing sheet** — a drawn frame
with a zone rail down its left edge, and a ruled title block carrying the metadata a grey caption
line usually mumbles.

[![Hugo](https://img.shields.io/badge/Hugo-%E2%89%A5%200.158%20extended-ff4088?style=flat-square&logo=hugo&logoColor=white)](https://gohugo.io)
[![Licence](https://img.shields.io/badge/licence-MIT-blue?style=flat-square)](https://github.com/cebor/vellum/blob/main/LICENSE)

<picture>
  <source media="(prefers-color-scheme: dark)"
          srcset="https://raw.githubusercontent.com/cebor/vellum/main/images/hero-dark.webp">
  <img alt="A Vellum post: a drawn frame, a lettered zone rail down its left edge, a ruled title block of metadata, and a syntax-highlighted code block"
       src="https://raw.githubusercontent.com/cebor/vellum/main/images/hero-light.webp">
</picture>

**[Live demo](https://pages.stkn.org/felix/vellum)** · **[Docs](https://pages.stkn.org/felix/vellum/en/docs/)** · **[Source](https://github.com/cebor/vellum)**

Built for technical writing that is mostly code. The reading column is wide — 800px, measuring
**92 characters** at the 20px body size — because terminal output and command blocks are the
substance, not an inset. The line height is correspondingly generous so a line that long stays
trackable.

| | |
|---|---|
| **Multilingual** | Per-language content, menus, profiles, feeds and search indexes |
| **[Search](#search)** | Client-side, Fuse.js, built from the site's own [JSON output](#quick-start) |
| **[Light / dark](#behaviour)** | Follows the OS, or a toggle; works with JavaScript disabled |
| **Responsive images** | Bundle images auto-resized to a 480/800/1600 WebP ladder |
| **[Self-hosted fonts](#fonts)** | Two variable faces, ~121 KB, no third-party requests |
| **[Landing page](#landing-page)** | Profile block, buttons, latest posts — as a drawn index or a [working shell](#the-landing-page-two-ways) |
| **[Post furniture](#display-toggles)** | Table of contents, reading time, breadcrumbs, share row, post nav, edit link |
| **[Archives & taxonomies](#index-pages)** | Year/month archive, tag pages |
| **[SEO](#seo-and-analytics)** | OpenGraph, Twitter cards, schema.org, RSS, canonical + hreflang |
| **[Print](#on-paper)** | A dedicated print stylesheet, not an afterthought |

Linked rows have a section of their own below.

## Contents

[Gallery](#gallery) · [Quick start](#quick-start) · [Upgrading](#upgrading) ·
[Requirements](#requirements) · [Configuration](#configuration) · [Content](#content) ·
[Icons](#icons) · [Customising](#customising) · [Development](#development) · [Licence](#licence)

## Gallery

The hero above is a post. These are the three things it cannot show, and each of them is a claim made
elsewhere on this page that a sentence alone cannot settle. Every frame is generated from the demo
site by [`.parity/shots.mjs --fixtures`](https://github.com/cebor/vellum/blob/main/.parity/shots.mjs),
so none of them can drift away from what the theme actually renders.

### The landing page, two ways

`view = "terminal"` renders the profile's five views as a working shell instead of a drawn index —
the same keys, the same content, nothing to migrate. It is typed into, the arrow keys walk the
history, Tab completes, and `<command> --json` prints the raw data. Below, `skills` has just been
run.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-terminal-dark.webp">
  <img alt="A Vellum landing page rendered as a macOS-style terminal window: window buttons, a help listing of the available commands, and the output of the skills command laid out as a ruled table"
       src="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-terminal-light.webp">
</picture>

The default presentation — the drawn index — is what the demo's [English landing
page](https://pages.stkn.org/felix/vellum/en/) shows, with the shell running next to it on the
[German one](https://pages.stkn.org/felix/vellum/de/). [The landing page, both
ways](https://pages.stkn.org/felix/vellum/en/docs/the-landing-page/) walks through the difference.

### The icon set

Twenty-six marks, in two families that are drawn by different rules: UI glyphs on a 24×24 grid at a
1.75 stroke, and brand logotypes as filled paths. The names are listed under [Icons](#icons) below;
this is what they look like.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-icons-dark.webp">
  <img alt="A ruled grid of the theme's icons, each drawn above its own name: arrows, external link, hash, search, pencil, chevron, check, moon, sun, RSS, mail and the AI nib, then the brand marks for GitHub, GitLab, Codeberg, Stack Overflow, Mastodon, Bluesky, X, LinkedIn, Reddit, Y Combinator, Telegram and WhatsApp"
       src="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-icons-light.webp">
</picture>

The page that frame is taken from is [live](https://pages.stkn.org/felix/vellum/en/docs/icons/), and
it renders every name through the same partial the header and share row call — including a deliberate
unknown one, so the typo fallback is visible rather than described.

### On paper

The same post twice: **on screen at the left, on paper at the right.** The site chrome goes, and
the sheet stays — breadcrumb trail, ruled title block, figures with their captions, the title block
printing heavier rather than lighter. The graph substrate goes too, because on paper the reader's own
sheet is the substrate. Paper gets its own ink rather than the screen palette, which is why the right
half stays white whichever scheme you are reading this in.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-print-dark.webp">
  <img alt="The same post side by side: on the left as rendered on screen, with header, navigation, zone rail and contents panel; on the right as printed, with all of that gone, a breadcrumb trail at the top, the title block ruled heavier, and the cover figure with its caption"
       src="https://raw.githubusercontent.com/cebor/vellum/main/images/gallery-print-light.webp">
</picture>

## Quick start

### From nothing to a running site

```bash
hugo new site myblog && cd myblog
hugo mod init github.com/you/myblog
```

Replace the generated `hugo.toml` with this. It is the whole minimum — the theme import plus the
one setting the theme cannot supply for itself:

```toml
baseURL = "https://example.org/"
title = "My Site"
locale = "en-us"

[module]
  [[module.imports]]
    path = "github.com/cebor/vellum"

# The JSON output *is* the search index. Without it, /search/ finds nothing.
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

Then:

```bash
hugo mod get github.com/cebor/vellum
hugo new posts/hello.md

# The JSON output above is the search *index*. The search *page* is a content
# file, so it is the one piece you add by hand — `layout = "search"` renders it.
cat > content/search.md <<'EOF'
+++
title = "Search"
layout = "search"
hidemeta = true
searchHidden = true
+++
EOF

hugo server -D
```

That is a working site on <http://localhost:1313>, with search and syntax highlighting. Everything
below is refinement.

> [!NOTE]
> Two settings in this guide are ones a theme cannot supply for itself — the `JSON` home output
> above, and `ROOT404` [below](#if-you-use-defaultcontentlanguageinsubdir) — and both are invisible
> when missing: without the first the search page finds nothing, without the second a site using
> `defaultContentLanguageInSubdir` publishes no `/404.html`. Vellum checks both at build time and
> prints the TOML to paste, so you find out from `hugo` rather than from a reader.

> [!TIP]
> A full worked example lives in
> [`exampleSite/hugo.toml`](https://github.com/cebor/vellum/blob/main/exampleSite/hugo.toml) — two
> languages, menus, profile, search and the root 404, all in one file. It is the fastest way to see
> how the pieces fit together.

### Other ways to add the theme

The module import above keeps itself updatable — `hugo mod get -u` whenever you want the latest.
As a submodule instead:

```bash
git submodule add https://github.com/cebor/vellum.git themes/vellum
```

Copying the directory in works just as well. With a submodule or a copy — not with the module
import above, which names the theme itself — set it in your site config:

```toml
theme = "vellum"
```

### If you use `defaultContentLanguageInSubdir`

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

## Upgrading

With the module import, `hugo mod get -u` takes the latest release. To stay on a known version
instead — worth doing on a site you do not want moving under you — name the tag:

```bash
hugo mod get github.com/cebor/vellum@v0.3.0   # pin
hugo mod get -u github.com/cebor/vellum       # take the latest
```

Read the **Breaking** entries in
[`CHANGELOG.md`](https://github.com/cebor/vellum/blob/main/CHANGELOG.md) before you move. They are
the ones that move a URL or drop a param; everything else is additive by intent. Below 1.0 a breaking
change bumps the *minor*, so `v0.3.x` → `v0.4.0` is the step to read carefully.

> [!NOTE]
> The theme registry lists the *latest tag*, so a fresh `hugo mod get` without a version takes
> whatever that is at the time.

## Requirements

- **Hugo extended ≥ 0.158.** Lower versions fail at render time, not with a friendly message.
- **Browsers:** Chrome 123+, Safari 17.5+, Firefox 120+ (CSS `light-dark()`). Older browsers get a
  plain light palette through an `@supports` fallback rather than a broken page.

The theme uses Hugo's flat layout structure — templates directly in `layouts/`, partials in
`layouts/_partials/`, render hooks in `layouts/_markup/`, shortcodes in `layouts/_shortcodes/`. There
is no `layouts/_default/` and no `layouts/partials/`; files placed there silently do nothing.

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

All booleans and **all overridable per page** in front matter. Default `false`, except `ShowToc` and
`TocOpen`, which default to **`true`** — a page gets its contents panel, expanded, unless it or the
site sets the param to `false`.

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

`buttons` renders as a row under the views below — the last thing the profile
says before the index of posts starts. A `url` beginning with `http` is treated
as external and opens in a new tab; anything else is resolved against the
current language.

#### Status fields

Label/value rows in the profile block itself, set in the same ruled instrument a
post's title block uses. They stay visible whichever view is open. The value is
Markdown, so a link works.

```toml
[[params.profile.fields]]
  label = "Location"
  value = "Bremen, DE"
```

#### Views

The landing page can carry up to five views, switched from an index under the
profile block: **about**, **skills**, **record**, **projects** and **contact**.
Each appears only when its own key is set, so there is nothing to switch off —
set none and the landing page is exactly what it was.

Fewer than two and no index is drawn; the single view simply stands open. The
index needs no JavaScript: without it every view stands open and the index
entries are anchor links to them. With it, one view is shown at a time and
`/#profile-view-skills` opens that view directly.

The five view names come from the theme's translations (`view_about`,
`view_skills`, `view_record`, `view_projects`, `view_contact`) — override them in
your own `i18n/` the way you would any other label.

> [!IMPORTANT]
> On a multilingual site, set these per language, under
> `[languages.<lang>.params.profile]`. They are per-language content, not site
> settings.

**about** — one string of Markdown, set on the reading measure.

```toml
[params.profile]
  about = "A paragraph or two, in your own voice."
```

**skills** — grouped items, set as a drawing's schedule. `items` takes either a
plain list of strings, which stays on one line, or a list of tables with an
optional `note`, which turns that group into ruled rows with the notes in a
column of their own. The note is whatever you write — "8 years", "daily", "in
production" — because a percentage nobody could measure is not a fact about you.

```toml
[[params.profile.skills]]
  name  = "Languages"
  items = ["Go", "Rust", "TypeScript"]

[[params.profile.skills]]
  name = "Infrastructure"

  [[params.profile.skills.items]]
    name = "Kubernetes"
    note = "in production"

  [[params.profile.skills.items]]
    name = "Terraform"
    note = "4 years"
```

**record** — newest first, set as the revision table a drawing carries. `org` and
`note` are optional; `note` is Markdown.

```toml
[[params.profile.record]]
  period = "2022–"
  role   = "Principal engineer"
  org    = "Acme Werke"
  note   = "What the job actually was."
```

**projects** — work this sheet points at but does not contain. `url` may be
external or a path on this site; `description` is Markdown and `tags` is a plain
list. All three are optional.

```toml
[[params.profile.projects]]
  name        = "vellum"
  url         = "https://github.com/cebor/vellum"
  description = "A Hugo theme."
  tags        = ["Hugo", "CSS"]
```

**contact** — label/value rows like the status fields above, in their own view.
The value is Markdown.

```toml
[[params.profile.contact]]
  label = "Email"
  value = "[you@example.org](mailto:you@example.org)"
```

#### Presentation: index or shell

The five views have two presentations over exactly the same params. The default
is the drawn index above. Setting `view = "terminal"` renders them as a working
macOS-style shell instead — same keys, same content, nothing to migrate, and you
can switch back by deleting the line.

```toml
[params.profile]
  view = "terminal"            # "index" (default) or "terminal"

  [params.profile.terminal]    # all optional
    user = "you"               # defaults to a slug of params.author
    host = "vellum"            # defaults to a slug of the site title
    dir  = "~"
```

The shell is real: commands are typed, the arrow keys walk the history, Tab
completes, `Ctrl+C` and `Ctrl+L` do what they do, and `<command> --json` prints
the raw data instead of the table. Every command in `help` is also a button, so a
phone reaches everything without a keyboard, and the three window buttons work.

Without JavaScript there is no prompt, and the window shows the whole session
already run — every command and its output, in order. Nothing is lost and nothing
pretends to be interactive. That transcript is also what prints, without the
window around it.

There is a picture of it [above](#the-landing-page-two-ways), it is running on the
demo's [German landing page](https://pages.stkn.org/felix/vellum/de/), and [The
landing page, both
ways](https://pages.stkn.org/felix/vellum/en/docs/the-landing-page/) covers the
rest — the motion and how to turn it off, the window controls, and why the
terminal's stylesheet is the one file a site can avoid shipping.

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

Merged over the theme's defaults and handed to [Fuse.js](https://fusejs.io/api/options.html):

```toml
[params.fuseOpts]
  threshold = 0.4
  keys = ["title", "permalink", "summary", "content"]
```

TOML lowercases the keys, so the camelCase options Fuse expects have to be mapped back. Six are:
`minMatchCharLength`, `isCaseSensitive`, `shouldSort`, `ignoreLocation`, `includeMatches` and
`findAllMatches`. Single-word options (`threshold`, `distance`, `keys`, `location`) need no mapping.
Any other multi-word Fuse option arrives lowercased and is ignored — add it to the map in
`assets/js/search.js` if you need it.

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

Every one of these is optional and emits nothing when unset — including `manifest`, because the theme
ships no web manifest of its own. Point it at a file your site actually serves; naming one that does
not exist is a 404 on every page load.

<details>
<summary><b><code>[params.assets]</code></b> — <code>favicon</code>, <code>favicon16x16</code>, <code>favicon32x32</code>, <code>favicon_svg</code>, <code>apple_touch_icon</code>, <code>apple_touch_icon_sizes</code>, <code>safari_pinned_tab</code>, <code>safari_pinned_tab_color</code>, <code>manifest</code></summary>

```toml
[params.assets]
  favicon = "/favicon.ico"
  favicon16x16 = "/favicon-16x16.png"
  favicon32x32 = "/favicon-32x32.png"
  favicon_svg = "/favicon.svg"
  apple_touch_icon = "/apple-touch-icon.png"
  apple_touch_icon_sizes = "180x180"   # optional, emitted only when set
  safari_pinned_tab = "/safari-pinned-tab.svg"
  safari_pinned_tab_color = "#8a5200"  # optional, defaults to --accent (light)
  manifest = "/site.webmanifest"
```

Paths are emitted root-relative and resolved against `baseURL` including its path, so `/favicon.ico`
and `favicon.ico` both land inside a site published under a subpath. A fully qualified URL — an icon
on a CDN, say — is passed through untouched.

`apple_touch_icon` is what iOS uses for the home-screen icon and Safari for the large Favorites and
Dock tiles. `apple_touch_icon_sizes` adds a `sizes` attribute and is emitted only when you set it:
the theme is handed a path, not a file it can measure, so a default would be a claim about an image
it has never seen, and a size that disagrees with the actual PNG is worse than none. One `180x180`
icon is what every favicon generator produces and needs no `sizes` at all — there is nothing for iOS
to choose between. Declare it when you are hand-writing several rungs and want the pick to be
explicit.

`safari_pinned_tab_color` is not decoration: Safari tints the pinned tab's template icon with it and
wants the attribute present. It defaults to the light value of `--accent`, read out of
`00-tokens.css` the same way the `theme-color` pair is, so a recoloured theme carries the pinned tab
with it.

`favicon_svg` is emitted after the raster rungs so a browser that supports `image/svg+xml` prefers it
and `favicon` stays the fallback. It is the only rung that can follow the active colour scheme: put a
`@media (prefers-color-scheme: dark)` block inside the SVG itself and the tab icon flips with the
page. Custom properties on `:root` work there — `:root` is the `<svg>` element — so the file can be
written against the same token names as the stylesheet.

</details>

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
| `author` | Override the site author on this page. String, list or map, as in `[params]`. |
| `keywords` | Override the site keywords for this page's meta tag. |
| `images` | Social-card image for this page. A bundle resource name or a URL; the first entry wins. Overridden by `cover`. |
| `bodyClass` | Extra class appended to `<body>`, for a page that needs its own CSS hook. |
| `placeholder` | On a `layout = "search"` page, the search input's placeholder text. |
| `ai` | Disclose AI use on this post. See [AI disclosure](#ai-disclosure). |
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

### AI disclosure

States that a post was written with AI assistance. It puts a small stamp beside the post's title —
the note qualifies the whole sheet, so it is struck on the sheet's name rather than filed as one more
row of the title block — and the same drawn mark in the index, so a reader sees
it before opening the post. It follows `hidemeta`: a post that states no metadata states no
disclosure either. Hovering or focusing the stamp opens the detail; the detail is also read
out by a screen reader with the box closed, so nothing is hidden behind a pointer.

<details>
<summary>Writing it: <code>ai = true</code>, a level, or the full <code>[ai]</code> block — <code>level</code>, <code>note</code>, <code>model</code></summary>

Three ways to write the same thing. The shortest is the point:

```toml
ai = true                        # enough on its own; means level = "assisted"

ai = "generated"                 # just the level

[ai]                             # the full form
  level = "assisted"             # "assisted" or "generated"
  note = "Drafted from an outline, then edited by hand"
  model = "Claude Opus 5"
```

| Key | Default | Notes |
|---|---|---|
| `level` | `assisted` | `assisted` or `generated`. Anything else **fails the build** — a typo in a provenance statement is a false statement, and free wording belongs in `note`. |
| `note` | — | What was done. Free text. |
| `model` | `params.ai.model` | What it was done with. |

Name the model once for the whole site rather than in every post:

```toml
[params.ai]
  model = "Claude Opus 5"
```

To mark individual passages instead of the whole post, use the [`ai` shortcode](#ai). A post may do
either, both, or neither.

</details>

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

Goldmark's `unsafe` is off, so a post never needs raw HTML. These cover what it would have been for.

| Shortcode | For |
|---|---|
| [`collapse`](#collapse-alias-details) | A folded block — long logs, appendices |
| [`figure`](#figure) | An image with a caption, through the responsive-image ladder |
| [`video`](#video) | A self-hosted video with a poster |
| [`audio`](#audio) | A self-hosted audio track |
| [`intextimg`](#intextimg) | A small image set inline in a sentence |
| [`ai`](#ai) | Marking an individual passage as AI-written |
| [`rawhtml`](#rawhtml) | The deliberate escape hatch, where nothing else fits |

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

#### `ai`

Marks a passage as written with AI assistance, using the notation a drawing already has for an
altered region: a dashed change bar down the passage's edge, the sheet's AI mark flagged on the bar —
the same nib the sheet stamps beside its title — and a number beside it resolving to a row in the
**revision note** at the foot of the sheet. Every number links to its own row.

Inside a sentence there is no bar for a flag to sit on, so `display="inline"` sets the dashed line
under the words and raises the number after them, like a footnote reference.

```markdown
{{</* ai note="Drafted from an outline, then edited by hand" */>}}
A whole paragraph.
{{</* /ai */>}}

… a sentence with {{</* ai display="inline" */>}}this run{{</* /ai */>}} in it.
```

| Param | Default | Notes |
|---|---|---|
| `display` | `block` | `inline` for a run inside a sentence. Anything else fails the build. |
| `note` | the post's `ai.note` | What happened at this point; it is what the revision note prints. |
| `model` | the post's `ai.model` | Overrides the model for this passage alone. |

The post-level counterpart is front matter rather than a shortcode — see
[AI disclosure](#ai-disclosure). The two are independent: a post may mark passages without carrying a
stamp, and vice versa.

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
- **Fenced code blocks** are highlighted with Chroma *class names*, so their colours come from
  `00-tokens.css` and follow the theme in both schemes. This needs no `markup.highlight`
  configuration — the theme asks for classes per block, overriding Hugo's default of a palette baked
  into the markup. The exception is Hugo's built-in `{{< highlight >}}` shortcode, which bypasses
  render hooks and follows the site's own settings.
- **Tables** are wrapped in a focusable scroll container — Goldmark emits a bare `<table>` and a wide
  one would push the whole page sideways.
- **Images in a page bundle** are resized to a 480/800/1600 WebP ladder with `sizes` and intrinsic
  dimensions, so they neither shift the layout nor ship at source resolution. An image referenced
  from *outside* a bundle is passed through untouched and gets none of that — **always put post
  images in a page bundle.**

## Icons

UI glyphs, authored on a 24×24 grid with a 1.75 stroke:

`arrow-up` · `arrow-right` · `arrow-left` · `external` · `hash` · `search` · `pencil` ·
`chevron-right` · `check` · `moon` · `sun` · `rss` · `email` · `ai`

Brand marks, from [Simple Icons](https://simpleicons.org) (CC0) as filled paths:

`github` · `bluesky` · `stackoverflow` · `reddit` · `mastodon` · `linkedin` · `x` · `telegram` ·
`whatsapp` · `ycombinator` · `gitlab` · `codeberg`

Unknown names fall back to a generic link glyph, so a typo in `socialIcons` is visible rather than
silent. Extend the set by adding a branch to `_partials/icon.html`.

They are [drawn above](#the-icon-set), and the [icon
sheet](https://pages.stkn.org/felix/vellum/en/docs/icons/) on the demo renders every one of these
names live — including the fallback.

## Customising

### Your own CSS

Add `assets/css/99-local.css` to your **site** — site assets join the theme's glob and land last, so
your rules win without forking anything.

`assets/css/` holds numerically prefixed files that are globbed, concatenated, minified and
fingerprinted into one stylesheet with an SRI hash. **The numeric prefix is the cascade order**, which
is why a local file wants a high number: the glob is sorted by name across your assets and the
theme's together, so `99-local.css` lands after `95-print.css` and wins every tie at equal
specificity.

`00-tokens.css` is the single source of truth for colour, type, space and motion — override a token
there and the whole sheet follows. Sizes come from `--step--2` … `--step-5` for type and `--space-4xs`
… `--space-4xl` for spacing.

> [!IMPORTANT]
> Dim text by dropping to `--meta-soft` and a smaller step, never by lowering opacity. Every text
> token is contrast-checked at ≥4.5:1 against its surface in both schemes, and an `opacity: 0.6`
> silently undoes that.

Colours resolve through CSS `light-dark()`, so each is written once and the page themes correctly
with JavaScript disabled. Note that `light-dark()` only produces *colours* — a display swap like the
theme-toggle icon still needs a real `prefers-color-scheme` query. Browsers under the baseline are
caught by an `@supports not (color: light-dark(…))` block at the foot of `00-tokens.css` that repeats
the light palette; override a colour and you may want to override it there too.

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
against. Its [`docs/`](https://pages.stkn.org/felix/vellum/en/docs/) section is the other half of
this file: the README is the reference, those pages are the theme shown working, and they never
repeat a table from here. [`DESIGN.md`](https://github.com/cebor/vellum/blob/main/DESIGN.md) records
the visual system behind the stylesheet — line weights, palette, motion, print — if you want to
extend it in keeping.

The images on this page are not cut by hand. With that server running,
`node .parity/shots.mjs --fixtures` regenerates all nine of them — the two registry fixtures, the
hero pair and the gallery — and writes nothing unless every route it needs answers with the status it
expects. It needs `npm install` in `.parity/` first.

### Contributing

> [!NOTE]
> Please open issues and pull requests on **[GitHub](https://github.com/cebor/vellum)**.

Development happens on a self-hosted GitLab; the GitHub repository is a copy of it, pushed by hand.
So a pull request cannot simply be merged there — GitHub is not where `main` is written. Patches are
applied on GitLab instead and reach GitHub with the next push, authorship intact. In practice that
changes nothing about how you contribute: open the pull request, and treat the branch as the
contribution rather than the merge button.

[`CONTRIBUTING.md`](https://github.com/cebor/vellum/blob/main/CONTRIBUTING.md) has the details,
including the commit message format — commits are the source
[`CHANGELOG.md`](https://github.com/cebor/vellum/blob/main/CHANGELOG.md) is generated from, so they
follow a fixed `type(scope): summary` shape. Read the changelog's **Breaking** entries before
upgrading: they are the ones that move a URL or drop a param.

## Licence

MIT — see [`LICENSE`](https://github.com/cebor/vellum/blob/main/LICENSE).

Bundled third-party assets and their licence texts live in
[`licenses/`](https://github.com/cebor/vellum/tree/main/licenses): Archivo and JetBrains Mono
(SIL OFL-1.1) and Fuse.js (Apache-2.0). The brand marks in `icon.html` are Simple Icons paths, which
are CC0 and carry no licence text to bundle.

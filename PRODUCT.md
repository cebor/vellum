# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: the author of a technical blog that is mostly code.** They write posts whose substance is
command blocks, terminal output, config excerpts and diffs — material that breaks when it wraps and
that no amount of prose styling helps. They are running Hugo, comfortable editing a TOML config and a
CSS token file, and they publish to a static host.

Vellum is developed for **its author's own blog first**. Other Hugo authors are genuinely welcome —
the theme is MIT-licensed, documented in full, and published with a working demo — but where the
author's site and a hypothetical adopter's needs conflict, the author's site decides. Adoption is a
bonus, not a mandate.

**Secondary: someone evaluating the theme.** They arrive at the demo site or the README, and decide
within a screen or two whether this is the one. They are reading to answer "does my kind of content
survive in here?"

Both audiences read on desktop and on a phone, and both are likely to have a dark-mode preference set
at the OS level.

## Product Purpose

Vellum is a multilingual Hugo theme that sets every page as an **engineering drawing sheet**: a drawn
frame, a lettered zone rail down its edge, and a ruled **title block** carrying the post's metadata
instead of the grey caption line a blog theme usually mumbles under the title.

It exists because the default of the genre — a narrow centred column with a light-grey byline — is
wrong for its subject twice over. The column is too narrow for terminal output, and the metadata is
treated as an apology when on a technical post it is *specification*: what this is, who wrote it,
when, at what revision, how long it runs.

Success is that a reader can work through a post full of commands without a single line wrapping
where it shouldn't, can find their place in a long piece from the rail, and can print the page and
still have something that reads as a document.

## Positioning

The drawing-sheet metaphor is carried through as **structure, not decoration** — that is the part a
neighbouring theme could not truthfully copy by adopting the look:

- The **zone rail is a real section index.** One lettered zone per top-level heading, each a link,
  each positioned at that section's own measured offset down the sheet, with the section being read
  lit. On a drawing, a zone reference is how one person tells another where to look, which only works
  if the letter is beside the thing. A page with fewer than two sections renders no rail at all and
  the frame closes the column it would have taken.
- The **title block is a ruled instrument**, not a styled caption: fielded, labelled, and printed
  heavier rather than lighter.
- **Depth is line weight**, in a real three-step system — two widths crossed with three inks, not a
  row of tokens that all resolve to 1px. Nothing casts a shadow.
- **The wide measure is a considered position**, not an oversight — it was measured against a
  rendered line, not estimated, and the line height was set to carry it.

The test applied to any new element is whether it belongs on a drawing: ruled, lettered and
dimensioned, or it does not ship.

## Operating Context

- **Consuming sites deploy to static hosts, commonly with `rsync --delete`.** Any path the build
  stops generating is deleted from the live host. A theme change that renames an output format,
  drops a template, or moves a taxonomy path is a live 404 for every site running the theme.
- **The theme is developed standalone**, at `gitlab.stkn.org:felix/vellum`, committed directly to
  `main`. `.gitlab-ci.yml` builds `exampleSite/` on every branch and publishes it to GitLab Pages
  from `main`. There is no test suite, linter, or package manifest for the theme itself — that CI
  build is the only thing standing between a broken template and the demo.
- **`exampleSite/` serves two jobs at once, and both are real.** It is the test harness — the only
  site in the repo, so every change is exercised through it, and a template that needs content in
  order to be exercised gets that content added there. It is also the **showcase**: the published
  demo is where an evaluating reader forms their impression. Content that only proves a template
  renders, without also reading as a convincing post, is doing half its job.
- **`README.md` is the user-facing contract.** A param that is not in the README does nothing;
  adding one to a template without adding it there ships an undocumented feature, which for this
  product means an absent one.
- **`CONTRIBUTING.md` fixes the commit format, because commits are the changelog source.** Every
  commit in a release range is parsed; an unparseable one, or one carrying a scope that is not on the
  list, refuses the release or lands silently in the wrong group. Issues and pull requests are filed
  on GitHub, but `main` is written on GitLab — a patch is applied there and reaches GitHub with the
  next push, so the branch is the contribution rather than the merge button.
- **Releases are cut by `.release/release.sh` and never by hand.** It runs the preflight, derives the
  version, generates the `CHANGELOG.md` section, tags with that section as the tag message, pushes
  both remotes and verifies the tag arrived. A release is not published until the tag is on GitHub:
  the registry reads the *latest tag* there, not `main`, and nothing is mirrored automatically.
- **`.parity/` is tracked**, so every checkout can verify the URL surface and cut a release; only the
  builds it regenerates each run are ignored. It was maintainer-local until 2026-08-17, when this
  checkout's only copy turned out to be gone with nothing to restore it from — a checker for a
  binding commitment is versioned with what it checks. Its absence still refuses the release rather
  than skipping the check, but that now means a broken checkout, not the wrong machine.
- **`DESIGN.md` records the built visual world**, and the stylesheet outranks it where they disagree.

## Capabilities and Constraints

**Confirmed capabilities:** multilingual content, menus, profiles, feeds and search indexes;
client-side search (Fuse.js, built from the site's own JSON output); light/dark following the OS or a
toggle; responsive images (bundle images to a 480/800/1600 WebP ladder); self-hosted variable fonts;
a landing page with profile block and buttons; post furniture (table of contents, reading time,
breadcrumbs, share row, post nav, edit link); year/month archives and tag pages; OpenGraph, Twitter
cards, schema.org, RSS, canonical and hreflang; a dedicated print stylesheet; five Markdown alert
types via a render hook; AI-use disclosure at two grains — an `ai` front matter key that stamps the
whole post's title block, and an `ai` shortcode that marks an individual passage and resolves it to a
revision note at the foot of the sheet, each usable without the other; the `collapse` (alias
`details`), `figure`, `video`, `audio`, `intextimg`, `ai` and `rawhtml` shortcodes.

**Hard technical constraints:**

- **Hugo extended ≥ 0.158.** `site.Language.Locale` and `.Language.Label` are used unguarded in seven
  templates and exist only from that version; a lower one fails at render time, not with the version
  guard's message.
- **Browser baseline Chrome 123+ / Safari 17.5+ / Firefox 120+**, set by CSS `light-dark()`. Older
  browsers get a plain light palette through an `@supports` fallback rather than a broken page.
- **Hugo's flat layout structure only.** Templates in `layouts/`, partials in `layouts/_partials/`,
  render hooks in `layouts/_markup/`, shortcodes in `layouts/_shortcodes/`. There is no
  `layouts/_default/` and no `layouts/partials/`; files placed there silently do nothing.
- **Goldmark `unsafe` is off** in consuming sites. Anything a post needs that would otherwise take
  raw HTML has to be a render hook or a shortcode — that is why alerts and `collapse` exist.
- **Three settings the theme cannot supply for itself** and that fail quietly when missing:
  `home = ["HTML", "RSS", "JSON"]` (the JSON output *is* the search index), `pygmentsUseClasses` and
  `noClasses = false` (so Chroma emits classes the theme can map onto its own variables).

**Binding commitments — do not break without an explicit decision:**

1. **URL surface stability.** Before changing anything that affects output paths, build the theme
   old and new and diff the file lists. `.parity/check.sh [ref]` does exactly that: it builds
   `exampleSite` from a git worktree at `ref` (default `HEAD`) and from the working tree, and exits
   1 on any path the working tree stopped emitting. Both sides are built on demand, so the check
   cannot go stale. It catches cascades as well as the obvious case — dropping the only post with a
   given tag takes that whole tag's pages with it.
2. **WCAG AA text contrast, 4.5:1**, for every text token against every surface it sits on, in both
   schemes. Dim text by dropping to a softer token and a smaller step, never with `opacity`, which
   silently undoes the guarantee.

**True today but not commitments** (they may be traded deliberately, so do not treat a change to
them as a defect): the page themes, reads and navigates with JavaScript disabled — the zone rail
falls back to even spacing and the table of contents carries navigation; and a page load makes no
third-party requests, with fonts self-hosted and Fuse.js bundled.

**Release and compatibility:**

- **Versioned and released from tags** — `v0.1.0` through `v0.2.4` so far — with the version derived
  from the commits in the range rather than chosen. A breaking change currently bumps the *minor*,
  anything else the patch, because below 1.0 the major carries no signal.
- **`CHANGELOG.md` is generated from the commit history** and prints only what a *user of the theme*
  can see: `feat`, `fix`, `perf`, `revert` and anything breaking. Refactors, docs, CI and chores do
  not appear.
- **What counts as breaking is defined, and it is the adopter's compatibility guarantee:** changing
  the built URL surface, removing or renaming a param or a front matter key, dropping a shortcode, or
  raising the minimum Hugo version. Each requires a `!` subject *and* a `BREAKING CHANGE:` footer
  naming the affected paths or keys and the upgrade step, so an upgrade never asks the reader to
  diff the theme to find out what moved. Neither of the two binding commitments above ships as a
  quiet `fix`.
- **Listing on themes.gohugo.io is intended and submitted** — see Evidence for where that stands.
- **`CONTRIBUTING.md` is the contribution process**: commit format, scopes, the breaking-change rule,
  and the release procedure.

## Brand Commitments

- **Name: Vellum.** Author of record: Felix Itzenplitz. MIT licence, with Fuse.js (Apache-2.0),
  Archivo and JetBrains Mono (SIL OFL-1.1) and Simple Icons paths (CC0) bundled.
- **Voice: exact, and it states the reason.** The README and CLAUDE.md both explain *why* a rule
  exists ("Goldmark's `unsafe` is off, so a raw `<details>` is stripped — this is the only way to get
  one") rather than issuing it. Warnings name the actual failure mode, including the quiet ones. No
  marketing register, no exclamation, no hedging.
- **British spelling** in prose (`colour`, `licence`, `behaviour`) — note that CSS property names and
  Hugo params stay as the platform spells them.
- **The drawing vocabulary is the product's own language** and is used precisely: sheet, frame, zone,
  rail, title block, field, rule, revision. Not decorative jargon — each names a thing that is
  actually on the page.

## Evidence on Hand

- **Live demo:** `https://pages.stkn.org/felix/vellum`, published from `main`.
- **Source:** `https://gitlab.stkn.org/felix/vellum`, copied by hand to
  `https://github.com/cebor/vellum` — automatic mirroring is off by choice. GitHub is the public
  face: the module path users install, and where issues and pull requests go. A release is not
  published until that push has happened.
- **Registry listing:** *submitted, not yet listed* — still true as of 2026-08-17.
  `gohugoio/hugoThemesSiteBuilder` PR #763 adds the module path `github.com/cebor/vellum` to
  `themes.txt`. Upstream paused merging new themes in May 2026 (their issue #718), so the queue is
  the constraint, not the submission. `images/screenshot.png` and `images/tn.png` are its preview
  images and are required to exist; `images/hero-light.png` and `images/hero-dark.png` are the
  README's, and are required for the same reason one step earlier.
- **`README.md`** — complete user documentation: params, front matter, shortcodes, icon set,
  customising, licence.
- **`CONTRIBUTING.md`** — commit format, scopes, the breaking-change rule and the release procedure.
- **`CHANGELOG.md`** — generated release notes back to `v0.1.0`; entries up to 0.1.2 predate the
  generated format and were written by hand.
- **`DESIGN.md`** — the built visual world and its load-bearing rules.
- **`exampleSite/`** — a two-language site (en/de) with posts covering code and terminal output,
  multilingual behaviour, the zone rail, shortcodes, and a German-only post that exercises the
  missing-translation path. Includes a page bundle with cover and inline images, an SVG and an audio
  file.
- **`.parity/`** — `shots.mjs` for batched desktop/mobile, light/dark screenshots against a running
  server, status-asserted so a stale route fails the run rather than saving a 404 under a real
  page's name, and `--fixtures` for the four tracked PNGs under `images/`; `check.sh [ref]` for URL-surface diffs between a git ref and the working tree, both
  built on demand. **Tracked, so it is in every checkout** — a session that cannot find `check.sh`
  has found a real defect, not a machine that was never given the harness.
- **Measured figures that must not be re-estimated:** the 92-character measure and the predecessor
  theme's 83 were both counted from a rendered line. The minimum measured contrast across the
  palette is 4.87:1. Re-measure before changing either; a characters-per-pixel estimate is reliably
  wrong.
- **No** adoption numbers, download counts, user testimonials, performance benchmarks or press exist.
  Do not fabricate them.

## Product Principles

1. **The reading scene is code, not prose.** Every trade-off — the width of the column, the line
   height, the choice to ship a second font family, the print stylesheet — resolves in favour of
   command blocks and terminal output surviving intact. Rules that suit an essay are not
   automatically right here.
2. **Structure over ornament: earn the metaphor or drop it.** The rail indexes real sections or does
   not render; the title block states real fields. An element that only *looks* like drawing
   furniture is decoration, and decoration is the failure mode this theme was built against.
3. **A path is a promise.** Consuming sites delete what the build stops emitting. Output paths change
   only after a deliberate parity check, never as a side effect.
4. **Fail loudly or not at all.** The quiet failure is the enemy: a param that does nothing, a token
   renamed out from under a template, an asset that 404s in production while working locally. Where
   the theme can make a mistake break the build, it should.
5. **Document at the same commit.** The README is the contract and `DESIGN.md` is the record; a
   feature that lands without its documentation has not landed.

## Accessibility & Inclusion

- **WCAG AA text contrast (4.5:1) is a binding standard**, verified against every surface in both
  light and dark schemes.
- **State is encoded as a mark, not a hue** — a rule, a border, a lettered label — so it survives
  greyscale and colour vision deficiency.
- **`prefers-reduced-motion: reduce` collapses every duration**, and smooth scrolling is opt-in
  behind `no-preference` rather than opt-out.
- **Touch-target minimums live behind `@media (pointer: coarse)`**, so meeting them on touch does not
  cost the pointer layouts their density.
- **Multilingual is a first-class case**, not a bolt-on: per-language content, feeds, search indexes
  and metadata, with `hreflang` and a language switcher.

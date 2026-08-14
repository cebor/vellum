# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Vellum** — a multilingual Hugo theme that sets every page as an engineering drawing sheet: a drawn frame, and a ruled **title block** carrying the post's metadata instead of a grey caption line. The zone rail down the frame's left edge is a real section index — one lettered zone per top-level heading, each a link — and it renders only on pages that have sections to index, never as lettering over an empty field.

It was extracted from a personal blog it had been built inside, and is now developed standalone. This repo has no remote and no commits yet.

`README.md` is the user-facing documentation — params, front matter, shortcodes, icon set — and `exampleSite/` is a standalone site that exercises the theme without the blog's content. A param that isn't in the README does nothing; add it there when you add it to a template.

## Structure

Requires Hugo extended ≥ 0.158 — `site.Language.Locale` and `.Language.Label` are used unguarded in six templates and neither exists before that, so a lower version fails at render time, not with the version guard's message. Uses Hugo's flat layout structure: templates directly in `layouts/` (`baseof.html`, `home.html`, `list.html`, `single.html`, `term.html`, `taxonomy.html`, `archives.html`, `search.html`), partials in `layouts/_partials/`, render hooks in `layouts/_markup/`, shortcodes in `layouts/_shortcodes/`. There is no `layouts/_default/` and no `layouts/partials/` — putting files there silently does nothing.

Three render hooks carry behaviour the site depends on, not just styling:

- `_markup/render-image.html` resizes bundled images to a 480/800/1600 WebP ladder (the ladder is derived from `--content-width`, so those numbers move with it) with a `sizes` attribute and intrinsic `width`/`height`, so they neither shift the layout nor ship at source resolution. An image referenced from outside a page bundle is passed through untouched and gets none of that.
- `_markup/render-table.html` supplies the `.table-wrap` scroll container that `50-single.css` styles. Goldmark's default `<table>` has no wrapper, and a wide one pushes the whole page sideways.
- `_markup/render-blockquote.html` turns `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` into labelled alerts, which is why posts never need raw HTML (Goldmark's `unsafe` is off).

`layouts/home.root404.html` and `layouts/baseof.root404.html` render the site's root `/404.html`. The identifier `root404` is the consuming site's `[outputFormats.ROOT404]` name lowercased — rename the format there and both files stop matching silently. That baseof deliberately omits canonical, hreflang, OpenGraph and analytics: Hugo reports the *home page's* permalink while rendering it, so the shared `head.html` cannot recognise it.

## CSS

CSS lives in `assets/css/` as numerically prefixed files (`00-tokens.css` … `95-print.css`). They are globbed, concatenated, minified and fingerprinted into one stylesheet, so **the numeric prefix is the cascade order** — a new file needs a prefix that places it correctly (`95-print.css` sits after `90-syntax.css` precisely so its `@media print` rules can override the syntax colors).

`00-tokens.css` is the single source of truth for color, type, space and motion, and **nothing else in the stylesheet may carry a bare hex, rem or duration**. Colors resolve through CSS `light-dark()`, so each one is written once: `color-scheme: light dark` on a bare `:root` is what `data-theme="auto"` matches, and the explicit `[data-theme="light"]` / `[data-theme="dark"]` rules override *only* `color-scheme`, never the palette. The page therefore still themes correctly with JavaScript disabled, and there is no second block to keep in sync. This raises the effective browser baseline to Chrome 123+ / Safari 17.5+ / Firefox 120+. Two consequences worth remembering: a rule that needs to *override* `color-scheme` must repeat the `[data-theme]` selectors to win on specificity (see `95-print.css`), and a display swap like the theme-toggle icon still needs a real `prefers-color-scheme` media query because `light-dark()` only produces colors.

Sizes come from the same file: `--step--2` … `--step-5` for type and `--space-4xs` … `--space-4xl` for spacing. `--step-0` is body, 20px, which sets the 800px column at **92 characters** — measured with a rendered line, not estimated, against the predecessor theme's 83. That is deliberately past the classic 65–75 advice: command blocks and terminal output are the substance here and should not wrap, and `--line-height: 1.75` is what keeps a line that long trackable. Recount with a real rendered line before changing either number; a characters-per-pixel estimate is reliably wrong. Dim text by dropping to `--meta-soft` and a smaller step, never by lowering opacity — every text token is contrast-checked at ≥ 4.5:1 against its surface in both schemes, and an `opacity: 0.6` silently undoes that. Touch-target minimums live behind `@media (pointer: coarse)` so the pointer layouts keep their density.

Four token values are also parsed out of `00-tokens.css` at build time by `_partials/tokens.html` — `--content-width`, `--sheet-gutter`, `--frame-collapse` and `--bg` — because an image `sizes` attribute and a `theme-color` meta are evaluated without element context and cannot use `var()`. `--content-width` *is* the reading column, so the frame arithmetic in `20-layout.css` has to keep resolving to it; when that drifted, every image silently advertised the wrong `sizes`. That is what keeps the responsive-image breakpoint from silently disagreeing with the layout; renaming any of the four fails the build loudly instead. Never hardcode those numbers in a template.

Any asset referenced only from CSS must have its `RelPermalink` evaluated somewhere in a template, or Hugo never publishes it and it 404s in production while working locally.

## Fonts

The theme self-hosts two variable faces in `assets/fonts/`: **Archivo** (its width axis supplies both the reading face and the narrow tracked lettering of the title blocks) and **JetBrains Mono** for code. Roughly 121 KB on first load, cached thereafter.

## Commands

```bash
hugo server -D --source exampleSite --themesDir ../..   # the theme's own demo site
```

`exampleSite/` is the only site in this repo, so it is what every change is tested against; content that a template needs in order to be exercised has to be added there.

Hugo extended is required. There are no tests, linters, or package manifests for the theme itself — `.gitlab-ci.yml` builds `exampleSite/` on every branch and publishes it to GitLab Pages from `main`, so that build is the only thing standing between a broken template and the demo. It symlinks the repo root to `exampleSite/themes/vellum` instead of passing `--themesDir`, and takes its `--baseURL` from `CI_PAGES_URL` because the demo is served from a subpath.

## Design harness

- `DESIGN.md` records the built visual world (line-weight system, palette, motion, print) and the load-bearing rules. It describes what the stylesheet *is*; where the two disagree, the stylesheet is right and `DESIGN.md` is stale.
- `.impeccable/` is the impeccable skill's state: `config.json` (detector ignore rules, with the reason each was granted), local consent, and `review/` screenshot rounds. The skill lives in `.claude/skills/impeccable/` and its hooks are wired in `.claude/settings.local.json`.
- `.parity/` compares built URL surfaces. `shots.mjs` takes batched desktop/mobile, light/dark screenshots against a running server; `check.sh` diffs a candidate build's file list against the frozen `base-papermod` and `base-enigma` baselines. `base-enigma` keeps its name deliberately: Enigma was this theme's own former name, and the baseline is the URL surface of the in-site version that preceded the extraction. Those baselines can no longer be rebuilt — the themes that produced them are gone — so treat them as a record, not a regenerable fixture.

## Why URL safety matters here

The theme was written for a site that deploys with `rsync --delete`, where any path the build stops generating is deleted from the live host — and that is the normal case for a static host, not an unusual one. A theme change that renames an output format, drops a template, or changes a taxonomy path is therefore a live 404 for every site running it. Before changing anything that affects output paths, build a site old and new into separate directories and diff the file lists — that is what `.parity/check.sh` is for.

## Formatting

`.editorconfig`: LF, UTF-8, 4-space indent, 2 spaces for `.toml`/`.yml`/`.yaml`.

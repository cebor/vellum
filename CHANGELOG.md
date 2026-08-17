# Changelog

What changed in each release, and what an upgrade asks of you. Anything under **Breaking** changes
the built URL surface, a param or a front matter key — read those before upgrading, since sites
deploying with `rsync --delete` lose the paths a build stops emitting.

Entries are generated from the commit history by [`.release/changelog.sh`](.release/changelog.sh);
the format they follow is in [`CONTRIBUTING.md`](CONTRIBUTING.md). Only changes a user of the theme
can see are listed — refactors, documentation, CI and build chores are not. Releases up to 0.1.2
predate the generated format and were written by hand.

## [0.2.3](https://github.com/cebor/vellum/compare/v0.2.2...v0.2.3) - 2026-08-17

### Added

- **search:** results carry the post card's field grid — the issued date and the extent, in the same
  positions and with the same drawn separators as every other index. `hidemeta` is honoured, so a page
  that hides its title block does not have its date reappear here (3e849ee, cff4ba8, bc8eebe)
- **search:** a query that matches nothing is given the 404's exits rather than a grey line, and so is
  a search index that fails to load (a940aed, 328b0d8)

### Fixed

- **a11y:** `:target` scroll-margin is no longer scoped to the reduced-motion query, where a reader who
  asked for reduced motion had every zone mark, contents link and deep link land behind the sticky
  header (0f29e7d)
- **a11y:** the zone rail is placed after the sheet's content in the DOM, so tabbing a long post no
  longer throws focus back to the top of the page mid-read (14eeefb)
- **a11y:** disabled pagination text drops to `--meta-soft`. It had been painted in a line token, at
  2.06:1 (3275b68)
- **a11y:** the AI mark on a post card is named in the field grid, so it discloses to a keyboard and a
  touch reader and not only to a mouse (b3db382, 6fed8b9)
- **ai:** a marked passage is flagged with the sheet's own AI mark, standing beside the change bar so
  the bar runs unbroken. It replaces the numbered revision triangle, and the `revision` icon goes with
  it (c730124, 4d5dd26)
- **css:** the code copy button docks into a ruled strip above the block on touch. As a permanent
  floating control it had masked the first two lines of every block, and the same column however far
  the block was scrolled sideways (d564395, ed998e9)
- **search:** the search route gets its breadcrumbs (707a13a)
- **search:** the browser's native clear control is drawn from the palette instead of being left at its
  UA default (712b7b3)
- **partials:** the manifest link is guarded like the asset links around it. The theme ships no
  manifest of its own, so the unconditional `<link rel="manifest">` was a 404 and two console errors on
  every page load of every site running the theme. **Upgrading:** a site that serves a manifest now has
  to name it — `manifest = "/site.webmanifest"` under `[params.assets]` — or the link is no longer
  emitted (1828193)
- **exampleSite:** the demo opens the contents panel that the theme opens by default (9b4e4c8)

## [0.2.2](https://github.com/cebor/vellum/compare/v0.2.1...v0.2.2) - 2026-08-16

### Fixed

- **ai:** quieten the revision marks to the weight of the text they annotate (5a8c4a7)

## [0.2.1](https://github.com/cebor/vellum/compare/v0.2.0...v0.2.1) - 2026-08-16

### Added

- **ai:** disclose AI use as a title-block stamp and marked passages (e456a7d)

## [0.2.0](https://github.com/cebor/vellum/compare/v0.1.2...v0.2.0) - 2026-08-16

First release with a generated changelog. From here on entries come from the commit history, and
**Breaking** carries everything that moves a URL or drops a param. The two fixes below predate that
and were written by hand.

### Fixed

- **css:** keep the zone rail hidden below the collapse width once the script has placed it, where it
  had been coming back as a stack of marks in the frame's top corner (eaa1cc3)
- **list:** attach an `_index.md` body to the page head as a sheet note, instead of flush against the
  first post card, where proximity read it as that card's caption (6a29629)

## [0.1.2](https://github.com/cebor/vellum/compare/v0.1.1...v0.1.2) - 2026-08-15

### Fixed

- **docs:** correct the contributing note and document that the GitHub copy is pushed by hand, so a
  release that stops at GitLab is visibly an unfinished one.

## [0.1.1](https://github.com/cebor/vellum/compare/v0.1.0...v0.1.1) - 2026-08-15

### Fixed

- **docs:** escape the README's shortcode examples. The theme registry renders the README as a Hugo
  page, which extracts shortcodes from the raw source before Markdown runs — the examples were being
  called rather than shown, and failed the themes.gohugo.io build.

## [0.1.0] - 2026-08-15

First release listed for the Hugo theme registry.

### Added

- `[module.hugoVersion]` in `hugo.toml`, a `go.mod` fixing the module path at
  `github.com/cebor/vellum`, and the 3:2 preview images in `images/` — the metadata the registry
  reads, all of it from the latest tag.

# Changelog

What changed in each release, and what an upgrade asks of you. Anything under **Breaking** changes
the built URL surface, a param or a front matter key — read those before upgrading, since sites
deploying with `rsync --delete` lose the paths a build stops emitting.

Entries are generated from the commit history by [`.release/changelog.sh`](.release/changelog.sh);
the format they follow is in [`CONTRIBUTING.md`](CONTRIBUTING.md). Only changes a user of the theme
can see are listed — refactors, documentation, CI and build chores are not. Releases up to 0.1.2
predate the generated format and were written by hand.

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

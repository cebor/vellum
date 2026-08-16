# Changelog

What changed in each release, and what an upgrade asks of you. Anything under **Breaking** changes
the built URL surface, a param or a front matter key — read those before upgrading, since sites
deploying with `rsync --delete` lose the paths a build stops emitting.

Entries are generated from the commit history by [`.release/changelog.sh`](.release/changelog.sh);
the format they follow is in [`CONTRIBUTING.md`](CONTRIBUTING.md). Only changes a user of the theme
can see are listed — refactors, documentation, CI and build chores are not. Releases up to 0.1.2
predate the generated format and were written by hand.

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

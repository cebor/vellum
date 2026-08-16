# Contributing

Development happens on a self-hosted GitLab; `github.com/cebor/vellum` is a copy pushed by hand, and
it is the address listed on themes.gohugo.io. **Open issues and pull requests on GitHub.** A pull
request cannot be merged there — GitHub is not where `main` is written — so patches are applied on
GitLab and reach GitHub with the next push, authorship intact. Treat the branch as the contribution
rather than the merge button.

## Working on the theme

```bash
hugo server -D --source exampleSite --themesDir ../..
```

`exampleSite/` is the only site in this repository, so it is what every change is tested against.
Content a template needs in order to be exercised has to be added there.

Before you commit:

- **A param that isn't in `README.md` does nothing.** Add it there in the same commit that adds it to
  a template.
- **Changing output paths deletes live pages.** Sites deploy with `rsync --delete`, so a renamed
  output format, a dropped template or a moved taxonomy path is a 404 for every site running the
  theme. Run `.parity/check.sh [ref]` and quote the result in the commit body.
- `assets/css/` is concatenated in filename order, so the numeric prefix *is* the cascade position.
  Colors, sizes, spacings and durations belong in `00-tokens.css` and nowhere else.

## Commit messages

Commits are the changelog source. Each one is parsed, so the format is fixed:

```
<type>(<scope>)!: <summary>

<body — only when the reason is not obvious from the diff>

<footers>
```

### Subject

- **Imperative mood**, lowercase after the colon, no trailing full stop: `fix(css): keep the zone
  rail hidden below the collapse width`.
- **≤ 72 characters** including type and scope; aim for 50.
- Precise and technical. Name the thing that changed — the selector, the partial, the param — not the
  area it lives in. `fix(search): debounce the index fetch` beats `fix: search improvements`.
- One logical change per commit. Split refactors away from behaviour changes; a commit whose subject
  needs an "and" is usually two commits.

### Types

Only these. The type decides whether and where the commit shows up in the changelog:

| Type       | Use for                                                     | Changelog section |
| ---------- | ----------------------------------------------------------- | ----------------- |
| `feat`     | new template, partial, shortcode, param, icon, translation   | Added             |
| `fix`      | wrong rendering, broken link, missing output, a11y defect    | Fixed             |
| `perf`     | smaller payload, fewer requests, faster build                | Performance       |
| `refactor` | same output, different implementation                        | —                 |
| `docs`     | `README.md`, `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`, this file | —               |
| `build`    | `hugo.toml`, `go.mod`, `theme.toml`, registry fixtures       | —                 |
| `ci`       | `.gitlab-ci.yml`, `.parity/`, `.impeccable/`                 | —                 |
| `chore`    | anything else with no user-visible effect                    | —                 |
| `revert`   | reverting a previous commit; name its hash in the body       | Reverted          |

If a change is worth mentioning in the release notes, it is `feat`, `fix` or `perf`. Choose the type
by what a *user of the theme* sees, not by which file you touched: a `README.md` edit that documents
an existing param is `docs`; the param itself is `feat`.

### Scopes

Optional but expected. Use one of: `layouts`, `partials`, `shortcodes`, `markup`, `css`, `tokens`,
`i18n`, `fonts`, `search`, `print`, `a11y`, `exampleSite`, `registry`, `parity`, `ci`, `deps`.
Omit the scope when a change genuinely spans the theme. Never invent a one-off scope — an unknown
scope silently lands in the wrong changelog group.

### Breaking changes

A `!` before the colon **and** a `BREAKING CHANGE:` footer, always both:

```
feat(layouts)!: render archives from a dedicated output format

BREAKING CHANGE: /archive/index.html moves to /archives/. Sites deploying with
rsync --delete lose the old path. Set [outputs.section] or add an alias.
```

This is required for anything that changes the built URL surface, removes or renames a param or front
matter key, drops a shortcode, or raises the minimum Hugo version. The footer must name the affected
paths or keys and the upgrade step. Text contrast below 4.5:1 and a broken URL surface are the two
commitments in `PRODUCT.md` that are not tradeable — if a change touches either, it does not ship as
a quiet `fix`.

### Body

Optional, and usually absent. Add one only when the diff cannot answer *why*: a non-obvious browser
or Hugo behaviour, a failure mode that will be re-introduced without a note, a trade-off that was
weighed. Then keep it to a few sentences.

- Wrap at 72 columns, blank line after the subject.
- Explain the reason, not the change. Restating the diff in prose is noise.
- Quote the evidence when there is any: the `.parity/check.sh` result, an error message, the measured
  number.

### Footers

`Refs: #12` · `Closes: #12` · `Co-authored-by: Name <mail@example.org>` · `BREAKING CHANGE: …`

Issue numbers refer to GitHub, since that is where they are filed.

### Examples

```
feat(shortcodes): add a collapse shortcode for foldable sections
fix(markup): wrap tables so a wide one stops pushing the page sideways
fix(css): hide the zone rail in both states below the collapse width
perf(fonts): subset Archivo to latin and latin-ext
refactor(partials): fold title-block into sheet-stamp
docs: document the search params in the README
build(registry): add the 1500x1000 screenshot the theme gallery reads
```

Not this:

```
update styles                  → no type, no object, unparseable
fix: bug                       → says nothing a changelog can print
feat(css): tweak colors and also fix the mobile nav   → two commits
Fixed the header.              → past tense, full stop, no type
```

History before this file predates these rules; it is not rewritten.

## Releases

Tags are `vMAJOR.MINOR.PATCH`, annotated, on `main`. A release is not done until the tag has reached
GitHub — the registry reads the *latest tag* there, not `main`, and nothing is mirrored
automatically:

```bash
git push origin main --follow-tags
git push github main --follow-tags
git ls-remote --tags https://github.com/cebor/vellum.git   # verify
```

`images/screenshot.png` (1500×1000) and `images/tn.png` (900×600) must be present in the tagged
release, or the theme gallery shows a placeholder.

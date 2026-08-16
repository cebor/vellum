# Design

<!-- impeccable:design-schema 1 -->

Recorded from the built world of this theme, not from intention. Where this file and the stylesheet
in `assets/css/` disagree, the stylesheet is right and this file is stale.

## The world

**Every page is an engineering drawing sheet.** A drawn frame encloses the content; a zone rail runs
down its inside edge; and the metadata a blog usually mumbles in a grey caption line under the title
is set instead as a **ruled title block** — the bordered box a real drawing carries to state what the
sheet is, who drew it, when, and at which revision.

This refuses the centred-column developer blog. The test for any new element is whether it belongs on
a drawing: it is ruled, lettered, and dimensioned, or it does not ship.

The substrate is graph paper, printed inside the frame and nowhere else. Nothing casts a shadow —
depth is carried entirely by line, in three steps. **Those steps are not three widths.** Width and
colour are two independent axes: two widths, three ink weights, and a line is specified by picking
one of each.

| Width | Used for |
|---|---|
| `--line-thin` (1px) | Every drawn line on the sheet except its own edge |
| `--line-frame` (2px) | The sheet's edge: frame, header rule, footer rule, title-block cap rules |

| Ink | Used for |
|---|---|
| `--rule` | The lightest marks: title-block row rules, table rows, zone ticks, card separators, the graph substrate |
| `--rule-strong` | A division that has to hold its own: code block and image borders, the rule closing a section header above the list it introduces |
| `--rule-frame` | The sheet's edge, paired with `--line-frame` |

There is a **third axis, style, and it has exactly one use**: the change bar beside an AI-marked
passage is dashed. It has to be. A block quotation already owns the solid thin rule in the same ink,
and on a drawing the dashed line is the provisional or added one — so the dash is carrying the
distinction rather than decorating it. Any second use has to earn the same way, or the axis becomes
what `--line-hair` was.

A third width token, `--line-hair`, stood in the palette at 1px — the same value as `--line-thin` —
so which one an author reached for made no visible difference, and eleven declarations had drifted
between the two without anyone being able to see it. It was removed rather than given a real value:
the distinction those two tokens were meant to carry is already carried by the ink, and a token that
cannot fail visibly is the quiet failure this theme is built against.

## Colour

Cool paper or graphite ground, blueprint-grey rules, and exactly **one signal colour**. Amber is the
drawing office's red pencil — the mark that says "this one is live". It is never doing more than one
job on a screen at a time: the active nav item, the focus ring, the current zone, the 404 numerals.

Every colour is written once through CSS `light-dark()`. `color-scheme: light dark` on a bare `:root`
is what `data-theme="auto"` matches; the explicit `[data-theme]` rules override *only* `color-scheme`,
never the palette. The page therefore themes correctly with JavaScript disabled, and there is no
second block to keep in sync.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#eff0ec` | `#12161a` | The sheet |
| `--surface` | `#e4e6e0` | `#1a1f25` | Inline code |
| `--surface-sunk` | `#e9ebe6` | `#161b20` | Code blocks, ToC, alerts, collapse |
| `--text` | `#14181c` | `#e4e7e9` | Body |
| `--meta` | `#4a5560` | `#a0a8af` | Labels, summaries |
| `--meta-soft` | `#59636d` | `#8d959c` | The dimmest text permitted |
| `--rule` | `#c7ccc6` | `#333b43` | Hairline |
| `--rule-strong` | `#a3aba4` | `#454e56` | Thin |
| `--rule-frame` | `#8d968f` | `#566069` | Frame |
| `--grid` | `#e5e8e2` | `#161b21` | Graph substrate |
| `--accent` | `#8a5200` | `#e9a93a` | The one signal |
| `--danger` | `#a32218` | `#f2a49c` | Draft flag, warnings, errors |

Every text token clears **4.5:1** against every surface it sits on, in both schemes; the measured
minimum is 4.87:1. Dim text by dropping to `--meta-soft` and a smaller step, never by lowering
opacity — `opacity` silently undoes the contrast guarantee.

Syntax colours are drawn from the same ink family as the chrome, so code and page share one palette
rather than fighting.

**The two sides of a non-text token are matched in perceived lightness, not in hex distance.** The
graph substrate sits about 3 points of CIE L\* off its own ground in each scheme, and `--rule` about
15 points off the substrate. Picking a dark value that *looks* equivalent to its light partner
overshoots — a dark grid chosen that way landed twice as far off the ground as the light one, close
enough to `--rule` that a card separator and a graph line read as the same mark. Nothing here is
caught by the 4.5:1 text check, because none of it is text.

A `@supports not (color: light-dark(…))` block restates the light palette for browsers below
Chrome 123 / Safari 17.5 / Firefox 120, which would otherwise get *no value at all* for every colour
token and render as a broken page rather than a plain one.

## Type

Two self-hosted variable faces, subset to latin and latin-ext, `font-display: swap`.

**Archivo** carries a width axis as well as a weight axis, so one file supplies both voices the sheet
needs. That axis is doing real work, not decoration:

- `--font-stretch-display: 84%` — headings and the profile name, compressed enough to read as drawing
  lettering rather than as a default sans.
- `--font-stretch-label: 72%` with `--tracking-label: 0.1em`, uppercase, at `--step--2` — every label
  on the sheet: title-block field names, sheet stamps, nav, buttons, breadcrumbs, alert labels. This
  is what makes a title block look drawn instead of typed.

A matching italic ships but is **not** preloaded, so it is fetched only when a page actually sets
italic text.

**JetBrains Mono** carries code, dates, counts, tabular figures and the 404 numerals — data and
measurement only. It deliberately ships **no italic**: syntax comments are separated by colour, so a
code block never pulls a second mono file. Mono is never used as a costume for "technical"; the
tagline and the search field are set in Archivo.

**The measure is 92 characters** — `--step-0` at 20px across an 800px column. That is past the classic
65–75 advice on purpose: this blog's substance is command blocks and terminal output that should not
wrap, and the predecessor theme's line was 83. Both figures were measured from a rendered line.
`--line-height: 1.75` is what keeps a line that long trackable. Below 40rem `--step-0` steps back to
18px, because on a phone the column is the viewport and 20px would cut the line to about 40
characters.

## Composition

`--content-width` **is** the reading column. Everything else derives from it:

```
--frame-width = --content-width + --zone-rail-width + --sheet-gutter × 2 + --line-frame × 2
```

Get that arithmetic wrong and the column silently stops matching `--content-width`, which also
desynchronises the image `sizes` attribute — `_partials/tokens.html` parses `--content-width`,
`--sheet-gutter`, `--frame-collapse` and `--bg` straight out of the stylesheet at build time, because
a `sizes` attribute and a `theme-color` meta are evaluated without element context and cannot use
`var()`. Renaming any of the four fails the build loudly instead of shipping a stale value.

The header and footer rules align to the same two frame edges, so the whole page reads as one sheet.
Below `--frame-collapse` (60rem) the frame and rail are dropped and the column runs full-bleed inside
its gutters; the title block stacks to a single column and the identity survives on mono date lines,
hairline rules, bordered icon squares and the stacked block.

## The zone rail

One lettered zone per top-level section, **positioned at that section's own offset down the sheet**,
so a letter marks a location rather than listing one — and the zone being read is lit in amber. That
placement is the entire justification for the letters: on a drawing, zone references are how one
person tells another where to look, which only works if the letter is beside the thing.

Placement needs rendered heights, so it is measured after `DOMContentLoaded` and re-measured on
resize, on load, and when web fonts settle. Without JavaScript the marks fall back to even spacing —
honest furniture rather than a false claim, with the table of contents carrying the real navigation.

**A page with fewer than two sections renders no rail at all**, and the frame closes the column it
would have occupied. Lettering an empty field is the difference between a reference and a decoration.

## State

State is a **mark, not a hue**, so it survives greyscale and colour blindness:

- Active nav item: a 2px amber rule drawn under it, not a tint.
- Draft: a bordered box lettered `DRAFT`, not red text.
- Current zone: lit letter *and* a lengthened tick.
- Focus: a 2px amber outline, offset — one ring, never doubled with a border recolour.
- Alerts: a lettered label plus a border, so the type of alert is readable without colour.
- AI use: a drawn stamp and a dashed change bar in graphite, never the one signal colour — amber
  means "this is live", and a note on how the sheet was drawn is not live.

## Components

Every post card is **one invariant field grid** — meta line, title, summary, optional cover — in the
same positions on the home page, the section list, a tag page, and the 404. The index unit is
learnable rather than reinvented per page.

Cards are separated by ruled lines, never boxed: a drawing divides a schedule with rules, and boxing
each row would make the index heavier than the drawing it indexes.

Every index sheet carries the same head in the same order — title, standfirst, sheet stamp, and then
the **sheet note**, the body of the page's own `_index.md`. The note is a general note on the sheet,
not the first row of the schedule: it sits tight under the stamp that closes the head and is
separated from the index by the page's one generous interval, set in `--meta` on the standfirst's
measure so the index below stays the sheet's loudest mass. Rendered as plain prose it carried the
opposite spacing — the whole gap above it and none below — and proximity read it as a caption on the
first card. Only its paragraphs are toned down, so a table or a code block in an `_index.md` keeps
its ordinary treatment.

**AI provenance is drawing furniture, not a badge.** A post that discloses AI use carries a stamp in
the **corner of the title block** — where a drawing carries its stamps, and because the note
qualifies the whole block rather than adding one more field to it. The detail opens on hover *and* on
focus, so a pointer, a keyboard and a tap all reach it; it is closed with `display`, never `opacity`,
because `aria-describedby` reaches into hidden content and a screen reader therefore hears the whole
disclosure with the box shut.

A marked *passage* uses the notation a drawing already has for an altered region: the dashed change
bar, a numbered **revision flag** on the bar, and the number resolving to a row in the **revision
note** at the foot of the sheet — ruled with the same instrument as the title block it answers to.
The flag is a link to its own row, because a reference that does not resolve is not a reference. The
numbering is derived from each shortcode's ordinal rather than kept as a running count, so a second
render of the same content for another output format cannot number a passage twice.

The flag is **drawn, not typed.** The obvious mark is the Greek delta, and it is unusable here: both
bundled faces are subset to latin and latin-ext, so the character would fall back to whatever the
system had and quietly stop matching the sheet. It is an outlined triangle filling the 24×24 grid
with the number set inside it, dropped below the optical centre because a triangle's area is.

Icons are two deliberate families: UI glyphs authored on a 24×24 grid at 1.75 stroke, and brand marks
as the official filled logotypes, which cannot be redrawn as strokes without misrepresenting someone's
mark. No unicode glyph ever stands in for an icon. `<details>` gets a drawn chevron rather than the
UA disclosure triangle.

Browser surfaces are themed from the palette, not left at their defaults: selection, caret, scrollbar,
focus ring, underline offset, and tabular figures wherever a number is compared against another
number.

## Motion

One transition token (`--transition: 140ms`), used for colour and border changes only. No entrance
animations, no scroll effects. `prefers-reduced-motion: reduce` collapses every duration; smooth
scrolling is behind `prefers-reduced-motion: no-preference` in the first place.

## Print

A drawing sheet is a printed artefact, so printing is not an afterthought. `95-print.css` forces the
light scheme (repeating the `[data-theme]` selectors, which set `color-scheme` at a higher specificity
than a bare `:root`), drops the substrate and all chrome, prints the title block *heavier* rather than
lighter, wraps code so it cannot be cut off at the page edge, and prints external link destinations.

It must keep a numeric prefix after `90-syntax.css`: the CSS files are globbed and concatenated
alphabetically, so **the numeric prefix is the cascade order**, and these rules only beat the syntax
colours because they come later.

## Rules that are load-bearing

1. `00-tokens.css` is the only file that may carry a bare hex, rem or duration.
2. The numeric filename prefix is the cascade order.
3. Never dim text with `opacity`; drop to a softer token and a smaller step.
4. Never add a `box-shadow`. Depth is line weight.
5. Never encode state in colour alone.
6. Touch-target minimums live behind `@media (pointer: coarse)` so pointer layouts keep their density.
7. `--content-width` is the reading column; keep the frame arithmetic resolving to it.
8. Any asset referenced only from CSS must have its `RelPermalink` evaluated somewhere in a template,
   or Hugo never publishes it and it 404s in production while working locally.

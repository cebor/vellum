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
drawing office's red pencil — the mark that says "this one is live". It does exactly one *interactive*
job on a screen at a time: whatever amber marks as live — the active nav item, the focus ring, the
current zone, the 404 numerals — there is only ever one of it, and following it is unambiguous.

Alert borders and labels are the deliberate exception, and they are not a second live mark: an alert
does not compete for the click, it classifies a passage that is already in the reading flow. The rule
was written as "never more than one amber mark on a screen", which the built page has never obeyed —
a sheet carrying a TIP and an IMPORTANT next to an active nav item shows three, and reads correctly.
Narrowed to the interactive sense the rule is both true and worth keeping; taken literally it would
have cost the alerts their severity for a consistency nobody was reading.

Every colour is written once through CSS `light-dark()`. `color-scheme: light dark` on a bare `:root`
is what `data-theme="auto"` matches; the explicit `[data-theme]` rules override *only* `color-scheme`,
never the palette. The page therefore themes correctly with JavaScript disabled, and there is no
*per-scheme* block to keep in sync — no `prefers-color-scheme` half restating the palette in reverse.

There is exactly one restatement, and it is not a scheme: the `@supports not (color: light-dark(…))`
fallback described below, which repeats the **light** palette for browsers under the baseline. It has
to be kept in step by hand, so a colour changed above is changed in two places or in neither.

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
| `--accent-panel` | `#e5e0d4` | `#302b1e` | TIP / IMPORTANT alert fill, and every hover fill |
| `--danger-panel` | `#e8ddd9` | `#2d272a` | WARNING / CAUTION alert fill, and the draft badge |
| `--hl-line` | `#e3e2d8` | `#232422` | A highlighted line in a code block |
| `--syn-ins` | `#dae1da` | `#222d2e` | An added line in a diff |
| `--syn-del` | `#e5dfda` | `#2e2a2e` | A removed line in a diff |

Every text token clears **4.5:1** against every surface it sits on, in both schemes; the measured
minimum is 4.60:1. Dim text by dropping to `--meta-soft` and a smaller step, never by lowering
opacity — `opacity` silently undoes the contrast guarantee.

**The last five are opaque, and that is the whole point of them.** They began as alpha washes —
`--accent-soft`, `--danger-soft`, and the two diff fills — on the argument that nothing reads text off
a hover or a selection. It was wrong, and the audit could not see it: the check reads *tokens against
surfaces*, and an alpha fill is not a surface. It is the composite of a token and whatever happens to
lie underneath, and underneath an alert, a card or a chip is the graph substrate. So the ground moved
with the grid. A TIP label measured 4.86:1 over paper and **4.47:1** where a glyph crossed a grid
line; a hovered tag chip's count measured 4.61:1 over paper and **4.28:1** over the same line. Both
under the binding 4.5:1, on every sheet the theme has ever rendered. The highlighted code line failed
a third way at 4.46:1 light and 4.38:1 dark, and the two diff fills a fourth, at 4.26:1 and 4.28:1
against `--syn-comment`, the dimmest ink the palette has.

Baking them opaque makes the value a label is measured against the value that renders. The alert
panels are the same tints at the same alphas over `--bg`, matching to the byte, so nothing changed
appearance — only the grid stopped showing through. `--hl-line` steps the amber back from 10% to 6%,
and the diff fills from 13%/11% to 8%/6% light and 10%/11% dark, because any more than that puts a
commented line under the line. Each still sits 3 to 4.6 L\* off its ground, at or above the step the
substrate itself uses.

**A hover fill and an alert fill turned out to be the same value**, which is why there are now five
tokens here and not seven: `--accent-soft` over `--bg` *is* `--accent-panel`. Keeping two names for
one colour only meant one of them could drift. `--selection` is the one wash that stays alpha, and it
is the case the original argument was actually right about — it is drawn over arbitrary text at
`--text`'s contrast, and has no fixed ground to bake against.

The rule this produced: **a surface that carries text is an opaque token, checked against every ink
that can land on it** — which for the code surfaces means all nine `--syn-*` inks, not `--text` alone.
An alpha fill is for washes nobody reads off, and the test of "nobody reads off it" is what a hovered
card actually contains, not what the fill is called. The measured minimum lives in this group rather
than in the text tokens, which is why it moved out of the text tokens' 4.87:1. It sits at **4.60:1** —
`--meta-soft` on `--danger-panel`, tied with `--syn-comment` and `--syn-punct` on `--syn-ins` — with
`--accent-panel` next at 4.64:1 dark and 4.65:1 light. Across the 132 ink-and-surface pairs that can
actually occur, nothing is under 4.5:1.

The figure was once recorded as 4.70:1, read off the single panel the change was made for. The lesson
is the rule above, applied to itself: re-measure the whole matrix, not the token you touched — and
measure it against the inks that can *land* there, since a matrix of every ink against every surface
reports failures no reader can reach and hides the ones they can.

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

**The baseline itself is Firefox 121, not 120**, and the extra version is `:has()` rather than
`light-dark()`. Five rules use it. Four — the frame closing the rail's column, the card's cover
layout — degrade to a cosmetic difference and are left unguarded, which is what a baseline is for.
The fifth is the terminal input's focus ring, and it does not degrade. `outline: none` on the input
and the window's replacement ring are one move; split apart, the first was doing what `10-base.css`
forbids in as many words — *the ring is the only focus signal, so it must never be suppressed by a
component's own styling* — because `.term__input:focus` outranks the bare `:focus-visible` there on
specificity. A browser without `:has()` therefore had the global ring removed and nothing put in its
place. Both statements now sit inside one `@supports selector(:has(*))` block, so below it the global
amber ring simply lands on the input: not this component's preferred furniture, but the theme's own,
and present. The rule this states: **a `:has()` rule that carries a binding commitment is guarded;
one that carries an appearance is not.**

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
tagline and the search field are set in Archivo, and so is a figure caption, which was mono until an
audit named it as exactly that costume — a caption is prose about a figure, not a measurement of one.

**The measure is 92 characters** — `--step-0` at 20px across an 800px column. That is past the classic
65–75 advice on purpose: the reading scene here is command blocks and terminal output that should not
wrap, where a conventional column of the same body size measures 83. Both figures were counted from a
rendered line, not estimated.
`--line-height: 1.75` is what keeps a line that long trackable.

**A smaller step on the same column is a longer line, not a shorter one**, so secondary prose takes a
measure of its own: `60ch`, on the standfirst, the sheet note and the figure caption alike. The
caption had none, and at `--step--2` across the full column it ran about a quarter longer than body
copy does at `--step-0` — the one run of text on the sheet past a measure that was counted rather
than guessed.

Below 40rem `--step-0` steps back to
18px, because on a phone the column is the viewport and 20px would cut the line to about 40
characters.

## Composition

`--content-width` **is** the reading column. Everything else derives from it:

```
--frame-width = --content-width + --zone-rail-width + --sheet-gutter × 2 + --line-frame × 2
```

Get that arithmetic wrong and the column silently stops matching `--content-width`, which also
desynchronises the image `sizes` attribute — `_partials/tokens.html` parses `--content-width`,
`--sheet-gutter`, `--sheet-gutter-narrow`, `--sheet-narrow`, `--bg` and `--accent` straight out of
the stylesheet at build time, because a `sizes` attribute, a `theme-color` meta and the `mask-icon`
tint are evaluated without element context and cannot use `var()`. Renaming any of the six fails the
build loudly instead of shipping a stale value.

`--frame-collapse` is **not** one of them, and this file said for a while that it was. Nothing reads
it: a media query cannot resolve `var()`, so the `60rem` literals in `20-layout.css` are its only
consumers and the token is a name for the number rather than its source. It is now asserted in
`tokens.html` without being used, purely so that renaming it fails the build the way this paragraph
had been promising — a token nothing reads is a token that can be renamed away from what it names in
silence, which is the failure this theme is built against.

The header and footer rules align to the same two frame edges, so the whole page reads as one sheet.
Below `--frame-collapse` (60rem) the frame and rail are dropped and the column runs full-bleed inside
its gutters; the title block stacks to a single column and the identity survives on mono date lines,
hairline rules, bordered icon squares and the stacked block.

**The header is sticky only where it is short**, and the boundary is `--sheet-narrow` (40rem) rather
than the frame's own. Measured, it is not one height but four: 57px with a fine pointer, 70px with a
coarse one — the touch minimum raises every nav item to `--tap-target` — 122px once the nav wraps
below 40rem, and 181px on a phone where both apply. That last figure is **21% of an 844px viewport,
held permanently**, on the device with the least reading room and in a theme whose claim is that a
post survives intact. Below 40rem it therefore scrolls away like any other block, which is the same
concession the sheet already makes at 60rem when it gives up its frame and rail; `.top-link` is the
way back up and is fixed at every width.

That is also half of how **an anchor lands clear of it**. `:target` carries a
`scroll-margin-top`, and a single value could never be right for four header heights: at 64px it
suited the desktop case alone and put a heading 117px *above* the header's own bottom edge on a
phone — fully hidden, on the surface where the contents are the only section navigation the sheet has
because the rail is gone. The narrow case is not a margin problem, since absorbing 181px would push
the heading a fifth of the way down the screen; it is answered by the header not being sticky at all.
What remains is the coarse-pointer header at 70px, and that *is* a margin: stepped to `--space-4xl`
behind the same `pointer: coarse` query every other touch adjustment sits behind, so the pointer
layouts keep their tighter landing. Every combination of pointer and width from 320px to 1280px now
lands the heading below the header.

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

**A diff is the one state whose mark this stylesheet does not draw**, and it is worth being precise
about rather than counting as an exception. `--syn-ins` and `--syn-del` are 1.00:1 against each other
in greyscale, and cannot be separated there: both have to stay within about 4 L\* of the code ground
to keep `--syn-comment` above 4.5:1 on them, which leaves no room for a lightness difference. What
tells added from removed is the `+` and `-` the diff already begins each line with — which is why a
diff is legible in a terminal with no colour at all, and why the band's job here is to group a run of
lines rather than to carry the meaning. Adding a second mark would be inventing vocabulary for a
distinction the content already makes.

## Components

Every post card is **one invariant field grid** — meta line, title, summary, optional cover — in the
same positions on the home page, the section list, a tag page and the 404. The index unit is learnable
rather than reinvented per page.

A search result is the same unit at a reduced field set. It is the one place the grid is rebuilt in
JavaScript rather than by `post-card.html`, so it carries the meta line's **two time fields** — issued
and extent — as display strings in `index.json`, and reuses `post-card__meta` to set them: the
invariant there is the class, not the full field list. The AI mark and the draft flag are not carried,
because both would mean rebuilding a partial's logic in the script; `hidemeta` is honoured, so a page
that hides its title block everywhere else does not have its date reappear here.

**The list is capped at 50 and the count says so.** Fuse scores the whole plain text of every page,
so on a large site a two-character query matches most of the corpus and building one row per match on
every keystroke is what stalls. Capping the render is right; announcing the untrimmed total over it
was not. "900 results" above a list that stops at 50, with nothing accounting for the other 850, is
the same failure as a window naming a size it does not have and a rail lettering an empty field — and
it was worse in the live region than on screen, since a screen reader has only the count to go on.
The line reads `{shown} of {n} results` once the cap bites and `{n} results` when it does not.

A search that finds nothing gets the 404's treatment rather than a grey line, because both are the same
situation: the reader is at a dead end on a sheet that has other sheets.

Each card is a named `<article>`, labelled with its post's title. The element was already right — a
card is a self-contained syndicated item — but `<article>` is a landmark, and three to five unnamed
ones per index sheet meant a reader listing landmarks on the home page heard "article" five times
with nothing to tell them apart, on the surface whose whole job is indexing posts. The profile views
were already named this way; the cards were the set that had been missed.

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

**The landing page is a drawing office, and its extra material is a set of views.** The whole of it —
profile block, views, cross-references — is one `.office`, and that wrapper owns the single generous
break that closes the person's half of the page. The break belongs to the boundary, not to the last
block inside it: hung on the button row, which a site need not set, it disappeared with the buttons
and the stamp then arrived at the same interval that separates the view index from its own view.

The profile block is that sheet's title block, so the status fields set under the name are the
block's own rows — the same `title-block__row` markup, with only the outer frame dropped because
`.profile` already draws it. That drop is written two selectors deep on purpose: `.title-block` is
declared in `50-single.css` and the home rules are in `30-`, so a single-class override carries the
same specificity and loses on source order. It did lose, silently, for as long as the block existed —
the fields drew the title block's own 2px frame caps instead, so the block closed on two identical
`--rule-frame` lines 26px apart with bare sheet between them. **The numeric prefix is the cascade
order, and that cuts both ways**: a home rule that has to beat a later file says so in its selector.

**The avatar is pasted on the sheet, and whether it can follow the sheet depends on what it is.** A
raster cannot: one set of pixels, one lightness, and the demo's placeholder — a drawn front
elevation on `#eff0ec`, the light sheet's own paper — read as a lit rectangle above the name on the
dark sheet. It is now an SVG carrying its own `prefers-color-scheme` block, the technique
`static/favicon.svg` already uses, so the ink inverts with the scheme and the page's graph substrate
shows through where the PNG carried a picture of one. `profile.html` accepts either: a raster goes
through the resize, a vector is measured by `image-set.html` like every other image on the site.

Two things that branch taught, both of them recorded because neither failed loudly. A vector needs
an **intrinsic** `width` and `height`, not only a `viewBox`: the avatar spans two rows of the profile
grid, and a replaced element with no intrinsic size stretches to fill them — the drawing came out
120×177. And an XML comment may not contain a double hyphen, so a comment naming CSS custom
properties made the file malformed; a malformed SVG does not error, it loads as a broken-image icon
with the alt text beside it. Both were caught by measuring the rendered box rather than reading the
markup.

The raster branch's dimensions are now read off the **resized** variant rather than written as
`imageWidth` twice. Declaring both from the width made every portrait square, which reserves the
wrong box and shifts the block as it loads — `header.html` carries the same note over the same
mistake, and this was the second place it had been made.

Under it sit up to five views — about, skills, record, projects, contact — each rendered only when
its params exist, indexed by a row of lettered entries, and marked live the way everything else in
the theme is marked live: the 2px amber rule under the active item, the main nav's own mark.

**That mark is drawn on the tab's own bottom edge, not onto a container rule.** The index used to
carry a hairline and the mark was positioned at a negative offset onto it, which holds only while the
row does not wrap — and at 320px, or at 390px as soon as the five labels are set in a language with
longer words than English, the index breaks onto two rows and a first-row mark landed clear of the
row gap and into the labels below. The transparent border is declared on every tab, so marking one
does not move the row.

**The main nav keeps the offset technique**, because there the mark replacing a segment of the
sheet's edge is the point rather than an implementation detail, and it lands on the rule at every
width the nav holds one row. What it does not keep is the assumption that the gap below is deep
enough to fall into: the gap was `--space-md`, tightened to `--space-sm` below 40rem, and the drop is
`--space-sm + --line-frame` — 2px deeper than the gap it fell into, so a wrapped nav marked the top
edge of the row beneath. A menu of six entries wraps at 390px, so this was reachable on a phone, not
only at the 320px floor. The drop is now named once as `--nav-mark-drop` and the row gap is derived
from it, so the mark clears the row below by a hairline and no token change can reopen it. Wrapped,
the mark sits under its own word instead of on the rule: degraded, but never ambiguous.

**The three ruled instruments of the office share one label column**, `--office-label` at 8.5rem with
a `--space-lg` gap. They were set at 7.5rem, 8.5rem and 10rem with two different gaps, which put the
status fields' values, the record's roles and the schedule's items at three different offsets on one
sheet — and since the reader turns between two of them with a tab, the column visibly re-indented on
every switch. 8.5rem is the narrowest that clears the widest label any of them sets. A post's own
title block keeps 7.5rem: its labels are the theme's own, the widest measures 67px, and it never
appears beside these.

That index is deliberately **not numbered**. A numbered list of views would put a second reference
system on a page whose other one — the rail's letters — is earned by each letter marking a real
position, and nothing ever points back at a "02". The same test removed the letters from the schedule
below: a parts list numbers its rows so a balloon on the drawing can point at one, and none does here.

Each view is set in an instrument the theme already had, never a new one. **Skills are a schedule** —
a drawing's parts list, grouped, with an optional grade against each item in its own column; a group
whose items carry no grade stays a single line, so the plain form is a list of strings and nothing
more. The grade is free text the author writes, never a bar or a percentage: a five-step scale is a
fabricated measurement wearing tick marks, which is the same failure as the numbered revision triangle
this theme already removed once. **A record is the revision table**, period in mono with tabular
figures so two rows read as a column. **Projects are reference drawings**, ruled apart and never
boxed, and deliberately not `post-card.html` — that partial states an invariant field grid for *pages
on this site*, which a repository elsewhere is not. **Contact is a title block.**

Without JavaScript every view stands open, the index becomes anchor links, and nothing claims to be
active — the zone rail's fallback, for the rail's reason. That stacked state is also what prints.

Each view is a named region, and switching one moves focus into it. A tab is a link that was stopped
from navigating, so nothing announces the swap on its own: a screen reader is left on the tab it just
read, in front of a section it was never told about. The focus never scrolls — changing a view must
not pull the sheet out from under a sighted reader — and the panel is made focusable only at the
moment focus is moved, because a fragment that names a focusable element makes the browser focus it
on arrival, and `/#profile-view-skills` then drew the amber focus ring around the whole panel for a
reader who had asked for a view rather than for focus.

The band heading a view is the same `.sheet-band` the latest-posts head is, extracted so the two are
one rule rather than two that resemble each other. Only the three views with something to count carry
one; a band over the prose would repeat the index entry directly above it.

**A section gets one rule, and whatever opens the view carries it.** The index drew a `--rule-strong`
hairline of its own and the band drew the same hairline 68px below — two rules at the same width,
weight and ink with one label row between them, and on the two views with no band the first of them
stood over nothing at all. That, and not the missing bands, is what made turning between the views
read as uneven. The index is now a row of tabs and nothing else, bound to its view by the tightest
interval in the office; the rule below it is the band's on three views, the contact block's own frame
cap on the fourth, and on the prose there is none, which is what prose wants.

The office's intervals get tighter as they get more local, so the depth of a break is legible from
its size: `3xl` at the boundary the wrapper owns, `2xl` under the profile block, `xl` to the
cross-references, `md` from the index to the view it opens.

**The buttons are not one of the block's rows.** A title block states — name, discipline, location,
status — and a button does not state anything; it leaves the sheet. Set as the block's last row it
was also the loudest thing in an instrument whose whole point is that it is quiet, and it offered the
way out before the sheet had said what it is. So the row closes the person's half of the page
instead: under the views, or under the terminal, and one step nearer them than the stamp is to it,
because proximity is what says the buttons belong to the person rather than to the index of sheets.
It prints nowhere — a button carries no destination onto paper, so on a printed sheet it is a black
box pointing at nothing, and this stylesheet drops navigation.

**The same views have a second presentation, and it is a deliberate foreign object.**
`profile.view = "terminal"` renders the identical params as a working macOS shell
instead of the drawn index. It is the one component in the theme that carries a
`box-shadow`, and the exception is argued at the head of `35-terminal.css` rather
than smuggled in: a window without a shadow is not a window but a coloured box
claiming to be one. The shadow does the same job as the photograph's clipped
registration corner — it says this object *lies on* the sheet rather than being
drawn on it — and it is mixed from the frame's own ink at low alpha, because a
black shadow on cool paper is a bruise.

It is the one component that carries a `box-shadow`, and within it there are two.
The second is the 1px **inset** edge on each window light, which is not depth at
all: it is a drawn hairline, and `inset` is how you draw one that does not eat
into a 12px dot the way a border would. An inset hairline is line weight, which
is what the rule asks for. It is black where the window's shadow is not, and the
ground is why — that shadow falls on cool paper, this one on `#ff5f57`, where the
frame's grey would read as a smudge instead of an edge. Both exceptions are now
argued at their own declarations; the file's header used to state only the first,
which is the same defect as a comment describing code that has moved on.

Bare colour values survive in exactly one place: the three window buttons.
#ff5f57 has no correct second value, and those colours are recognisable precisely
because they are macOS's and nothing near them.

**Everything else is this theme's palette, and that is the whole reason the
window sits on the page instead of on top of it.** The window is deliberately not
running Terminal's "Basic" profile: a screen of pure white punches a hole in a
sheet of cool paper, and a terminal green and blue that came from no palette here
fought every other colour on the page. It runs a profile matched to the site —
`--surface-sunk` and `--line-height-code`, the same material and line box every
fenced code block already uses; `--syn-string` for the prompt, `--syn-func` for
links, `--syn-comment` for dim text, `--syn-number` for tags; `--rule-strong` for
the window edge and `--rule` for the bar's. Matching a terminal to what you are
looking at is the most ordinary thing a person with a terminal does, and every one
of those inks was contrast-checked long before this component existed, which a
hand-picked terminal green never was. The measured minimum across the shell is
5.1:1. The screen is set at `--step--1` and not the label step below it: at 13px
the window read as a footnote panel beside 20px body copy, and that size gap was
doing as much to make it foreign as the colour was.

**`.term__cmd` and `.term__input` are the theme's only interactive targets under
`--tap-target`, and they stay there.** The input needs no size of its own: a click
anywhere in the window body that is not a link or a selection puts the caret in it,
so its real target is the whole screen. The commands are the argued case. On a coarse pointer `.term__cmd` gains `--space-3xs` of block padding and
lands near 32px rather than 44px. That is a deliberate exception to the rule the
rest of the theme applies without one, so it has to say why: the commands are set
in the transcript's own line box, and growing them to 44px would space `help`'s
rows apart until the window stopped looking like a terminal and started looking
like a menu with a title bar. A shell's output is the one surface where the line
box *is* the content, and the rule the theme already wrote for the AI mark —
"an inline target is exactly what the size minimum exempts" — is the same
argument. It is the weaker end of that exemption, because each command sits one
per row in `.term__help-row` rather than inside a sentence, so the exception is
recorded here rather than assumed. Every command is also a word the reader can
type, and the window's own `Tab` completion reaches it without a pointer at all.

It earns the skin by being real rather than a picture of one: typed commands, a
history on the arrow keys, Tab completion, `Ctrl+C` and `Ctrl+L`, zsh's own
"command not found", a `--json` flag that prints the data instead of the table,
and three window buttons that actually close, minimise and zoom — which is also why
they carry a 24px hit box on a coarse pointer, drawn as a pseudo-element so the 12px
dot is unchanged. Not `--tap-target`: their centres are 28px apart, so a 44px box
would overlap its neighbour and hand it the tap, and opening the gap enough to clear
44px would pull a 28px title bar apart until it stopped being one. Three painted
dots that do nothing would make the whole component the costume the rest of this
theme refuses. The window spans the sheet's full width, so the size in its title
bar is **measured rather than stated** — the script reads the real column and row
count out of the box and re-reads it on resize and once the fonts settle. A
window that names a size it does not have is the same failure as a rail lettering
an empty field.

**All three of those claims are conditional on JavaScript, and the sheet now says
so rather than assuming it.** The buttons' handlers all live in one map, so
without a script they painted and did nothing — the costume the paragraph above
refuses, drawn on the one page where nobody could press them. The size was worse:
the bar stated the markup's placeholder `80×24` over a window as wide as the
column holding the whole session. Both are hidden until the pre-paint script sets
`.js`, which is the rule `10-base.css` already states for the theme toggle, the
top link and the copy control; these three and the size were simply left out of
it. The rules are written in `35-terminal.css` rather than added to that list,
because every selector in this file begins with `.term` and that is what lets
`head-assets.html` drop the whole sheet for a site that never turns the terminal
on. Without a script the bar says what it knows — the user and the shell — and
nothing it cannot operate.

Close, minimise and zoom differ in kind, and the markup now says which is which.
Close acts once and announces its result by revealing the reopen line, which
carries its own label; the other two are toggles and carry `aria-pressed`, set in
the same statement that flips the class so the two cannot drift. A toggle whose
label cannot change has to state its state instead, or a reader presses
"Minimise", perceives nothing, and is offered "Minimise" again. **Close also moves
focus**, to the reopen control: the button it was pressed on is inside the window
it hides, so leaving focus there dropped the reader onto `<body>` and back to the
top of the sheet. Reopen has always done the mirror of this, ending on
`input.focus()`; close was the one handler that moved nothing.

Output **arrives** rather than appearing: revealed a character at a time by
walking the text nodes of the very markup Hugo rendered, so the effect works on a
table and there is still exactly one copy of the content. A command the reader
clicks is typed into the real input line — a terminal has one place where typing
happens, and a second caret over a second prompt while the first sits empty below
is the tell that the thing is a picture. Any keystroke finishes everything still
pending at once, because no reader is ever held behind an animation, and
`prefers-reduced-motion: reduce` removes it entirely. **That listener is on the
window, not on the input**, and the difference is the whole promise: the commands
are buttons, the window's own first line invites the reader to click them, and a
click leaves focus on the button it hit. Bound to the input, the escape worked
only for a command that had been *typed* — measured mid-reveal, a keystroke after
a click moved the transcript 326 → 355 characters while it settled at 519, and
after typing the same command it went straight to 519. The path the window
advertises was the one with no way out of the animation. While output is arriving it
carries `aria-hidden` and is announced once, finished: a live region mutating one
character at a time would make a screen reader stutter through the whole thing.

There is exactly one copy of the content. The transcript of every command is in
the HTML, rendered by Hugo and translated with the rest of the site; the script
hides it and replays those same nodes on demand. So without JavaScript the window
holds the complete session already run and shows no prompt at all — a prompt that
can run nothing is a worse lie than no prompt — and that transcript is also what
prints, with the window's chrome dropped, because a title bar and an input line
are controls and paper has none.

**AI provenance is drawing furniture, not a badge.** A post that discloses AI use carries a stamp
**beside the title**, at the end of the title row and dropped onto the title's cap band, so it reads
as struck on the sheet's name rather than floated above it. It is not drawn inside the title block:
a mark in the block's own corner reads as one more of the block's fields, and this note qualifies the
whole sheet. Set against the sheet's name it says so. It is therefore emitted from the head by its
own `_partials/ai-stamp.html` rather than by the title block — a stamp is not a row — which also
retired the wrapper div the block only ever carried in order to hold a button outside its `<dl>`. It
still follows `hidemeta`, because how a sheet was drawn is metadata. The detail opens on hover *and* on
focus, so a pointer, a keyboard and a tap all reach it; it is closed with `display`, never `opacity`,
because `aria-describedby` reaches into hidden content and a screen reader therefore hears the whole
disclosure with the box shut.

A marked *passage* uses the notation a drawing already has for an altered region: the dashed change
bar, the **AI mark flagged on the bar**, and a number beside it resolving to a row in the **revision
note** at the foot of the sheet — ruled with the same instrument as the title block it answers to.
Every number is a link to its own row, because a reference that does not resolve is not a reference.
The numbering is derived from each shortcode's ordinal rather than kept as a running count, so a
second render of the same content for another output format cannot number a passage twice.

**The AI mark is one glyph at two grains, and the number is a reference in all three registers.** The
nib above a plotted line stamps the sheet beside its title and flags the change bar for a
single passage, so what says "AI" on this sheet is one mark seen twice rather than two marks meaning
the same thing. It is a drawing instrument and a machine-laid line, deliberately not a sparkle: that
mark says "magic" where this one has to say "tooling".

| Where | Mark |
|---|---|
| Beside the title | The nib glyph as a stamp, set at the end of the title row and opening the disclosure — the whole sheet's grain |
| In the index | The same nib glyph with the field name lettered beside it. It is the only mark in the meta row that names nothing on its own — a date and an extent read as themselves — and it opens nothing, so the word is set rather than left to a tooltip a keyboard and a touch would never reach |
| Beside the change bar | The same nib glyph, set clear of the line with the number after it, and pulled down onto the passage it flags. Astride the bar it read as a mark applied to the rule, and the rule cut the nib in half going past; standing beside it, the bar stays one unbroken dashed line and the flag is what annotates it |
| In running prose | The dashed line under the words and the number raised after them. There is no bar for a flag to sit on, and a glyph mid-sentence would stop the line dead |
| In the revision note | A plain number in the key column, set like the title block's own keys. Drawing the mark again would make the key louder than the note it keys |

The mark on the bar was a **numbered triangle** — the drawing's own revision flag, outlined on the
24×24 grid with the number inside it and dropped below the optical centre because a triangle's area
is. It was replaced rather than refined: it carried the delta's geometry only to be legible as
*revision*, read as a warning sign at reading size, and spent the sheet's second AI mark on saying
what the nib already said. Its constraint still stands for anything that replaces it — the mark is
**drawn, not typed**, because the Greek delta is outside the latin and latin-ext subsets both bundled
faces ship and would fall back to whatever the system had.

Icons are two deliberate families: UI glyphs authored on a 24×24 grid at 1.75 stroke, and brand marks
as the official filled logotypes, which cannot be redrawn as strokes without misrepresenting someone's
mark. No unicode glyph ever stands in for an icon. `<details>` gets a drawn chevron rather than the
UA disclosure triangle.

Browser surfaces are themed from the palette, not left at their defaults: selection, caret, scrollbar,
focus ring, underline offset, the search field's clear control, and tabular figures wherever a number
is compared against another number. The two UA replacements — the `<details>` chevron and that clear
control — are drawn from geometry at hairline weight rather than from an image, so neither adds a
request or an asset whose `RelPermalink` has to be evaluated somewhere to get published.

## Motion

One transition token (`--transition: 140ms`), used for colour and border changes only. No entrance
animations, no scroll effects. `prefers-reduced-motion: reduce` collapses every duration; smooth
scrolling is behind `prefers-reduced-motion: no-preference` in the first place.

## Print

A drawing sheet is a printed artefact, so printing is not an afterthought. `95-print.css` forces the
light scheme (repeating the `[data-theme]` selectors, which set `color-scheme` at a higher specificity
than a bare `:root`), drops the substrate and all chrome, prints the title block *heavier* rather than
lighter, wraps code so it cannot be cut off at the page edge, and prints external link destinations.

**What must not be split across a page break is the sheet's furniture as much as the content's.** The
`break-inside: avoid` list protected code blocks, tables, figures, alerts and blockquotes and left
the title block, the fenced block's own bordered wrapper and the index card `auto` — the wrong way
round for a theme whose claim is the sheet. The block that is "the reason a printed sheet is
identifiable" could be cut in half; the border printed around a fence was drawn on `.highlight` while
the protection sat on the `pre` inside it, so a block near the foot of a page could leave an orphaned
top border behind; and a card could be cut between its meta line and the title it dates. All three
are in the list now.

**There is no `forced-colors` block except one, and that is the finding.** In Windows high contrast
the sheet holds together with no code written for it: text legible in both schemes, frame and
title-block rules intact, the graph substrate correctly absent rather than a grid of system-coloured
lines, the draft badge carried by its border, and the active nav mark surviving as a *notch cut into
the header rule* because the mark is a painted bar rather than a tint. That is rule 6 — state is a
mark, not a hue — paying off in a mode nobody designed for. The single exception is the terminal's
window lights, whose meaning *is* their colour: all three became the exact colour of the bar they sit
on and disappeared while staying focusable and clickable. They take a `ButtonBorder` outline in the
reader's own palette rather than `forced-color-adjust: none`, because someone in high contrast chose
that palette deliberately and three outlined circles at macOS's size and spacing are recognisable
enough without overriding it.

It must keep a numeric prefix after `90-syntax.css`: the CSS files are globbed and concatenated
alphabetically, so **the numeric prefix is the cascade order**, and these rules only beat the syntax
colours because they come later.

One `@media print` block lives outside it, at the foot of `35-terminal.css`: that sheet is dropped
from the bundle entirely on a site that leaves `profile.view` at its default, so its print half has to
travel with it or ship to every site that has no terminal. Nothing between the two files touches a
`.term` selector, so the rules sit at the same point in the cascade either way.

## Rules that are load-bearing

1. `00-tokens.css` is the only file that may carry a bare hex, rem or duration.
2. The numeric filename prefix is the cascade order.
3. Never dim text with `opacity`; drop to a softer token and a smaller step.
4. **A line token is never a text colour.** `--rule`, `--rule-strong` and `--rule-frame` are exempt
   from the 4.5:1 check because none of them is text — which holds exactly until one is used as text,
   and then the invariant passes while a rendered text node sits at 2.06:1. The disabled pagination
   link did for a while. `--meta-soft` is the dimmest text the palette has.
5. Never add a `box-shadow`. Depth is line weight.
6. Never encode state in colour alone.
6a. **The focus ring is never suppressed by a component, and `.main` is the one destination that is
   not a component.** `baseof.html` gives `<main>` `tabindex="-1"` so the skip link can land *focus*
   there rather than only moving the sequential starting point — without it, activating the link left
   focus on `<body>`, the next Tab happened to land inside main, and a screen reader was taken
   nowhere and announced nothing, so the one control whose job is to confirm you skipped the
   navigation confirmed nothing. Focusable, the global ring then outlined the entire sheet, on Enter
   and on any cold load of a URL carrying `#main` — the same arrival-focus problem the profile views
   record, which they answer with JavaScript that the skip link cannot rely on. So `.main:focus`
   drops the outline. The rule it bends is about controls: a ring says *which* of many things is
   focused, and a ring around all of them says nothing. The next Tab reaches a real control and rings
   normally.
7. Touch-target minimums live behind `@media (pointer: coarse)` so pointer layouts keep their density.
   Every standalone control clears `--tap-target` there; the exceptions are `.term__cmd`,
   `.term__input`, the window buttons, the "Hugo" link in the footer line and `.title-block__value a`,
   each argued at its own declaration. A link inside a sentence is exempt and a link that is its own
   row is not — the test is the element, not the file it is in. **Applying the rule to the control
   that opens a thing is not applying it to the thing.** `.toc__summary` cleared 44px while every
   entry under it sat at its 16px line box, and the card title — the one link a reader is aiming at on
   the home page, every section list, every tag page and the 404 — sat at 24px while
   `.archive-item__link` and `.search-results a`, the identical case, had both been raised. Both are
   now raised in the same centred shape those two use: the link carries no padding, so growing it from
   the top leaves the title at the head of a 44px box with the space beneath it.
8. `--content-width` is the reading column; keep the frame arithmetic resolving to it.
9. Any asset referenced only from CSS must have its `RelPermalink` evaluated somewhere in a template,
   or Hugo never publishes it and it 404s in production while working locally.
10. **A band drawn on a code line is sized to the block, not to the viewport.** `.chroma code` and
    `.chroma .line` are both `width: max-content; min-width: 100%`, and the diff fills are `display:
    block` inside them. Without that chain a flex line sizes to the `pre`'s *visible* width, so at
    390px a highlighted line's band covered 332px of a 697px line and scrolling right left the marked
    line unmarked — on the one surface this theme exists for.
11. **Every flex and grid container that holds author text states a floor of zero.** A flex item's
    `min-width` and a grid track's automatic minimum both default to *min-content*, and
    `overflow-wrap: break-word` — correctly chosen in `10-base.css`, for the reason stated there —
    deliberately leaves min-content alone. So an unbreakable run in anything an author writes set the
    container's floor and the container widened the sheet under it, while the same text in a
    paragraph on its own page was fine, because a word overflowing a block in normal flow does not
    widen its parent. Measured at 320px with a bare URL and a long compound in every author-supplied
    field: an index sheet went to 600px, a post's to 572px, the tag index to 681px. `minmax(0, 1fr)`
    on `.post-card`, `min-width: 0` on `.breadcrumbs__item` and `.post-footer > *`.
    **The tag chip is the one exception and takes `overflow-wrap: anywhere`** — the keyword
    `10-base.css` rules out globally, because `anywhere` shrinks min-content and the measured reading
    column must not collapse. A chip has no measured column to protect; it is sized by its own word
    and nothing else, and as an `inline-flex` its min-content *is* that word, so no amount of room
    given to the item would have let `break-word` break it.

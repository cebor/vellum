+++
title = "Printing a Sheet"
date = 2026-04-16T08:30:00+02:00
tags = ["reference", "layout"]
summary = "A drawing is a printed artefact to begin with, so paper is not an export format here — it is where the sheet was always going."
# Deliberately the shortest post in the demo, and deliberately one section deep.
#
# `zone-rail.html` renders nothing below two top-level sections and the frame
# closes the column it would have taken — a state DESIGN.md describes, CSS draws
# in `.sheet__frame:not(:has(.zone-rail))`, and no `single` page in this
# repository was in. The lists, the home page and the tag pages all build that
# selector, so the rule itself was covered; what was not was a *post* sheet
# closing its own rail column, which is the surface a reader actually meets it
# on. An audit found it the way this repo finds everything: nothing failed, so
# nobody looked.
#
# The two `###` under the one `##` are the other half. The rail counts top-level
# sections and the contents count every heading, so at one section and three
# identifiers this page renders a table of contents and no rail — the exact
# split behind the claim that the contents carry the real navigation when the
# rail is absent. Both thresholds are now walked by one page.
+++

Every other theme treats printing as an export: a stylesheet bolted on at the
end that hides the navigation and hopes for the best. That order is wrong here.
A drawing is a printed artefact first and a screen artefact second, so the
question is not what to strip for paper — it is what the sheet was always meant
to look like once it got there.

## What survives

The frame, the title block and the rules: everything that makes the page
identifiable as a document rather than a printout of a web page. The title block
prints *heavier* than it renders, not lighter, because on paper it is doing the
job it was drawn for — stating what the sheet is, who drew it and when, to
someone holding it away from any screen.

### The furniture

The graph substrate goes, because on paper the reader's own sheet is the
substrate and a printed grid is just ink. The scheme is forced light whatever
the reader chose, since paper has one ground. Anything that cannot be actioned
with a pen goes with it — the header, the zone rail, the contents, the share
row, the theme toggle. A button on paper is a black box pointing at nothing.

What is protected is the furniture as much as the content. A title block cut in
half by a page break is a sheet that has lost its name, so it is in the same
`break-inside: avoid` list as the code blocks, the tables and the figures.

### The links

A link's destination is invisible on paper, so external ones print theirs after
the text. Internal links do not: a path that only resolves inside the site is
noise in a margin, and the reader holding the page has already got the sheet
that matters.

Code wraps rather than running off the edge. That is the one place the reading
column gives up its rule about not wrapping command blocks — a line cut off by
the paper is worse than a line folded onto the next one, and paper has no
horizontal scroll.

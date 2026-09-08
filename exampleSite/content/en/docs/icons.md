+++
title = "The Icon Set"
date = 2026-07-02T10:00:00+02:00
weight = 10
tags = ["reference"]
summary = "Every glyph the theme can draw, drawn — because a list of names cannot show you a stroke weight."
translationKey = "the-icon-set"
+++

The README lists these by name, which is the right form for the thing you copy into `socialIcons`
and the wrong form for deciding whether they fit your site. A name cannot tell you the stroke weight,
the optical size, or how a row of them sits together. So here they are, rendered through the same
`icon.html` the header and the share row call.

## UI glyphs

Authored on a 24×24 grid with a 1.75 stroke, round caps, no fill — one hand throughout. They are
drawn below at 28px so the stroke reads as a stroke.

{{< icon-sheet names="arrow-up, arrow-right, arrow-left, external, hash, search, pencil, chevron-right, check, moon, sun, rss, email, ai" >}}

The `ai` mark is the odd one and the argued one: a drawing nib above a plotted line, the line dashed
because a machine laid it down. It is not a sparkle. A sparkle says *magic*; this mark has to say
*tooling*, and it is the same mark at both grains — stamped beside a post's title for a whole sheet,
flagged on the change bar for a single passage.

## Brand marks

These are official logotypes from [Simple Icons](https://simpleicons.org) (CC0), so they are filled
shapes rather than strokes. They cannot be redrawn on the 24×24 stroke grid without misrepresenting
somebody's mark, which is why they switch the stroke off and carry their own fill.

{{< icon-sheet names="github, gitlab, codeberg, stackoverflow, mastodon, bluesky, x, linkedin, reddit, ycombinator, telegram, whatsapp" >}}

One of those has a second name. `ycombinator` is what a site writes in `socialIcons`; `hackernews` is
the key the share row uses for the submit target. They resolve to the same logotype:

{{< icon-sheet names="ycombinator, hackernews" >}}

## What an unknown name does

Nothing silently. A name with no branch falls through to a generic link glyph, so a typo shows up on
the page instead of leaving a hole where an icon should be:

{{< icon-sheet names="not-an-icon" >}}

That is the whole failure mode, and it is why this page exists as a rendered sheet rather than a
list: every name above is really drawn here, so one that stops resolving turns into that link glyph
in the open.

To add your own, extend `_partials/icon.html` with another branch and keep the 24×24 grid.

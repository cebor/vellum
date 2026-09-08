+++
title = "The Landing Page, Both Ways"
date = 2026-07-09T15:20:00+02:00
weight = 20
tags = ["reference", "layout"]
summary = "Five views over one profile, and two presentations over the same params — with both of them running in this demo."
translationKey = "the-landing-page"
+++

The landing page is the part of this theme the README has to describe in the most words and can show
the least of. It is worth reading there for the exact keys; this page is for the thing a table cannot
carry, which is what the two presentations feel like next to each other.

## One profile, up to five views

Under the profile block a landing page can carry **about**, **skills**, **record**, **projects** and
**contact**. Each renders only when its own key is set, so there is nothing to switch off — set none
and you have the plain profile the theme started with.

This demo sets all five in English and deliberately leaves `projects` out in German. That is not an
oversight to fix. A branch nothing builds is a branch nothing checks, so the "view absent" path
needed a page that actually omits one, and the German landing page is it.

Two things about the index that are easy to miss:

- **Fewer than two views and no index is drawn.** A single view simply stands open. An index with one
  entry is a control that cannot control anything.
- **It needs no JavaScript.** Without it every view stands open at once and the index entries are
  plain anchor links to them. With it, one view shows at a time and `/#profile-view-skills` opens
  that view directly. Nothing is behind the script that is not also reachable without it.

## The same params, drawn two ways

`view = "terminal"` swaps the drawn index for a working macOS-style shell. Same keys, same content,
nothing to migrate — delete the line and you are back. This demo runs one of each so you can put them
side by side:

- [**This site's landing page**]({{< relref path="/" lang="en" >}}) — the default, a drawn index under
  the profile.
- [**The German landing page**]({{< relref path="/" lang="de" >}}) — the same theme, the same five
  keys, rendered as a shell.

Go and use the second one. The shell is not a picture of a shell: commands are typed, the arrow keys
walk the history, Tab completes, `Ctrl+C` and `Ctrl+L` do what they do, and `<command> --json` prints
the raw data instead of the table. Every command in `help` is also a button, so a phone reaches all of
it without a keyboard, and the three window buttons work — close collapses the window to one line,
minimise to its title bar, zoom grows it from 24 rows to 40.

Output arrives a character at a time rather than appearing, and a command you click is typed into the
prompt. Any keystroke finishes what is still pending at once, so nothing is ever held behind the
effect, and `prefers-reduced-motion: reduce` turns all of it off.

Turn JavaScript off and the window shows the whole session already run — every command and its
output, in order. Nothing is lost and nothing pretends to be interactive. That transcript is also
what prints, without the window around it.

> [!NOTE]
> The window does not run Terminal's "Basic" white profile. It runs one matched to the theme, on the
> same sunk surface and syntax inks every code block on this site already uses, so it sits on the page
> rather than on top of it.

## What the choice costs

Almost nothing, and in one direction less than nothing: `35-terminal.css` is dropped from the
stylesheet entirely unless a site asks for the terminal. It is the theme's only feature that is off by
default, so it is the only sheet a site could otherwise be shipping for markup no page of it will ever
contain.

This demo is the case that proves it. Because the view is set per language, English and German build
*different* stylesheets — one with the terminal rules, one without. View source on either landing page
and compare the filename in the `<link>`.

+++
title = "The Zone Rail"
date = 2026-05-08T16:45:00+02:00
draft = false
tags = ["layout", "typography"]
summary = "On a real drawing the border zones let two people talk about the same spot. Here they index the post."
# Renders _partials/comments.html, the empty stub a site overrides. Set here so
# the demo actually walks that branch — it is otherwise never built, and a
# template nothing builds is a template nothing checks.
comments = true
+++

A drawing frame is divided into zones — letters down one edge, numbers along the other — so that two
people on a phone call can agree on where they are looking. "The bracket in C4." It is a coordinate
system for a conversation.

## What it does here

This theme keeps the letters and gives them a job: **one zone per top-level heading**, in document
order, each one a link. The rail you can see down the left edge of this page has three letters
because this post has three `##` headings. Scroll, and the current one is marked.

That makes the rail a table of contents that costs no vertical space — it lives in the frame margin,
which was otherwise empty ruling.

## When it does not render

This is the part worth stating plainly, because it is where the metaphor could have gone wrong: a
page with nothing to index gets **no rail at all**.

- A profile or landing page has no `##` headings, so no rail.
- A short note written as one continuous argument has none either — and that is a legitimate way to
  write, not a defect to route around.

Lettering an empty field would be a drawing that claims a structure it does not have. An empty zone
rail is worse than no zone rail.

> [!NOTE]
> The separate `ShowToc` block is a different thing: a conventional, collapsible contents list that
> includes `###` headings too. The rail is the coarse index; the ToC is the fine one. A post can
> have both, either, or neither.

## Headings and anchors

Every heading gets an anchor link, revealed on hover and on keyboard focus:

```markdown
## When it does not render
```

The render hook that adds it lives in `layouts/_markup/render-heading.html`. Because it is a render
hook rather than JavaScript, the anchors exist in the HTML as shipped — they work with scripting
off, and they survive being saved to a file.

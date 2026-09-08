+++
title = "Der Icon-Satz"
date = 2026-07-02T10:00:00+02:00
weight = 10
tags = ["referenz"]
summary = "Jedes Zeichen, das das Theme zeichnen kann — gezeichnet, weil eine Namensliste keine Strichstärke zeigt."
translationKey = "the-icon-set"
+++

Die README führt sie als Namen auf. Das ist die richtige Form für das, was man in `socialIcons`
kopiert, und die falsche, um zu entscheiden, ob sie zur eigenen Seite passen. Ein Name sagt nichts
über Strichstärke, optische Größe oder darüber, wie eine Reihe davon zusammensitzt. Also hier,
gerendert durch dasselbe `icon.html`, das auch Kopfzeile und Share-Zeile aufrufen.

## UI-Zeichen

Auf einem 24×24-Raster mit 1,75er Strich gezeichnet, runde Enden, keine Füllung — durchgehend eine
Hand. Unten bei 28px gezeichnet, damit der Strich als Strich lesbar ist.

{{< icon-sheet names="arrow-up, arrow-right, arrow-left, external, hash, search, pencil, chevron-right, check, moon, sun, rss, email, ai" >}}

Das `ai`-Zeichen ist das ungewöhnliche und das begründete: eine Reißfeder über einer geplotteten
Linie, die Linie gestrichelt, weil eine Maschine sie gezogen hat. Es ist kein Funkeln. Ein Funkeln
sagt *Magie*; dieses Zeichen muss *Werkzeug* sagen — und es ist dasselbe Zeichen in beiden Körnungen:
neben dem Titel gestempelt für ein ganzes Blatt, auf der Änderungsfahne geflaggt für eine einzelne
Passage.

## Markenzeichen

Das sind offizielle Logotypen von [Simple Icons](https://simpleicons.org) (CC0), also gefüllte Formen
statt Striche. Sie lassen sich nicht auf das 24×24-Strichraster umzeichnen, ohne jemandes Marke
falsch wiederzugeben — deshalb schalten sie den Strich ab und bringen ihre eigene Füllung mit.

{{< icon-sheet names="github, gitlab, codeberg, stackoverflow, mastodon, bluesky, x, linkedin, reddit, ycombinator, telegram, whatsapp" >}}

Eines davon hat einen zweiten Namen. `ycombinator` schreibt eine Seite in `socialIcons`,
`hackernews` ist der Schlüssel, den die Share-Zeile für das Submit-Ziel verwendet. Beide lösen zum
selben Logotyp auf:

{{< icon-sheet names="ycombinator, hackernews" >}}

## Was ein unbekannter Name tut

Nichts stillschweigend. Ein Name ohne Zweig fällt auf ein allgemeines Link-Zeichen durch, damit ein
Tippfehler auf der Seite auftaucht, statt ein Loch zu hinterlassen, wo ein Icon sein sollte:

{{< icon-sheet names="kein-icon" >}}

Das ist der ganze Fehlerfall, und er ist der Grund, warum diese Seite ein gerendertes Blatt ist und
keine Liste: Jeder Name oben wird hier wirklich gezeichnet, also wird einer, der nicht mehr auflöst,
offen sichtbar zu genau diesem Link-Zeichen.

Für eigene Zeichen `_partials/icon.html` um einen weiteren Zweig erweitern und beim 24×24-Raster
bleiben.

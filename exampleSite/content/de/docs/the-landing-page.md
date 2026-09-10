+++
title = "Die Startseite, zweimal"
date = 2026-07-09T15:20:00+02:00
weight = 20
tags = ["referenz", "layout"]
summary = "Fünf Ansichten über ein Profil und zwei Präsentationen über dieselben Params — beide laufen in dieser Demo."
translationKey = "the-landing-page"
+++

Die Startseite ist der Teil dieses Themes, den die README mit den meisten Worten beschreiben muss und
am wenigsten zeigen kann. Für die genauen Schlüssel lohnt sich dort das Nachlesen; diese Seite ist für
das, was eine Tabelle nicht transportiert: wie sich die beiden Präsentationen nebeneinander anfühlen.

## Ein Profil, bis zu fünf Ansichten

Unter dem Profilblock kann eine Startseite **about**, **skills**, **record**, **projects** und
**contact** tragen. Jede rendert nur, wenn ihr eigener Schlüssel gesetzt ist, es gibt also nichts
abzuschalten. Setzt man keine, hat man das schlichte Profil, mit dem das Theme angefangen hat.

Diese Demo setzt auf Englisch alle fünf und lässt `projects` auf Deutsch bewusst weg. Das ist kein
Versehen, das behoben gehört. Ein Zweig, den nichts baut, ist ein Zweig, den nichts prüft: der Pfad
„Ansicht fehlt" brauchte also eine Seite, die wirklich eine weglässt, und die deutsche Startseite ist
sie.

Zwei Dinge am Index, die man leicht übersieht:

- **Bei weniger als zwei Ansichten wird kein Index gezeichnet.** Die einzelne Ansicht steht dann
  einfach offen. Ein Index mit einem Eintrag ist ein Bedienelement, das nichts bedienen kann.
- **Er braucht kein JavaScript.** Ohne es stehen alle Ansichten gleichzeitig offen und die
  Index-Einträge sind einfache Ankerlinks dorthin. Mit ihm wird eine Ansicht zur Zeit gezeigt, und
  `/#profile-view-skills` öffnet direkt diese. Nichts liegt hinter dem Skript, was nicht auch ohne es
  erreichbar wäre.

## Dieselben Params, zweimal gezeichnet

`view = "terminal"` tauscht den gezeichneten Index gegen eine funktionierende Shell im macOS-Stil.
Dieselben Schlüssel, derselbe Inhalt, nichts zu migrieren. Zeile löschen und man ist zurück. Diese
Demo betreibt von jedem eines, sodass man sie nebeneinanderlegen kann:

- [**Die Startseite dieser Sprache**]({{< relref path="/" lang="de" >}}) — als Shell.
- [**Die englische Startseite**]({{< relref path="/" lang="en" >}}) — dasselbe Theme, dieselben fünf
  Schlüssel, als gezeichneter Index.

Und zwar wirklich benutzen. Die Shell ist kein Bild einer Shell: Befehle werden getippt, die
Pfeiltasten laufen durch die Historie, Tab vervollständigt, `Strg+C` und `Strg+L` tun, was sie tun,
und `<befehl> --json` gibt die Rohdaten statt der Tabelle aus. Jeder Befehl in `help` ist auch ein
Knopf, damit ein Telefon ohne Tastatur an alles herankommt, und die drei Fensterknöpfe funktionieren:
Schließen klappt das Fenster auf eine Zeile zusammen, Minimieren auf seine Titelleiste, Zoomen wächst
es von 24 auf 40 Zeilen.

Die Ausgabe kommt zeichenweise statt zu erscheinen, und ein angeklickter Befehl wird in den Prompt
getippt. Jeder Tastendruck beendet sofort, was noch aussteht, sodass niemand hinter dem Effekt
zurückgehalten wird, und `prefers-reduced-motion: reduce` schaltet das Ganze ab.

Schaltet man JavaScript aus, zeigt das Fenster die bereits gelaufene Sitzung: jeden Befehl und seine
Ausgabe, der Reihe nach. Nichts geht verloren und nichts gibt vor, interaktiv zu sein. Genau dieses
Transkript ist auch das, was gedruckt wird, ohne das Fenster darum herum.

> [!NOTE]
> Das Fenster fährt nicht Terminals weißes „Basic"-Profil. Es fährt eines, das zum Theme passt, auf
> derselben abgesenkten Fläche und mit denselben Syntaxfarben, die jeder Codeblock dieser Seite schon
> benutzt, es sitzt also auf der Seite statt obenauf.

## Was die Wahl kostet

Fast nichts, und in einer Richtung weniger als nichts: `35-terminal.css` fällt vollständig aus dem
Stylesheet, solange eine Seite das Terminal nicht anfordert. Es ist die einzige Funktion des Themes,
die standardmäßig aus ist, und damit das einzige Stylesheet, das eine Seite sonst für Markup
ausliefern könnte, das auf keiner ihrer Seiten je vorkommt.

Diese Demo ist der Fall, der das belegt. Weil die Ansicht pro Sprache gesetzt ist, bauen Englisch und
Deutsch *unterschiedliche* Stylesheets — eines mit den Terminal-Regeln, eines ohne. Quelltext auf
einer der beiden Startseiten ansehen und den Dateinamen im `<link>` vergleichen.

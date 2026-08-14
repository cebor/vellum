+++
title = "Mehrsprachig von Anfang an"
date = 2026-06-24T11:00:00+02:00
draft = false
tags = ["mehrsprachig", "referenz"]
summary = "Zwei Sprachen, von denen keine eine Übersetzungsschicht über der anderen ist — und was das an Konfiguration kostet."
translationKey = "multilingual-by-design"
+++

Diese Demo läuft auf Englisch und Deutsch. Nicht Englisch mit deutschem Anstrich: Jede Sprache hat
ihr eigenes Inhaltsverzeichnis, ihr eigenes Menü, ihren eigenen Suchindex, ihren eigenen Feed und
ihre eigenen Tags. Ein Beitrag darf in einer Sprache existieren und in der anderen nicht — das ist
der Normalfall, keine Lücke, für die man sich entschuldigt.

## Der Aufbau

```toml
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = true

[languages.en]
  languageName = "English"
  contentDir = "content/en"
  weight = 1

[languages.de]
  languageName = "Deutsch"
  contentDir = "content/de"
  weight = 2
```

`defaultContentLanguageInSubdir` stellt *jede* Sprache unter ein Präfix, Englisch eingeschlossen.
Damit landet nichts im Veröffentlichungswurzelverzeichnis — und genau deshalb bringt das Theme das
Ausgabeformat `ROOT404` mit, damit der Webserver überhaupt ein Fehlerdokument ausliefern kann.

> [!IMPORTANT]
> `ROOT404` gehört ausschließlich in die Standardsprache. Gibt man es beiden, streiten sie sich um
> `/404.html`, und die Build-Reihenfolge entscheidet.

## Übersetzungen paaren

Zwei Beiträge werden über einen gemeinsamen `translationKey` zu Übersetzungen voneinander. Damit
bleiben Dateiname und URL in jeder Sprache idiomatisch:

```toml
translationKey = "multilingual-by-design"
```

Im Schriftfeld erscheint dann die Zeile **Auch auf**, und die Sprachumschaltung im Kopf führt auf das
Gegenstück dieser Seite statt auf die Startseite. Wo es kein Gegenstück gibt — wie bei zwei
Beiträgen dieser Demo — fällt sie auf die Startseite der anderen Sprache zurück. Das ist die
ehrliche Antwort.

## Parameter je Sprache

Alles unter `[languages.xx.params]` erreicht die Templates als `site.Params`, bereits für die
aktuelle Sprache aufgelöst. Erst das macht einen wirklich sprachabhängigen `editPost`-Link möglich:

```toml
[languages.de.params.editPost]
  URL = "https://example.org/-/edit/main/content/de"
  appendFilePath = true
```

`.File.Path` ist relativ zum `contentDir` der jeweiligen Sprache — eine einzige seitenweite URL
könnte also immer nur für eine der beiden stimmen.

## Datumsangaben

`DateFormat = ":date_long"` statt einer Go-Layout-Zeichenkette. Ein Layout wie `2. January 2006`
friert den Monatsnamen in einer Sprache ein und schreibt auf einer deutschen Seite bereitwillig
*January*; die Kurzform löst pro Sprache auf.

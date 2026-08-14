+++
title = "Code und Terminalausgabe"
date = 2026-03-27T09:15:00+01:00
draft = false
tags = ["code", "referenz"]
summary = "Codeblöcke sind der eigentliche Inhalt eines technischen Beitrags, nicht sein Beiwerk — entsprechend werden sie gesetzt."
translationKey = "code-and-terminal-output"
+++

Die Lesespalte dieses Themes ist aus genau einem Grund 92 Zeichen breit: Eine aus einem 80 Zeichen
breiten Terminal kopierte Zeile soll hineinpassen, ohne umzubrechen. Alles andere an der Behandlung
von Code folgt aus dieser Entscheidung.

## Syntaxhervorhebung

Chroma gibt Klassennamen statt Inline-Styles aus. Nur deshalb lassen sich die Syntaxfarben über
dieselben `light-dark()`-Tokens auflösen wie der Rest der Seite. Die einbindende Site muss das
allerdings aktiv einschalten:

```toml
pygmentsUseClasses = true

[markup.highlight]
  noClasses = false
```

Fehlt eines von beidem, backt Hugo eine Hell-Palette fest ins HTML — und die Codeblöcke bleiben auf
einer dunklen Seite hell.

## Ein Beispiel

```go
// tokens.html liest vier Werte zur Build-Zeit aus 00-tokens.css, weil ein
// sizes-Attribut ohne Element-Kontext ausgewertet wird und kein var() kennt.
func measure(css string) (int, error) {
    m := regexp.MustCompile(`--content-width:\s*(\d+)px`).FindStringSubmatch(css)
    if m == nil {
        return 0, fmt.Errorf("--content-width fehlt: Layout und responsive "+
            "Bilder wären sich stillschweigend uneinig")
    }
    return strconv.Atoi(m[1])
}
```

Bemerkenswert ist weniger der Code als der Fehlertext. Ein fehlendes Token bringt hier nichts zum
Absturz — es sorgt nur dafür, dass jedes Bild eine falsche `sizes`-Angabe ausliefert. Solche Fehler
überleben Monate.

## Lange Ausgaben

{{< collapse summary="Vollständige Build-Ausgabe" >}}
```console
$ hugo --source exampleSite --themesDir ../.. --printPathWarnings
Start building sites …
hugo v0.165.0+extended linux/amd64

                   │ EN │ DE
───────────────────┼────┼────
  Pages            │ 24 │ 21
  Paginator pages  │  2 │  1
  Non-page files   │  4 │  2
  Processed images │  6 │  6
  Aliases          │  4 │  3

Total in 284 ms
```
{{< /collapse >}}

Wenn eine Ausgabe über hunderte Zeilen läuft, gehört sie in einen `collapse`-Shortcode — gefaltet,
aber vollständig. Gekürzte Logs sind das Einzige, was Lesende nicht rekonstruieren können.

> [!TIP]
> `ShowCodeCopyButtons = true` setzt auf jeden Block eine Kopierschaltfläche. Sie erscheint bei
> Hover *und* bei Tastaturfokus und wird im Druck unterdrückt — auf Papier gibt es nichts zu kopieren.

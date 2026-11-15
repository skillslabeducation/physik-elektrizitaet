# Lichter an! – Lern- und Übungsseite Elektrizität (Klasse 7)

Interaktive Lernseite zur Vorbereitung auf eine Physikarbeit zum Thema Elektrizität, optimiert für Handy und Tablet.

**Online:** https://skillslabeducation.github.io/physik-elektrizitaet/

## Die Geschichte

Stromausfall! Eine Hafenstadt liegt nachts im Dunkeln. In sechs Stadtteilen lernst du die Themen der Arbeit. Jeder geschaffte Stadtteil geht wieder an. Am Ende wartet „Das große Einschalten“: eine Probearbeit mit 20 Aufgaben. Ab 80 % leuchtet die ganze Stadt.

## Inhalt

| Stadtteil | Thema |
|-----------|-------|
| 1 Wetterwarte | Elektrische Ladung, Ladungstrennung durch Reibung, Glimmlampe, Elektroskop |
| 2 Altstadt | Der Stromkreis, Leiter und Nichtleiter, Schalter, Schaltzeichen, Schaltplan, Sicherheit |
| 3 Hafen | Reihen- und Parallelschaltung, Stromstärke (Knotenregel), Spannung (Maschenregel) |
| 4 Wohnviertel | Wann ist welche Schaltung sinnvoll? |
| 5 Fabrik | UND- und ODER-Schaltung, Wahrheitstabelle, Wechselschaltung (Zusatz) |
| 6 Leuchtturm | Schaltskizzen zu gegebenen Problemen |

Jeder Stadtteil hat drei Bereiche:
- **Verstehen:** Karten mit Merksätzen und Experimenten zum Ausprobieren
- **Üben:** Auswahl, Lückentext, Zuordnen, Sortieren, Rechnen, Schaltpläne lesen, Baukasten-Missionen, Skizzen auf Papier
- **Erklären:** Freitext mit Checkpunkten und Musterantwort

Dazu kommen:
- **Baukasten:** Schaltungen auf einem Raster bauen. Die Simulation rechnet mit echten Strömen und Spannungen: Lampen in Reihe leuchten schwächer, ein Kurzschluss wird erkannt, Messwerte lassen sich einblenden.
- **Störungen:** Falsch beantwortete Aufgaben werden wiederholt, bis sie zweimal hintereinander sitzen.
- **Blitzrunde, Lernplan, Spickzettel und Strom-Geheimnisse:** 60 Sekunden „stimmt oder stimmt nicht“, ein Lernplan bis zum Datum der Arbeit, ein Spickzettel zum Drucken und Geheimnisse zum Freischalten mit Funken.

Inhalte, die nicht sicher im Unterricht dran waren, sind als „Zusatz“ markiert: Elektronen, Kurzschluss, Wechselschaltung und Messgeräte anschließen.

## Technik

- Reines HTML, CSS und JavaScript, ohne Build-Schritt und ohne externe Dienste
- Alle Grafiken und Schaltzeichen sind selbst gezeichnetes SVG
- Fortschritt nur lokal im Browser (localStorage)
- Schriften: Chakra Petch und Lexend (SIL Open Font License), lokal in `fonts/`
- Auf dem iPhone oder iPad in Safari „Teilen → Zum Home-Bildschirm“ wählen, dann startet die Seite wie eine App

## Tests

```
node tests/schaltung.test.js   # Simulation, Kurzschluss, Missionsprüfung
node tests/logic.test.js       # Funken, Störungen, Lernplan
node tests/uebung.test.js      # Eingaben und Auswertung
node tests/inhalt.test.js      # alle Inhalte: jede Mission ist mit ihrer Musterlösung lösbar
```

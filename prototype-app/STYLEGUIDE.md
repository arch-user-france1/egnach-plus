# Styleguide «Egnach Plus»

Verbindliche Gestaltungsregeln des Prototyps. Sie stützen sich auf die
**Gestalt-Gesetze**, die **Interaktionsprinzipien nach ISO 9241-110** sowie
Best Practices (Qualitätsmerkmale nach ISO 25010, Gebrauchstauglichkeit nach
ISO 9241-11: Effektivität, Effizienz, Zufriedenstellung).

## 1. Design-Tokens (einzige Quelle: `src/theme/theme.js`)

Alle semantischen Farben, Schriften und Radien werden als CSS-Variablen
injiziert. **Regel: Views verwenden nur Tokens, keine Hex-Werte** (Ausnahme:
rein dekorative Illustrationsflächen, z. B. Foto-Platzhalter).

| Token | Wert | Verwendung |
|---|---|---|
| `--primary` | `#009944` (Wappengrün) | Primäraktionen, aktive Zustände |
| `--accent` | `#0093DD` (Wappenblau) | Sekundäre Akzente, Links |
| `--ink` / `--ink-2` / `--ink-3` | Grautöne | Text-Hierarchie (Titel / Fliesstext / Hinweise) |
| `--success` / `--danger` / `--warning` | Grün / Rot / Ocker | Feedback-Semantik, Fehlerzustände, Pflichtfeld-Stern |
| `--surface` / `--card` / `--line` | Warmweiss-Töne | Hintergründe, Karten, Trennlinien |
| `--radius`, `--radius-sm`, `--radius-lg` | 14 / 8 / 22 px | Einheitliche Eckenrundung |
| `--font` | Inter | Fliesstext, Bedienelemente |
| `--font-display` | Fraunces | Seitentitel (H1/H2) |

Die Farben leiten sich aus dem **Egnacher Gemeindewappen** ab
(Wiedererkennung, Identifikation der Zielgruppe mit der Gemeinde).

## 2. Angewandte Gestalt-Gesetze

| Gesetz | Umsetzung im Prototyp |
|---|---|
| **Nähe** | Zusammengehörige Elemente stehen in Karten (`Card`) bzw. Formulargruppen mit kleinem Innenabstand; zwischen Gruppen grössere Abstände (z. B. Label + Eingabefeld + Hinweis = 6 px, zwischen Feldern 14 px). |
| **Ähnlichkeit** | Gleiche Funktion = gleiches Aussehen: alle Primäraktionen grün gefüllt (`Button`), alle Kategorien als `Chip`, alle Inserate als identisch aufgebaute Karten. |
| **Geschlossenheit** | Karten mit Rahmen + Rundung fassen Inserate/Anlässe als Einheit zusammen; das Hilfe-Sheet und Dialoge sind klar umschlossene Flächen. |
| **Kontinuität / gemeinsame Region** | Listen führen das Auge vertikal in einer Spalte; die Tab-Bar gruppiert die fünf Hauptbereiche in einer gemeinsamen Leiste. |
| **Figur-Grund** | Modale (Hilfe, Bestätigungsdialog) liegen auf abgedunkeltem Hintergrund; Karten heben sich durch `--card` (Weiss) vom warmen `--surface` ab. |
| **Prägnanz** | Pro Maske eine dominante Aktion (z. B. «Publizieren»), reduzierte Icon-Sprache, klare Titelhierarchie über `--font-display`. |

## 3. Interaktionsprinzipien nach ISO 9241-110

| Prinzip | Umsetzung |
|---|---|
| **Aufgabenangemessenheit** | Inserat erstellen in 3 Schritten mit nur den nötigen Feldern; Vorschau vor Publikation; Kategorien als vorbelegte Auswahl statt Freitext. |
| **Selbstbeschreibungsfähigkeit** | Fortschrittsanzeige «Schritt 1 von 3» + Zeitschätzung; Labels statt nur Platzhalter; Hinweistexte unter Feldern («TT.MM.JJJJ», «CHF / Einheit»). |
| **Erwartungskonformität** | Tab-Bar unten (Mobile-Konvention), Zurück-Pfeil oben links, «*» für Pflichtfelder, rotes Fehler-Styling, Schliessen-Kreuz oben. |
| **Lernförderlichkeit** | Onboarding-Tour, kontextuelle Hilfe-Sheets (`HelpSheet`) pro Maske, Tipp-Banner (`HelpBanner`). |
| **Steuerbarkeit** | Wizard erlaubt Zurück ohne Datenverlust, «Entwurf speichern», Abbrechen jederzeit über Schliessen-Kreuz, Dialog vor destruktiven Aktionen (`ConfirmDialog`). |
| **Fehlertoleranz** | Validierung mit konkreten, freundlichen Meldungen («Bitte einen Titel eingeben»); Fehler werden beim Tippen zurückgesetzt; Löschen erfordert Bestätigung. |
| **Individualisierbarkeit** | Einstellung «Grosser Text» (Textskalierung), Sprachwahl im Onboarding, Übersetzungsfunktion im Chat. |

## 4. Regeln für Formulare (Pflichtfelder & Eingabeformate)

- Pflichtfelder tragen einen **roten Stern (`*`)** hinter dem Label; jede
  Formularmaske erklärt die Konvention einmalig («Pflichtfelder sind mit *
  markiert»).
- Erwartete **Eingabeformate** stehen als Hinweis unter dem Feld
  (z. B. Datum «TT.MM.JJJJ», Preis «CHF / Einheit») und als Beispiel im
  Platzhalter — der Platzhalter ersetzt nie das Label.
- **Fehlerzustand:** roter Rahmen + Warn-Icon + konkrete Meldung am Feld
  selbst (nicht nur global); Zeichenlimits werden live angezeigt («12 / 60»).

## 5. Hilfe & Feedback

- **Hilfe:** «?»-Knopf in der Top-Bar öffnet ein kontextbezogenes
  Hilfe-Sheet mit Schritt-für-Schritt-Erklärung; Tipp-Banner geben
  Inline-Hinweise.
- **Feedback:** Jede Aktion erhält eine sichtbare Rückmeldung —
  Erfolgsmaske mit Häkchen-Animation nach dem Publizieren, `Toast` für
  Nebenaktionen («Entwurf gespeichert»), Zustandswechsel bei Favoriten/RSVP,
  `ConfirmDialog` vor irreversiblen Aktionen.

## 6. Barrierefreiheit (Bezug Band E)

- Texte skalierbar über «Grosser Text» (Reflow statt reinem Zoom).
- Interaktive Elemente mit `aria-label` (IconButton), `aria-pressed`
  (Auswahl-Buttons), `role="progressbar"` mit Wertangaben.
- Mindest-Touchfläche 44–46 px für Eingabefelder und Buttons.
- Semantische Farbkontraste: Text `--ink` auf `--surface` ≥ 4.5:1;
  Statusfarben werden nie als einziges Unterscheidungsmerkmal genutzt
  (immer Icon + Text dazu).

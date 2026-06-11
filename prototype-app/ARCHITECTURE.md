# Architektur «Egnach Plus» — MVC-Entwurfsmuster

Dieses Dokument beschreibt, wie der klickbare Prototyp das **MVC-Entwurfsmuster**
(Model–View–Controller) umsetzt (Handlungsziel 2.1, M322).

## Funktionsprinzip MVC

MVC trennt eine Anwendung in drei Verantwortlichkeiten:

| Schicht | Verantwortung | Im Projekt |
|---|---|---|
| **Model** | Hält die Daten (Zustand), kapselt Geschäftslogik und Persistenz, benachrichtigt Beobachter über Änderungen | `src/model/store.js`, Seed-Daten in `src/data/seed.js` |
| **View** | Stellt die Daten dar, nimmt Benutzereingaben entgegen, enthält keine Geschäftslogik | `src/screens/*` (Masken) und `src/components/*` (wiederverwendbare Widgets) |
| **Controller** | Übersetzt Benutzerinteraktionen (Klicks, Eingaben) in Operationen auf dem Model | `src/controller/appController.js` |

Der Datenfluss ist unidirektional (Observer-Prinzip):

```
        Benutzereingabe (Klick, Formular)
                      │
                      ▼
   View ────────► Controller ────────► Model
    ▲              (actions)        (Zustand +
    │                                Persistenz)
    │                                     │
    └────────── benachrichtigt ◄──────────┘
         (subscribe / useSyncExternalStore)
```

1. Die **View** meldet eine Benutzerinteraktion an den **Controller**
   (z. B. `actions.addListing(...)` beim Klick auf «Publizieren»).
2. Der **Controller** ruft die entsprechende Domänen-Operation des **Models** auf.
3. Das **Model** ändert seinen Zustand, persistiert ihn (localStorage) und
   benachrichtigt alle registrierten Beobachter.
4. Die **Views** beobachten das Model über den Hook `useStore()`
   (`useSyncExternalStore`) und rendern sich automatisch neu.

## Vorteile der Trennung im Projekt

- **Austauschbarkeit der View:** Die Screens kennen weder localStorage noch
  Datenstrukturen-Interna; ein Wechsel auf eine echte REST-API würde nur das
  Model betreffen.
- **Testbarkeit:** Die Domänen-Operationen des Models (`addListing`,
  `toggleFavorite`, …) sind reine JavaScript-Funktionen und ohne UI testbar.
- **Ein Zustand, viele Masken:** Marktplatz, Detailansicht und Profil zeigen
  dieselben Inserate; weil alle dasselbe Model beobachten, bleiben sie
  automatisch konsistent (keine doppelte Datenhaltung in den Views).

## Verzeichnisstruktur

```
src/
├── model/
│   └── store.js          # MODEL: Zustand, Persistenz, Observer, Domänen-Operationen
├── controller/
│   └── appController.js  # CONTROLLER: Aktionen, die Views auslösen dürfen
├── hooks/
│   └── useStore.js       # View-Anbindung: verbindet Views mit Model + Controller
├── screens/              # VIEW: Masken (eine Datei pro Screen/Dialog)
├── components/           # VIEW: wiederverwendbare Widgets (Button, Field, …)
├── data/seed.js          # MODEL: Beispieldaten des Prototyps
├── theme/theme.js        # Styleguide-Tokens (Farben, Schrift, Radien) → STYLEGUIDE.md
└── App.jsx               # Routing (Abfolge der Masken) + Theme-Injektion
```

Lokaler UI-Zustand (z. B. welcher Schritt eines Formular-Wizards gerade
sichtbar ist, ob ein Hilfe-Sheet offen ist) bleibt bewusst in der View
(`useState`): Er ist reine Darstellungslogik und gehört nicht ins Model.

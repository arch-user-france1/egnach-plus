export const LISTINGS = [
  { id: 'l1', title: 'Bohrhammer Bosch GBH 2-26', cat: 'Leihen', neighborhood: 'Egnach Dorf', pos: [47.5471, 9.3840], price: 'CHF 12 / Tag', priceWeek: 'CHF 50 / Woche', rating: 4.9, reviews: 23, avatar: 'TH', ownerName: 'Thomas Hofer', tone: 'sand', verified: true, available: 'Ab Mi, 11. Juni', handover: 'Persönlich', deposit: 'CHF 50', languages: 'DE · EN', description: 'Professioneller Bohr- und Meisselhammer, SDS-plus, inkl. Zusatzhandgriff und Tiefenanschlag. Wenig benutzt, im Originalkoffer. Abholung in Egnach Dorf, Übergabe persönlich.', distance: '400 m' },
  { id: 'l2', title: 'Französisch-Nachhilfe', cat: 'Dienste', neighborhood: 'Neuhof', pos: [47.5440, 9.3870], price: 'CHF 40 / Std.', rating: 5.0, reviews: 12, avatar: 'CR', ownerName: 'Céline Roth', tone: 'lake', verified: true, available: 'Ab sofort', handover: 'Online/Vor Ort', deposit: '—', languages: 'DE · FR · EN', description: 'Nachhilfe für Schüler und Erwachsene. Alle Stufen, auch Konversation und Prüfungsvorbereitung.', distance: '1.2 km' },
  { id: 'l3', title: 'Anhänger 1.5 m', cat: 'Leihen', neighborhood: 'Seefeld', pos: [47.5480, 9.3760], price: 'CHF 25 / Tag', rating: 4.7, reviews: 8, avatar: 'PS', ownerName: 'Peter Suter', tone: 'slate', verified: false, available: 'Ab Fr, 13. Juni', handover: 'Persönlich', deposit: 'CHF 100', languages: 'DE', description: 'Einachsiger Anhänger, 1500 kg zulässiges Gesamtgewicht. Ideal für Umzüge und Gartenabfuhr. Führerschein Kategorie B erforderlich.', distance: '800 m' },
  { id: 'l4', title: 'Velo-Service Lehrling', cat: 'Jobs', neighborhood: 'Egnach Dorf', pos: [47.5495, 9.3820], price: 'CHF 28 / Std.', rating: 4.8, reviews: 5, avatar: 'LM', ownerName: 'Lukas Meier', tone: 'moss', verified: true, available: 'Wochenenden', handover: 'Vor Ort', deposit: '—', languages: 'DE', description: 'Gelernter Veloflicker, repariere Rennvelos, MTBs und E-Bikes. Reifenwechsel, Schaltung, Bremsen. Günstig und zuverlässig.', distance: '600 m' },
  { id: 'l5', title: 'Apfelmost 5 L', cat: 'Tausch', neighborhood: 'Buchen', pos: [47.5502, 9.3900], price: 'Tausch', rating: 4.9, reviews: 3, avatar: 'OK', ownerName: 'Otto Keller', tone: 'rose', verified: true, available: 'Ab sofort', handover: 'Abholung', deposit: '—', languages: 'DE', description: 'Selbst gepresster Apfelmost vom eigenen Garten, 5-Liter-PET. Tausche gegen Gemüse, Beeren oder ähnliches aus dem Garten.', distance: '2.1 km' },
];

export const EVENTS = [
  { id: 'ev1', title: 'Hafenfest am Bodensee 2026', date: 'Samstag, 14. Juni', time: '14:00–23:00', dateShort: 'Sa · 14:00', location: 'Hafenanlage Seefeld', address: 'Seestrasse 12, 9322 Egnach', cats: ['Dorffest', 'Gemeinde', 'Familie'], tone: 'lake', free: true, languages: 'DE · EN · IT · SQ', description: 'Das traditionelle Hafenfest der Gemeinde Egnach mit Live-Musik, Foodständen der Dorfvereine, Kinderprogramm und Bootsfahrten ab Hafen. Ab 21:00 grosses Seefeuerwerk.', organizer: 'Gemeinde Egnach', attendees: 247, month: 'JUN', day: 14, neighbors: 18 },
  { id: 'ev2', title: 'Sommerlauf Egnach', date: 'Mittwoch, 11. Juni', time: '18:30', dateShort: 'Mi · 18:30', location: 'Schulhaus', address: 'Schulstrasse 4, 9322 Egnach', cats: ['Sport', 'Familie'], tone: 'moss', free: true, languages: 'DE', description: 'Jährlicher Volkslauf rund ums Schulhaus. Kategorien für Kinder, Jugendliche und Erwachsene. Anmeldung vor Ort möglich.', organizer: 'TVE Egnach', attendees: 89, month: 'JUN', day: 11, neighbors: 7 },
  { id: 'ev3', title: 'Sprachcafé DE/EN', date: 'Donnerstag, 12. Juni', time: '19:00', dateShort: 'Do · 19:00', location: 'Bibliothek', address: 'Dorfstrasse 2, 9322 Egnach', cats: ['Sprache'], tone: 'lake', free: true, languages: 'DE · EN', description: 'Offenes Gesprächsformat für alle, die Deutsch oder Englisch üben möchten. Kaffee und Kuchen inklusive.', organizer: 'Gemeinde Egnach', attendees: 24, month: 'JUN', day: 12, neighbors: 3 },
  { id: 'ev4', title: 'Senioren-Zmittag', date: 'Donnerstag, 12. Juni', time: '11:30', dateShort: 'Do · 11:30', location: 'Gemeindesaal', address: 'Hauptstrasse 7, 9322 Egnach', cats: ['Senioren'], tone: 'sand', free: false, languages: 'DE', description: 'Monatlicher Mittagstisch für Seniorinnen und Senioren. Menü auf Anfrage. Anmeldung bis Mittwoch 12:00.', organizer: 'Pro Senectute', attendees: 42, month: 'JUN', day: 12, neighbors: 5 },
  { id: 'ev5', title: 'Live-Musik «de Trio»', date: 'Samstag, 14. Juni', time: '20:00', dateShort: 'Sa · 20:00', location: 'Restaurant Sonne', address: 'Bahnhofstrasse 3, 9322 Egnach', cats: ['Kultur'], tone: 'rose', free: false, languages: 'DE', description: 'Lokale Band «de Trio» spielt Jazz-Pop und Mundart. Reservierung empfohlen.', organizer: 'Restaurant Sonne', attendees: 60, month: 'JUN', day: 14, neighbors: 4 },
];

export const CHAT_THREADS = [
  {
    id: 'luan-krasniqi',
    name: 'Luan Krasniqi',
    initials: 'LK',
    verified: true,
    online: true,
    lang: 'SQ',
    listingId: 'l1',
    time: '09:45',
    unread: 1,
    messages: [
      { id: 'm1', own: false, text: "Përshëndetje! A është bohrhammer-i ende i lirë për fundjavën?", translation: "Grüezi! Ist der Bohrhammer am Wochenende noch frei?", translatedFrom: 'SQ', time: '09:32' },
      { id: 'm2', own: true,  text: "Hoi Luan, ja — Samstag und Sonntag passt. Komm um 9 vorbei.", translation: "Tungjatjeta Luan, po — e shtuna dhe e diela më shkojnë. Eja rreth orës 9.", translatedTo: 'SQ', time: '09:42' },
      { id: 'm3', own: false, text: "Faleminderit! A duhet të sjell diçka? Kaucionin?", translation: "Danke! Soll ich etwas mitbringen? Die Kaution?", translatedFrom: 'SQ', time: '09:44' },
      { id: 'm4', own: true,  text: "Nur einen Ausweis und CHF 50 Kaution in bar.", translation: "Vetëm një dokument identifikimi dhe 50 CHF kaucion në para të gatshme.", translatedTo: 'SQ', time: '09:45' },
    ]
  },
  {
    id: 'celine-roth',
    name: 'Céline Roth',
    initials: 'CR',
    verified: true,
    online: false,
    lang: 'FR',
    listingId: 'l2',
    time: 'Gestern',
    unread: 0,
    messages: [
      { id: 'm1', own: false, text: "Bonjour ! Oui, je donne aussi des cours le mercredi après-midi.", translation: "Grüezi! Ja, ich gebe auch am Mittwochnachmittag Nachhilfe.", translatedFrom: 'FR', time: 'Gestern' },
      { id: 'm2', own: true,  text: "Super, dann melde ich meine Tochter gerne an. Danke!", translation: "Super, j'inscris donc volontiers ma fille. Merci !", translatedTo: 'FR', time: 'Gestern' },
    ]
  },
  {
    id: 'peter-suter',
    name: 'Peter Suter',
    initials: 'PS',
    verified: false,
    online: false,
    lang: 'DE',
    listingId: 'l3',
    time: 'Mo',
    unread: 0,
    messages: [
      { id: 'm1', own: true,  text: "Hoi Peter, ist der Anhänger am Freitag noch frei?", time: 'Mo' },
      { id: 'm2', own: false, text: "Hoi! Ja, Freitag ab Mittag kannst du ihn abholen.", time: 'Mo' },
    ]
  },
  {
    id: 'otto-keller',
    name: 'Otto Keller',
    initials: 'OK',
    verified: true,
    online: true,
    lang: 'DE',
    listingId: 'l5',
    time: 'Mo',
    unread: 2,
    messages: [
      { id: 'm1', own: false, text: "Grüezi! Ich hätte noch Apfelmost — was hättest du zum Tauschen?", time: 'Mo' },
    ]
  }
];

export const AVAILABILITY = {
  '2026-06-13': [
    { from: '09:00', to: '11:00', label: 'Wiederholt wöchentlich', recurring: true, booked: false },
    { from: '13:30', to: '15:00', label: 'Maja R. · Gartenarbeit', recurring: false, booked: true },
    { from: '16:00', to: '18:00', label: 'Einmalig', recurring: false, booked: false },
  ]
};

// ============================================================================
// MODEL (MVC)
// ----------------------------------------------------------------------------
// Das Model hält den gesamten Anwendungszustand (Daten), kapselt die
// Persistenz (localStorage) und benachrichtigt registrierte Beobachter
// (Views) über Änderungen — das Observer-Prinzip des MVC-Musters.
// Views greifen nie direkt schreibend auf das Model zu; Änderungen laufen
// über die hier exportierten Domänen-Operationen, die der Controller aufruft.
// ============================================================================
import { LISTINGS, EVENTS, CHAT_THREADS, AVAILABILITY } from '../data/seed.js';
import { track } from './analytics.js';

const SAMPLE_OWN_LISTINGS = [
  {
    id: 'ul_sample_1', own: true,
    title: 'Kindervelo 20"', cat: 'Leihen', neighborhood: 'Egnach Dorf',
    price: 'CHF 5 / Tag', rating: 0, reviews: 0, avatar: 'AM', ownerName: 'Anna Müller',
    tone: 'sand', verified: true, available: 'Ab sofort',
    handover: 'Persönlich', deposit: '—', languages: 'DE',
    description: 'Kindervelo 20 Zoll, guter Zustand, mit Stützrädern.', distance: '0 m',
  },
  {
    id: 'ul_sample_2', own: true,
    title: 'Nähmaschine Singer', cat: 'Leihen', neighborhood: 'Egnach Dorf',
    price: 'CHF 8 / Tag', rating: 0, reviews: 0, avatar: 'AM', ownerName: 'Anna Müller',
    tone: 'lake', verified: true, available: 'Wochenenden',
    handover: 'Persönlich', deposit: '—', languages: 'DE',
    description: 'Singer Nähmaschine, Grundfunktionen, Anleitung dabei.', distance: '0 m',
  },
];

// --- Persistenz -------------------------------------------------------------
const STORAGE_KEYS = [
  'egnach_onboarded', 'egnach_user', 'egnach_lang', 'egnach_text_scale',
  'egnach_favorites', 'egnach_rsvp', 'egnach_chat_messages',
  'egnach_availability', 'egnach_user_listings', 'egnach_user_events',
  'egnach_layout_override', 'egnach_analytics',
];

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Prototyp: Speicherfehler bewusst ignorieren */ }
}

// --- Zustand ----------------------------------------------------------------
let state = {
  onboarded:    load('egnach_onboarded', false),
  user:         load('egnach_user', { name: 'Anna Müller', initials: 'AM', neighborhood: 'Egnach Dorf', verified: true }),
  lang:         load('egnach_lang', 'de'),
  textScale:    load('egnach_text_scale', 1),
  favorites:    load('egnach_favorites', []),
  rsvp:         load('egnach_rsvp', []),
  chatMessages: load('egnach_chat_messages', {}),
  availability: load('egnach_availability', AVAILABILITY),
  listings:     [...LISTINGS, ...load('egnach_user_listings', SAMPLE_OWN_LISTINGS)],
  events:       [...EVENTS,   ...load('egnach_user_events',   [])],
  chatThreads:  CHAT_THREADS,
  // A/B-Test: vom Nutzer gewählte Layout-Darstellung. 'system' folgt der
  // stabilen A/B-Zuteilung; 'classic'/'glas' überschreiben sie explizit.
  layoutOverride: load('egnach_layout_override', 'system'),
};

// --- Observer ---------------------------------------------------------------
const listeners = new Set();

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  listeners.forEach(fn => fn(state));
}

// Nutzer-erstellte Einträge sind die, die nicht aus den Seed-Daten stammen.
const userListingsOf = (s) => s.listings.filter(l => !LISTINGS.find(sl => sl.id === l.id));
const userEventsOf   = (s) => s.events.filter(e => !EVENTS.find(se => se.id === e.id));

// --- A/B-Layout: Auflösung der aktiven Variante -----------------------------
// Auflösungsreihenfolge (erster Treffer gewinnt):
//   1. Nutzer-Override aus den Einstellungen ('classic' | 'glass')
//   2. Stabile A/B-Zuteilung (Hash der Nutzer-ID → 50/50)
//   3. Default 'classic' (bis das Experiment hochgefahren ist)
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // auf 32-Bit halten
  }
  return Math.abs(h);
}

// Stabil pro Nutzer: derselbe Bucket über alle Sessions (kein Flackern).
function abAssignment(s) {
  const key = s.user?.id || s.user?.name || 'anon';
  return hashString(key) % 2 === 0 ? 'classic' : 'glass';
}

export function resolveLayoutVariant(s = state) {
  const o = s.layoutOverride;
  if (o === 'classic' || o === 'glass') return o;
  return abAssignment(s);
}

/** Aktive Variante für die Analytik-Markierung (ohne Hook). */
export function getLayoutVariant() {
  return resolveLayoutVariant(state);
}

// --- Domänen-Operationen (werden vom Controller aufgerufen) ------------------
export function completeOnboarding(lang) {
  save('egnach_onboarded', true);
  save('egnach_lang', lang);
  setState(s => ({ ...s, onboarded: true, lang }));
}

export function setUser(user) {
  save('egnach_user', user);
  setState(s => ({ ...s, user }));
}

export function setTextScale(textScale) {
  save('egnach_text_scale', textScale);
  setState(s => ({ ...s, textScale }));
}

export function toggleFavorite(listingId) {
  setState(s => {
    const favs = s.favorites.includes(listingId)
      ? s.favorites.filter(id => id !== listingId)
      : [...s.favorites, listingId];
    save('egnach_favorites', favs);
    return { ...s, favorites: favs };
  });
}

export function setLayoutOverride(value) {
  // 'system' | 'classic' | 'glass' — wird sofort app-weit angewandt.
  save('egnach_layout_override', value);
  setState(s => ({ ...s, layoutOverride: value }));
  track('layout_override_set', { override: value, variant: getLayoutVariant() });
}

export function toggleRsvp(eventId) {
  setState(s => {
    const attending = !s.rsvp.includes(eventId);
    const rsvp = attending
      ? [...s.rsvp, eventId]
      : s.rsvp.filter(id => id !== eventId);
    save('egnach_rsvp', rsvp);
    // Funnel-Ereignis mit aktiver Variante markieren (A/B messbar machen).
    if (attending) track('attend_event', { eventId, variant: resolveLayoutVariant(s) });
    return { ...s, rsvp };
  });
}

export function sendMessage(threadId, text, translation, translatedTo, listing) {
  setState(s => {
    const existing = s.chatMessages[threadId] || [];
    const msgs = [...existing, {
      id: 'm' + Date.now(),
      own: true, text, translation, translatedTo,
      listing: listing || undefined,
      time: new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }),
    }];
    const chatMessages = { ...s.chatMessages, [threadId]: msgs };
    save('egnach_chat_messages', chatMessages);
    return { ...s, chatMessages };
  });
}

export function saveAvailability(date, slots) {
  setState(s => {
    const availability = { ...s.availability, [date]: slots };
    save('egnach_availability', availability);
    return { ...s, availability };
  });
}

export function addListing(listing) {
  setState(s => {
    const userListings = userListingsOf(s).concat({ ...listing, own: true });
    save('egnach_user_listings', userListings);
    track('listing_created', { variant: resolveLayoutVariant(s) });
    return { ...s, listings: [...LISTINGS, ...userListings] };
  });
}

export function updateListing(id, updates) {
  setState(s => {
    const userListings = userListingsOf(s).map(l => l.id === id ? { ...l, ...updates } : l);
    save('egnach_user_listings', userListings);
    return { ...s, listings: [...LISTINGS, ...userListings] };
  });
}

export function removeListing(id) {
  setState(s => {
    const userListings = userListingsOf(s).filter(l => l.id !== id);
    save('egnach_user_listings', userListings);
    return { ...s, listings: [...LISTINGS, ...userListings] };
  });
}

export function addEvent(event) {
  setState(s => {
    const userEvents = userEventsOf(s).concat(event);
    save('egnach_user_events', userEvents);
    track('event_created', { variant: resolveLayoutVariant(s) });
    return { ...s, events: [...EVENTS, ...userEvents] };
  });
}

export function reset() {
  STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
  window.location.reload();
}

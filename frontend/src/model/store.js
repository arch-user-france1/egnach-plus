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
  'egnach_favorites', 'egnach_rsvp', 'egnach_declined', 'egnach_chat_messages',
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
  declined:     load('egnach_declined', []),
  chatMessages: load('egnach_chat_messages', {}),
  availability: load('egnach_availability', AVAILABILITY),
  listings:     [...LISTINGS, ...load('egnach_user_listings', SAMPLE_OWN_LISTINGS)],
  events:       [...EVENTS,   ...load('egnach_user_events',   [])],
  chatThreads:  CHAT_THREADS,
  // Layout-Darstellung. Glass ist neu die Standard-Variante; nur ein expliziter
  // Override auf 'classic' wechselt zurück zur klassischen Darstellung.
  layoutOverride: load('egnach_layout_override', 'glass'),
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

// --- Layout-Variante: Auflösung der aktiven Variante ------------------------
// Glass ist die Standard-Darstellung (Resultat des Usability-Tests, Band D).
// Nur ein expliziter Nutzer-Override auf 'classic' wechselt zurück zur
// klassischen Variante; jeder andere Wert ('glass' | 'system' | leer) ergibt
// 'glass'.
export function resolveLayoutVariant(s = state) {
  return s.layoutOverride === 'classic' ? 'classic' : 'glass';
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

// Antwort-Zustand eines Anlasses (für den Kalender):
//   'accepted'   → in `rsvp`        (Zusage, prominent)
//   'declined'   → in `declined`    (Absage)
//   'suggestion' → in keinem        (noch keine Antwort = Vorschlag)
export function eventResponse(s, id) {
  if (s.rsvp.includes(id)) return 'accepted';
  if (s.declined.includes(id)) return 'declined';
  return 'suggestion';
}

function persistResponses(rsvp, declined) {
  save('egnach_rsvp', rsvp);
  save('egnach_declined', declined);
}

export function toggleRsvp(eventId) {
  setState(s => {
    const attending = !s.rsvp.includes(eventId);
    const rsvp = attending
      ? [...s.rsvp, eventId]
      : s.rsvp.filter(id => id !== eventId);
    // Eine Zusage hebt eine frühere Absage auf (konsistenter Antwort-Zustand).
    const declined = attending ? s.declined.filter(id => id !== eventId) : s.declined;
    persistResponses(rsvp, declined);
    // Funnel-Ereignis mit aktiver Variante markieren (A/B messbar machen).
    if (attending) track('attend_event', { eventId, variant: resolveLayoutVariant(s) });
    return { ...s, rsvp, declined };
  });
}

/** Anlass zusagen (Kalender: aus Vorschlag/Absage → Zusage). */
export function acceptEvent(eventId) {
  setState(s => {
    if (s.rsvp.includes(eventId)) return s;
    const rsvp = [...s.rsvp, eventId];
    const declined = s.declined.filter(id => id !== eventId);
    persistResponses(rsvp, declined);
    track('attend_event', { eventId, variant: resolveLayoutVariant(s) });
    return { ...s, rsvp, declined };
  });
}

/** Anlass absagen (Kalender: aus Vorschlag/Zusage → Absage). */
export function declineEvent(eventId) {
  setState(s => {
    if (s.declined.includes(eventId)) return s;
    const declined = [...s.declined, eventId];
    const rsvp = s.rsvp.filter(id => id !== eventId);
    persistResponses(rsvp, declined);
    track('decline_event', { eventId, variant: resolveLayoutVariant(s) });
    return { ...s, rsvp, declined };
  });
}

/** Antwort zurücknehmen (Kalender: zurück auf «Vorschlag»). */
export function resetEventResponse(eventId) {
  setState(s => {
    const rsvp = s.rsvp.filter(id => id !== eventId);
    const declined = s.declined.filter(id => id !== eventId);
    persistResponses(rsvp, declined);
    return { ...s, rsvp, declined };
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
  localStorage.removeItem('egnach_jwt');
  window.location.reload();
}

export function login(token, user) {
  localStorage.setItem('egnach_jwt', token);
  setState(s => ({ ...s, onboarded: true, user: { ...s.user, ...user } }));
}

export const register = login;

export function hydrate({ user, favorites, rsvps, listings, events, availability }) {
  setState(s => ({
    ...s,
    ...(user        ? { onboarded: true, user: { ...s.user, ...user } } : {}),
    ...(favorites   ? { favorites } : {}),
    ...(rsvps       ? {
          rsvp:     rsvps.filter(r => r.status === 'accepted').map(r => r.eventId),
          declined: rsvps.filter(r => r.status === 'declined').map(r => r.eventId),
        } : {}),
    ...(listings    ? { listings: [...LISTINGS, ...listings] } : {}),
    ...(events      ? { events:   [...EVENTS,   ...events]   } : {}),
    ...(availability ? { availability } : {}),
  }));
}

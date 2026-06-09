import { useState, useCallback } from 'react';
import { LISTINGS, EVENTS, CHAT_THREADS, AVAILABILITY } from '../data/seed.js';

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

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Singleton state so multiple hook calls share the same data
let _listeners = [];
let _state = {
  onboarded:    load('egnach_onboarded', false),
  user:         load('egnach_user', { name: 'Anna Müller', initials: 'AM', neighborhood: 'Egnach Dorf', verified: true }),
  lang:         load('egnach_lang', 'de'),
  favorites:    load('egnach_favorites', []),
  rsvp:         load('egnach_rsvp', []),
  chatMessages: load('egnach_chat_messages', {}),
  availability: load('egnach_availability', AVAILABILITY),
  listings:     [...LISTINGS, ...load('egnach_user_listings', SAMPLE_OWN_LISTINGS)],
  events:       [...EVENTS,   ...load('egnach_user_events',   [])],
  chatThreads:  CHAT_THREADS,
};

function setState(updater) {
  _state = typeof updater === 'function' ? updater(_state) : { ..._state, ...updater };
  _listeners.forEach(fn => fn(_state));
}

export function useStore() {
  const [state, setLocalState] = useState(_state);

  const subscribe = useCallback(() => {
    const fn = (s) => setLocalState({ ...s });
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(x => x !== fn); };
  }, []);

  // Subscribe on first render
  useState(() => subscribe());

  const actions = {
    completeOnboarding(lang) {
      const next = { onboarded: true, lang };
      save('egnach_onboarded', true);
      save('egnach_lang', lang);
      setState(s => ({ ...s, ...next }));
    },
    setUser(user) {
      save('egnach_user', user);
      setState(s => ({ ...s, user }));
    },
    toggleFavorite(listingId) {
      setState(s => {
        const favs = s.favorites.includes(listingId)
          ? s.favorites.filter(id => id !== listingId)
          : [...s.favorites, listingId];
        save('egnach_favorites', favs);
        return { ...s, favorites: favs };
      });
    },
    toggleRsvp(eventId) {
      setState(s => {
        const rsvp = s.rsvp.includes(eventId)
          ? s.rsvp.filter(id => id !== eventId)
          : [...s.rsvp, eventId];
        save('egnach_rsvp', rsvp);
        return { ...s, rsvp };
      });
    },
    sendMessage(threadId, text, translation, translatedTo, listing) {
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
    },
    saveAvailability(date, slots) {
      setState(s => {
        const availability = { ...s.availability, [date]: slots };
        save('egnach_availability', availability);
        return { ...s, availability };
      });
    },
    addListing(listing) {
      setState(s => {
        const userListings = s.listings
          .filter(l => !LISTINGS.find(sl => sl.id === l.id))
          .concat({ ...listing, own: true });
        save('egnach_user_listings', userListings);
        return { ...s, listings: [...LISTINGS, ...userListings] };
      });
    },
    updateListing(id, updates) {
      setState(s => {
        const userListings = s.listings
          .filter(l => !LISTINGS.find(sl => sl.id === l.id))
          .map(l => l.id === id ? { ...l, ...updates } : l);
        save('egnach_user_listings', userListings);
        return { ...s, listings: [...LISTINGS, ...userListings] };
      });
    },
    removeListing(id) {
      setState(s => {
        const userListings = s.listings
          .filter(l => !LISTINGS.find(sl => sl.id === l.id))
          .filter(l => l.id !== id);
        save('egnach_user_listings', userListings);
        return { ...s, listings: [...LISTINGS, ...userListings] };
      });
    },
    addEvent(event) {
      setState(s => {
        const userEvents = s.events
          .filter(e => !EVENTS.find(se => se.id === e.id))
          .concat(event);
        save('egnach_user_events', userEvents);
        return { ...s, events: [...EVENTS, ...userEvents] };
      });
    },
    reset() {
      ['egnach_onboarded','egnach_user','egnach_lang','egnach_favorites','egnach_rsvp',
       'egnach_chat_messages','egnach_availability','egnach_user_listings','egnach_user_events']
        .forEach(k => localStorage.removeItem(k));
      window.location.reload();
    },
  };

  return { state, actions };
}

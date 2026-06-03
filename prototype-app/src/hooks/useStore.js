import { useState, useCallback } from 'react';
import { LISTINGS, EVENTS, CHAT_THREADS, AVAILABILITY } from '../data/seed.js';

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
  listings: LISTINGS,
  events: EVENTS,
  chatThreads: CHAT_THREADS,
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
    sendMessage(threadId, text, translation, translatedTo) {
      setState(s => {
        const existing = s.chatMessages[threadId] || [];
        const msgs = [...existing, {
          id: 'm' + Date.now(),
          own: true, text, translation, translatedTo,
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
    reset() {
      ['egnach_onboarded','egnach_user','egnach_lang','egnach_favorites','egnach_rsvp','egnach_chat_messages','egnach_availability']
        .forEach(k => localStorage.removeItem(k));
      window.location.reload();
    },
  };

  return { state, actions };
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { api } from './lib/api.js'
import { hydrate } from './model/store.js'

async function boot() {
  const token = localStorage.getItem('egnach_jwt');
  if (token) {
    try {
      const [{ user }, { favoriteIds }, { rsvps }, { availability }] = await Promise.all([
        api.get('/auth/me'),
        api.get('/listings/me/favorites'),
        api.get('/events/me/rsvps'),
        api.get('/availability'),
      ]);
      hydrate({ user, favorites: favoriteIds, rsvps, availability });
    } catch (err) {
      if (err.status === 401) localStorage.removeItem('egnach_jwt');
    }
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();

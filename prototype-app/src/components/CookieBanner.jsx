import { useState } from 'react';

const STORAGE_KEY = 'cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));

  if (!visible) return null;

  function dismiss(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  }

  return (
    /* full-screen backdrop */
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: '0 0 24px',
    }}>
      {/* card */}
      <div style={{
        width: '100%',
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        padding: '28px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.18)',
      }}>
        {/* cookie icon + title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>🍪</span>
          <h2 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: '#111',
            letterSpacing: '-0.3px',
          }}>
            Datenschutzhinweis
          </h2>
        </div>

        {/* body */}
        <p style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.6,
          color: '#444',
        }}>
          Diese Seite ist ein <strong>Prototyp</strong> — es werden
          keinerlei Cookies gespeichert oder personenbezogene Daten
          erhoben.
        </p>

        {/* buttons — equal prominence per DSGVO/DIN requirement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => dismiss('accepted')}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              border: 'none',
              background: 'var(--color-primary, #4a7c59)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Akzeptieren
          </button>
          <button
            onClick={() => dismiss('declined')}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              border: '2px solid var(--color-primary, #4a7c59)',
              background: 'transparent',
              color: 'var(--color-primary, #4a7c59)',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  );
}

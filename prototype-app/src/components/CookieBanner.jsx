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
    // Dim backdrop — signals modal context, blocks interaction with content below
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px 16px 0 0',
        padding: '24px 20px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 -2px 24px rgba(0,0,0,0.15)',
      }}>

        {/* Self-descriptive title — user immediately knows what this is */}
        <h2
          id="cookie-banner-title"
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#111111',
          }}
        >
          Cookie Notice
        </h2>

        {/* Exact text as specified */}
        <p style={{
          margin: 0,
          fontSize: 15,
          lineHeight: 1.55,
          color: '#333333', // ≥ 4.5:1 contrast on white (WCAG AA)
        }}>
          Prototype deployment – no cookies are being collected.
        </p>

        {/* Stacked buttons: equal width, min 48px height (ISO 9241-110 error tolerance) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button
            onClick={() => dismiss('accepted')}
            style={{
              width: '100%',
              minHeight: 48,
              padding: '0 16px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-primary, #4a7c59)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Accept
          </button>
          <button
            onClick={() => dismiss('declined')}
            style={{
              width: '100%',
              minHeight: 48,
              padding: '0 16px',
              borderRadius: 10,
              border: '1.5px solid #555555',
              background: 'transparent',
              color: '#111111', // high contrast, equal visual weight to primary
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

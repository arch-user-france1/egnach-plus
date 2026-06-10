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
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(20, 20, 20, 0.95)',
      color: '#f0f0f0',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      backdropFilter: 'blur(6px)',
      borderTop: '1px solid rgba(255,255,255,0.12)',
    }}>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
        Prototype deployment — no cookies are being collected.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => dismiss('accepted')}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 10,
            border: 'none',
            background: 'var(--color-primary, #4a7c59)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          onClick={() => dismiss('declined')}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'transparent',
            color: '#f0f0f0',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

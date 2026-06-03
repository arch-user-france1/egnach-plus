import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body } from '../components/index.js';
import Button from '../components/Button.jsx';
import Mark from '../components/Mark.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const LANGS = [
  { code: 'de', label: 'Deutsch',   sub: 'Schweiz' },
  { code: 'en', label: 'English',   sub: 'Switzerland' },
  { code: 'it', label: 'Italiano',  sub: 'Svizzera' },
  { code: 'sq', label: 'Shqip',     sub: 'Zvicra' },
  { code: 'tr', label: 'Türkçe',    sub: 'İsviçre' },
  { code: 'pt', label: 'Português', sub: 'Suíça' },
];

export default function SplashScreen() {
  const [lang, setLang] = useState('de');
  const navigate = useNavigate();
  const { actions } = useStore();

  function handleStart() {
    actions.completeOnboarding(lang);
    navigate('/onboarding');
  }

  return (
    <Screen background="var(--surface)" style={{ overflowY: 'auto' }}>
      <div style={{ padding: '36px 28px 28px', background: 'linear-gradient(180deg, var(--primary-tint) 0%, var(--surface) 100%)' }}>
        <Mark size={84} variant="wappen" />
        <h1 style={{ margin: '20px 0 8px', fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1.1, fontWeight: 700, letterSpacing: -0.8, color: 'var(--ink)' }}>
          Willkommen in<br />Egnach.
        </h1>
        <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 280 }}>
          Das digitale Dorfzentrum für Anlässe, Nachbarschaftshilfe und den lokalen Marktplatz.
        </p>
      </div>

      <Body style={{ padding: '22px 20px 20px' }}>
        <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1.2, marginBottom: 10 }}>
          SPRACHE · LANGUAGE · LINGUA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-pressed={lang === l.code}
              style={{
                padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${lang === l.code ? 'var(--primary)' : 'var(--line)'}`,
                background: lang === l.code ? 'var(--primary-tint)' : 'var(--card)',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: 0.5,
                flexShrink: 0,
              }}>{l.code.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{l.label}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{l.sub}</div>
              </div>
              {lang === l.code && <Icon name="check" size={18} color="var(--primary)" stroke={2.4} />}
            </button>
          ))}
        </div>
      </Body>

      <div style={{ padding: '14px 20px 26px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        <Button full size="lg" onClick={handleStart}>Loslegen</Button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>Schon dabei?</span>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Anmelden</button>
        </div>
      </div>
    </Screen>
  );
}

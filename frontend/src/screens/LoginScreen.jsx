import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body, HelpSheet } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Checkbox from '../components/Checkbox.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';
import { api } from '../lib/api.js';

const HELP_ITEMS = [
  { icon: 'fingerprint', title: 'Passkey-Anmeldung',  text: 'Nutze Face ID, Touch ID oder deinen Geräte-PIN — sicher und ohne Passwort.' },
  { icon: 'lock',        title: 'E-Mail & Passwort',   text: 'Alternativ kannst du dich auch mit deiner E-Mail-Adresse anmelden.' },
  { icon: 'shield',      title: 'Konto vergessen?',    text: 'Wende dich ans Gemeindehaus: 071 474 11 11 (Mo–Fr, 08:00–11:30).' },
  { icon: 'info',        title: 'Noch kein Konto?',    text: 'Erstelle ein Konto — kostenlos und ausschliesslich für Einwohner von Egnach.' },
];

export default function LoginScreen() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [email, setEmail] = useState('anna.mueller@example.ch');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [help, setHelp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      actions.login(token, user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Anmeldung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />} title="Anmelden" onHelp={() => setHelp(true)} />

      <Body padding="20px 22px">
        <h2 style={{ margin: '4px 0 6px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>Willkommen zurück.</h2>
        <p style={{ margin: '0 0 22px', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Melde dich mit Passkey an — schnell, sicher und ohne Passwort.
        </p>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1.2, marginBottom: 8 }}>EMPFOHLEN</div>
          <button
            onClick={handleLogin}
            style={{
              border: '1.5px solid var(--primary)', borderRadius: 'var(--radius)',
              background: 'var(--primary-tint)', padding: 16,
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', cursor: 'pointer',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
              <Icon name="fingerprint" size={24} stroke={1.8} color="var(--primary)" />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary-ink)' }}>Mit Passkey anmelden</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', marginTop: 2 }}>Face ID · Touch ID · Geräte-PIN</div>
            </div>
            <Icon name="chevron" size={18} color="var(--primary-ink)" stroke={2} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: 0.5 }}>ODER MIT E-MAIL</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="E-Mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.ch" leading={<Icon name="globe" size={16} color="var(--ink-3)" />} />
          <div>
            <Field
              label="Passwort" value={password} onChange={e => setPassword(e.target.value)}
              type={showPw ? 'text' : 'password'} placeholder="Passwort eingeben"
              leading={<Icon name="lock" size={16} color="var(--ink-3)" />}
              trailing={
                <button onClick={() => setShowPw(v => !v)} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', fontWeight: 600, cursor: 'pointer', padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}>
                  {showPw ? 'Verbergen' : 'Zeigen'}
                </button>
              }
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minHeight: 44 }}>
                <Checkbox on={remember} onChange={setRemember} />
                <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-2)' }}>Angemeldet bleiben</span>
              </label>
              <button style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}>Vergessen?</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <Button full size="lg" variant="outline" onClick={handleLogin} disabled={loading}>
            {loading ? 'Anmelden…' : 'Mit E-Mail anmelden'}
          </Button>
        </div>

        {error && (
          <div style={{ marginTop: 12, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <HelpBanner tone="info" title="Probleme beim Anmelden?">
            Schreibe uns oder ruf direkt im Gemeindehaus an: 071 474 11 11 (Mo–Fr, 08:00–11:30).
          </HelpBanner>
        </div>
      </Body>

      <div style={{ padding: '12px 22px 24px', borderTop: '1px solid var(--line)', background: 'var(--card)', textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>Noch kein Konto? </span>
        <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--primary)', cursor: 'pointer', padding: 0 }}>Konto erstellen</button>
      </div>
      <HelpSheet open={help} onClose={() => setHelp(false)} title="Anmelden" intro="So meldest du dich bei Egnach Plus an." items={HELP_ITEMS} />
    </Screen>
  );
}

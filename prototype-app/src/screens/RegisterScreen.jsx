import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body, HelpSheet } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Checkbox from '../components/Checkbox.jsx';
import Badge from '../components/Badge.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const NEIGHBORHOODS = ['Egnach Dorf', 'Neuhof', 'Seefeld', 'Buchen', 'Steinebrunn'];

const HELP_ITEMS = [
  { icon: 'info',     title: 'Pflichtfelder',         text: 'Alle mit * markierten Felder müssen ausgefüllt sein.' },
  { icon: 'pin',      title: 'Quartier wählen',        text: 'Wähle das Quartier, in dem du wohnst. Das hilft Nachbarn, dich zu finden.' },
  { icon: 'lock',     title: 'Sicheres Passwort',      text: 'Mindestens 8 Zeichen, eine Zahl und ein Sonderzeichen.' },
  { icon: 'shield',   title: 'Datenschutz',            text: 'Deine Daten werden ausschliesslich lokal gespeichert und nicht weitergegeben.' },
];

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [form, setForm] = useState({
    vorname: '', nachname: '', email: '', telefon: '', geburtsdatum: '', quartier: '', passwort: '', passwort2: '',
  });
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [help, setHelp] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const errors = submitted ? {
    vorname: !form.vorname ? 'Pflichtfeld' : '',
    nachname: !form.nachname ? 'Pflichtfeld' : '',
    email: !form.email ? 'Pflichtfeld' : !/\S+@\S+\.\S+/.test(form.email) ? 'Ungültige E-Mail-Adresse' : '',
    passwort2: form.passwort !== form.passwort2 ? 'Die Passwörter stimmen nicht überein.' : '',
  } : {};

  function handleSubmit() {
    setSubmitted(true);
    const hasErrors = !form.vorname || !form.nachname || !form.email || form.passwort !== form.passwort2;
    if (!hasErrors && accepted) {
      actions.setUser({
        name: `${form.vorname} ${form.nachname}`,
        initials: `${form.vorname[0]}${form.nachname[0]}`.toUpperCase(),
        neighborhood: form.quartier || 'Egnach Dorf',
        verified: false,
      });
      navigate('/verify');
    }
  }

  return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />} title="Konto erstellen" onHelp={() => setHelp(true)} />
      <Body padding="16px 22px 24px">
        <div style={{ marginBottom: 14 }}>
          <Badge tone="primary" size="sm">SCHRITT 2 VON 4</Badge>
          <h2 style={{ margin: '10px 0 4px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>Erzähl uns von dir.</h2>
          <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>
            Pflichtfelder sind mit <span style={{ color: 'var(--danger)' }}>*</span> markiert.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Vorname" required value={form.vorname} onChange={set('vorname')} error={errors.vorname} />
            <Field label="Nachname" required value={form.nachname} onChange={set('nachname')} error={errors.nachname} />
          </div>
          <Field label="E-Mail-Adresse" required type="email" value={form.email} onChange={set('email')} hint="Wir senden dir einen Bestätigungslink." error={errors.email} />
          <Field label="Telefonnummer" required value={form.telefon} onChange={set('telefon')} hint="Format: +41 79 123 45 67" placeholder="+41 79 ..." />
          <Field label="Geburtsdatum" required value={form.geburtsdatum} onChange={set('geburtsdatum')} hint="TT.MM.JJJJ — du musst mind. 16 Jahre alt sein." placeholder="TT.MM.JJJJ" trailing={<Icon name="calendar" size={16} color="var(--ink-3)" />} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Quartier <span style={{ color: 'var(--danger)' }}>*</span></span>
            <div style={{ position: 'relative' }}>
              <select
                value={form.quartier} onChange={set('quartier')}
                style={{
                  width: '100%', height: 46, borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)', background: 'var(--card)',
                  fontFamily: 'var(--font)', fontSize: 14, color: form.quartier ? 'var(--ink)' : 'var(--ink-3)',
                  padding: '0 40px 0 14px', appearance: 'none', cursor: 'pointer',
                }}
              >
                <option value="">Quartier wählen…</option>
                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon name="chevronDown" size={14} color="var(--ink-3)" />
              </div>
            </div>
          </div>

          <Field label="Passwort" required type="password" value={form.passwort} onChange={set('passwort')} hint="Mind. 8 Zeichen, eine Zahl und ein Sonderzeichen." leading={<Icon name="lock" size={16} color="var(--ink-3)" />} />
          <Field label="Passwort bestätigen" required type="password" value={form.passwort2} onChange={set('passwort2')} error={errors.passwort2} leading={<Icon name="lock" size={16} color="var(--ink-3)" />} />

          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 4, cursor: 'pointer' }}>
            <Checkbox on={accepted} onChange={setAccepted} />
            <span style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 12, lineHeight: 1.5, color: 'var(--ink-2)' }}>
              Ich akzeptiere die <u>Nutzungsbedingungen</u> und die <u>Datenschutzerklärung</u> der Gemeinde Egnach.
            </span>
          </label>
        </div>
      </Body>

      <div style={{ padding: '12px 22px 24px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        <Button full size="lg" onClick={handleSubmit}>Konto erstellen</Button>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>
          Schon dabei? <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Anmelden</button>
        </div>
      </div>
      <HelpSheet open={help} onClose={() => setHelp(false)} title="Konto erstellen" intro="So erstellst du dein Konto bei Egnach Plus." items={HELP_ITEMS} />
    </Screen>
  );
}

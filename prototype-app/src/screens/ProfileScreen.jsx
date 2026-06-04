import { useNavigate } from 'react-router-dom';
import { Screen, Body } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Avatar from '../components/Avatar.jsx';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import Switch from '../components/Switch.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import { useState } from 'react';
import { useStore } from '../hooks/useStore.js';

function Row({ icon, label, value, toggleOn, onToggle, last, onClick }) {
  return (
    <button onClick={onClick} style={{
      border: 'none',
      width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
      background: 'transparent',
      borderBottom: last ? 'none' : '1px solid var(--line)',
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left',
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={16} stroke={1.8} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
        {value && <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{value}</div>}
      </div>
      {toggleOn !== undefined
        ? <Switch on={toggleOn} size="sm" onChange={onToggle} />
        : <Icon name="chevron" size={14} color="var(--ink-3)" stroke={2} />}
    </button>
  );
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [notifs, setNotifs] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [bigText, setBigText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voice, setVoice] = useState(false);

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Profil</h1>
        <IconButton name="options" label="Einstellungen" />
      </div>

      <Body>
        {/* Hero */}
        <div style={{ padding: '12px 16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Avatar size={84} initials={state.user.initials} verified={state.user.verified} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>{state.user.name}</span>
              {state.user.verified && <Badge tone="success" size="md"><Icon name="check" size={10} stroke={3} color="#155E3E" /> Verifiziert</Badge>}
            </div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{state.user.neighborhood} · seit Mai 2024</div>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 4 }}>
            {[{ n: 12, l: 'Anlässe' }, { n: state.rsvp.length + 8, l: 'Inserate' }, { n: '4.9', l: '⭐ 23' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1, letterSpacing: 0.3 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 6 }}>
            <div style={{ flex: 1 }}><Button full size="md" variant="outline" leading={<Icon name="edit" size={14} />}>Bearbeiten</Button></div>
            <div style={{ flex: 1 }}><Button full size="md" variant="outline" leading={<Icon name="share" size={14} />}>Teilen</Button></div>
          </div>
        </div>

        {/* Kompetenzen */}
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>KOMPETENZEN</span>
            <button style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}>+ Hinzufügen</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Chip tone="primary">Gartenarbeit</Chip>
            <Chip tone="primary">Übersetzen DE/EN</Chip>
            <Chip tone="primary">Kinderhüten</Chip>
            <Chip tone="soft">+ 2 weitere</Chip>
          </div>
        </div>

        <div style={{ padding: '12px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>EINSTELLUNGEN</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="bell" label="Benachrichtigungen" toggleOn={notifs} onToggle={setNotifs} />
          <Row icon="globe" label="Sprache & Region" value="Deutsch · Schweiz" onClick={() => { }} />
          <Row icon="language" label="Auto-Übersetzung" value="Aktiv für EN, SQ, IT" toggleOn={autoTranslate} onToggle={setAutoTranslate} />
          <Row icon="pin" label="Mein Quartier" value={state.user.neighborhood} onClick={() => { }} last />
        </Card>

        <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>BARRIEREFREIHEIT</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="info" label="Grosser Text" toggleOn={bigText} onToggle={setBigText} />
          <Row icon="image" label="Hoher Kontrast" toggleOn={highContrast} onToggle={setHighContrast} />
          <Row icon="mic" label="Sprachausgabe" toggleOn={voice} onToggle={setVoice} last />
        </Card>

        <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>KONTO &amp; SICHERHEIT</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="shield" label="Verifizierung" value="Verifiziert · Mai 2025" onClick={() => navigate('/verify')} />
          <Row icon="lock" label="Passkey verwalten" onClick={() => { }} />
          <Row icon="calendar" label="Verfügbarkeit" onClick={() => navigate('/verfuegbarkeit')} />
          <Row icon="info" label="Hilfe & Support" onClick={() => { }} last />
        </Card>

        <div style={{ padding: '24px 16px 16px' }}>
          <Button full size="md" variant="danger" onClick={actions.reset}>Abmelden</Button>
        </div>
        <div style={{ textAlign: 'center', padding: '0 16px 16px', fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)' }}>
          Egnach Plus · v1.0.0 · Gemeinde Egnach
        </div>
      </Body>

    </Screen>
  );
}

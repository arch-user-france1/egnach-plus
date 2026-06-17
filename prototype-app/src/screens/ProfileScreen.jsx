import { useNavigate } from 'react-router-dom';
import { Screen, Body, HelpButton, HelpSheet, Toast, ConfirmDialog } from '../components/index.js';
import Avatar from '../components/Avatar.jsx';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import Switch from '../components/Switch.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import GlassHelpFab from '../components/glass/GlassHelpFab.jsx';
import { useState } from 'react';
import { useStore } from '../hooks/useStore.js';
import { useLayoutVariant } from '../hooks/useLayoutVariant.js';

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

const HELP_ITEMS = [
  { icon: 'edit',    title: 'Profil bearbeiten',  text: 'Tippe auf «Bearbeiten», um deinen Namen, dein Foto und deine Kompetenzen anzupassen.' },
  { icon: 'briefcase', title: 'Meine Inserate',   text: 'Unter «Meine Ausschreibungen» verwaltest du deine eigenen Inserate.' },
  { icon: 'info',    title: 'Einstellungen',      text: 'Passe Sprache, Benachrichtigungen und Barrierefreiheit an.' },
  { icon: 'shield',  title: 'Verifizierung',      text: 'Verifizierte Nutzer erhalten mehr Vertrauen und Anfragen.' },
];

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const activeVariant = useLayoutVariant();
  const [einfach, setEinfach] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifMarket, setNotifMarket] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const bigText = state.textScale > 1;
  const [highContrast, setHighContrast] = useState(false);
  const [voice, setVoice] = useState(false);
  const [help, setHelp] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Profil</h1>
        {activeVariant !== 'glass' && <HelpButton onClick={() => setHelp(true)} />}
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

        {/* App-Ansicht (A/B-Layout) — gross, beschriftet und in einfacher Sprache,
            damit auch weniger technikaffine Personen sofort verstehen, was passiert. */}
        <div style={{ padding: '4px 16px 8px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>ANSICHT</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Wie soll die App aussehen?</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.45 }}>
              Tippe auf ein Design. Die App ändert sich sofort — du kannst jederzeit zurückwechseln.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {[
                { v: 'classic', label: 'Klassisch', hint: 'Gewohnt' },
                { v: 'glass',   label: 'Glas',      hint: 'Neu' },
              ].map((o) => {
                const active = activeVariant === o.v;
                return (
                  <button
                    key={o.v}
                    onClick={() => actions.setLayoutOverride(o.v)}
                    aria-pressed={active}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 'var(--radius)', cursor: 'pointer',
                      border: `2px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary-tint)' : 'var(--card)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, color: active ? 'var(--primary-ink)' : 'var(--ink)' }}>{o.label}</span>
                    <span style={{
                      fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600,
                      color: active ? 'var(--primary)' : 'var(--ink-3)',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {active ? <><Icon name="check" size={12} stroke={3} color="var(--primary)" /> Aktiv</> : o.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Meine Ausschreibungen */}
        {(() => {
          const ownListings = state.listings.filter(l => l.own);
          return (
            <>
              <div style={{ padding: '4px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>MEINE AUSSCHREIBUNGEN</span>
                <button
                  onClick={() => navigate('/inserat-erstellen')}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}
                >
                  + Neu
                </button>
              </div>
              {ownListings.length === 0 ? (
                <div style={{ margin: '0 16px', padding: '20px 16px', borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px dashed var(--line-2)', textAlign: 'center' }}>
                  <Icon name="briefcase" size={24} color="var(--ink-3)" stroke={1.6} />
                  <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>Noch keine Inserate</div>
                  <button
                    onClick={() => navigate('/inserat-erstellen')}
                    style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', marginTop: 6, padding: 0 }}
                  >
                    Erstes Inserat erstellen →
                  </button>
                </div>
              ) : (
                <div style={{ margin: '0 16px', borderRadius: 'var(--radius)', border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--card)' }}>
                  {ownListings.map((l, i) => (
                    <button
                      key={l.id}
                      onClick={() => navigate(`/inserat-bearbeiten/${l.id}`)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', background: 'transparent', border: 'none',
                        borderBottom: i < ownListings.length - 1 ? '1px solid var(--line)' : 'none',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name="store" size={18} stroke={1.6} color="var(--ink-2)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</div>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{l.cat} · {l.price}</div>
                      </div>
                      <Icon name="chevron" size={14} color="var(--ink-3)" stroke={2} />
                    </button>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* Kompetenzen */}
        <div style={{ padding: '16px 16px 12px' }}>
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

        <div style={{ padding: '16px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>EINSTELLUNGEN</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="info" label="Einfach-Modus" value="Nur die wichtigsten Funktionen anzeigen" toggleOn={einfach} onToggle={setEinfach} />
          <Row icon="bell" label="Benachrichtigungen" toggleOn={notifs} onToggle={setNotifs} />
          {notifs && !einfach && (
            [
              { label: 'Nachrichten',          on: notifChat,   set: setNotifChat },
              { label: 'Anlässe in der Nähe',  on: notifEvents, set: setNotifEvents },
              { label: 'Marktplatz-Antworten', on: notifMarket, set: setNotifMarket },
              { label: 'Wochenübersicht',      on: notifWeekly, set: setNotifWeekly },
            ].map((r) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px 10px 52px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{r.label}</div>
                <Switch on={r.on} size="sm" onChange={r.set} />
              </div>
            ))
          )}
          <Row icon="globe" label="Sprache & Region" value="Deutsch · Schweiz" onClick={() => { }} />
          <Row icon="language" label="Auto-Übersetzung" value="EN, SQ, IT" toggleOn={autoTranslate} onToggle={setAutoTranslate} />
          <Row icon="pin" label="Mein Quartier" value={state.user.neighborhood} onClick={() => { }} last />
        </Card>

        <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>BARRIEREFREIHEIT</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row
            icon="textSize"
            label="Grosser Text"
            value="Vergrössert die Schrift in der ganzen App"
            toggleOn={bigText}
            onToggle={(on) => actions.setTextScale(on ? 1.15 : 1)}
          />
          <Row icon="image" label="Hoher Kontrast" toggleOn={highContrast} onToggle={setHighContrast} />
          <Row icon="mic" label="Sprachausgabe" toggleOn={voice} onToggle={setVoice} last />
        </Card>

        <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>KONTO &amp; SICHERHEIT</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="shield" label="Verifizierung" value="Verifiziert" onClick={() => navigate('/verify')} />
          <Row icon="lock" label="Passkey verwalten" onClick={() => { }} />
          <Row icon="calendar" label="Verfügbarkeit" onClick={() => navigate('/verfuegbarkeit')} />
          <Row icon="info" label="Hilfe & Support" onClick={() => { }} last />
        </Card>

        <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>ÜBER DIE APP</div>
        <Card padding={0} style={{ margin: '0 16px' }}>
          <Row icon="info" label="Impressum" onClick={() => { }} />
          <Row icon="shield" label="Datenschutzerklärung" onClick={() => { }} />
          <Row icon="briefcase" label="Nutzungsbedingungen" onClick={() => { }} last />
        </Card>

        <div style={{ padding: '24px 16px 16px' }}>
          <Button full size="md" variant="danger" onClick={() => setLogoutConfirm(true)}>Abmelden</Button>
        </div>
        <div style={{ textAlign: 'center', padding: '0 16px 16px', fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)' }}>
          Egnach Plus · v1.0.0 · Gemeinde Egnach
        </div>
      </Body>

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Profil" intro="Verwalte dein Profil und deine Einstellungen." items={HELP_ITEMS} />
      <ConfirmDialog
        open={logoutConfirm}
        onCancel={() => setLogoutConfirm(false)}
        onConfirm={actions.reset}
        tone="danger" icon="logout"
        title="Wirklich abmelden?"
        body="Du wirst aus Egnach Plus abgemeldet. Deine lokalen Daten bleiben gespeichert."
        cancelLabel="Abbrechen"
        confirmLabel="Abmelden"
      />
      {activeVariant === 'glass' && <GlassHelpFab onClick={() => setHelp(true)} />}
    </Screen>
  );
}

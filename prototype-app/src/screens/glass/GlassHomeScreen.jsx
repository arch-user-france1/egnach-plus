import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { SectionHeader, HelpSheet, CatChip } from '../../components/index.js';
import Avatar from '../../components/Avatar.jsx';
import IconButton from '../../components/IconButton.jsx';
import Badge from '../../components/Badge.jsx';
import Photo from '../../components/Photo.jsx';
import Icon from '../../components/Icon.jsx';
import { GlassShell, GlassSearch, QuickTile, abPanel } from '../../components/glass/index.js';
import { useStore } from '../../hooks/useStore.js';
import { useLayoutVariant } from '../../hooks/useLayoutVariant.js';
import { track } from '../../model/analytics.js';

const HELP = {
  title: 'Willkommen auf der Startseite',
  intro: 'Hier findest du alles aus Egnach auf einen Blick.',
  items: [
    { icon: 'pin',    title: 'Dein Quartier wählen', text: 'Tippe oben auf den Ort, um Beiträge aus deinem Quartier zu sehen.' },
    { icon: 'search', title: 'Suchen',                text: 'Suche nach Anlässen, Dingen zum Leihen oder Nachbarn — per Text oder Mikrofon.' },
    { icon: 'paws',   title: 'Schnellzugriff',        text: 'Die vier Kacheln führen dich direkt zu Helfen, Leihen, Anlässen und zur Karte.' },
    { icon: 'info',   title: 'Hilfe ist immer da',    text: 'Der grüne «?»-Knopf unten rechts öffnet auf jeder Seite passende Erklärungen.' },
  ],
};

const QUICK = [
  { glyph: 'garten',   label: 'Helfen',  ink: '#6C792D', path: '/marktplatz' },
  { glyph: 'werkzeug', label: 'Leihen',  ink: '#536078', path: '/marktplatz' },
  { glyph: 'gemeinde', label: 'Anlässe', ink: '#3F6079', path: '/anlaesse' },
  { icon:  'map',      label: 'Karte',   ink: 'var(--accent)', path: '/map' },
];

function GlassHomeHeader({ user, onLocation }) {
  return (
    <div style={{ padding: '10px 16px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
      <Avatar size={40} initials={user.initials} verified={user.verified} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>Grüezi, {user.name.split(' ')[0]}</div>
        <button
          onClick={onLocation}
          aria-label="Quartier wählen"
          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <Icon name="pin" size={12} color="var(--primary)" stroke={2} />
          <span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{user.neighborhood}</span>
          <Icon name="chevronDown" size={12} color="var(--ink-2)" stroke={2} />
        </button>
      </div>
      <IconButton name="bell" badge="3" label="Benachrichtigungen" />
    </div>
  );
}

export default function GlassHomeScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const variant = useLayoutVariant();
  const [help, setHelp] = useState(false);

  const hero = state.events[0];
  const week = state.events.slice(0, 4);
  const near = state.listings.slice(0, 2);

  function openHelp() {
    track('open_help', { screen: 'home', variant });
    setHelp(true);
  }

  return (
    <Fragment>
      <GlassShell headerH={62} header={<GlassHomeHeader user={state.user} onLocation={() => navigate('/map')} />} onHelp={openHelp}>
        <div style={{ padding: '8px 16px 14px' }}>
          <GlassSearch placeholder="Suche in Egnach…" mic onClick={() => navigate('/marktplatz')} />
        </div>

        {/* Schnellzugriff — 4 Glas-Kacheln */}
        <div style={{ padding: '0 16px 6px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {QUICK.map((q, i) => <QuickTile key={i} {...q} onClick={() => navigate(q.path)} />)}
        </div>

        {/* Bild-Held mit frostigem Info-Panel */}
        {hero && (
          <div style={{ padding: '14px 16px 2px' }}>
            <div
              onClick={() => navigate(`/anlaesse/${hero.id}`)}
              style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 196, boxShadow: '0 10px 26px rgba(15,30,55,0.16)', cursor: 'pointer' }}
            >
              <Photo width="100%" height={196} tone={hero.tone} radius={0} hint="hafenfest" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,30,55,0.32) 0%, rgba(15,30,55,0) 34%, rgba(15,30,55,0) 58%, rgba(15,30,55,0.16) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge tone="accent" size="sm">DORFFEST</Badge></div>
              <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, borderRadius: 'var(--radius)', padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 10, ...abPanel }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>{hero.title}</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 11.5, color: 'var(--ink-2)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                    <Icon name="calendar" size={11} stroke={2} color="var(--ink-2)" /> {hero.date} · {hero.location}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); actions.toggleRsvp(hero.id); }}
                  aria-label={state.rsvp.includes(hero.id) ? 'Teilnahme zurückziehen' : 'Teilnehmen'}
                  className="ab-press"
                  style={{
                    height: 38, padding: '0 16px', borderRadius: 19, cursor: 'pointer', flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: 'var(--font)', fontWeight: 700, fontSize: 13,
                    ...(state.rsvp.includes(hero.id)
                      ? { background: 'color-mix(in srgb, var(--primary) 16%, var(--card))', border: '1px solid color-mix(in srgb, var(--primary) 42%, transparent)', color: 'var(--primary)' }
                      : { background: 'var(--primary)', border: 'none', color: '#fff' }),
                  }}
                >
                  {state.rsvp.includes(hero.id) && <Icon name="check" size={14} stroke={3} color="var(--primary)" />}
                  {state.rsvp.includes(hero.id) ? 'Zugesagt' : 'Teilnehmen'}
                </button>
              </div>
            </div>
          </div>
        )}

        <SectionHeader title="Diese Woche" action="Alle" onAction={() => navigate('/anlaesse')} />
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {week.map((e) => (
            <div key={e.id} onClick={() => navigate(`/anlaesse/${e.id}`)} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', ...abPanel }}>
              <Photo width="100%" height={80} tone={e.tone} radius={0} hint={e.cats[0]} />
              <div style={{ padding: 10 }}>
                <CatChip name={e.cats[0]} size="sm" />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', marginTop: 7, lineHeight: 1.25 }}>{e.title}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', marginTop: 3 }}>{e.dateShort} · {e.location}</div>
              </div>
            </div>
          ))}
        </div>

        <SectionHeader title="Aus der Nachbarschaft" action="Marktplatz" onAction={() => navigate('/marktplatz')} />
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {near.map((l) => (
            <div key={l.id} onClick={() => navigate(`/marktplatz/${l.id}`)} style={{ borderRadius: 'var(--radius)', padding: 10, display: 'flex', gap: 12, cursor: 'pointer', ...abPanel }}>
              <Photo width={64} height={64} tone={l.tone} hint="bild" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{l.title}</div>
                <div style={{ marginTop: 6 }}><CatChip name={l.cat} size="sm" /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--primary)', fontWeight: 700 }}>{l.price}</span>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>· {l.neighborhood} · {l.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 12 }} />
      </GlassShell>

      <HelpSheet open={help} onClose={() => setHelp(false)} {...HELP} />
    </Fragment>
  );
}

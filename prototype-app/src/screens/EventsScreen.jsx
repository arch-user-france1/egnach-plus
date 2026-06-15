import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen, Body, HScroll, HelpButton, HelpSheet, CatGlyph, catKey } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import Icon from '../components/Icon.jsx';
import Badge from '../components/Badge.jsx';
import { useStore } from '../hooks/useStore.js';
import { useLayoutVariant } from '../hooks/useLayoutVariant.js';
import { track } from '../model/analytics.js';

const CATS = ['Alle', 'Gemeinde', 'Sport', 'Familie', 'Senioren', 'Sprache', 'Kultur'];

const HELP_ITEMS = [
  { icon: 'calendar', title: 'Anlässe filtern',     text: 'Wähle eine Kategorie oder nutze die Listenansicht, um Anlässe zu finden.' },
  { icon: 'check',    title: 'Teilnehmen',           text: 'Öffne einen Anlass und tippe auf «Teilnehmen», um dich anzumelden.' },
  { icon: 'pin',      title: 'Standort',             text: 'Jeder Anlass zeigt den Veranstaltungsort an — tippe für die Karte.' },
  { icon: 'plus',     title: 'Anlass erstellen',     text: 'Tippe auf + unten rechts, um einen eigenen Anlass zu erstellen.' },
];

const DAY_LABELS = {
  11: 'Heute · Mittwoch, 11. Juni',
  12: 'Donnerstag, 12. Juni',
  14: 'Samstag, 14. Juni',
};

const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

const stagger = { visible: { transition: { staggerChildren: 0.07 } } };
const cardItem = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.26 } },
};

function getDayLabel(day, events) {
  if (DAY_LABELS[day]) return DAY_LABELS[day];
  const ev = events.find(e => e.day === parseInt(day, 10));
  if (ev && ev.date) {
    const parts = ev.date.split('.');
    if (parts.length >= 2) {
      const month = parseInt(parts[1], 10);
      return `${parts[0]}. ${MONTH_NAMES[month - 1] || ''}`;
    }
    return ev.date;
  }
  return `Tag ${day}`;
}

export default function EventsScreen() {
  const navigate = useNavigate();
  const { state } = useStore();
  const variant = useLayoutVariant();
  const [activeCat, setActiveCat] = useState('Alle');
  const [view, setView] = useState('list');
  const [help, setHelp] = useState(false);

  const filtered = activeCat === 'Alle' ? state.events : state.events.filter(e => e.cats.includes(activeCat));

  // Group by day
  const byDay = {};
  filtered.forEach(e => {
    if (!byDay[e.day]) byDay[e.day] = [];
    byDay[e.day].push(e);
  });

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Anlässe</h1>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{filtered.length} Anlässe · diese Woche</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton name="search" label="Suchen" />
          <HelpButton onClick={() => { track('open_help', { screen: 'events', variant }); setHelp(true); }} />
        </div>
      </div>

      <Body>
        {/* Segmented control */}
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ height: 40, borderRadius: 20, padding: 4, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'flex', gap: 4 }}>
            {[['log','Liste','list'],['calendar','Kalender','calendar']].map(([icon, label, val]) => (
              <button key={val} onClick={() => setView(val)} style={{
                flex: 1, borderRadius: 16,
                background: view === val ? 'var(--card)' : 'transparent',
                boxShadow: view === val ? '0 1px 2px rgba(15,30,55,0.06)' : 'none',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: view === val ? 'var(--ink)' : 'var(--ink-3)',
                fontFamily: 'var(--font)', fontSize: 13, fontWeight: view === val ? 600 : 500,
              }}>
                <Icon name={icon} size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <HScroll padding="0 16px 4px">
          {CATS.map(c => {
            const key = c === 'Alle' ? null : catKey(c);
            return (
              <Chip
                key={c}
                active={activeCat === c}
                tone={c === 'Gemeinde' && activeCat !== c ? 'primary' : 'default'}
                onClick={() => setActiveCat(c)}
                leading={key ? <CatGlyph name={key} size={15} stroke={2} /> : undefined}
              >{c}</Chip>
            );
          })}
        </HScroll>

        {Object.entries(byDay).map(([day, events]) => (
          <div key={day}>
            <div style={{ padding: '18px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {getDayLabel(day, state.events)}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <motion.div
              key={activeCat + day}
              variants={stagger} initial="hidden" animate="visible"
              style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              {events.map(e => (
                <motion.div key={e.id} variants={cardItem}>
                <Card padding={0} onClick={() => navigate(`/anlaesse/${e.id}`)} style={{ overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: 70, padding: '14px 8px', textAlign: 'center', background: 'var(--surface-2)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>{e.month}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginTop: 4 }}>{e.day}</div>
                      <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)', marginTop: 6, fontWeight: 600 }}>{e.time}</div>
                    </div>
                    <div style={{ flex: 1, padding: 12 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{e.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Icon name="pin" size={11} color="var(--ink-3)" stroke={2} />
                        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{e.location}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                        {e.cats.map((c, ci) => <Chip key={ci} size="sm" tone="soft">{c}</Chip>)}
                      </div>
                    </div>
                  </div>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </Body>

      <div style={{ position: 'absolute', right: 18, bottom: 20, zIndex: 5 }}>
        <motion.button
          onClick={() => { track('open_create_flow', { screen: 'events', variant }); navigate('/anlass-erstellen'); }}
          aria-label="Anlass erstellen"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.18 }}
          whileTap={{ scale: 0.90 }}
          style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 6px 16px rgba(0,147,221,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="plus" size={26} color="#fff" stroke={2.4} />
        </motion.button>
      </div>

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Anlässe" intro="Entdecke und nimm an Anlässen in Egnach teil." items={HELP_ITEMS} />
    </Screen>
  );
}

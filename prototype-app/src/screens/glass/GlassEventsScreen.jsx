import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { HScroll, HelpSheet, Chip, CatChip } from '../../components/index.js';
import IconButton from '../../components/IconButton.jsx';
import Photo from '../../components/Photo.jsx';
import Icon from '../../components/Icon.jsx';
import { GlassShell, abPanel } from '../../components/glass/index.js';
import { useStore } from '../../hooks/useStore.js';
import { useLayoutVariant } from '../../hooks/useLayoutVariant.js';
import { track } from '../../model/analytics.js';

const CATS = ['Gemeinde', 'Sport', 'Familie', 'Senioren', 'Sprache', 'Kultur'];

const HELP = {
  title: 'Anlässe finden & teilnehmen',
  intro: 'Alle Veranstaltungen der Gemeinde und Vereine — übersichtlich nach Tag sortiert.',
  items: [
    { icon: 'log',    title: 'Liste oder Kalender', text: 'Wechsle oben zwischen der Tagesliste und der Kalenderansicht.' },
    { icon: 'filter', title: 'Nach Thema filtern',  text: 'Tippe auf eine Kategorie wie Sport, Familie oder Senioren, um passende Anlässe zu sehen.' },
    { icon: 'check',  title: 'Teilnehmen',           text: 'Tippe direkt auf «Dabei». Du bekommst eine Erinnerung vor dem Termin.' },
    { icon: 'plus',   title: 'Eigenen Anlass',       text: 'Mit dem grünen «+ Anlass»-Knopf meldest du einen Anlass deines Vereins an.' },
  ],
};

const DAY_LABELS = {
  11: 'Heute · Mittwoch, 11. Juni',
  12: 'Donnerstag, 12. Juni',
  14: 'Samstag, 14. Juni',
};
const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

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

function CatFilterChip({ name, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
      <CatChip name={name} active={active}>{label}</CatChip>
    </button>
  );
}

export default function GlassEventsScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const variant = useLayoutVariant();
  const [activeCat, setActiveCat] = useState('Alle');
  const [view, setView] = useState('list');
  const [help, setHelp] = useState(false);

  const filtered = activeCat === 'Alle' ? state.events : state.events.filter(e => e.cats.includes(activeCat));
  const byDay = {};
  filtered.forEach(e => { (byDay[e.day] = byDay[e.day] || []).push(e); });

  function openHelp() { track('open_help', { screen: 'events', variant }); setHelp(true); }
  function openCreate() { track('open_create_flow', { screen: 'events', variant }); navigate('/anlass-erstellen'); }

  const header = (
    <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, boxSizing: 'border-box' }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Anlässe</h1>
        <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{filtered.length} Anlässe · diese Woche</div>
      </div>
      <IconButton name="search" label="Suchen" />
    </div>
  );

  return (
    <Fragment>
      <GlassShell headerH={58} header={header} createLabel="Anlass" createIcon="plus" onCreate={openCreate} onHelp={openHelp}>
        {/* Glas-Segmented Liste / Kalender */}
        <div style={{ padding: '8px 16px 12px' }}>
          <div style={{ height: 42, borderRadius: 21, padding: 4, display: 'flex', gap: 4, ...abPanel }}>
            {[['log', 'Liste', 'list'], ['calendar', 'Kalender', 'calendar']].map(([icon, label, val]) => {
              const on = view === val;
              return (
                <button key={val} onClick={() => setView(val)} style={{
                  flex: 1, borderRadius: 17, border: 'none', cursor: 'pointer',
                  background: on ? 'var(--card)' : 'transparent',
                  boxShadow: on ? '0 1px 2px rgba(15,30,55,0.08)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: on ? 'var(--ink)' : 'var(--ink-3)',
                  fontFamily: 'var(--font)', fontSize: 13, fontWeight: on ? 600 : 500,
                }}>
                  <Icon name={icon} size={14} />{label}
                </button>
              );
            })}
          </div>
        </div>

        <HScroll padding="0 16px 4px">
          <Chip active={activeCat === 'Alle'} onClick={() => setActiveCat('Alle')}>Alle</Chip>
          {CATS.map(c => (
            <CatFilterChip key={c} name={c} label={c} active={activeCat === c} onClick={() => setActiveCat(activeCat === c ? 'Alle' : c)} />
          ))}
        </HScroll>

        {Object.entries(byDay).map(([day, events]) => (
          <div key={day}>
            <div style={{ padding: '18px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{getDayLabel(day, state.events)}</span>
              <div style={{ flex: 1, height: 1, background: 'color-mix(in srgb, var(--line) 70%, transparent)' }} />
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((e) => {
                const attending = state.rsvp.includes(e.id);
                return (
                  <div key={e.id} onClick={() => navigate(`/anlaesse/${e.id}`)} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', ...abPanel }}>
                    <div style={{ position: 'relative' }}>
                      <Photo width="100%" height={100} tone={e.tone} radius={0} hint={e.cats[0]} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,30,55,0.12) 0%, rgba(15,30,55,0) 55%)' }} />
                      <div style={{ position: 'absolute', top: 10, left: 10, borderRadius: 14, padding: '6px 11px', textAlign: 'center', ...abPanel }}>
                        <div style={{ fontFamily: 'var(--font)', fontSize: 9, fontWeight: 700, color: 'var(--accent)', letterSpacing: 1 }}>{e.month}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, marginTop: 1 }}>{e.day}</div>
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, borderRadius: 999, padding: '4px 10px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink)', ...abPanel }}>{String(e.time).split('–')[0]}</div>
                    </div>
                    <div style={{ padding: '11px 12px 12px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{e.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <Icon name="pin" size={11} color="var(--ink-3)" stroke={2} />
                        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{e.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 10 }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {e.cats.map((c, ci) => <CatChip key={ci} name={c} size="sm" />)}
                        </div>
                        <button
                          onClick={(ev) => { ev.stopPropagation(); actions.toggleRsvp(e.id); }}
                          className="ab-press"
                          style={{ height: 32, padding: '0 14px', borderRadius: 16, border: 'none', background: attending ? 'var(--ink)' : 'var(--primary)', color: '#fff', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
                        >{attending ? 'Dabei ✓' : 'Dabei'}</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div style={{ height: 12 }} />
      </GlassShell>

      <HelpSheet open={help} onClose={() => setHelp(false)} {...HELP} />
    </Fragment>
  );
}

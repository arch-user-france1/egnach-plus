import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body, HScroll } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Chip from '../components/Chip.jsx';
import TabBar from '../components/TabBar.jsx';
import Icon from '../components/Icon.jsx';
import Badge from '../components/Badge.jsx';
import { useStore } from '../hooks/useStore.js';

const CATS = ['Alle', 'Gemeinde', 'Sport', 'Familie', 'Senioren', 'Sprache', 'Kultur'];

const DAY_LABELS = {
  11: 'Heute · Mittwoch, 11. Juni',
  12: 'Donnerstag, 12. Juni',
  14: 'Samstag, 14. Juni',
};

export default function EventsScreen() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [activeCat, setActiveCat] = useState('Alle');
  const [view, setView] = useState('list');

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
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{state.events.length} Anlässe · diese Woche</div>
        </div>
        <IconButton name="search" label="Suchen" />
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
          {CATS.map(c => (
            <Chip key={c} active={activeCat === c} tone={c === 'Gemeinde' && activeCat !== c ? 'primary' : 'default'} onClick={() => setActiveCat(c)}>{c}</Chip>
          ))}
        </HScroll>

        {Object.entries(byDay).map(([day, events]) => (
          <div key={day}>
            <div style={{ padding: '18px 16px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: 0.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {DAY_LABELS[day] || `Tag ${day}`}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {events.map(e => (
                <Card key={e.id} padding={0} onClick={() => navigate(`/anlaesse/${e.id}`)} style={{ overflow: 'hidden', cursor: 'pointer' }}>
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
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />
      </Body>

      <div style={{ position: 'absolute', right: 18, bottom: 92, zIndex: 5 }}>
        <button aria-label="Anlass erstellen" style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 6px 16px rgba(217,119,87,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="plus" size={26} color="#fff" stroke={2.4} />
        </button>
      </div>

      <TabBar active={2} onNavigate={(p) => navigate(p)} />
    </Screen>
  );
}

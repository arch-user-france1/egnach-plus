import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Checkbox from '../components/Checkbox.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Badge from '../components/Badge.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const WEEKDAYS = ['M','D','M','D','F','S','S'];

function buildCalendar() {
  const days = [];
  for (let i = 0; i < 2; i++) days.push({ empty: true });
  for (let d = 1; d <= 30; d++) days.push({ d });
  while (days.length < 35) days.push({ empty: true });
  return days;
}

const STATES = { 3:'partial',4:'partial',7:'booked',10:'booked',12:'selected',13:'selected',14:'selected',18:'partial',21:'booked',25:'partial' };

export default function AvailabilityScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [selectedDay, setSelectedDay] = useState(13);
  const [newSlotOpen, setNewSlotOpen] = useState(false);
  const [newFrom, setNewFrom] = useState('19:00');
  const [newTo, setNewTo]     = useState('20:30');
  const [recurring, setRecurring] = useState(true);
  const days = buildCalendar();

  const dateKey = `2026-06-${String(selectedDay).padStart(2,'0')}`;
  const slots = state.availability[dateKey] || [];

  function handleSave() {
    let updated = [...slots];
    if (newSlotOpen) updated = [...updated, { from: newFrom, to: newTo, label: recurring ? 'Wiederholt wöchentlich' : 'Einmalig', recurring, booked: false }];
    actions.saveAvailability(dateKey, updated);
    setNewSlotOpen(false);
  }

  return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />} title="Verfügbarkeit" trailing={<IconButton name="info" label="Info" />} />
      <Body padding="0 0 8px">
        <div style={{ padding: '14px 18px 4px' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>Wann bist du verfügbar?</h2>
          <p style={{ margin: '4px 0 0', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>Tippe einen Tag, um Zeitfenster zu setzen. Wöchentlich wiederholend möglich.</p>
        </div>

        {/* Segmented */}
        <div style={{ padding: '12px 18px' }}>
          <div style={{ height: 36, borderRadius: 18, padding: 3, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'flex', gap: 4 }}>
            {['Monat','Woche','Tag'].map((l, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 14, background: i === 0 ? 'var(--card)' : 'transparent', boxShadow: i === 0 ? '0 1px 2px rgba(15,30,55,0.06)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontSize: 12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--ink)' : 'var(--ink-3)' }}>{l}</div>
            ))}
          </div>
        </div>

        {/* Month nav */}
        <div style={{ padding: '4px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton name="back" label="Vorheriger Monat" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>Juni</span>
            <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-3)' }}>2026</span>
          </div>
          <IconButton name="chevron" label="Nächster Monat" />
        </div>

        {/* Weekday labels */}
        <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {WEEKDAYS.map((d, i) => <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.5 }}>{d}</div>)}
        </div>

        {/* Days grid */}
        <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {days.map((cell, i) => {
            if (cell.empty) return <div key={i} style={{ aspectRatio: '1' }} />;
            const s = STATES[cell.d];
            const sel = cell.d === selectedDay;
            const booked = s === 'booked';
            const partial = s === 'partial';
            return (
              <button key={i} onClick={() => setSelectedDay(cell.d)} aria-label={`Tag ${cell.d}`} aria-pressed={sel} style={{
                aspectRatio: '1', borderRadius: 10,
                background: sel ? 'var(--primary)' : booked ? 'var(--surface-3)' : partial ? 'var(--primary-tint)' : 'transparent',
                border: `1px solid ${sel ? 'var(--primary)' : booked ? 'var(--line-2)' : 'transparent'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: sel ? '#fff' : booked ? 'var(--ink-3)' : 'var(--ink)',
                position: 'relative', opacity: booked ? 0.7 : 1, cursor: 'pointer',
              }}>
                <span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: sel ? 700 : 500 }}>{cell.d}</span>
                {partial && !sel && <div style={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2, background: 'var(--primary)' }} />}
                {booked && <div style={{ position: 'absolute', bottom: 4, width: 12, height: 2, background: 'var(--ink-3)' }} />}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ padding: '12px 18px 12px', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { l:'Frei',      sw: { border: '1px dashed var(--line-2)' } },
            { l:'Teilweise', sw: { background: 'var(--primary-tint)' } },
            { l:'Gebucht',   sw: { background: 'var(--surface-3)' } },
            { l:'Auswahl',   sw: { background: 'var(--primary)' } },
          ].map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, ...it.sw, display: 'block' }} />
              <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', fontWeight: 500 }}>{it.l}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--line)', margin: '4px 18px' }} />

        {/* Selected day */}
        <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Samstag, {selectedDay}. Juni</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{slots.length} Zeitfenster · {slots.filter(s=>s.booked).length} gebucht</div>
          </div>
          <button onClick={() => setNewSlotOpen(v => !v)} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0, minHeight: 44 }}>
            <Icon name="plus" size={12} stroke={2.2} color="var(--primary)" /> Zeitfenster
          </button>
        </div>

        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {slots.map((slot, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: slot.booked ? 'var(--surface-2)' : 'var(--card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: slot.booked ? 'var(--accent-tint)' : 'var(--primary-tint)', color: slot.booked ? '#7a3318' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={slot.booked ? 'log' : 'calendar'} size={16} stroke={2} color={slot.booked ? '#7a3318' : 'var(--primary)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{slot.from} – {slot.to}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{slot.label}</div>
              </div>
              {slot.booked ? <Badge tone="accent" size="sm">GEBUCHT</Badge> : <Icon name="chevron" size={14} color="var(--ink-3)" stroke={2} />}
            </div>
          ))}
        </div>

        {/* New slot form */}
        {newSlotOpen && (
          <div style={{ padding: '14px 18px 4px' }}>
            <div style={{ borderRadius: 'var(--radius)', padding: 14, border: '1.5px dashed var(--line-2)', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Neues Zeitfenster</span>
                <IconButton name="close" onClick={() => setNewSlotOpen(false)} label="Schliessen" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Field label="Von" required value={newFrom} onChange={e => setNewFrom(e.target.value)} hint="HH:MM" />
                <Field label="Bis" required value={newTo}   onChange={e => setNewTo(e.target.value)} hint="HH:MM" />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, cursor: 'pointer' }}>
                <Checkbox on={recurring} onChange={setRecurring} />
                <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-2)' }}>Wöchentlich wiederholen</span>
              </label>
            </div>
          </div>
        )}

        <div style={{ padding: '14px 18px 8px' }}>
          <HelpBanner tone="info" title="Hinweis">Setze realistische Zeitfenster — Nachbarn können nur deine freien Slots anfragen. Du erhältst eine Push-Benachrichtigung bei neuen Anfragen.</HelpBanner>
        </div>
      </Body>

      <div style={{ padding: '10px 16px 12px', background: 'var(--card)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1 }}><Button full size="lg" variant="outline" onClick={() => navigate(-1)}>Verwerfen</Button></div>
        <div style={{ flex: 1 }}><Button full size="lg" onClick={handleSave}>Speichern</Button></div>
      </div>
    </Screen>
  );
}

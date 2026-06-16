import { useMemo, useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { CatChip } from '../../components/index.js';
import { abPanel } from '../../components/glass/index.js';

// ─── Kalender-Ansicht (Glass · Anlässe) ─────────────────────────────────────
// Zeigt die Anlässe auf einem 2-Wochen-Kalender. Jeder Anlass hat einen
// Antwort-Zustand, der überall konsistent ist (Liste, Profil-Statistik):
//   • Zugesagt   → prominent (grün, ✓)
//   • Vorschlag  → noch keine Antwort, klar als Vorschlag erkennbar (zwei
//                  klare Knöpfe «Zusagen» / «Absagen»)
//   • Abgesagt   → zurückhaltend dargestellt, lässt sich doch noch zusagen

// Prototyp-«Heute»: Mittwoch, 11. Juni 2026 (passt zu den Seed-Daten).
const TODAY = new Date(2026, 5, 11);
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WD_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// 14 Tage ab dem Montag der Woche, die den Anker enthält.
function build14Days(anchor) {
  const offset = (anchor.getDay() + 6) % 7;
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - offset);
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function statusOf(state, id) {
  if (state.rsvp.includes(id)) return 'accepted';
  if (state.declined.includes(id)) return 'declined';
  return 'suggestion';
}

const STATUS_COLOR = {
  accepted:   'var(--primary)',
  suggestion: 'var(--accent)',
  declined:   'var(--ink-3)',
};

function Dot({ color, hollow }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: 3,
      background: hollow ? 'transparent' : color,
      border: hollow ? `1.5px solid ${color}` : 'none',
      display: 'inline-block',
    }} />
  );
}

function LegendItem({ color, hollow, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Dot color={color} hollow={hollow} />
      <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)' }}>{label}</span>
    </span>
  );
}

export default function EventCalendar({ events, state, actions, navigate }) {
  const days = useMemo(() => build14Days(TODAY), []);

  const eventsOn = useMemo(() => {
    const map = {};
    days.forEach(d => { map[key(d)] = []; });
    events.forEach(e => {
      const d = days.find(dd => dd.getDate() === e.day && dd.getMonth() === 5 && String(e.month).toUpperCase().startsWith('JUN'));
      if (d) map[key(d)].push(e);
    });
    return map;
  }, [days, events]);

  // Startauswahl: Heute (falls Anlässe), sonst erster Tag mit Anlässen.
  const initial = useMemo(() => {
    const todayIdx = days.findIndex(d => key(d) === key(TODAY));
    if (todayIdx >= 0 && eventsOn[key(days[todayIdx])]?.length) return todayIdx;
    const firstWith = days.findIndex(d => eventsOn[key(d)]?.length > 0);
    return firstWith >= 0 ? firstWith : (todayIdx >= 0 ? todayIdx : 0);
  }, [days, eventsOn]);

  const [sel, setSel] = useState(initial);
  const selDay = days[sel];
  const selEvents = eventsOn[key(selDay)] || [];
  const rangeLabel = `${days[0].getDate()}.–${days[13].getDate()}. ${MONTHS[days[13].getMonth()]} ${days[13].getFullYear()}`;

  return (
    <div style={{ padding: '0 16px' }}>
      {/* Kalender-Karte */}
      <div style={{ borderRadius: 'var(--radius)', padding: '12px 12px 14px', ...abPanel }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px 10px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{rangeLabel}</span>
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>2 Wochen</span>
        </div>

        {/* Wochentage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 4 }}>
          {WEEKDAYS.map(w => (
            <div key={w} style={{ textAlign: 'center', fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.3 }}>{w}</div>
          ))}
        </div>

        {/* 14 Tage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {days.map((d, i) => {
            const evs = eventsOn[key(d)] || [];
            const isSel = i === sel;
            const isToday = key(d) === key(TODAY);
            return (
              <button
                key={i}
                onClick={() => setSel(i)}
                aria-label={`${d.getDate()}. ${MONTHS[d.getMonth()]}${evs.length ? `, ${evs.length} Anlässe` : ''}`}
                aria-pressed={isSel}
                style={{
                  height: 46, borderRadius: 12, cursor: 'pointer', padding: '5px 0 4px',
                  border: `1.5px solid ${isSel ? 'var(--primary)' : 'transparent'}`,
                  background: isSel ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font)', fontSize: 13,
                  fontWeight: isToday ? 800 : 600,
                  color: isToday ? 'var(--primary)' : 'var(--ink)',
                  lineHeight: 1,
                }}>{d.getDate()}</span>
                <span style={{ display: 'flex', gap: 3, height: 6, alignItems: 'center' }}>
                  {evs.slice(0, 4).map(e => {
                    const st = statusOf(state, e.id);
                    return <Dot key={e.id} color={STATUS_COLOR[st]} hollow={st === 'declined'} />;
                  })}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legende */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '12px 2px 0', borderTop: '1px solid color-mix(in srgb, var(--line) 60%, transparent)', marginTop: 10 }}>
          <LegendItem color={STATUS_COLOR.accepted} label="Zugesagt" />
          <LegendItem color={STATUS_COLOR.suggestion} label="Vorschlag" />
          <LegendItem color={STATUS_COLOR.declined} hollow label="Abgesagt" />
        </div>
      </div>

      {/* Tages-Detail */}
      <div style={{ padding: '18px 2px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {key(selDay) === key(TODAY) ? 'Heute · ' : ''}{WD_FULL[selDay.getDay()]}, {selDay.getDate()}. {MONTHS[selDay.getMonth()]}
        </span>
        <div style={{ flex: 1, height: 1, background: 'color-mix(in srgb, var(--line) 70%, transparent)' }} />
      </div>

      {selEvents.length === 0 ? (
        <div style={{ borderRadius: 'var(--radius)', padding: '24px 16px', textAlign: 'center', ...abPanel }}>
          <Icon name="calendar" size={22} color="var(--ink-3)" stroke={1.6} />
          <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', marginTop: 8 }}>Keine Anlässe an diesem Tag.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {selEvents.map(e => (
            <DayEventCard key={e.id} event={e} status={statusOf(state, e.id)} actions={actions} navigate={navigate} />
          ))}
        </div>
      )}
      <div style={{ height: 12 }} />
    </div>
  );
}

// ─── Anlass-Karte im Tages-Detail (je Antwort-Zustand) ──────────────────────
function DayEventCard({ event: e, status, actions, navigate }) {
  const meta = (
    <>
      <div
        onClick={() => navigate(`/anlaesse/${e.id}`)}
        style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25, cursor: 'pointer', textDecoration: status === 'declined' ? 'line-through' : 'none' }}
      >{e.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="calendar" size={11} stroke={2} color="var(--ink-3)" /> {String(e.time).split('–')[0]}
        </span>
        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="pin" size={11} stroke={2} color="var(--ink-3)" /> {e.location}
        </span>
      </div>
    </>
  );

  // ── Zugesagt: prominent ──
  if (status === 'accepted') {
    return (
      <div style={{
        borderRadius: 'var(--radius)', padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
        background: 'color-mix(in srgb, var(--primary) 12%, var(--card))',
        border: '1px solid color-mix(in srgb, var(--primary) 38%, transparent)',
        boxShadow: '0 6px 18px color-mix(in srgb, var(--primary) 18%, transparent)',
      }}>
        <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: 'var(--primary)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 9px', borderRadius: 999, background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700 }}>
            <Icon name="check" size={12} stroke={3} color="#fff" /> Zugesagt
          </span>
          <div style={{ marginTop: 7 }}>{meta}</div>
        </div>
        <button
          onClick={() => actions.resetEventResponse(e.id)}
          aria-label="Zusage entfernen"
          className="ab-press"
          style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid var(--line)', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Icon name="close" size={13} stroke={2} color="var(--ink-2)" />
        </button>
      </div>
    );
  }

  // ── Abgesagt: zurückhaltend ──
  if (status === 'declined') {
    return (
      <div style={{
        borderRadius: 'var(--radius)', padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'center',
        background: 'var(--card)', border: '1px solid var(--line)', opacity: 0.7,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)' }}>
            <Icon name="close" size={12} stroke={2.4} color="var(--ink-3)" /> Abgesagt
          </span>
          <div style={{ marginTop: 6 }}>{meta}</div>
        </div>
        <button
          onClick={() => actions.acceptEvent(e.id)}
          className="ab-press"
          style={{ height: 34, padding: '0 12px', borderRadius: 17, border: '1px solid var(--primary)', background: 'transparent', color: 'var(--primary)', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer', flexShrink: 0 }}
        >
          Doch zusagen
        </button>
      </div>
    );
  }

  // ── Vorschlag: klar erkennbar, zwei eindeutige Knöpfe ──
  return (
    <div style={{ borderRadius: 'var(--radius)', padding: '12px 14px', ...abPanel }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 9px', borderRadius: 999,
          background: 'color-mix(in srgb, var(--accent) 16%, transparent)',
          border: '1px solid color-mix(in srgb, var(--accent) 34%, transparent)',
          color: 'var(--accent)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700,
        }}>
          <Icon name="info" size={12} stroke={2.2} color="var(--accent)" /> Vorschlag
        </span>
      </div>
      <div style={{ marginTop: 8 }}>{meta}</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
        {e.cats.map((c, ci) => <CatChip key={ci} name={c} size="sm" />)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() => actions.acceptEvent(e.id)}
          className="ab-press"
          style={{ flex: 1, height: 40, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Icon name="check" size={15} stroke={2.6} color="#fff" /> Zusagen
        </button>
        <button
          onClick={() => actions.declineEvent(e.id)}
          className="ab-press"
          style={{ flex: 1, height: 40, borderRadius: 'var(--radius-sm)', border: '1px solid var(--line-2)', background: 'var(--card)', color: 'var(--ink)', fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Icon name="close" size={15} stroke={2.4} color="var(--ink-2)" /> Absagen
        </button>
      </div>
    </div>
  );
}

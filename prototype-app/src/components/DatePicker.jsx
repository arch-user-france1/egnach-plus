import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon.jsx';
import Field from './Field.jsx';

const DE_MONTHS_LONG = [
  'Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember',
];
const DE_DAYS_SHORT = ['Mo','Di','Mi','Do','Fr','Sa','So'];

function pad2(n) { return String(n).padStart(2, '0'); }

function parseDateDE(str) {
  const parts = (str || '').split('.');
  if (parts.length >= 2) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parts[2] ? parseInt(parts[2], 10) : NaN;
    if (!isNaN(d) && !isNaN(m) && m >= 1 && m <= 12 && d >= 1 && d <= 31)
      return { day: d, month: m, year: isNaN(y) ? new Date().getFullYear() : y };
  }
  return null;
}

export default function DatePicker({ label, value, onChange, required, error, hint, placeholder }) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const parsed = parseDateDE(value);
  const [viewYear, setViewYear] = useState(parsed?.year || today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.month - 1 : today.getMonth());

  useEffect(() => {
    const p = parseDateDE(value);
    if (p) { setViewYear(p.year); setViewMonth(p.month - 1); }
  }, [value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  // cells: { day, type: 'prev' | 'current' | 'next' }
  const cells = [];
  for (let i = firstDow - 1; i >= 0; i--)
    cells.push({ day: daysInPrevMonth - i, type: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, type: 'current' });
  let nextDay = 1;
  while (cells.length < 42)
    cells.push({ day: nextDay++, type: 'next' });

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function selectCell(cell) {
    if (cell.type === 'prev') {
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      setViewMonth(m); setViewYear(y);
      onChange({ target: { value: `${pad2(cell.day)}.${pad2(m + 1)}.${y}` } });
    } else if (cell.type === 'next') {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      setViewMonth(m); setViewYear(y);
      onChange({ target: { value: `${pad2(cell.day)}.${pad2(m + 1)}.${y}` } });
    } else {
      onChange({ target: { value: `${pad2(cell.day)}.${pad2(viewMonth + 1)}.${viewYear}` } });
    }
    setOpen(false);
  }

  const selectedDay = parsed && parsed.month === viewMonth + 1 && parsed.year === viewYear ? parsed.day : null;
  const todayDay = today.getMonth() === viewMonth && today.getFullYear() === viewYear ? today.getDate() : null;

  const portalTarget = document.querySelector('.phone-shell') || document.body;

  return (
    <>
      <Field
        label={label} value={value} onChange={onChange}
        required={required} error={error} hint={hint} placeholder={placeholder}
        trailing={
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, color: 'var(--ink-3)' }}
            aria-label="Kalender öffnen"
          >
            <Icon name="calendar" size={16} color="var(--ink-3)" />
          </button>
        }
      />

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="dp-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setOpen(false)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)', zIndex: 300 }}
              />
              <motion.div
                key="dp-sheet"
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 390, damping: 34 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 301,
                  background: 'var(--card)',
                  borderRadius: '20px 20px 0 0',
                  paddingBottom: 32,
                  boxShadow: '0 -4px 40px rgba(0,0,0,0.14)',
                }}
              >
                {/* Drag handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
                </div>

                {/* Month navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 14px' }}>
                  <button
                    type="button" onClick={prevMonth}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, display: 'flex', alignItems: 'center' }}
                  >
                    <Icon name="back" size={18} color="var(--ink)" />
                  </button>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>
                    {DE_MONTHS_LONG[viewMonth]} {viewYear}
                  </span>
                  <button
                    type="button" onClick={nextMonth}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, display: 'flex', alignItems: 'center' }}
                  >
                    <Icon name="chevron" size={18} color="var(--ink)" />
                  </button>
                </div>

                {/* Weekday headers */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', marginBottom: 4 }}>
                  {DE_DAYS_SHORT.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', padding: '2px 0 6px' }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px', gap: '2px 0' }}>
                  {cells.map((cell, i) => {
                    const isCurrent = cell.type === 'current';
                    const sel = isCurrent && cell.day === selectedDay;
                    const tod = isCurrent && cell.day === todayDay;
                    const faded = !isCurrent;
                    return (
                      <button
                        key={i} type="button"
                        onClick={() => selectCell(cell)}
                        style={{
                          height: 40,
                          borderRadius: 20,
                          background: sel ? 'var(--primary)' : 'transparent',
                          border: tod && !sel ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                          cursor: 'pointer',
                          fontFamily: 'var(--font)',
                          fontSize: 14,
                          fontWeight: sel || tod ? 700 : 400,
                          color: sel ? '#fff' : faded ? 'var(--ink-3)' : tod ? 'var(--primary)' : 'var(--ink)',
                          transition: 'background 0.12s',
                        }}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        portalTarget
      )}
    </>
  );
}

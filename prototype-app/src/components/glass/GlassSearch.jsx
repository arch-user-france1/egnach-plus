import Icon from '../Icon.jsx';
import { abPanel } from './tokens.js';

// ─── Glas-Suche ─────────────────────────────────────────────────────────────
// Flexibel: als Eingabefeld (value/onChange), als Knopf (onClick → z. B. zum
// Marktplatz wechseln) oder rein darstellend. `filter` und `mic` blenden die
// jeweiligen Zusatz-Icons ein (wie im Handoff).
export default function GlassSearch({
  placeholder, mic = false, filter = false,
  value, onChange, onClick, onFilter, ariaLabel,
}) {
  const interactive = typeof onChange === 'function';
  const base = {
    height: 46, borderRadius: 23, padding: '0 16px',
    display: 'flex', alignItems: 'center', gap: 10, ...abPanel,
  };

  const inner = (
    <>
      <Icon name="search" size={18} color="var(--ink-3)" />
      {interactive ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel || placeholder}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink)',
          }}
        />
      ) : (
        <span style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-3)', textAlign: 'left' }}>{placeholder}</span>
      )}
      {filter && <div style={{ width: 1, height: 18, background: 'var(--line)' }} />}
      {filter && (
        <button
          onClick={(e) => { e.stopPropagation(); onFilter?.(); }}
          aria-label="Filter öffnen"
          style={{ border: 'none', background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <Icon name="filter" size={18} color="var(--ink)" />
        </button>
      )}
      {mic && <Icon name="mic" size={16} color="var(--ink-3)" />}
    </>
  );

  if (interactive) return <div style={base}>{inner}</div>;

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || placeholder}
      style={{ ...base, width: '100%', cursor: onClick ? 'pointer' : 'default' }}
    >
      {inner}
    </button>
  );
}

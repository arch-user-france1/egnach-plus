import Icon from '../Icon.jsx';
import { CatGlyph } from '../glyphs.jsx';
import { abPanel } from './tokens.js';

// ─── Schnellzugriff-Kachel (Glass-Start) ────────────────────────────────────
// Glas-Kachel mit Kategorie-Glyph oder UI-Icon + Label darunter.
export default function QuickTile({ glyph, icon, label, ink, onClick }) {
  const col = ink || 'var(--primary)';
  return (
    <button
      onClick={onClick}
      className="ab-press"
      aria-label={label}
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}
    >
      <div style={{ width: '100%', height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col, ...abPanel }}>
        {glyph ? <CatGlyph name={glyph} size={26} stroke={1.9} color={col} /> : <Icon name={icon} size={24} stroke={1.8} color={col} />}
      </div>
      <span style={{ fontFamily: 'var(--font)', fontSize: 11.5, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
    </button>
  );
}

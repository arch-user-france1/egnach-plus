import Icon from '../Icon.jsx';
import { AB_GLASS_BG, AB_GLASS_BLUR, AB_GLASS_RIM, AB_GLASS_LIFT } from './tokens.js';

// ─── Schwebende Aktions-Knöpfe (kontextspezifisch + Hilfe) ──────────────────
// Hilfe «?» ist auf jedem Glass-Screen die dauerhafte Haupt-Aktion (Anf. 2.3).
// Der optionale Erstellen-Knopf (+ Inserat / + Anlass) sitzt darüber und führt
// nur in bestehende Flows — keine neuen Funktionen.
export default function GlassActions({ createLabel, onCreate, createIcon = 'plus', onHelp }) {
  return (
    <div style={{
      position: 'absolute', right: 16, bottom: 100, zIndex: 42,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12,
      animation: 'ab-fab-in .4s cubic-bezier(.22,1,.36,1) both',
    }}>
      {createLabel && (
        <button onClick={onCreate} className="ab-press" style={{
          height: 52, padding: '0 18px 0 15px', borderRadius: 26,
          background: 'var(--primary)', color: '#fff',
          border: '1px solid rgba(255,255,255,0.30)',
          boxShadow: '0 10px 26px color-mix(in srgb, var(--primary) 42%, transparent), 0 2px 6px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.30)',
          display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer',
          fontFamily: 'var(--font)', fontSize: 14.5, fontWeight: 700, letterSpacing: 0.1,
        }}>
          <Icon name={createIcon} size={22} stroke={2.4} color="#fff" />
          {createLabel}
        </button>
      )}
      <button onClick={onHelp} aria-label="Hilfe" className="ab-press" style={{
        width: 54, height: 54, borderRadius: '50%',
        background: AB_GLASS_BG, border: AB_GLASS_RIM,
        backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
        boxShadow: AB_GLASS_LIFT,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        color: 'var(--primary)', fontFamily: 'var(--font)', fontWeight: 800, fontSize: 25, lineHeight: 1,
      }}>?</button>
    </div>
  );
}

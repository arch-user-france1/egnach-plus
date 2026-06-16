import { AB_GLASS_BG, AB_GLASS_BLUR, AB_GLASS_RIM, AB_GLASS_LIFT } from './tokens.js';

// ─── Schwebender Glas-Hilfe-Knopf (FAB) ─────────────────────────────────────
// In der Glass-Variante ist Hilfe auf JEDER Seite der gleiche schwebende
// «?»-Knopf (wie auf den Browse-Screens) — statt eines kleinen Knopfs in der
// Kopfzeile. Sitzt über der unteren Navigations-/Aktionsleiste.
export default function GlassHelpFab({ onClick, bottom = 100, right = 16 }) {
  return (
    <button
      onClick={onClick}
      aria-label="Hilfe"
      className="ab-press"
      style={{
        position: 'absolute', right, bottom, zIndex: 42,
        width: 54, height: 54, borderRadius: '50%',
        background: AB_GLASS_BG, border: AB_GLASS_RIM,
        backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
        boxShadow: AB_GLASS_LIFT,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        color: 'var(--primary)', fontFamily: 'var(--font)', fontWeight: 800, fontSize: 25, lineHeight: 1,
        animation: 'ab-fab-in .4s cubic-bezier(.22,1,.36,1) both',
      }}
    >?</button>
  );
}

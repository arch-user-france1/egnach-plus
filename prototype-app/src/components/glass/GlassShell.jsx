import { useRef, useState, useLayoutEffect } from 'react';
import GlassActions from './GlassActions.jsx';
import { AB_BG, AB_GLASS_BG, AB_GLASS_BLUR } from './tokens.js';

// ─── Glass-Shell (B-Frame) ──────────────────────────────────────────────────
// Der getönte Verlaufs-Hintergrund + die Glas-Kopfzeile + die schwebenden
// Aktions-Knöpfe rund um den Screen-Inhalt. Der Inhalt scrollt unter der
// Kopfzeile und hinter der (global gerenderten) `GlassNav` durch.
//
// Hinweis: Die schwebende Navigation wird bewusst eine Ebene höher in `App.jsx`
// gerendert (eine Navigations-Chrome für alle Tab-Screens), damit der Wechsel
// Classic ↔ Glass an genau einer Stelle entschieden wird.
//
// `headerH` ist nur der Startwert/Mindestwert. Die tatsächliche Höhe der
// (absolut positionierten) Glas-Kopfzeile wird gemessen und exakt als oberer
// Innenabstand des Scroll-Bereichs reserviert. So überlappt die Kopfzeile nie
// den ersten Inhalt — unabhängig von Titel-/Untertitel-Länge oder Textskalierung.
export default function GlassShell({ headerH = 58, header, createLabel, onCreate, createIcon, onHelp, children }) {
  const headerRef = useRef(null);
  const [topInset, setTopInset] = useState(headerH);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => setTopInset(el.offsetHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: AB_BG }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto', paddingTop: topInset, paddingBottom: 124, WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>

      <div ref={headerRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, minHeight: headerH,
        background: AB_GLASS_BG, backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
        borderBottom: '1px solid color-mix(in srgb, var(--line) 60%, transparent)',
        boxShadow: '0 6px 18px rgba(15,30,55,0.05), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}>
        {header}
      </div>

      <GlassActions createLabel={createLabel} onCreate={onCreate} createIcon={createIcon} onHelp={onHelp} />
    </div>
  );
}

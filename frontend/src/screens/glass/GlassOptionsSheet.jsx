import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../../components/Icon.jsx';
import Switch from '../../components/Switch.jsx';
import { AB_GLASS_BLUR, AB_GLASS_RIM, abPanel } from '../../components/glass/index.js';

// ─── Glas-Variante von «Sortieren & filtern» (Marktplatz) ───────────────────
// Frostiges Bottom-Sheet, das vom Filter-Knopf in der Suchleiste geöffnet wird.
const sheetSpring = { type: 'spring', damping: 28, stiffness: 320 };

// Frostiger Sheet-Hintergrund — etwas dichter als die Karten, damit Text klar
// lesbar bleibt, aber der Glas-Charakter erhalten bleibt.
const SHEET_BG = 'color-mix(in srgb, var(--card) 82%, transparent)';

function SortChip({ sort, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        height: 36, padding: '0 14px', borderRadius: 18, cursor: 'pointer', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
        ...(active
          ? { background: 'color-mix(in srgb, var(--primary) 16%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 34%, transparent)', color: 'var(--primary)' }
          : { ...abPanel, color: 'var(--ink)' }),
      }}
    >
      <Icon name={sort.icon} size={13} stroke={2} color={active ? 'var(--primary)' : 'var(--ink-2)'} />
      {sort.label}
    </button>
  );
}

export default function GlassOptionsSheet({
  open, onClose, sorts, sortId, setSortId,
  onlyMine, setOnlyMine, verifiedOnly, setVerifiedOnly, onReset,
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, zIndex: 1090, background: 'rgba(13,22,34,0.42)' }}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={sheetSpring}
            role="dialog" aria-label="Sortieren und filtern"
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1091,
              background: SHEET_BG,
              backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
              borderTop: AB_GLASS_RIM,
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              boxShadow: '0 -14px 44px rgba(15,30,55,0.28), inset 0 1px 0 rgba(255,255,255,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
            </div>

            <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Sortieren & filtern</div>
              <button
                onClick={onClose}
                aria-label="Schliessen"
                className="ab-press"
                style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...abPanel }}
              >
                <Icon name="close" size={14} stroke={2} color="var(--ink-2)" />
              </button>
            </div>

            <div style={{ padding: '6px 20px 4px' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 8 }}>SORTIEREN NACH</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {sorts.map(s => (
                  <SortChip key={s.id} sort={s} active={sortId === s.id} onClick={() => setSortId(s.id)} />
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 20px 4px' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 4 }}>FILTER</div>
              {[
                { icon: 'user',   label: 'Nur meine Inserate',        hint: 'Zeigt nur deine eigenen Angebote', on: onlyMine,     onToggle: () => setOnlyMine(!onlyMine) },
                { icon: 'shield', label: 'Nur verifizierte Anbieter', hint: 'Von der Gemeinde Egnach geprüft',  on: verifiedOnly, onToggle: () => setVerifiedOnly(!verifiedOnly) },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i === 0 ? '1px solid color-mix(in srgb, var(--line) 60%, transparent)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...abPanel }}>
                    <Icon name={row.icon} size={16} stroke={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{row.label}</div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{row.hint}</div>
                  </div>
                  <Switch on={row.on} size="sm" onChange={row.onToggle} />
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px 24px', display: 'flex', gap: 10 }}>
              <button
                onClick={onReset}
                className="ab-press"
                style={{ flex: 1, height: 48, borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', ...abPanel }}
              >
                Zurücksetzen
              </button>
              <button
                onClick={onClose}
                className="ab-press"
                style={{ flex: 1, height: 48, borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.30)', background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 22px color-mix(in srgb, var(--primary) 38%, transparent)' }}
              >
                Anwenden
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

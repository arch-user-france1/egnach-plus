/* eslint-disable react-refresh/only-export-components --
   Diese Datei bündelt bewusst die Kategorie-Daten (CAT_META, catKey) mit ihren
   Glyph-Komponenten, da beide eng zusammengehören (die Glyph-Pfade enthalten
   JSX und müssen daher in einem .jsx-Modul leben). Betrifft nur Dev-HMR. */
// ============================================================================
// Kategorie-Glyphen (geteilt zwischen Classic- und Glass-Layout)
// ----------------------------------------------------------------------------
// Grosse, freundliche Linien-Icons für die wichtigsten Funktionen und
// Kategorie-Tags der App. Gleiche Zeichensprache wie die UI-Icons
// (24×24-viewBox, runde Enden/Ecken), nur etwas kräftiger, damit sie auf einen
// Blick lesbar sind — Ziel: «die App verstehen, ohne jedes Wort zu lesen».
// Wird in beiden A/B-Varianten verwendet (siehe Settings → Darstellung).
// ============================================================================

// ─── Glyph-Pfade ────────────────────────────────────────────────────────────
const CAT_GLYPHS = {
  // ── Anlässe ──
  gemeinde: (
    <>
      <path d="M3.5 10 12 4.5 20.5 10" />
      <path d="M6 10v8M9.5 10v8M14.5 10v8M18 10v8" />
      <path d="M4 18h16M3 20.5h18" />
    </>
  ),
  sport: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4l3.4 2.5-1.3 4h-4.2l-1.3-4z" />
      <path d="M12 7.4V3.6M15.4 9.9l3.6-1.2M14.1 13.9l2.3 3M9.9 13.9l-2.3 3M8.6 9.9 5 8.7" />
    </>
  ),
  familie: (
    <>
      <circle cx="8.4" cy="6" r="2.4" />
      <path d="M4.7 19v-3.8c0-2.3 1.5-3.7 3.7-3.7s3.7 1.4 3.7 3.7V19" />
      <circle cx="16.3" cy="8.4" r="2" />
      <path d="M13.4 19v-3c0-1.9 1.2-3.1 2.9-3.1S19.2 14.1 19.2 16v3" />
    </>
  ),
  senioren: (
    <>
      <circle cx="10" cy="5" r="2.2" />
      <path d="M10 7.4c-1.7 0-2.7 1.2-2.7 3.2L6.7 15" />
      <path d="M10 7.4c1.5 0 2.3 1 2.6 2.5l.9 4.4" />
      <path d="M6.7 15 6 19.6M12.6 14.3l1.3 5.3" />
      <path d="M9.8 10.6 13 12M16.4 8.6V19.6" />
    </>
  ),
  sprache: (
    <>
      <path d="M3.5 6.2h17a1.6 1.6 0 0 1 1.6 1.6v6.4a1.6 1.6 0 0 1-1.6 1.6h-7.6L8 20v-4.2H3.5A1.6 1.6 0 0 1 1.9 14.2V7.8A1.6 1.6 0 0 1 3.5 6.2Z" />
      <text x="6.6" y="13.4" fontSize="6.6" fontWeight="800" fill="currentColor" stroke="none" fontFamily="var(--font)">A</text>
      <text x="12.4" y="13.4" fontSize="6.6" fontWeight="800" fill="currentColor" stroke="none" fontFamily="var(--font)">文</text>
    </>
  ),
  kultur: (
    <>
      <path d="M9 17V6l9.5-2v9" />
      <ellipse cx="6.5" cy="17" rx="2.5" ry="2" />
      <ellipse cx="16" cy="15" rx="2.5" ry="2" />
    </>
  ),
  party: (
    <>
      <path d="M3 21l4.8-11 6.8 6.8z" />
      <path d="M14.8 9.5l1.7-1.7M17.1 12.7l2.2-.5M13.6 7.5l-.4-2.3" />
      <path d="M16.1 7.4h.01M19.6 9.4h.01M14.2 4.7h.01M20.4 6h.01" />
    </>
  ),
  natur: (
    <>
      <path d="M5.5 18.5c0-7.5 5-11.5 13-12-.3 8.4-4.8 12.3-13 12Z" />
      <path d="M8 16C10.5 12.3 13.5 10 17.5 8.4" />
    </>
  ),

  // ── Marktplatz ──
  werkzeug: (
    <>
      <path d="M3.5 9.5h17v9.5h-17z" />
      <path d="M8.2 9.5V7.4a1.8 1.8 0 0 1 1.8-1.8h4a1.8 1.8 0 0 1 1.8 1.8v2.1" />
      <path d="M3.5 13.6h17M10.4 13.6v2.4h3.2v-2.4" />
    </>
  ),
  handwerk: (
    <>
      <path d="M16 6.4a3.7 3.7 0 0 0-5 4.5l-6.2 6.2L7 19.4l6.2-6.2a3.7 3.7 0 0 0 4.5-5l-2.4 2.4-2-2L15.8 6.3z" />
    </>
  ),
  tausch: (
    <>
      <path d="M4 9.2h13l-3.2-3.3M20 14.8H7l3.2 3.3" />
    </>
  ),
  jobs: (
    <>
      <path d="M4 8.6h16v10.4H4z" />
      <path d="M8.8 8.6V7a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2v1.6" />
      <path d="M4 13.2h16M10.2 13.2v2.2h3.6v-2.2" />
    </>
  ),

  // ── Nachbarschaftshilfe ──
  garten: (
    <>
      <path d="M9 3.5h6v2.4a3 3 0 0 1-6 0V3.5Z" />
      <path d="M12 5.9V12.2" />
      <path d="M7.8 12.2h8.4l-1.3 4.6a3.1 3.1 0 0 1-5.8 0z" />
    </>
  ),
  eltern: (
    <>
      <path d="M4 13a8 8 0 0 1 8-8v8z" />
      <path d="M4 13h13" />
      <path d="M17 13l3.4-7.8M17.4 5.2h3.2" />
      <circle cx="7.6" cy="17.6" r="2.1" />
      <circle cx="14.4" cy="17.6" r="2.1" />
    </>
  ),
  kinder: (
    <>
      <path d="M8.6 9.2h6.8l-.7 8.8a2 2 0 0 1-2 1.9h-.4a2 2 0 0 1-2-1.9z" />
      <path d="M8 9.2 8.7 7.2h6.6L16 9.2" />
      <path d="M10.7 4.8h2.6L13 7.2h-2z" />
      <path d="M9.7 12.6h4.6" />
    </>
  ),
  tiere: (
    <>
      <circle cx="6" cy="9" r="1.9" />
      <circle cx="18" cy="9" r="1.9" />
      <circle cx="9.3" cy="6" r="1.9" />
      <circle cx="14.7" cy="6" r="1.9" />
      <path d="M12 12.5c-2.8 0-4.8 1.9-4.8 3.9 0 1.7 1.6 2.8 4.8 2.8s4.8-1.1 4.8-2.8c0-2-2-3.9-4.8-3.9Z" />
    </>
  ),
  einkauf: (
    <>
      <path d="M5.6 8.2h12.8l-1 11.3H6.6z" />
      <path d="M9 8.2V6.6a3 3 0 0 1 6 0v1.6" />
    </>
  ),
  fahrdienst: (
    <>
      <path d="M4 14l1.7-4.6A2 2 0 0 1 7.6 8h8.8a2 2 0 0 1 1.9 1.4L20 14" />
      <path d="M3 14h18v3.4H3z" />
      <circle cx="7.6" cy="17.4" r="1.9" />
      <circle cx="16.4" cy="17.4" r="1.9" />
    </>
  ),
};

// Deutsche Labels + harmonische, gedämpfte Farbe je Kategorie. Die Töne sind
// bewusst erd-/seefarben gehalten, damit ein Raster aus Kacheln als Familie
// wirkt und nicht als Regenbogen.
export const CAT_META = {
  // Anlässe
  gemeinde: { label: 'Gemeinde',     group: 'Anlässe',             bg: '#DEE7EC', ink: '#3F6079' },
  sport:    { label: 'Sport',        group: 'Anlässe',             bg: '#E3EBD7', ink: '#587A32' },
  familie:  { label: 'Familie',      group: 'Anlässe',             bg: '#DBEAF4', ink: '#2E6CA8' },
  senioren: { label: 'Senioren',     group: 'Anlässe',             bg: '#F1E7CD', ink: '#9A782A' },
  sprache:  { label: 'Sprache',      group: 'Anlässe',             bg: '#E7E1F1', ink: '#6A4F9E' },
  kultur:   { label: 'Kultur',       group: 'Anlässe',             bg: '#F6E3D5', ink: '#B45934' },
  party:    { label: 'Party',        group: 'Anlässe',             bg: '#F4DEE6', ink: '#AE4269' },
  natur:    { label: 'Natur & See',  group: 'Anlässe',             bg: '#DCEAD7', ink: '#3E7C4A' },
  // Marktplatz
  werkzeug: { label: 'Leihen',       group: 'Marktplatz',          bg: '#E3E6EB', ink: '#536078' },
  handwerk: { label: 'Dienste',      group: 'Marktplatz',          bg: '#DFE6E9', ink: '#4E6271' },
  tausch:   { label: 'Tausch',       group: 'Marktplatz',          bg: '#DDEAE5', ink: '#2D7C6A' },
  jobs:     { label: 'Jobs',         group: 'Marktplatz',          bg: '#E5E3F0', ink: '#5A569E' },
  // Nachbarschaftshilfe
  garten:    { label: 'Gartenhilfe',  group: 'Nachbarschaftshilfe', bg: '#E8EBD2', ink: '#6C792D' },
  eltern:    { label: 'Elterntreff',  group: 'Nachbarschaftshilfe', bg: '#D6EBE7', ink: '#2D7C72' },
  kinder:    { label: 'Kinderhüten',  group: 'Nachbarschaftshilfe', bg: '#F5E4DB', ink: '#BE654D' },
  tiere:     { label: 'Tiere',        group: 'Nachbarschaftshilfe', bg: '#ECE4D5', ink: '#88683D' },
  einkauf:   { label: 'Einkaufshilfe',group: 'Nachbarschaftshilfe', bg: '#F5E3D8', ink: '#BE603A' },
  fahrdienst:{ label: 'Fahrdienst',   group: 'Nachbarschaftshilfe', bg: '#DFE4F1', ink: '#495A9E' },
};

// ─── CatGlyph — das reine Icon ──────────────────────────────────────────────
export function CatGlyph({ name, size = 24, stroke = 1.8, color = 'currentColor' }) {
  const inner = CAT_GLYPHS[name];
  if (!inner) return <div style={{ width: size, height: size, border: '1px dashed currentColor', opacity: 0.4, flexShrink: 0 }} />;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      {inner}
    </svg>
  );
}

// ─── catKey — findet den Glyph-Schlüssel zu einem (deutschen) Label ─────────
export function catKey(label) {
  if (!label) return null;
  if (CAT_META[label]) return label;
  const hit = Object.keys(CAT_META).find(
    (k) => CAT_META[k].label.toLowerCase() === String(label).toLowerCase(),
  );
  return hit || null;
}

// ─── CatTile — grosse getönte Kachel + Label ────────────────────────────────
export function CatTile({ name, label, size = 64, iconSize, onClick }) {
  const m = CAT_META[name] || {};
  const lbl = label !== undefined ? label : m.label;
  const is = iconSize || Math.round(size * 0.46);
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: size + 8,
        border: 'none', background: 'transparent', padding: 0, cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{
        width: size, height: size, borderRadius: Math.round(size * 0.32),
        background: m.bg || 'var(--surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <CatGlyph name={name} size={is} stroke={1.9} color={m.ink || 'var(--ink)'} />
      </div>
      {lbl && (
        <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.2 }}>{lbl}</span>
      )}
    </button>
  );
}

// ─── CatChip — Pille mit Glyph + kurzem Label, je Kategorie getönt ──────────
export function CatChip({ name, children, size = 'md', active = false }) {
  const key = catKey(name) || catKey(children);
  const m = key ? CAT_META[key] : null;
  const h = size === 'sm' ? 26 : 32;
  const fs = size === 'sm' ? 12 : 13;
  const gs = size === 'sm' ? 14 : 16;
  const label = children !== undefined ? children : (m ? m.label : name);
  // Sanfter Fallback für Labels ohne Glyph (z. B. «Dorffest»).
  if (!m) {
    return (
      <span style={{
        height: h, padding: '0 12px', borderRadius: 999,
        background: 'var(--surface-2)', color: 'var(--ink-2)',
        display: 'inline-flex', alignItems: 'center',
        fontFamily: 'var(--font)', fontSize: fs, fontWeight: 600,
        flexShrink: 0, letterSpacing: 0.1, whiteSpace: 'nowrap',
      }}>{label}</span>
    );
  }
  return (
    <span style={{
      height: h, padding: '0 12px 0 9px', borderRadius: 999,
      background: active ? m.ink : m.bg,
      color: active ? '#fff' : m.ink,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font)', fontSize: fs, fontWeight: 600,
      flexShrink: 0, letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>
      <CatGlyph name={key} size={gs} stroke={2} color={active ? '#fff' : m.ink} />
      {label}
    </span>
  );
}

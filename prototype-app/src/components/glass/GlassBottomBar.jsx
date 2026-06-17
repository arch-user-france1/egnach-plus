import Icon from '../Icon.jsx';
import { useGlassChrome } from './GlassChrome.jsx';
import { AB_GLASS_BG, AB_GLASS_BLUR, AB_GLASS_RIM, AB_GLASS_LIFT } from './tokens.js';

// ─── Untere Glas-Leiste: Navigation (+ optionale Seiten-Aktionen) ───────────
// Immer sichtbar in der Glass-Variante. Ohne Seiten-Aktion zeigt sie die volle
// Navigation (Icon + Label). Meldet eine Seite Aktionen an, wird die Navigation
// kompakt (nur Icons, horizontal scrollbar) und die beschrifteten Aktionsknöpfe
// erscheinen daneben — so versteht man trotz Platzmangel, was sie bewirken.
const TABS = [
  { name: 'home',     label: 'Start',   path: '/home' },
  { name: 'store',    label: 'Markt',   path: '/marktplatz' },
  { name: 'calendar', label: 'Anlässe', path: '/anlaesse' },
  { name: 'chat',     label: 'Chat',    path: '/chat' },
  { name: 'user',     label: 'Profil',  path: '/profil' },
];

function ActionButton({ action }) {
  const primary = (action.tone || 'primary') === 'primary';
  return (
    <button
      onClick={action.disabled ? undefined : action.onClick}
      disabled={action.disabled}
      aria-label={action.label}
      className="ab-press"
      style={{
        height: 46, padding: action.icon ? '0 16px 0 13px' : '0 16px', borderRadius: 23,
        display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0,
        cursor: action.disabled ? 'default' : 'pointer',
        opacity: action.disabled ? 0.5 : 1,
        fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, letterSpacing: 0.1, whiteSpace: 'nowrap',
        ...(primary
          ? {
              background: 'var(--primary)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.30)',
              boxShadow: '0 8px 22px color-mix(in srgb, var(--primary) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.30)',
            }
          : {
              background: 'color-mix(in srgb, var(--card) 78%, transparent)', color: 'var(--ink)',
              border: AB_GLASS_RIM,
              backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
              boxShadow: '0 6px 18px rgba(15,30,55,0.12), inset 0 1px 0 rgba(255,255,255,0.5)',
            }),
      }}
    >
      {action.icon && <Icon name={action.icon} size={18} stroke={2.2} color={primary ? '#fff' : 'var(--ink)'} />}
      {action.label}
    </button>
  );
}

export default function GlassBottomBar({ active = -1, onNavigate }) {
  const { actions } = useGlassChrome();
  const hasActions = !!(actions && actions.length);

  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 22, zIndex: 40,
      height: 66, borderRadius: 26, padding: '0 6px',
      display: 'flex', alignItems: 'center', gap: 6,
      background: AB_GLASS_BG, border: AB_GLASS_RIM,
      backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
      boxShadow: AB_GLASS_LIFT,
      animation: 'ab-nav-in .45s cubic-bezier(.22,1,.36,1) both',
    }}>
      {/* Navigation — voll (mit Label) oder kompakt (nur Icons, scrollbar).
          Im kompakten Zustand werden die Ränder ausgeblendet (Fade/Blur), damit
          erkennbar bleibt, dass seitlich noch mehr Tabs sind — im Usability-Test
          hatten einige vergessen, dass die Leiste mehr als die sichtbaren Knöpfe
          hat. */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0,
          overflowX: hasActions ? 'auto' : 'visible',
          maskImage: hasActions ? 'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)' : undefined,
          WebkitMaskImage: hasActions ? 'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)' : undefined,
        }}
      >
        {TABS.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              onClick={() => onNavigate?.(t.path)}
              aria-label={t.label}
              aria-current={on ? 'page' : undefined}
              className="ab-tab"
              style={{
                flex: hasActions ? '0 0 auto' : '1 1 0', minWidth: hasActions ? 40 : 0,
                height: 54, border: 'none', background: 'transparent', cursor: 'pointer',
                position: 'relative', padding: hasActions ? '0 6px' : 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              }}
            >
              <span className="ab-tab-pill" style={{
                position: 'absolute', left: hasActions ? 2 : 5, right: hasActions ? 2 : 5, top: 3, bottom: 3, borderRadius: 16,
                background: on ? 'color-mix(in srgb, var(--primary) 16%, transparent)' : 'transparent',
                border: `1px solid ${on ? 'color-mix(in srgb, var(--primary) 30%, transparent)' : 'transparent'}`,
                transform: on ? 'scale(1)' : 'scale(0.8)',
              }} />
              <span style={{ position: 'relative', display: 'flex' }}>
                <Icon name={t.name} size={22} stroke={on ? 2.1 : 1.7} color={on ? 'var(--primary)' : 'var(--ink-3)'} />
              </span>
              {!hasActions && (
                <span style={{
                  position: 'relative', fontFamily: 'var(--font)', fontSize: 10,
                  fontWeight: on ? 700 : 500, letterSpacing: 0.2,
                  color: on ? 'var(--primary)' : 'var(--ink-3)',
                }}>{t.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Seiten-Aktion(en) — beschriftet, glasig */}
      {hasActions && (
        <>
          <div style={{ width: 1, height: 30, background: 'color-mix(in srgb, var(--line) 70%, transparent)', flexShrink: 0 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, paddingRight: 2 }}>
            {actions.map((a, i) => <ActionButton key={a.key || i} action={a} />)}
          </div>
        </>
      )}
    </div>
  );
}

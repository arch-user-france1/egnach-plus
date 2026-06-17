import Icon from '../Icon.jsx';
import { AB_GLASS_BG, AB_GLASS_BLUR, AB_GLASS_RIM, AB_GLASS_LIFT } from './tokens.js';

// ─── Schwebende Glas-Navigation (Pill-Insel) ────────────────────────────────
// Ersetzt im Glass-Layout die fixe `TabBar`. Sie ist immer sichtbar und der
// Inhalt scrollt dahinter durch — deshalb ist sie absolut positioniert und der
// Scroll-Body bekommt unten 124px Polster.
const TABS = [
  { name: 'home',     label: 'Start',   path: '/home' },
  { name: 'store',    label: 'Markt',   path: '/marktplatz' },
  { name: 'calendar', label: 'Anlässe', path: '/anlaesse' },
  { name: 'chat',     label: 'Chat',    path: '/chat' },
  { name: 'user',     label: 'Profil',  path: '/profil' },
];

export default function GlassNav({ active = 0, onNavigate }) {
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 22, zIndex: 1000,
      height: 66, borderRadius: 26, padding: '0 6px',
      display: 'flex', alignItems: 'center',
      background: AB_GLASS_BG, border: AB_GLASS_RIM,
      backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
      boxShadow: AB_GLASS_LIFT,
      animation: 'ab-nav-in .45s cubic-bezier(.22,1,.36,1) both',
    }}>
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
              flex: 1, height: 54, border: 'none', background: 'transparent', cursor: 'pointer',
              position: 'relative', padding: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}
          >
            <span className="ab-tab-pill" style={{
              position: 'absolute', left: 5, right: 5, top: 3, bottom: 3, borderRadius: 18,
              background: on ? 'color-mix(in srgb, var(--primary) 16%, transparent)' : 'transparent',
              border: `1px solid ${on ? 'color-mix(in srgb, var(--primary) 30%, transparent)' : 'transparent'}`,
              transform: on ? 'scale(1)' : 'scale(0.8)',
            }} />
            <span style={{ position: 'relative', display: 'flex' }}>
              <Icon name={t.name} size={22} stroke={on ? 2.1 : 1.7} color={on ? 'var(--primary)' : 'var(--ink-3)'} />
            </span>
            <span style={{
              position: 'relative', fontFamily: 'var(--font)', fontSize: 10,
              fontWeight: on ? 700 : 500, letterSpacing: 0.2,
              color: on ? 'var(--primary)' : 'var(--ink-3)',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

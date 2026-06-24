import Icon from './Icon.jsx';

const TABS = [
  { name: 'home',     label: 'Start',  path: '/home' },
  { name: 'store',    label: 'Markt',  path: '/marktplatz' },
  { name: 'calendar', label: 'Anlässe',path: '/anlaesse' },
  { name: 'chat',     label: 'Chat',   path: '/chat' },
  { name: 'user',     label: 'Profil', path: '/profil' },
];

export default function TabBar({ active = 0, onNavigate }) {
  return (
    <div style={{
      display: 'flex', background: 'var(--card)',
      borderTop: '1px solid var(--line)',
      paddingTop: 6,
      paddingBottom: 18,
      flexShrink: 0,
    }}>
      {TABS.map((t, i) => {
        const on = i === active;
        return (
          <button
            key={i}
            onClick={() => onNavigate?.(t.path)}
            aria-label={t.label}
            aria-current={on ? 'page' : undefined}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, padding: '4px 0',
              color: on ? 'var(--primary)' : 'var(--ink-3)',
              border: 'none', background: 'transparent', cursor: 'pointer',
              minHeight: 44,
            }}
          >
            <Icon name={t.name} size={22} stroke={on ? 2 : 1.6} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: on ? 600 : 500, letterSpacing: 0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

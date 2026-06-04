export function Screen({ children, background = 'var(--surface)', style }) {
  return (
    <div style={{
      width: '100%', height: '100%', background, color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: 'var(--font)',
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function Body({ children, padding = 0, background, style }) {
  return (
    <div style={{
      flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
      padding, background, WebkitOverflowScrolling: 'touch',
      ...style,
    }}>{children}</div>
  );
}

export function HScroll({ children, gap = 10, padding = '0 16px' }) {
  return (
    <div style={{
      display: 'flex', gap, padding, overflowX: 'auto', scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}
      className="hide-scrollbar"
    >{children}</div>
  );
}

export function SectionHeader({ title, action, onAction, dense = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: dense ? '4px 16px 8px' : '20px 16px 10px',
    }}>
      <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>{title}</h3>
      {action && (
        <button onClick={onAction} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          {action}
        </button>
      )}
    </div>
  );
}

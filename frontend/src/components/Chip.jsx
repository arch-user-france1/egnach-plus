export default function Chip({ children, active = false, leading, onClick, size = 'md', tone = 'default' }) {
  const h  = size === 'sm' ? 24 : 30;
  const fs = size === 'sm' ? 11 : 12;
  let bg = active ? 'var(--ink)' : 'var(--card)';
  let fg = active ? 'var(--surface)' : 'var(--ink)';
  let bd = active ? 'var(--ink)' : 'var(--line)';
  if (tone === 'soft')    { bg = 'var(--surface-2)';    bd = 'transparent'; fg = 'var(--ink-2)'; }
  if (tone === 'primary') { bg = 'var(--primary-tint)'; bd = 'transparent'; fg = 'var(--primary-ink)'; }
  return (
    <button
      onClick={onClick}
      style={{
        height: h, padding: leading ? '0 12px 0 10px' : '0 12px',
        borderRadius: 999, background: bg, color: fg,
        border: `1px solid ${bd}`,
        fontFamily: 'var(--font)', fontSize: fs, fontWeight: 500,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        flexShrink: 0, cursor: 'pointer', letterSpacing: 0.1,
        whiteSpace: 'nowrap',
      }}
    >
      {leading}{children}
    </button>
  );
}

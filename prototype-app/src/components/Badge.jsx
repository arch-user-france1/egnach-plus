export default function Badge({ children, tone = 'primary', size = 'md' }) {
  const h  = size === 'sm' ? 18 : 22;
  const fs = size === 'sm' ? 10 : 11;
  let bg = 'var(--primary-tint)', fg = 'var(--primary-ink)';
  if (tone === 'accent')  { bg = 'var(--accent-tint)';  fg = '#7a3318'; }
  if (tone === 'success') { bg = '#E1F1E7';              fg = '#155E3E'; }
  if (tone === 'neutral') { bg = 'var(--surface-2)';    fg = 'var(--ink-2)'; }
  if (tone === 'danger')  { bg = '#FAE5E2';              fg = '#7a1a15'; }
  return (
    <span style={{
      height: h, padding: '0 8px', borderRadius: 999,
      background: bg, color: fg,
      fontFamily: 'var(--font)', fontSize: fs, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4, letterSpacing: 0.2,
      flexShrink: 0,
    }}>{children}</span>
  );
}

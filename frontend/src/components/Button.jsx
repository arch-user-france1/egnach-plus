export default function Button({ children, variant = 'primary', size = 'md', full = false, leading, trailing, onClick, style, disabled, type = 'button' }) {
  const heights = { sm: 36, md: 44, lg: 52 };
  const pad     = { sm: '0 14px', md: '0 18px', lg: '0 22px' };
  const fs      = { sm: 13, md: 14, lg: 15 };

  let bg = 'var(--primary)', fg = '#fff', border = 'transparent';
  if (variant === 'ghost')   { bg = 'transparent'; fg = 'var(--ink)'; }
  if (variant === 'outline') { bg = 'transparent'; fg = 'var(--ink)'; border = 'var(--line-2)'; }
  if (variant === 'accent')  { bg = 'var(--accent)'; }
  if (variant === 'danger')  { bg = 'transparent'; fg = 'var(--danger)'; }
  if (disabled) { bg = 'var(--surface-3)'; fg = 'var(--ink-3)'; }

  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{
        height: heights[size], padding: pad[size],
        width: full ? '100%' : undefined,
        borderRadius: 'var(--radius-sm)',
        background: bg, color: fg, border: `1px solid ${border}`,
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: fs[size],
        letterSpacing: 0.1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: variant === 'primary' && !disabled ? '0 1px 1px rgba(0,0,0,0.06)' : 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {leading}<span>{children}</span>{trailing}
    </button>
  );
}

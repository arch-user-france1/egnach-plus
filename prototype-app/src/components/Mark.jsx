export default function Mark({ size = 40, variant = 'badge' }) {
  if (variant === 'wappen') {
    return (
      <div style={{ width: size, height: size * (563 / 500), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src="/egnach-wappen.png" alt="Wappen Egnach" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: variant === 'badge' ? 'var(--primary)' : 'transparent',
      border: variant === 'mono' ? '1.6px solid var(--ink)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: size * 0.5, color: variant === 'mono' ? 'var(--ink)' : '#fff',
        letterSpacing: -0.5,
      }}>E<span style={{ opacity: 0.7 }}>+</span></span>
    </div>
  );
}

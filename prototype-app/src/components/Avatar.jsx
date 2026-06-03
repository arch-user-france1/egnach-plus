import Icon from './Icon.jsx';

const COLORS = ['#2563A8','#3E7C4A','#B0436B','#C18A2B','#7B5EA7','#0E6E73'];

export default function Avatar({ size = 40, initials = '', verified = false, bg, fg }) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % COLORS.length;
  const c = bg || COLORS[idx] || '#2563A8';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: c, color: fg || '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: size * 0.38,
        letterSpacing: 0.5, userSelect: 'none',
      }}>{initials}</div>
      {verified && (
        <div style={{
          position: 'absolute', right: -2, bottom: -2,
          width: size * 0.36, height: size * 0.36, borderRadius: '50%',
          background: 'var(--primary)', color: '#fff',
          border: '2px solid var(--card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="check" size={size * 0.2} stroke={3} color="#fff" />
        </div>
      )}
    </div>
  );
}

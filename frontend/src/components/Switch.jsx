export default function Switch({ on = false, size = 'md', onChange }) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 22 : 26;
  const k = h - 4;
  return (
    <button
      role="switch" aria-checked={on} onClick={() => onChange?.(!on)}
      style={{
        width: w, height: h, borderRadius: 999,
        background: on ? 'var(--primary)' : 'var(--surface-3)',
        border: 'none', padding: 0, position: 'relative',
        cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 2, left: on ? w - k - 2 : 2,
        width: k, height: k, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

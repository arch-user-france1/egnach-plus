import Icon from './Icon.jsx';

export default function IconButton({ name, onClick, size = 36, badge, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label || name}
      style={{
        width: size, height: size, borderRadius: '50%',
        border: 'none', background: 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink)', cursor: 'pointer', position: 'relative',
        flexShrink: 0, padding: 0,
      }}
    >
      <Icon name={name} size={size > 36 ? 22 : 20} />
      {badge && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          minWidth: 14, height: 14, padding: '0 4px',
          borderRadius: 7, background: 'var(--accent)', color: '#fff',
          fontFamily: 'var(--font)', fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid var(--surface)',
        }}>{badge}</span>
      )}
    </button>
  );
}

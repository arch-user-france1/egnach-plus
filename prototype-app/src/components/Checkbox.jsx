import Icon from './Icon.jsx';

export default function Checkbox({ on = false, size = 18, onChange }) {
  return (
    <button
      role="checkbox" aria-checked={on} onClick={() => onChange?.(!on)}
      style={{
        width: size, height: size, borderRadius: 5,
        background: on ? 'var(--primary)' : 'var(--card)',
        border: `1.5px solid ${on ? 'var(--primary)' : 'var(--line-2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, padding: 0, cursor: 'pointer',
      }}
    >
      {on && <Icon name="check" size={size - 6} color="#fff" stroke={2.4} />}
    </button>
  );
}

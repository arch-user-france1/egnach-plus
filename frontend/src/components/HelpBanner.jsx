import Icon from './Icon.jsx';

const TONES = {
  info:    { bg: 'var(--primary-tint)', ink: 'var(--primary-ink)', icon: 'info' },
  warning: { bg: '#FBF3DE',             ink: '#6E4F0E',            icon: 'warning' },
  success: { bg: '#E1F1E7',             ink: '#155E3E',            icon: 'check' },
  accent:  { bg: 'var(--accent-tint)',  ink: '#7a3318',            icon: 'info' },
};

export default function HelpBanner({ tone = 'info', title, children }) {
  const c = TONES[tone] || TONES.info;
  return (
    <div style={{
      background: c.bg, color: c.ink, borderRadius: 'var(--radius-sm)',
      padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{ marginTop: 1 }}>
        <Icon name={c.icon} size={18} stroke={2} color={c.ink} />
      </div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{title}</div>}
        <div style={{ fontFamily: 'var(--font)', fontSize: 12, lineHeight: 1.45, opacity: 0.88 }}>{children}</div>
      </div>
    </div>
  );
}

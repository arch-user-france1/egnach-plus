import { HelpButton } from './Feedback.jsx';

export default function TopBar({ title, leading, trailing, onHelp, subtitle, transparent = false, dense = false }) {
  const sideW = onHelp ? 72 : 32;
  return (
    <div style={{
      padding: dense ? '8px 12px' : '10px 16px',
      display: 'flex', alignItems: 'center', gap: 8,
      background: transparent ? 'transparent' : 'var(--surface)',
      borderBottom: transparent ? 'none' : '1px solid var(--line)',
      minHeight: 52, flexShrink: 0,
    }}>
      <div style={{ width: sideW, display: 'flex' }}>{leading}</div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{title}</div>}
        {subtitle && <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ width: sideW, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {trailing}
        {onHelp && <HelpButton onClick={onHelp} size={30} />}
      </div>
    </div>
  );
}

import Icon from './Icon.jsx';

export default function Field({
  label, value, onChange, placeholder, required, hint, error,
  type = 'text', leading, trailing, multiline = false, rows = 3, name,
}) {
  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink)',
    lineHeight: multiline ? 1.5 : 'normal', resize: 'none',
    padding: 0, width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', letterSpacing: 0.1 }}>{label}</span>
          {required && <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>}
        </span>
      )}
      <div style={{
        minHeight: multiline ? rows * 22 + 18 : 46,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--card)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--line)'}`,
        padding: multiline ? '12px 14px' : '0 14px',
        display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 10,
        boxShadow: error ? '0 0 0 3px rgba(200,75,63,0.10)' : 'none',
      }}>
        {leading}
        {multiline
          ? <textarea
              name={name} value={value} onChange={onChange} placeholder={placeholder}
              rows={rows} style={{ ...inputStyle, paddingTop: 2 }}
            />
          : <input
              name={name} type={type} value={value} onChange={onChange}
              placeholder={placeholder}
              style={{ ...inputStyle, height: '100%' }}
            />
        }
        {trailing}
      </div>
      {hint && !error && (
        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--danger)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="warning" size={12} stroke={2} color="var(--danger)" />{error}
        </span>
      )}
    </div>
  );
}

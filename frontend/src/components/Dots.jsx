export default function Dots({ count = 3, active = 0, accent = 'var(--ink)' }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: i === active ? 22 : 6, height: 6, borderRadius: 3,
          background: i === active ? accent : 'var(--line-2)',
          transition: 'width 0.2s',
        }} />
      ))}
    </div>
  );
}

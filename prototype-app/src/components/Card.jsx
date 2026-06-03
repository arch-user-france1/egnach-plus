export default function Card({ children, padding = 14, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--card)', borderRadius: 'var(--radius)',
      border: '1px solid var(--line)', padding,
      boxShadow: '0 1px 2px rgba(15,30,55,0.04)',
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}>{children}</div>
  );
}

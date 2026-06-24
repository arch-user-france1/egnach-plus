const PALETTES = {
  sand:  { a: '#E9E2D2', b: '#DDD2BB' },
  lake:  { a: '#D1DDE8', b: '#B7C8DA' },
  moss:  { a: '#D7DFCC', b: '#BFCAB0' },
  rose:  { a: '#EBD6DE', b: '#D9BAC6' },
  slate: { a: '#D4D9DF', b: '#B8C0C9' },
};

export default function Photo({ width = '100%', height = 140, hint = 'foto', radius = 12, tone = 'sand', style }) {
  const p = PALETTES[tone] || PALETTES.sand;
  return (
    <div style={{
      width, height: typeof height === 'number' ? height : height,
      borderRadius: radius, overflow: 'hidden',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `repeating-linear-gradient(135deg, ${p.a} 0 14px, ${p.b} 14px 28px)`,
      color: 'rgba(0,0,0,0.45)', flexShrink: 0,
      ...style,
    }}>
      <span style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        fontSize: 11, letterSpacing: 0.5,
        background: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: 4,
      }}>{hint}</span>
    </div>
  );
}

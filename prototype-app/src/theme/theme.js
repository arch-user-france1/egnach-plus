export const PALETTES = {
  egnach: {
    label: 'Egnach Wappen',
    primary: '#009944',
    primaryTint: '#E0F2E7',
    primaryInk: '#00391A',
    accent: '#0093DD',
    accentTint: '#D6EFFA',
  },
  bodensee: {
    label: 'Bodensee',
    primary: '#2563A8',
    primaryTint: '#E6EFF8',
    primaryInk: '#0E2A47',
    accent: '#D97757',
    accentTint: '#FBEBE0',
  },
  alpenwiese: {
    label: 'Alpenwiese',
    primary: '#3E7C4A',
    primaryTint: '#E6EFE7',
    primaryInk: '#1B3D24',
    accent: '#C18A2B',
    accentTint: '#F6ECD7',
  },
};

export const FONTS = {
  inter:   { label: 'Inter',        stack: "'Inter', system-ui, sans-serif" },
  manrope: { label: 'Manrope',      stack: "'Manrope', system-ui, sans-serif" },
  dmsans:  { label: 'DM Sans',      stack: "'DM Sans', system-ui, sans-serif" },
};

export const DISPLAY_FONTS = {
  fraunces:{ label: 'Fraunces',     stack: "'Fraunces', Georgia, serif" },
  space:   { label: 'Space Grotesk',stack: "'Space Grotesk', system-ui, sans-serif" },
  dmserif: { label: 'DM Serif',     stack: "'DM Serif Display', Georgia, serif" },
};

export function buildCssVars({ palette = 'egnach', font = 'inter', displayFont = 'fraunces', radius = 14, dark = false } = {}) {
  const p = PALETTES[palette] || PALETTES.egnach;
  const f = FONTS[font] || FONTS.inter;
  const d = DISPLAY_FONTS[displayFont] || DISPLAY_FONTS.fraunces;

  let ink = '#15202D', ink2 = '#5A6478', ink3 = '#8B93A4';
  let surface = '#FBFAF7', surface2 = '#F3F0E9', surface3 = '#ECE8DE';
  let line = '#E4E0D5', line2 = '#CFC9BB', card = '#FFFFFF';

  if (dark) {
    ink = '#F1ECE2'; ink2 = '#A8B0C0'; ink3 = '#6E7588';
    surface = '#0F1620'; surface2 = '#181F2A'; surface3 = '#222B38';
    line = '#28323F'; line2 = '#3A4654'; card = '#141B25';
  }

  return {
    '--primary': p.primary,
    '--primary-tint': p.primaryTint,
    '--primary-ink': p.primaryInk,
    '--accent': p.accent,
    '--accent-tint': p.accentTint,
    '--ink': ink, '--ink-2': ink2, '--ink-3': ink3,
    '--surface': surface, '--surface-2': surface2, '--surface-3': surface3,
    '--card': card, '--line': line, '--line-2': line2,
    '--success': '#1F8A5B', '--danger': '#C84B3F', '--warning': '#C9892A',
    '--heraldic-green': '#009944', '--heraldic-blue': '#0093DD', '--heraldic-red': '#E60000',
    '--radius': radius + 'px',
    '--radius-sm': Math.max(4, radius - 6) + 'px',
    '--radius-lg': (radius + 8) + 'px',
    '--font': f.stack,
    '--font-display': d.stack,
  };
}

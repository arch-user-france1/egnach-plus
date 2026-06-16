// ============================================================================
// Glas-Token (Variante B) — «Liquid Glass»
// ----------------------------------------------------------------------------
// Werte aus dem Design-Handoff. Sie leiten sich via color-mix aus `--card` /
// `--surface` ab und passen sich daher automatisch an Hell-/Dunkel-Theme an.
// `backdrop-filter` ≈ iOS .ultraThinMaterial / Android RenderEffect-Blur.
// ============================================================================
export const AB_GLASS_BG   = 'color-mix(in srgb, var(--card) 56%, transparent)';
export const AB_PANEL_BG   = 'color-mix(in srgb, var(--card) 70%, transparent)';
export const AB_GLASS_BLUR = 'saturate(180%) blur(22px)';
export const AB_GLASS_RIM  = '1px solid rgba(255,255,255,0.45)';
export const AB_GLASS_LIFT =
  '0 12px 34px rgba(15,30,55,0.18), 0 3px 10px rgba(15,30,55,0.10), inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(255,255,255,0.16)';

// Getönter Verlaufs-Hintergrund — gibt dem Glas etwas zum Brechen.
export const AB_BG =
  'linear-gradient(176deg, var(--primary-tint) 0%, var(--surface) 18%, var(--surface) 66%, var(--accent-tint) 126%)';

// Wiederverwendbarer Frost-Panel-Stil für Karten/Overlays.
export const abPanel = {
  background: AB_PANEL_BG,
  backdropFilter: AB_GLASS_BLUR, WebkitBackdropFilter: AB_GLASS_BLUR,
  border: AB_GLASS_RIM,
  boxShadow: '0 6px 20px rgba(15,30,55,0.10), inset 0 1px 0 rgba(255,255,255,0.5)',
};

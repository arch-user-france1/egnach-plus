// ============================================================================
// MODEL · Analytik (A/B-Test-Messung)
// ----------------------------------------------------------------------------
// Im Prototyp wird die Produktiv-Telemetrie durch ein kleines, persistiertes
// Ereignis-Log ersetzt. Es hält fest, welche Layout-Variante ein Nutzer sieht
// (Exposure/Assignment) und markiert die wichtigsten Funnel-Ereignisse mit der
// aktiven `layoutVariant`, damit der A/B-Test messbar ist (Hilfe geöffnet,
// Erstellen-Flow geöffnet, Teilnahme zugesagt …).
// In Produktion würde `track()` an einen Experiment-/Analytics-Dienst senden.
// ============================================================================
const LOG_KEY = 'egnach_analytics';
const MAX_ENTRIES = 200;

function load() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch { return []; }
}

let log = load();
// Pro Session nur einmal pro Variante eine Exposure loggen.
const exposed = new Set();

/** Ein Funnel-/Telemetrie-Ereignis aufzeichnen (mit aktiver Variante taggen). */
export function track(event, props = {}) {
  const entry = { event, ...props, ts: Date.now() };
  log = [...log, entry].slice(-MAX_ENTRIES);
  try { localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch { /* Prototyp: Speicherfehler ignorieren */ }
  if (typeof console !== 'undefined') console.info('[analytics]', event, props);
  return entry;
}

/** Exposure-Ereignis loggen, sobald ein Nutzer eine Variante erstmals sieht. */
export function trackExposureOnce(variant) {
  if (!variant || exposed.has(variant)) return;
  exposed.add(variant);
  track('layout_exposure', { variant });
}

/** Das aktuelle Ereignis-Log (für Debug/Auswertung im Prototyp). */
export function getAnalyticsLog() {
  return log;
}

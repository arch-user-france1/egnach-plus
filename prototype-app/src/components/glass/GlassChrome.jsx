/* eslint-disable react-refresh/only-export-components --
   Provider + zugehörige Hooks gehören hier bewusst zusammen; betrifft nur Dev-HMR. */
import { createContext, useContext, useEffect, useRef, useState } from 'react';

// ============================================================================
// Glass-Chrome-Kontext — Seiten-Aktionen für die untere Glas-Leiste
// ----------------------------------------------------------------------------
// In der Glass-Variante bleibt die schwebende Navigation IMMER sichtbar — auch
// auf Seiten mit eigener Hauptaktion (Inserat erstellen, Anlass melden, Detail-
// Seiten …). Damit Navigation und Aktion sich den knappen Platz unten teilen,
// melden solche Seiten ihre Aktion(en) über diesen Kontext an; die untere Leiste
// (`GlassBottomBar`) rendert dann eine kompakte (scrollbare) Navigation neben
// beschrifteten Glas-Aktionsknöpfen.
// ============================================================================
const Ctx = createContext(null);

export function GlassChromeProvider({ children }) {
  const [actions, setActions] = useState(null);
  return <Ctx.Provider value={{ actions, setActions }}>{children}</Ctx.Provider>;
}

export function useGlassChrome() {
  return useContext(Ctx) || { actions: null, setActions: () => {} };
}

// Signatur aus den darstellungsrelevanten Feldern (ohne onClick), damit wir nur
// dann neu setzen, wenn sich Beschriftung/Icon/Zustand ändern.
function signatureOf(actions) {
  if (!actions) return '';
  return actions.map(a => `${a.key || a.label}|${a.label}|${a.icon || ''}|${a.tone || ''}|${a.disabled ? 1 : 0}`).join('~');
}

/**
 * Screens rufen diesen Hook auf, um ihre Hauptaktion(en) für die untere
 * Glas-Leiste bereitzustellen. `enabled` = nur in der Glass-Variante aktiv.
 * onClick wird über eine Ref immer frisch aufgerufen (keine veralteten Closures).
 */
export function useGlassPageActions(actions, enabled = true) {
  const { setActions } = useGlassChrome();
  const ref = useRef(actions);
  // onClick-Closures aktuell halten, ohne die Ref während des Renderns zu mutieren.
  useEffect(() => { ref.current = actions; });
  const sig = enabled ? signatureOf(actions) : '';

  useEffect(() => {
    if (!enabled || !actions || actions.length === 0) {
      setActions(null);
      return undefined;
    }
    const wrapped = actions.map((a, i) => ({
      ...a,
      onClick: (...args) => ref.current?.[i]?.onClick?.(...args),
    }));
    setActions(wrapped);
    return () => setActions(null);
    // Bewusst nur von der Signatur abhängig — onClick bleibt über die Ref aktuell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sig, setActions]);
}

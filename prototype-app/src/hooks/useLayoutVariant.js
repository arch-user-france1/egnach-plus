// ============================================================================
// VIEW-ANBINDUNG · Aktive Layout-Variante (A/B-Test)
// ----------------------------------------------------------------------------
// Liefert die aufgelöste Variante ('classic' | 'glass') und rendert die View
// neu, sobald sich Override oder Nutzer (A/B-Bucket) ändern. Der AppShell
// entscheidet damit an genau einer Stelle, welche Navigations-Chrome und
// welche Browse-Screens gerendert werden.
// ============================================================================
import { useSyncExternalStore } from 'react';
import { subscribe, resolveLayoutVariant } from '../model/store.js';

export function useLayoutVariant() {
  return useSyncExternalStore(subscribe, resolveLayoutVariant);
}

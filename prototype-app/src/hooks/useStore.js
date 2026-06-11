// ============================================================================
// VIEW-ANBINDUNG (MVC)
// ----------------------------------------------------------------------------
// Dieser Hook verbindet die Views (Screens/Komponenten) mit Model und
// Controller: Die View beobachtet das Model über useSyncExternalStore
// (Observer-Muster) und löst Änderungen ausschliesslich über die
// Controller-Aktionen aus. Render-Fluss: Aktion → Model ändert Zustand →
// Model benachrichtigt → View rendert neu.
// ============================================================================
import { useSyncExternalStore } from 'react';
import { getState, subscribe } from '../model/store.js';
import { actions } from '../controller/appController.js';

export function useStore() {
  const state = useSyncExternalStore(subscribe, getState);
  return { state, actions };
}

// ============================================================================
// CONTROLLER (MVC)
// ----------------------------------------------------------------------------
// Der Controller nimmt Benutzerinteraktionen aus den Views entgegen
// (Button-Klicks, Formular-Eingaben) und übersetzt sie in Operationen auf
// dem Model. Die Views kennen nur diese Aktionen — nie die interne
// Datenhaltung oder Persistenz des Models.
// ============================================================================
import * as model from '../model/store.js';

export const actions = {
  /** Onboarding abschliessen und gewählte Sprache übernehmen. */
  completeOnboarding: model.completeOnboarding,
  /** Benutzerprofil (Name, Quartier, Verifizierung) aktualisieren. */
  setUser: model.setUser,
  /** Textskalierung («Grosser Text», Barrierefreiheit) setzen. */
  setTextScale: model.setTextScale,
  /** Inserat als Favorit markieren / Markierung entfernen. */
  toggleFavorite: model.toggleFavorite,
  /** Anlass-Teilnahme zusagen / Zusage zurückziehen. */
  toggleRsvp: model.toggleRsvp,
  /** Chat-Nachricht senden (optional mit Übersetzung und Inserat-Bezug). */
  sendMessage: model.sendMessage,
  /** Verfügbarkeits-Slots für ein Datum speichern. */
  saveAvailability: model.saveAvailability,
  /** Neues Inserat publizieren. */
  addListing: model.addListing,
  /** Bestehendes eigenes Inserat bearbeiten. */
  updateListing: model.updateListing,
  /** Eigenes Inserat löschen. */
  removeListing: model.removeListing,
  /** Neuen Anlass erstellen. */
  addEvent: model.addEvent,
  /** Inhalt (Inserat, Anlass, Chat) melden. */
  submitReport: model.submitReport,
  /** Prototyp auf Werkszustand zurücksetzen. */
  reset: model.reset,
};

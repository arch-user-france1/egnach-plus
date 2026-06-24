import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

// ─── Karten-Vorschau (MapItem) ──────────────────────────────────────────────
// Kleine, sofort sichtbare Karte in der Inserat-Detailansicht. Sie zeigt den
// Standort direkt als Mini-Karte (statt nur als Icon-Knopf, der in den
// Usability-Tests oft übersehen wurde) und führt per Klick auf die volle Karte.
//
// - Skeleton-Ladezustand, solange die Kartenkacheln laden oder kein Internet
//   verfügbar ist (Leaflet nicht geladen → Vorschau bleibt im Skeleton, die
//   Adresse ist trotzdem direkt lesbar).
// - Die Karte selbst ist nicht interaktiv; der ganze Block ist ein Knopf.
export default function MapPreview({ pos, address, neighborhood, distance, onClick }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!ref.current || mapRef.current || !window.L || !pos) return;

    const map = window.L.map(ref.current, {
      center: pos, zoom: 15,
      zoomControl: false, attributionControl: false,
      dragging: false, touchZoom: false, scrollWheelZoom: false,
      doubleClickZoom: false, boxZoom: false, keyboard: false,
    });
    mapRef.current = map;

    const tiles = window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    tiles.on('load', () => { setReady(true); setOffline(false); });
    // Bei Internetausfall laden die Kacheln nicht → im Skeleton bleiben und
    // einen Offline-Hinweis zeigen (die Adresse bleibt trotzdem lesbar).
    tiles.on('tileerror', () => { if (!navigator.onLine) setOffline(true); });
    tiles.addTo(map);

    window.L.marker(pos, {
      interactive: false,
      icon: window.L.divIcon({
        className: '',
        html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:#0093DD;border:2.5px solid #fff;box-shadow:0 4px 10px rgba(15,30,55,0.28);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:#fff;font-size:12px;">🏷️</div></div>`,
        iconSize: [30, 30], iconAnchor: [15, 30],
      }),
    }).addTo(map);

    // Fallback: Falls das load-Event ausbleibt (Cache), trotzdem aufdecken —
    // aber nur, wenn wir online sind (offline bleibt der Skeleton sichtbar).
    const t = setTimeout(() => { if (navigator.onLine) setReady(true); }, 1200);
    return () => { clearTimeout(t); map.remove(); mapRef.current = null; };
  }, [pos]);

  return (
    <button
      onClick={onClick}
      aria-label="Standort auf der Karte ansehen"
      style={{
        display: 'block', width: '100%', padding: 0, border: '1px solid var(--line)',
        borderRadius: 'var(--radius)', overflow: 'hidden', background: 'var(--card)',
        cursor: 'pointer', textAlign: 'left',
      }}
    >
      <div style={{ position: 'relative', height: 150 }}>
        <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
        {!ready && (
          <div className="egnach-skeleton" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name="map" size={26} stroke={1.6} color="var(--ink-3)" />
            {offline && (
              <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>Karte offline – Adresse unten</span>
            )}
          </div>
        )}
        {/* «Öffnen»-Hinweis, damit der Kartencharakter sofort klar ist */}
        <div style={{
          position: 'absolute', right: 10, bottom: 10, zIndex: 500,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 12px', borderRadius: 16,
          background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(6px)',
          boxShadow: '0 2px 8px rgba(15,30,55,0.18)',
          fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--primary)',
        }}>
          <Icon name="map" size={14} stroke={2} color="var(--primary)" /> Karte öffnen
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px' }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="pin" size={16} stroke={2} color="var(--primary)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {address || neighborhood}
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
            {neighborhood}{distance ? ` · ${distance} entfernt` : ''}
          </div>
        </div>
        <Icon name="chevron" size={15} stroke={2} color="var(--ink-3)" />
      </div>
    </button>
  );
}

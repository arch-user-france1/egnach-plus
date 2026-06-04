import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, HScroll } from '../components/index.js';
import Chip from '../components/Chip.jsx';
import Badge from '../components/Badge.jsx';
import Photo from '../components/Photo.jsx';
import TabBar from '../components/TabBar.jsx';
import Icon from '../components/Icon.jsx';
import Button from '../components/Button.jsx';

const EGNACH = [47.5474, 9.3838];
const PEEK_H = 192;
const FULL_H = 520;

const MAP_PINS = [
  { id: 'ev1', kind: 'event', pos: [47.5475, 9.3865], title: 'Hafenfest am Bodensee', sub: 'Sa, 14. Juni · 14:00', meta: '600 m', tone: 'lake', desc: 'Das traditionelle Hafenfest mit Live-Musik, Foodständen der Dorfvereine, Kinderprogramm und Bootsfahrten ab Hafen. Ab 21 Uhr grosses Seefeuerwerk.' },
  { id: 'ev3', kind: 'event', pos: [47.5455, 9.3795], title: 'Sprachcafé DE/EN',     sub: 'Do, 19:00 · Bibliothek',   meta: '1.1 km', tone: 'moss', desc: 'Offenes Gesprächsformat für alle, die Deutsch oder Englisch üben möchten. Kaffee und Kuchen inklusive. Für alle Sprachniveaus offen.' },
  { id: 'ev2', kind: 'event', pos: [47.5510, 9.3920], title: 'Vereinsapero TVE',     sub: 'Fr, 18:30 · Turnhalle',    meta: '1.6 km', tone: 'sand', desc: 'Jährlicher Volkslauf rund ums Schulhaus mit Kategorien für Kinder, Jugendliche und Erwachsene. Anmeldung vor Ort möglich.' },
  { id: 'l4',  kind: 'job',   pos: [47.5495, 9.3820], title: 'Gartenarbeit am Sa.', sub: 'CHF 35 / Std.',             meta: '0.5 km', tone: 'moss', desc: 'Hilfe beim Unkraut jäten, Rasenmähen und Heckenschneiden. Werkzeug vorhanden, flexibel am Wochenende.' },
  { id: 'l2',  kind: 'job',   pos: [47.5440, 9.3870], title: 'Hund hüten 3 Tage',  sub: 'CHF 25 / Tag',              meta: '1.4 km', tone: 'sand', desc: 'Freundlicher Labrador, stubenrein. Braucht zweimal tägliche Spaziergänge, Futter ist vorhanden.' },
  { id: 'l3',  kind: 'job',   pos: [47.5480, 9.3760], title: 'Umzugshilfe gesucht', sub: 'CHF 30 / Std.',            meta: '2.0 km', tone: 'lake', desc: 'Umzug von 3-Zimmer-Wohnung, ca. 4 Stunden. Möbelwagen wird gestellt, Verpflegung inklusive.' },
];

function makePin(kind, isActive) {
  if (!window.L) return null;
  const size = isActive ? 38 : 30;
  return window.L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${kind === 'event' ? '#009944' : '#0093DD'};border:2.5px solid #fff;box-shadow:0 4px 10px rgba(15,30,55,0.28);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:#fff;font-size:12px;">${kind === 'event' ? '📅' : '💼'}</div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

export default function MapScreen() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const cardRefs = useRef({});
  const [activePin, setActivePin] = useState('ev1');
  const [filter, setFilter] = useState('all');

  // Drawer drag state
  const [drawerProgress, setDrawerProgress] = useState(0);
  const [animating, setAnimating] = useState(false);
  const progressRef = useRef(0);
  const dragStartY = useRef(null);
  const dragStartP = useRef(0);

  const applyProgress = (p) => {
    progressRef.current = p;
    setDrawerProgress(p);
  };

  const snapTo = (target) => {
    setAnimating(true);
    applyProgress(target);
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartY.current = e.clientY;
    dragStartP.current = progressRef.current;
    setAnimating(false);
  };

  const onPointerMove = (e) => {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - e.clientY;
    applyProgress(Math.max(0, Math.min(1, dragStartP.current + dy / (FULL_H - PEEK_H))));
  };

  const onPointerUp = (e) => {
    if (dragStartY.current === null) return;
    const wasTap = Math.abs(e.clientY - dragStartY.current) < 8;
    dragStartY.current = null;
    if (wasTap) {
      snapTo(progressRef.current > 0.5 ? 0 : 1);
    } else {
      snapTo(progressRef.current > 0.38 ? 1 : 0);
    }
  };

  // Derived visuals
  const translateY = (FULL_H - PEEK_H) * (1 - drawerProgress);
  // Sequential crossfade: list fades out first half, detail fades in second half
  const listOpacity = Math.max(0, 1 - drawerProgress * 2);
  const detailOpacity = Math.max(0, drawerProgress * 2 - 1);

  const visible = MAP_PINS.filter(p =>
    filter === 'all' ||
    (filter === 'events' && p.kind === 'event') ||
    (filter === 'jobs' && p.kind === 'job')
  );
  const active = visible.find(p => p.id === activePin) ?? visible[0];
  const detailPath = active
    ? (active.kind === 'event' ? `/anlaesse/${active.id}` : `/marktplatz/${active.id}`)
    : '/anlaesse';

  // Map init
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !window.L) return;

    const map = window.L.map(containerRef.current, {
      center: EGNACH, zoom: 15, zoomControl: false, attributionControl: true,
    });
    mapRef.current = map;

    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(map);

    MAP_PINS.forEach(p => {
      const m = window.L.marker(p.pos, { icon: makePin(p.kind, p.id === 'ev1') }).addTo(map);
      markersRef.current[p.id] = { marker: m, kind: p.kind };
    });

    window.L.marker(EGNACH, {
      interactive: false,
      icon: window.L.divIcon({
        className: '',
        html: `<div style="position:relative;width:44px;height:44px;"><div style="position:absolute;inset:0;border-radius:50%;background:rgba(37,99,168,0.18);animation:egnach-pulse 2s ease-out infinite;"></div><div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;background:#2563A8;border:3px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.25);"></div></div>`,
        iconSize: [44, 44], iconAnchor: [22, 22],
      }),
    }).addTo(map);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Highlight active marker + re-register click handlers with a fresh closure
  useEffect(() => {
    if (!window.L) return;
    Object.entries(markersRef.current).forEach(([id, { marker, kind }]) => {
      marker.setIcon(makePin(kind, id === activePin));
      marker.off('click');
      marker.on('click', () => {
        setActivePin(id);
        mapRef.current?.flyTo(MAP_PINS.find(p => p.id === id).pos, 16);
        if (id === activePin) snapTo(1);
      });
    });
  }, [activePin]);

  // Scroll active card into view
  useEffect(() => {
    cardRefs.current[activePin]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }, [activePin]);

  // Filter marker visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(markersRef.current).forEach(([id, { marker, kind }]) => {
      const show = filter === 'all' || (filter === 'events' && kind === 'event') || (filter === 'jobs' && kind === 'job');
      if (show) { if (!map.hasLayer(marker)) marker.addTo(map); }
      else       { if (map.hasLayer(marker))  map.removeLayer(marker); }
    });
  }, [filter]);

  return (
    <Screen background="var(--surface)">
      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Top chrome */}
        <div style={{ position: 'absolute', top: 8, left: 12, right: 12, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 44, borderRadius: 22, background: 'var(--card)', border: '1px solid var(--line)', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(15,30,55,0.12)' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }} aria-label="Zurück">
              <Icon name="back" size={20} />
            </button>
            <span style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)' }}>Karte · Egnach</span>
            <Icon name="filter" size={18} color="var(--ink)" />
          </div>
          <HScroll gap={6} padding="0">
            <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Alle</Chip>
            <Chip active={filter === 'events'} onClick={() => setFilter('events')} leading={<span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', display: 'inline-block' }} />}>Anlässe</Chip>
            <Chip active={filter === 'jobs'} onClick={() => setFilter('jobs')} leading={<span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} />}>Jobs</Chip>
            <Chip>Heute</Chip>
            <Chip>2 km</Chip>
          </HScroll>
        </div>

        {/* Zoom controls */}
        <div style={{ position: 'absolute', right: 12, top: 110, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[{ icon: 'pin', fn: () => mapRef.current?.flyTo(EGNACH, 16) }, { icon: 'plus', fn: () => mapRef.current?.zoomIn() }].map((c, i) => (
            <button key={i} onClick={c.fn} aria-label={i === 0 ? 'Meinen Standort anzeigen' : 'Hineinzoomen'} style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--card)', border: '1px solid var(--line)', boxShadow: '0 2px 6px rgba(15,30,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink)' }}>
              <Icon name={c.icon} size={18} />
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ position: 'absolute', left: 12, top: 110, zIndex: 400, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 5, boxShadow: '0 2px 6px rgba(15,30,55,0.06)' }}>
          {[['var(--primary)', 4, 5, 'Anlässe'], ['var(--accent)', 2, 2, 'Jobs']].map(([bg, r, _, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: r, background: bg, display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-2)', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom drawer */}
        <div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: FULL_H,
            transform: `translateY(${translateY}px)`,
            transition: animating ? 'transform 0.42s cubic-bezier(0.32,0.72,0,1)' : 'none',
            background: 'var(--card)',
            borderTopLeftRadius: 22, borderTopRightRadius: 22,
            boxShadow: '0 -10px 28px rgba(15,30,55,0.12)',
            zIndex: 400,
            display: 'flex', flexDirection: 'column',
          }}
          onTransitionEnd={() => setAnimating(false)}
        >
          {/* Drag zone: pill + crossfading header */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ padding: '8px 16px 0', cursor: 'grab', touchAction: 'none', flexShrink: 0, userSelect: 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              <div style={{ width: 44, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
            </div>

            <div style={{ position: 'relative', height: 44, marginBottom: 10 }}>
              {/* List header */}
              <div style={{ position: 'absolute', inset: 0, opacity: listOpacity, pointerEvents: listOpacity < 0.05 ? 'none' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{visible.length} in der Nähe</div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>Pin antippen · nach oben ziehen</div>
                </div>
              </div>

              {/* Detail header */}
              <div style={{ position: 'absolute', inset: 0, opacity: detailOpacity, pointerEvents: detailOpacity < 0.05 ? 'none' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge tone={active?.kind === 'event' ? 'primary' : 'accent'} size="sm">
                    {active?.kind === 'event' ? 'Anlass' : 'Job'}
                  </Badge>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)' }}>{active?.meta} entfernt</span>
                </div>
                <button
                  onPointerDown={e => e.stopPropagation()}
                  onClick={() => snapTo(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, color: 'var(--ink-3)' }}
                  aria-label="Schliessen"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>

            {/* List view */}
            <div style={{ position: 'absolute', inset: 0, opacity: listOpacity, pointerEvents: listOpacity < 0.05 ? 'none' : 'auto' }}>
              <HScroll padding="0 16px" gap={10}>
                {visible.map(p => {
                  const on = p.id === activePin;
                  return (
                    <button
                      key={p.id}
                      ref={el => { if (el) cardRefs.current[p.id] = el; }}
                      onClick={() => { setActivePin(p.id); mapRef.current?.flyTo(p.pos, 16); }}
                      style={{ width: 220, flexShrink: 0, border: `1.5px solid ${on ? 'var(--primary)' : 'var(--line)'}`, borderRadius: 'var(--radius)', background: on ? 'var(--primary-tint)' : 'var(--card)', padding: 10, cursor: 'pointer', boxShadow: on ? '0 4px 14px rgba(37,99,168,0.18)' : 'none', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Photo width={54} height={54} tone={p.tone} radius={10} hint={p.kind === 'event' ? 'anlass' : 'job'} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Badge tone={p.kind === 'event' ? 'primary' : 'accent'} size="sm">{p.kind === 'event' ? 'Anlass' : 'Job'}</Badge>
                          <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', marginTop: 2 }}>{p.sub}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                            <Icon name="pin" size={11} color="var(--ink-3)" stroke={2} />
                            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{p.meta}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </HScroll>
            </div>

            {/* Detail view */}
            {active && (
              <div style={{ position: 'absolute', inset: 0, opacity: detailOpacity, pointerEvents: detailOpacity < 0.05 ? 'none' : 'auto', overflowY: 'auto', padding: '0 16px 24px' }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 16, height: 150, flexShrink: 0 }}>
                  <Photo width="100%" height={150} tone={active.tone} radius={0} hint={active.kind === 'event' ? 'anlass' : 'job'} />
                </div>

                <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
                  {active.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  <Icon name={active.kind === 'event' ? 'calendar' : 'euro'} size={13} color="var(--ink-3)" />
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>{active.sub}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-3)', flexShrink: 0, display: 'inline-block' }} />
                  <Icon name="pin" size={11} color="var(--ink-3)" />
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>{active.meta}</span>
                </div>

                <p style={{ margin: '0 0 22px', fontFamily: 'var(--font)', fontSize: 14, lineHeight: 1.65, color: 'var(--ink-2)' }}>
                  {active.desc}
                </p>

                <Button
                  full size="lg" variant="primary"
                  trailing={<Icon name="chevron" size={16} color="#fff" />}
                  onClick={() => navigate(detailPath)}
                >
                  Details ansehen
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TabBar active={0} onNavigate={(p) => navigate(p)} />
    </Screen>
  );
}

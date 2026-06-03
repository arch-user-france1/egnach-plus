import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, HScroll } from '../components/index.js';
import Chip from '../components/Chip.jsx';
import Badge from '../components/Badge.jsx';
import Photo from '../components/Photo.jsx';
import TabBar from '../components/TabBar.jsx';
import Icon from '../components/Icon.jsx';

const EGNACH = [47.5474, 9.3838];

const MAP_PINS = [
  { id: 'e1', kind: 'event', pos: [47.5475, 9.3865], title: 'Hafenfest am Bodensee', sub: 'Sa, 14. Juni · 14:00', meta: '600 m', tone: 'lake' },
  { id: 'e2', kind: 'event', pos: [47.5455, 9.3795], title: 'Sprachcafé DE/EN',     sub: 'Do, 19:00 · Bibliothek', meta: '1.1 km', tone: 'moss' },
  { id: 'e3', kind: 'event', pos: [47.5510, 9.3920], title: 'Vereinsapero TVE',     sub: 'Fr, 18:30 · Turnhalle', meta: '1.6 km', tone: 'sand' },
  { id: 'j1', kind: 'job',   pos: [47.5495, 9.3820], title: 'Gartenarbeit am Sa.',  sub: 'CHF 35 / Std.', meta: '0.5 km', tone: 'moss' },
  { id: 'j2', kind: 'job',   pos: [47.5440, 9.3870], title: 'Hund hüten 3 Tage',   sub: 'CHF 25 / Tag', meta: '1.4 km', tone: 'sand' },
  { id: 'j3', kind: 'job',   pos: [47.5480, 9.3760], title: 'Umzugshilfe gesucht', sub: 'CHF 30 / Std.', meta: '2.0 km', tone: 'lake' },
];

export default function MapScreen() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [activePin, setActivePin] = useState('e1');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !window.L) return;

    const map = window.L.map(containerRef.current, {
      center: EGNACH, zoom: 15, zoomControl: false, attributionControl: true,
    });
    mapRef.current = map;

    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(map);

    const buildPin = (kind, active) => {
      const color = kind === 'event' ? 'var(--primary)' : 'var(--accent)';
      const size = active ? 38 : 30;
      return window.L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${kind==='event'?'#009944':'#0093DD'};border:2.5px solid #fff;box-shadow:0 4px 10px rgba(15,30,55,0.28);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:#fff;font-size:12px;">${kind==='event'?'📅':'💼'}</div></div>`,
        iconSize: [size, size], iconAnchor: [size/2, size],
      });
    };

    MAP_PINS.forEach(p => {
      const m = window.L.marker(p.pos, { icon: buildPin(p.kind, p.id === 'e1') }).addTo(map);
      m.on('click', () => setActivePin(p.id));
      markersRef.current[p.id] = { marker: m, kind: p.kind };
    });

    // "Du bist hier" — user dot
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(markersRef.current).forEach(([id, { marker, kind }]) => {
      const show = filter === 'all' || (filter === 'events' && kind === 'event') || (filter === 'jobs' && kind === 'job');
      if (show) { if (!map.hasLayer(marker)) marker.addTo(map); }
      else       { if (map.hasLayer(marker))  map.removeLayer(marker); }
    });
  }, [filter]);

  const visible = MAP_PINS.filter(p => filter === 'all' || (filter === 'events' && p.kind === 'event') || (filter === 'jobs' && p.kind === 'job'));
  const active = visible.find(p => p.id === activePin) || visible[0];

  return (
    <Screen background="var(--surface)">
      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Top floating chrome */}
        <div style={{ position: 'absolute', top: 8, left: 12, right: 12, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 44, borderRadius: 22, background: 'var(--card)', border: '1px solid var(--line)', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 14px rgba(15,30,55,0.12)' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32 }} aria-label="Zurück">
              <Icon name="back" size={20} />
            </button>
            <span style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)' }}>Karte · Egnach</span>
            <Icon name="filter" size={18} color="var(--ink)" />
          </div>

          <HScroll gap={6} padding="0">
            <Chip active={filter==='all'}    onClick={()=>setFilter('all')}>Alle</Chip>
            <Chip active={filter==='events'} onClick={()=>setFilter('events')} leading={<span style={{ width:8,height:8,borderRadius:4,background:'var(--primary)',display:'inline-block' }}/>}>Anlässe</Chip>
            <Chip active={filter==='jobs'}   onClick={()=>setFilter('jobs')}   leading={<span style={{ width:8,height:8,borderRadius:2,background:'var(--accent)',display:'inline-block' }}/>}>Jobs</Chip>
            <Chip>Heute</Chip>
            <Chip>2 km</Chip>
          </HScroll>
        </div>

        {/* Right side zoom controls */}
        <div style={{ position: 'absolute', right: 12, top: 110, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[{icon:'pin',fn:()=>mapRef.current?.flyTo(EGNACH,16)},{icon:'plus',fn:()=>mapRef.current?.zoomIn()}].map((c,i)=>(
            <button key={i} onClick={c.fn} aria-label={i===0?'Meinen Standort anzeigen':'Hineinzoomen'} style={{ width:42,height:42,borderRadius:12,background:'var(--card)',border:'1px solid var(--line)',boxShadow:'0 2px 6px rgba(15,30,55,0.08)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--ink)' }}>
              <Icon name={c.icon} size={18} />
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ position:'absolute',left:12,top:110,zIndex:400,background:'var(--card)',border:'1px solid var(--line)',borderRadius:10,padding:'8px 10px',display:'flex',flexDirection:'column',gap:5,boxShadow:'0 2px 6px rgba(15,30,55,0.06)' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <span style={{ width:10,height:10,borderRadius:5,background:'var(--primary)',display:'inline-block' }} />
            <span style={{ fontFamily:'var(--font)',fontSize:10,color:'var(--ink-2)',fontWeight:600 }}>Anlässe</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <span style={{ width:10,height:10,borderRadius:2,background:'var(--accent)',display:'inline-block' }} />
            <span style={{ fontFamily:'var(--font)',fontSize:10,color:'var(--ink-2)',fontWeight:600 }}>Jobs</span>
          </div>
        </div>

        {/* Bottom sheet */}
        <div style={{ position:'absolute',left:0,right:0,bottom:0,zIndex:400,background:'var(--card)',borderTopLeftRadius:22,borderTopRightRadius:22,boxShadow:'0 -10px 28px rgba(15,30,55,0.12)',padding:'8px 14px 16px',maxHeight:'46%',display:'flex',flexDirection:'column' }}>
          <div style={{ display:'flex',justifyContent:'center',marginBottom:8 }}>
            <div style={{ width:44,height:4,borderRadius:2,background:'var(--line-2)' }} />
          </div>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,color:'var(--ink)' }}>{visible.length} in der Nähe</div>
              <div style={{ fontFamily:'var(--font)',fontSize:11,color:'var(--ink-3)',marginTop:1 }}>Sortiert nach Distanz</div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:6 }}>
              <Icon name="map" size={14} color="var(--primary)" />
              <span style={{ fontFamily:'var(--font)',fontSize:12,color:'var(--primary)',fontWeight:600 }}>Liste</span>
            </div>
          </div>
          <HScroll padding="0" gap={10}>
            {visible.map(p => {
              const on = p.id === activePin;
              return (
                <button key={p.id} onClick={() => { setActivePin(p.id); mapRef.current?.flyTo(p.pos, 16); }}
                  style={{ width:220,flexShrink:0,border:`1.5px solid ${on?'var(--primary)':'var(--line)'}`,borderRadius:'var(--radius)',background:on?'var(--primary-tint)':'var(--card)',padding:10,cursor:'pointer',boxShadow:on?'0 4px 14px rgba(37,99,168,0.18)':'none',textAlign:'left' }}>
                  <div style={{ display:'flex',gap:10 }}>
                    <Photo width={54} height={54} tone={p.tone} radius={10} hint={p.kind==='event'?'anlass':'job'} />
                    <div style={{ flex:1,minWidth:0 }}>
                      <Badge tone={p.kind==='event'?'primary':'accent'} size="sm">{p.kind==='event'?'Anlass':'Job'}</Badge>
                      <div style={{ fontFamily:'var(--font)',fontSize:13,fontWeight:700,color:'var(--ink)',marginTop:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.title}</div>
                      <div style={{ fontFamily:'var(--font)',fontSize:11,color:'var(--ink-2)',marginTop:2 }}>{p.sub}</div>
                      <div style={{ display:'flex',alignItems:'center',gap:4,marginTop:6 }}>
                        <Icon name="pin" size={11} color="var(--ink-3)" stroke={2} />
                        <span style={{ fontFamily:'var(--font)',fontSize:11,color:'var(--ink-3)' }}>{p.meta}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </HScroll>
        </div>
      </div>

      <TabBar active={0} onNavigate={(p) => navigate(p)} />
    </Screen>
  );
}

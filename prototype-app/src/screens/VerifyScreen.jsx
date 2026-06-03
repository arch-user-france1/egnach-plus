import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

function ScanOverlay({ onDone, type }) {
  const [phase, setPhase] = useState('scanning'); // scanning | processing | done

  function startProcess() {
    setTimeout(() => setPhase('processing'), 2500);
    setTimeout(() => { setPhase('done'); setTimeout(onDone, 900); }, 4200);
  }

  useState(() => { startProcess(); });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(10,14,22,0.97)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Demo badge */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,160,0,0.18)', border: '1px solid rgba(255,160,0,0.5)',
        borderRadius: 999, padding: '6px 14px',
        fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: '#FFA500',
        letterSpacing: 0.5,
      }}>DEMO — Nicht implementiert</div>

      {/* Camera frame */}
      <div style={{ position: 'relative', width: 280, height: type === 'selfie' ? 280 : 175, borderRadius: type === 'selfie' ? '50%' : 12, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', background: '#111' }}>
        {type !== 'selfie' && (
          <div style={{ position: 'absolute', left: 20, right: 20, top: 20, bottom: 20, borderRadius: 6, border: '1.5px dashed rgba(255,255,255,0.4)' }}>
            <div style={{ position: 'absolute', left: 8, top: 8, width: 12, height: 12, borderTop: '2px solid #fff', borderLeft: '2px solid #fff' }} />
            <div style={{ position: 'absolute', right: 8, top: 8, width: 12, height: 12, borderTop: '2px solid #fff', borderRight: '2px solid #fff' }} />
            <div style={{ position: 'absolute', left: 8, bottom: 8, width: 12, height: 12, borderBottom: '2px solid #fff', borderLeft: '2px solid #fff' }} />
            <div style={{ position: 'absolute', right: 8, bottom: 8, width: 12, height: 12, borderBottom: '2px solid #fff', borderRight: '2px solid #fff' }} />
          </div>
        )}

        {phase === 'scanning' && (
          <motion.div
            style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', boxShadow: '0 0 8px var(--primary)' }}
            animate={{ top: ['4px', 'calc(100% - 6px)', '4px'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {phase === 'processing' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)', borderTopColor: 'var(--primary)' }}
            />
          </div>
        )}

        {phase === 'done' && (
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,153,68,0.2)' }}
          >
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="check" size={28} stroke={2.5} color="#fff" />
            </div>
          </motion.div>
        )}
      </div>

      <div style={{ marginTop: 24, fontFamily: 'var(--font)', fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
        {phase === 'scanning' && (type === 'selfie' ? 'Gesicht positionieren…' : 'Vorderseite scannen…')}
        {phase === 'processing' && 'Verarbeitung…'}
        {phase === 'done' && (type === 'selfie' ? 'Selfie erkannt ✓' : 'Ausweis erkannt ✓')}
      </div>
    </motion.div>
  );
}

const CHECKS = [
  { label: 'Vollständiger Name', done: true },
  { label: 'Geburtsdatum', done: true },
  { label: 'Ausweisfoto', done: false },
  { label: 'Foto-Selfie', done: false },
];

function Stepper({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 8px' }}>
      {[1, 2, 3].map(n => {
        const done = n < active, on = n === active;
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? '1' : 'none', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: done ? 'var(--primary)' : on ? 'var(--primary-tint)' : 'var(--card)',
              border: `1.5px solid ${done || on ? 'var(--primary)' : 'var(--line-2)'}`,
              color: done ? '#fff' : on ? 'var(--primary-ink)' : 'var(--ink-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{done ? <Icon name="check" size={14} stroke={2.4} color="#fff" /> : n}</div>
            {n < 3 && <div style={{ flex: 1, height: 2, background: done ? 'var(--primary)' : 'var(--line)' }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function VerifyScreen() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [scanType, setScanType] = useState(null);
  const [idDone, setIdDone] = useState(false);
  const [selfieDone, setSelfieDone] = useState(false);

  function handleScan(type) { setScanType(type); }
  function handleScanDone() {
    if (scanType === 'id') { setIdDone(true); setScanType('selfie'); }
    else { setSelfieDone(true); setScanType(null); }
  }

  function handleFinish() {
    actions.completeOnboarding('de');
    navigate('/home');
  }

  const checks = [
    { label: 'Vollständiger Name', done: true },
    { label: 'Geburtsdatum', done: true },
    { label: 'Ausweisfoto', done: idDone },
    { label: 'Foto-Selfie', done: selfieDone },
  ];

  return (
    <Screen>
      <AnimatePresence>{scanType && <ScanOverlay type={scanType} onDone={handleScanDone} />}</AnimatePresence>

      <TopBar leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />} title="Verifikation" />
      <Body padding="14px 20px 16px">
        <Stepper active={2} />
        <p style={{ margin: '0 0 14px', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>Schritt 2 · Ausweis fotografieren</p>

        <h2 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>
          Bestätige deine Identität.
        </h2>
        <p style={{ margin: '0 0 18px', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          So wissen Nachbarn, dass du in Egnach wohnst. Deine Daten bleiben verschlüsselt — nur deine Verifikation ist sichtbar.
        </p>

        <div style={{ height: 180, borderRadius: 'var(--radius)', background: '#111', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 220, height: 130, borderRadius: 10, border: '2px dashed rgba(255,255,255,0.55)', position: 'relative', background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 8px, transparent 8px 16px)' }}>
            <div style={{ position: 'absolute', left: 12, top: 12, width: 36, height: 46, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ position: 'absolute', left: 60, top: 18, width: 80, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 60, top: 32, width: 50, height: 5, background: 'rgba(255,255,255,0.18)', borderRadius: 2 }} />
            {[[8,8,false,false],[8,null,false,true],[null,8,true,false],[null,null,true,true]].map(([top,bot,isRight,isBottom],i)=>(
              <div key={i} style={{ position:'absolute', top:top??undefined, bottom:bot??undefined, left:isRight?undefined:8, right:isRight?8:undefined, width:14,height:14, borderTop:!isBottom?'2px solid #fff':'none', borderBottom:isBottom?'2px solid #fff':'none', borderLeft:!isRight?'2px solid #fff':'none', borderRight:isRight?'2px solid #fff':'none' }} />
            ))}
          </div>
          <span style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font)', fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>Vorderseite scannen</span>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 10 }}>WAS WIR PRÜFEN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: c.done ? 'var(--primary)' : 'transparent', border: `1.5px solid ${c.done ? 'var(--primary)' : 'var(--line-2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {c.done && <Icon name="check" size={12} stroke={2.6} color="#fff" />}
                </div>
                <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: c.done ? 'var(--ink-2)' : 'var(--ink)', fontWeight: c.done ? 400 : 500 }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <HelpBanner tone="info" title="Sicher & lokal">
            Die Verifizierung erfolgt einmalig und wird verschlüsselt gespeichert. Du erhältst danach das blaue Häkchen «Verifiziert».
          </HelpBanner>
        </div>
      </Body>

      <div style={{ padding: '12px 20px 24px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
        {!idDone && !selfieDone && (
          <Button full size="lg" leading={<Icon name="camera" size={18} color="#fff" />} onClick={() => handleScan('id')}>
            Ausweis fotografieren
          </Button>
        )}
        {idDone && !selfieDone && (
          <Button full size="lg" leading={<Icon name="camera" size={18} color="#fff" />} onClick={() => handleScan('selfie')}>
            Selfie aufnehmen
          </Button>
        )}
        {idDone && selfieDone && (
          <Button full size="lg" onClick={handleFinish}>Verifikation abschliessen</Button>
        )}
        <Button full size="md" variant="ghost" onClick={handleFinish}>Später erledigen</Button>
      </div>
    </Screen>
  );
}

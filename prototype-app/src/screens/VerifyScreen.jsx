import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

function CameraFramePlaceholder({ onDone }) {
  const [done, setDone] = useState(false);

  useState(() => {
    setDone(true)
  }, []);

  useEffect(() => {
    let t = null;
    if (done) t = setTimeout(() => {
      onDone();
    }, 800);
    return () => t ? clearTimeout(t) : undefined
  }, [done, onDone])

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <AnimatePresence>
        {done && (
          <motion.div
            key="green"
            initial={{ scale: 0, borderRadius: '50%' }}
            animate={{ scale: 6, borderRadius: '0%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 80, height: 80,
              marginLeft: -40, marginTop: -40,
              background: 'var(--primary)',
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {done && (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 18 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
          >
            <Icon name="check" size={52} stroke={3} color="#fff" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


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

const CHECKS = [
  { label: 'Vollständiger Name' },
  { label: 'Geburtsdatum' },
  { label: 'Ausweisfoto' },
  { label: 'Foto-Selfie' },
];

export default function VerifyScreen() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [scanning, setScanning] = useState(false);

  function handleScan() { setScanning(true); }

  function handleFinish() {
    actions.completeOnboarding('de');
    navigate('/home');
  }

  return (
    <Screen>
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
          {scanning && <CameraFramePlaceholder onDone={handleFinish} />}
          {!scanning && (
            <>
              <div style={{ width: 220, height: 130, borderRadius: 10, border: '2px dashed rgba(255,255,255,0.55)', position: 'relative', background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 8px, transparent 8px 16px)' }}>
                <div style={{ position: 'absolute', left: 12, top: 12, width: 36, height: 46, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
                <div style={{ position: 'absolute', left: 60, top: 18, width: 80, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 2 }} />
                <div style={{ position: 'absolute', left: 60, top: 32, width: 50, height: 5, background: 'rgba(255,255,255,0.18)', borderRadius: 2 }} />
                {[[8,8,false,false],[8,null,false,true],[null,8,true,false],[null,null,true,true]].map(([top,bot,isRight,isBottom],i)=>(
                  <div key={i} style={{ position:'absolute', top:top??undefined, bottom:bot??undefined, left:isRight?undefined:8, right:isRight?8:undefined, width:14,height:14, borderTop:!isBottom?'2px solid #fff':'none', borderBottom:isBottom?'2px solid #fff':'none', borderLeft:!isRight?'2px solid #fff':'none', borderRight:isRight?'2px solid #fff':'none' }} />
                ))}
              </div>
              <span style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font)', fontSize: 11, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>Vorderseite scannen</span>
            </>
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 10 }}>WAS WIR PRÜFEN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CHECKS.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', border: '1.5px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={12} stroke={2.6} color="#fff" />
                </div>
                <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', fontWeight: 400 }}>{c.label}</span>
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
        <Button full size="lg" leading={<Icon name="camera" size={18} color="#fff" />} onClick={handleScan}>
          Ausweis fotografieren
        </Button>
        <Button full size="md" variant="ghost" onClick={handleFinish}>Später erledigen</Button>
      </div>
    </Screen>
  );
}

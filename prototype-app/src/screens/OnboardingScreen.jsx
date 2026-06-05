import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../components/index.js';
import Button from '../components/Button.jsx';
import Dots from '../components/Dots.jsx';
import Icon from '../components/Icon.jsx';

const STEPS = [
  {
    title: 'Hilf mit. Lass dir helfen.',
    text: 'Entdecke Anlässe, leihe vom Nachbarn, biete deine Hilfe an — alles in Egnach.',
    tone: 'primary',
  },
  {
    title: 'Leihen statt kaufen.',
    text: 'Werkzeuge, Dienste, Gartenprodukte — direkt mit Nachbarn tauschen.',
    tone: 'accent',
  },
  {
    title: 'Sei dabei.',
    text: 'Chat mit Übersetzung in DE, EN, IT, SQ und TR. Niemand bleibt ausgeschlossen.',
    tone: 'success',
  },
  {
    title: 'Das erwartet dich.',
    text: null,
    overview: true,
  },
];

function Illustration({ step }) {
  if (step === 0) return (
    <div style={{ height: 240, borderRadius: 22, background: `linear-gradient(180deg, var(--primary-tint) 0%, #F1E8DA 100%)`, position: 'relative', overflow: 'hidden', border: '1px solid var(--line)' }}>
      <div style={{ position: 'absolute', top: 28, right: 36, width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', opacity: 0.85 }} />
      <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 320 240" preserveAspectRatio="none" width="100%" height="100%">
        <path d="M0 160 Q60 130 120 150 T240 140 T320 150 V200 H0 Z" fill="rgba(62,124,74,0.55)" />
        <path d="M0 180 Q80 160 160 175 T320 172 V200 H0 Z" fill="rgba(62,124,74,0.85)" />
      </svg>
      <div style={{ position: 'absolute', left: 60, bottom: 60, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {[{w:28,h:36,c:'var(--accent)'},{w:22,h:28,c:'#9D3B2B'},{w:30,h:42,c:'var(--accent)'}].map((b,i)=>(
          <div key={i} style={{ width: b.w, height: b.h, background: '#fff', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -(b.h*0.28), left: -2, right: -2, height: b.h*0.28, background: b.c, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 56, background: 'linear-gradient(180deg, rgba(37,99,168,0.35), rgba(37,99,168,0.55))' }} />
    </div>
  );
  if (step === 1) return (
    <div style={{ height: 240, borderRadius: 22, background: 'linear-gradient(180deg, var(--accent-tint) 0%, #F5EDE4 100%)', position: 'relative', overflow: 'hidden', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px' }}>
      {[{icon:'briefcase',label:'Bohrhammer',price:'CHF 12/Tag'},{icon:'paws',label:'Gartenhilfe',price:'CHF 35/Std.'},{icon:'reload',label:'Apfelmost',price:'Tausch'}].map((it,i)=>(
        <div key={i} style={{ flex: 1, background: 'var(--card)', borderRadius: 14, padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, border: '1px solid var(--line)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={it.icon} size={20} stroke={1.8} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink)', textAlign: 'center' }}>{it.label}</div>
          <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--primary)', fontWeight: 600 }}>{it.price}</div>
        </div>
      ))}
    </div>
  );
  if (step === 2) return (
    <div style={{ height: 240, borderRadius: 22, background: 'linear-gradient(180deg, #E6EFF8 0%, #EFE8E2 100%)', position: 'relative', overflow: 'hidden', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {[{f:'DE',t:'SQ'},{f:'SQ',t:'DE'}].map((p,i)=>(
          <div key={i} style={{ background: i===0?'var(--primary)':'var(--card)', border: i===0?'none':'1px solid var(--line)', borderRadius: 14, padding: '10px 16px', maxWidth: 140 }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: i===0?'rgba(255,255,255,0.75)':'var(--ink-3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="language" size={12} stroke={2} color={i===0?'rgba(255,255,255,0.75)':'var(--ink-3)'} />
              {p.f} → {p.t}
            </div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: i===0?'#fff':'var(--ink)' }}>
              {i===0?'Hoi! Ist der Bohrhammer frei?':'Tungjatjeta! A është...'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {['DE','EN','IT','SQ','TR'].map(l=>(
          <div key={l} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, color: 'var(--ink-2)' }}>{l}</div>
        ))}
      </div>
    </div>
  );
  return null;
}

const OVERVIEW_ITEMS = [
  { icon: 'calendar', label: 'Anlässe',  discBg: 'var(--primary-tint)', iconColor: 'var(--primary)' },
  { icon: 'briefcase',label: 'Leihen',   discBg: 'var(--accent-tint)',  iconColor: 'var(--accent)' },
  { icon: 'paws',     label: 'Helfen',   discBg: 'var(--surface-2)',    iconColor: 'var(--ink-2)' },
  { icon: 'map',      label: 'Karte',    discBg: 'var(--surface-2)',    iconColor: 'var(--ink-2)' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isOverview = step === 3;
  const isLast = step === STEPS.length - 1;

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '12px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', cursor: 'pointer', padding: '4px 0', minHeight: 44, display: 'flex', alignItems: 'center' }}>Überspringen</button>
      </div>

      <div style={{ flex: 1, padding: '14px 28px 0', display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {!isOverview && <Illustration step={step} />}
            {isOverview && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {OVERVIEW_ITEMS.map((it, i) => (
                  <div key={i} style={{ borderRadius: 20, background: 'var(--card)', border: '1px solid var(--line)', padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 72, height: 72, borderRadius: '50%', background: it.discBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={it.icon} size={28} stroke={1.8} color={it.iconColor} />
                    </div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{it.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={'text-' + step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, delay: 0.08 }}
          >
            <h2 style={{ margin: '12px 0 8px', fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1.15, fontWeight: 700, letterSpacing: -0.5, color: 'var(--ink)' }}>
              {STEPS[step].title}
            </h2>
            {STEPS[step].text && (
              <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 16, lineHeight: 1.55, color: 'var(--ink-2)' }}>
                {STEPS[step].text}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ padding: '18px 24px 28px', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
        <Dots count={4} active={step} accent="var(--primary)" />
        <Button
          full size="lg"
          trailing={!isLast ? <Icon name="arrowSmall" size={18} color="#fff" stroke={2.2} /> : undefined}
          onClick={() => isLast ? navigate('/register') : setStep(s => s + 1)}
        >
          {isLast ? 'Konto erstellen' : 'Weiter'}
        </Button>
      </div>
    </Screen>
  );
}

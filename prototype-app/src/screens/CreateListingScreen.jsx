import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const TYPES = [
  { icon: 'briefcase', label: 'Leihen' },
  { icon: 'paws',      label: 'Dienste' },
  { icon: 'reload',    label: 'Tausch' },
  { icon: 'car',       label: 'Jobs' },
];

const TYPE_TONES = { Leihen: 'sand', Dienste: 'lake', Tausch: 'moss', Jobs: 'rose' };
const MONTHS = ['JAN','FEB','MRZ','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ'];

function parseDateDE(str) {
  const parts = (str || '').split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (!isNaN(day) && !isNaN(month) && month >= 1 && month <= 12)
      return { day, month: MONTHS[month - 1] };
  }
  return null;
}

const stepVariants = {
  enter:  (d) => ({ x: d > 0 ?  40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? -40 :  40, opacity: 0 }),
};
const stepTransition = { type: 'tween', ease: 'easeInOut', duration: 0.22 };

export default function CreateListingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: storeState, actions } = useStore();

  const defaultType = TYPES.find(t => t.label === location.state?.defaultType)
    ? location.state.defaultType : 'Leihen';

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [type, setType] = useState(defaultType);
  const [form, setForm] = useState({ title: '', description: '', price: '', date: '' });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: null }));
  };

  function validate() {
    const e = {};
    if (!form.title.trim())        e.title = 'Bitte einen Titel eingeben';
    if (form.title.length > 60)    e.title = 'Max. 60 Zeichen';
    if (!form.description.trim())  e.description = 'Bitte eine Beschreibung eingeben';
    if (!form.price.trim())        e.price = 'Bitte einen Preis eingeben';
    if (!form.date.trim())         e.date = 'Bitte ein Datum eingeben';
    return e;
  }

  function go(delta) {
    setDirection(delta);
    setStep(s => s + delta);
  }

  function handleNext() {
    if (step === 0) {
      const e = validate();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
    }
    if (step === 1) {
      const parsed = parseDateDE(form.date);
      const { initials = 'AN', name = 'Anonym', neighborhood = 'Egnach', verified = false } = storeState.user;
      actions.addListing({
        id: 'ul_' + Date.now(),
        title: form.title.trim(),
        cat: type,
        neighborhood,
        price: form.price.trim().startsWith('CHF') ? form.price.trim() : `CHF ${form.price.trim()}`,
        rating: 0, reviews: 0, avatar: initials, ownerName: name,
        tone: TYPE_TONES[type] || 'sand', verified,
        available: parsed ? `Ab ${parsed.day}. ${parsed.month}` : `Ab ${form.date}`,
        handover: 'Persönlich', deposit: '—', languages: 'DE',
        description: form.description.trim(), distance: '0 m',
      });
    }
    go(1);
  }

  if (step === 2) return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="close" onClick={() => navigate('/marktplatz')} label="Schliessen" />} title="Neues Inserat" />
      <Body padding="24px 20px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 40 }}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
            style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="check" size={36} stroke={2.5} color="#fff" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.26 }}
            style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}
          >
            Inserat publiziert!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.24 }}
            style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}
          >
            Dein Inserat ist jetzt für Nachbarn aus Egnach sichtbar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.22 }}
          >
            <Button size="lg" onClick={() => navigate('/marktplatz')}>Zum Marktplatz</Button>
          </motion.div>
        </div>
      </Body>
    </Screen>
  );

  return (
    <Screen background="var(--surface)">
      <TopBar
        leading={<IconButton name="close" onClick={() => navigate(-1)} label="Schliessen" />}
        title="Neues Inserat"
        trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>Entwurf</span>}
      />

      <Body padding="14px 18px 20px">
        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>
              SCHRITT {step + 1} VON 3
            </span>
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>ca. 2 min</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }} role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3} aria-label={`Schritt ${step + 1} von 3`}>
            {[0,1,2].map(i => (
              <motion.div
                key={i}
                animate={{ background: i <= step ? 'var(--primary)' : 'var(--line)' }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, height: 4, borderRadius: 2 }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
          >
            {step === 0 && <>
              <h2 style={{ margin: '6px 0 4px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>
                Was bietest du an?
              </h2>
              <p style={{ margin: '0 0 14px', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)' }}>
                Pflichtfelder sind mit * markiert.
              </p>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Art des Inserats</span>
                  <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TYPES.map(t => {
                    const active = type === t.label;
                    return (
                      <motion.button
                        key={t.label}
                        onClick={() => setType(t.label)}
                        aria-pressed={active}
                        whileTap={{ scale: 0.96 }}
                        animate={{
                          background: active ? 'var(--primary-tint)' : 'var(--card)',
                          borderColor: active ? 'var(--primary)' : 'var(--line)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                          padding: 14, borderRadius: 'var(--radius-sm)',
                          border: `1.5px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                          display: 'flex', flexDirection: 'column', gap: 8,
                          cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <Icon name={t.icon} size={22} stroke={1.8} color={active ? 'var(--primary)' : 'var(--ink)'} />
                        <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: active ? 'var(--primary-ink)' : 'var(--ink)' }}>
                          {t.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Titel" required value={form.title} onChange={set('title')} error={errors.title}
                  hint={errors.title || `Max. 60 Zeichen · ${form.title.length} / 60`}
                  placeholder="z.B. Bohrhammer Bosch GBH 2-26" />
                <Field label="Beschreibung" required multiline rows={4} value={form.description} onChange={set('description')}
                  error={errors.description} hint={errors.description || `${form.description.length} / 500`}
                  placeholder="Beschreibe dein Angebot…" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Preis" required value={form.price} onChange={set('price')}
                    error={errors.price} hint={errors.price || 'CHF / Einheit'}
                    trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>CHF</span>} />
                  <Field label="Verfügbar ab" required value={form.date} onChange={set('date')}
                    error={errors.date} hint={errors.date || 'TT.MM.JJJJ'} placeholder="11.06.2026"
                    trailing={<Icon name="calendar" size={14} color="var(--ink-3)" />} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 6 }}>Fotos</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Photo width={72} height={72} tone="sand" radius={10} hint="01" />
                    <div style={{ width: 72, height: 72, borderRadius: 10, border: '1.5px dashed var(--line-2)', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--ink-3)', cursor: 'pointer' }}>
                      <Icon name="plus" size={20} />
                      <span style={{ fontFamily: 'var(--font)', fontSize: 10 }}>Foto hinzufügen</span>
                    </div>
                  </div>
                </div>
                <HelpBanner tone="info" title="Tipp">
                  Klare Fotos und ein präziser Titel erhöhen deine Antwortrate um über 60%.
                </HelpBanner>
              </div>
            </>}

            {step === 1 && <>
              <h2 style={{ margin: '6px 0 14px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>
                Überprüfen & Publizieren
              </h2>
              <div style={{ padding: 16, borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>VORSCHAU</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{form.title || 'Kein Titel'}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>
                  {form.price ? `CHF ${form.price}` : '—'} · {type}
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{form.description || 'Keine Beschreibung'}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>Verfügbar ab: {form.date}</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <HelpBanner tone="success" title="Bereit zur Publikation">
                  Dein Inserat wird nach der Überprüfung für alle Nachbarn in Egnach sichtbar.
                </HelpBanner>
              </div>
            </>}
          </motion.div>
        </AnimatePresence>
      </Body>

      <div style={{ padding: '12px 16px 22px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <Button full size="lg" variant="outline" onClick={() => step === 0 ? navigate(-1) : go(-1)}>
            {step === 0 ? 'Entwurf speichern' : 'Zurück'}
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <Button full size="lg" trailing={<Icon name="arrowSmall" size={18} color="#fff" stroke={2.2} />} onClick={handleNext}>
            {step === 1 ? 'Publizieren' : 'Weiter'}
          </Button>
        </div>
      </div>
    </Screen>
  );
}

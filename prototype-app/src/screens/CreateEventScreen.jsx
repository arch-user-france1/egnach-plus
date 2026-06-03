import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const EVENT_CATS = ['Gemeinde', 'Sport', 'Familie', 'Senioren', 'Sprache', 'Kultur'];
const CAT_ICONS = { Gemeinde: 'shield', Sport: 'star', Familie: 'home', Senioren: 'user', Sprache: 'language', Kultur: 'bell' };
const MONTH_LABELS = ['JAN','FEB','MRZ','APR','MAI','JUN','JUL','AUG','SEP','OKT','NOV','DEZ'];

function parseDateDE(str) {
  const parts = (str || '').split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    if (!isNaN(day) && !isNaN(month) && month >= 1 && month <= 12)
      return { day, month: MONTH_LABELS[month - 1], monthNum: month };
  }
  return null;
}

const stepVariants = {
  enter:  (d) => ({ x: d > 0 ?  40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? -40 :  40, opacity: 0 }),
};
const stepTransition = { type: 'tween', ease: 'easeInOut', duration: 0.22 };

export default function CreateEventScreen() {
  const navigate = useNavigate();
  const { state: storeState, actions } = useStore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', address: '', description: '', free: true, price: '' });
  const [selectedCats, setSelectedCats] = useState([]);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(f => ({ ...f, [k]: val }));
    setErrors(er => ({ ...er, [k]: null }));
  };

  function toggleCat(cat) {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setErrors(er => ({ ...er, cats: null }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim())        e.title = 'Bitte einen Titel eingeben';
    if (!form.date.trim())         e.date = 'Bitte ein Datum eingeben';
    else if (!parseDateDE(form.date)) e.date = 'Format: TT.MM.JJJJ';
    if (!form.time.trim())         e.time = 'Bitte eine Uhrzeit eingeben';
    if (!form.location.trim())     e.location = 'Bitte einen Veranstaltungsort eingeben';
    if (!form.description.trim())  e.description = 'Bitte eine Beschreibung eingeben';
    if (selectedCats.length === 0) e.cats = 'Bitte mindestens eine Kategorie wählen';
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
      actions.addEvent({
        id: 'ue_' + Date.now(),
        title: form.title.trim(),
        date: form.date,
        time: form.time,
        dateShort: parsed ? `${MONTH_LABELS[parsed.monthNum - 1].substring(0,2)} · ${form.time}` : form.time,
        location: form.location.trim(),
        address: form.address.trim() || form.location.trim(),
        cats: selectedCats.length > 0 ? selectedCats : ['Gemeinde'],
        tone: 'lake', free: form.free, languages: 'DE',
        description: form.description.trim(),
        organizer: storeState.user.name || 'Anonym',
        attendees: 0,
        month: parsed ? parsed.month : '',
        day: parsed ? parsed.day : 0,
        neighbors: 0,
      });
    }
    go(1);
  }

  if (step === 2) return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="close" onClick={() => navigate('/anlaesse')} label="Schliessen" />} title="Neuer Anlass" />
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
            Anlass publiziert!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.24 }}
            style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}
          >
            Dein Anlass ist jetzt für alle Nachbarn in Egnach sichtbar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.22 }}
          >
            <Button size="lg" onClick={() => navigate('/anlaesse')}>Zu den Anlässen</Button>
          </motion.div>
        </div>
      </Body>
    </Screen>
  );

  return (
    <Screen background="var(--surface)">
      <TopBar
        leading={<IconButton name="close" onClick={() => navigate(-1)} label="Schliessen" />}
        title="Neuer Anlass"
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
                Was veranstaltest du?
              </h2>
              <p style={{ margin: '0 0 16px', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)' }}>
                Pflichtfelder sind mit * markiert.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Titel" required value={form.title} onChange={set('title')}
                  error={errors.title} hint={errors.title || `Max. 80 Zeichen · ${form.title.length} / 80`}
                  placeholder="z.B. Sommerfest im Dorfpark" />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Datum" required value={form.date} onChange={set('date')}
                    error={errors.date} hint={errors.date || 'TT.MM.JJJJ'} placeholder="14.06.2026"
                    trailing={<Icon name="calendar" size={14} color="var(--ink-3)" />} />
                  <Field label="Uhrzeit" required value={form.time} onChange={set('time')}
                    error={errors.time} hint={errors.time || 'HH:MM'} placeholder="18:00"
                    trailing={<Icon name="info" size={14} color="var(--ink-3)" />} />
                </div>

                <Field label="Veranstaltungsort" required value={form.location} onChange={set('location')}
                  error={errors.location} hint={errors.location || 'z.B. Gemeindesaal, Schulhaus, Park'}
                  placeholder="Dorfpark Egnach"
                  leading={<Icon name="pin" size={16} color="var(--ink-3)" stroke={2} />} />

                <Field label="Adresse" value={form.address} onChange={set('address')}
                  hint="Optional · z.B. Hauptstrasse 7, 9322 Egnach"
                  placeholder="Hauptstrasse 7, 9322 Egnach" />

                {/* Category multi-select */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Kategorien</span>
                    <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {EVENT_CATS.map(cat => {
                      const active = selectedCats.includes(cat);
                      return (
                        <motion.button
                          key={cat}
                          onClick={() => toggleCat(cat)}
                          aria-pressed={active}
                          whileTap={{ scale: 0.94 }}
                          animate={{
                            background: active ? 'var(--primary-tint)' : 'var(--card)',
                            borderColor: active ? 'var(--primary)' : 'var(--line)',
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          style={{
                            padding: '7px 14px', borderRadius: 20, cursor: 'pointer',
                            border: `1.5px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                            fontFamily: 'var(--font)', fontSize: 13,
                            fontWeight: active ? 600 : 500,
                            color: active ? 'var(--primary-ink)' : 'var(--ink)',
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          <Icon name={CAT_ICONS[cat]} size={13} stroke={2} color={active ? 'var(--primary)' : 'var(--ink-3)'} />
                          {cat}
                        </motion.button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {errors.cats && (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, overflow: 'hidden' }}
                      >
                        <Icon name="warning" size={12} stroke={2} color="var(--danger)" />{errors.cats}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <Field label="Beschreibung" required multiline rows={4} value={form.description} onChange={set('description')}
                  error={errors.description} hint={errors.description || `${form.description.length} / 600`}
                  placeholder="Was erwartet die Teilnehmenden?…" />

                {/* Free / Paid toggle — role=switch for screen readers (ISO 9241-171) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--card)', border: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>Kostenloser Anlass</div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>Eintritt frei für alle Nachbarn</div>
                  </div>
                  <motion.button
                    role="switch" aria-checked={form.free}
                    onClick={() => setForm(f => ({ ...f, free: !f.free }))}
                    animate={{ background: form.free ? 'var(--primary)' : 'var(--line-2)' }}
                    transition={{ duration: 0.2 }}
                    style={{ width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', padding: 0, position: 'relative', flexShrink: 0 }}
                  >
                    <motion.div
                      animate={{ left: form.free ? 23 : 3 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', position: 'absolute', top: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                    />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {!form.free && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Field label="Preis / Eintritt" value={form.price} onChange={set('price')}
                        hint="CHF pro Person" placeholder="z.B. 15.00"
                        trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>CHF</span>} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <HelpBanner tone="info" title="Tipp">
                  Anlässe mit vollständiger Beschreibung und Adresse erhalten deutlich mehr Anmeldungen.
                </HelpBanner>
              </div>
            </>}

            {step === 1 && <>
              <h2 style={{ margin: '6px 0 14px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>
                Überprüfen & Publizieren
              </h2>
              <div style={{ padding: 16, borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>VORSCHAU</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>{form.title}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Icon name="calendar" size={13} color="var(--ink-3)" stroke={2} />
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>{form.date} · {form.time} Uhr</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Icon name="pin" size={13} color="var(--ink-3)" stroke={2} />
                  <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>{form.location}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selectedCats.map(c => (
                    <span key={c} style={{ padding: '3px 10px', borderRadius: 12, background: 'var(--primary-tint)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--primary-ink)' }}>{c}</span>
                  ))}
                  {form.free
                    ? <span style={{ padding: '3px 10px', borderRadius: 12, background: 'var(--accent-tint)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>Kostenlos</span>
                    : <span style={{ padding: '3px 10px', borderRadius: 12, background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)' }}>CHF {form.price}</span>
                  }
                </div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{form.description}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>Organisiert von {storeState.user.name || 'dir'}</div>
              </div>
              <div style={{ marginTop: 16 }}>
                <HelpBanner tone="success" title="Bereit zur Publikation">
                  Dein Anlass wird sofort für alle Nachbarn in Egnach sichtbar.
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

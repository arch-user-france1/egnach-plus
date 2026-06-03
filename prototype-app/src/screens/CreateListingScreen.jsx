import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import HelpBanner from '../components/HelpBanner.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';

const TYPES = [
  { icon: 'briefcase', label: 'Leihen' },
  { icon: 'paws', label: 'Dienste' },
  { icon: 'reload', label: 'Tausch' },
  { icon: 'car', label: 'Jobs' },
];

export default function CreateListingScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('Leihen');
  const [form, setForm] = useState({ title: '', description: '', price: '', date: '' });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (step === 2) return (
    <Screen background="var(--surface)">
      <TopBar leading={<IconButton name="close" onClick={() => navigate(-1)} label="Schliessen" />} title="Neues Inserat" />
      <Body padding="24px 20px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={36} stroke={2.5} color="#fff" />
          </div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>Inserat publiziert!</h2>
          <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>Dein Inserat ist jetzt für Nachbarn aus Egnach sichtbar.</p>
          <Button size="lg" onClick={() => navigate('/marktplatz')}>Zum Marktplatz</Button>
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
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>SCHRITT {step + 1} VON 3</span>
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>ca. 2 min</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? 'var(--primary)' : 'var(--line)' }} />)}
          </div>
        </div>

        {step === 0 && <>
          <h2 style={{ margin: '6px 0 14px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>Was bietest du an?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
            {TYPES.map(t => (
              <button key={t.label} onClick={() => setType(t.label)} style={{ padding: 14, borderRadius: 'var(--radius-sm)', background: type === t.label ? 'var(--primary-tint)' : 'var(--card)', border: `1.5px solid ${type === t.label ? 'var(--primary)' : 'var(--line)'}`, display: 'flex', flexDirection: 'column', gap: 8, color: type === t.label ? 'var(--primary)' : 'var(--ink)', cursor: 'pointer', textAlign: 'left' }} aria-pressed={type === t.label}>
                <Icon name={t.icon} size={22} stroke={1.8} color={type === t.label ? 'var(--primary)' : 'var(--ink)'} />
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: type === t.label ? 'var(--primary-ink)' : 'var(--ink)' }}>{t.label}</div>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Titel" required value={form.title} onChange={set('title')} hint={`Max. 60 Zeichen · ${form.title.length} / 60`} placeholder="z.B. Bohrhammer Bosch GBH 2-26" />
            <Field label="Beschreibung" required value={form.description} onChange={set('description')} multiline rows={4} hint={`${form.description.length} / 500`} placeholder="Beschreibe dein Angebot…" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Preis" required value={form.price} onChange={set('price')} hint="CHF / Einheit" trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>CHF</span>} />
              <Field label="Verfügbar ab" required value={form.date} onChange={set('date')} hint="TT.MM.JJJJ" trailing={<Icon name="calendar" size={14} color="var(--ink-3)" />} />
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
            <HelpBanner tone="info" title="Tipp">Klare Fotos und ein präziser Titel erhöhen deine Antwortrate um über 60%.</HelpBanner>
          </div>
        </>}

        {step === 1 && <>
          <h2 style={{ margin: '6px 0 14px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)' }}>Überprüfen & Publizieren</h2>
          <div style={{ padding: 16, borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 0.8 }}>VORSCHAU</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{form.title || 'Kein Titel'}</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{form.price ? `CHF ${form.price}` : '—'} · {type}</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{form.description || 'Keine Beschreibung'}</div>
          </div>
          <div style={{ marginTop: 16 }}>
            <HelpBanner tone="success" title="Bereit zur Publikation">Dein Inserat wird nach der Überprüfung für alle Nachbarn in Egnach sichtbar.</HelpBanner>
          </div>
        </>}
      </Body>

      <div style={{ padding: '12px 16px 22px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1 }}><Button full size="lg" variant="outline" onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}>{step === 0 ? 'Entwurf speichern' : 'Zurück'}</Button></div>
        <div style={{ flex: 1 }}><Button full size="lg" trailing={<Icon name="arrowSmall" size={18} color="#fff" stroke={2.2} />} onClick={() => setStep(s => s + 1)}>{step === 1 ? 'Publizieren' : 'Weiter'}</Button></div>
      </div>
    </Screen>
  );
}

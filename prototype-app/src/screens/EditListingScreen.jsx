import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Screen, Body, ConfirmDialog, HelpSheet } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import GlassHelpFab from '../components/glass/GlassHelpFab.jsx';
import { useStore } from '../hooks/useStore.js';
import { useLayoutVariant } from '../hooks/useLayoutVariant.js';
import { useGlassPageActions } from '../components/glass/GlassChrome.jsx';

const TYPES = [
  { icon: 'briefcase', label: 'Leihen' },
  { icon: 'paws',      label: 'Dienste' },
  { icon: 'reload',    label: 'Tausch' },
  { icon: 'car',       label: 'Jobs' },
];

const EINHEITEN = ['Tag', 'Std.', 'Woche', 'Tausch'];

function parsePriceStr(str) {
  if (!str || str === 'Tausch') return { priceAmount: '', priceUnit: 'Tausch' };
  const m = (str || '').match(/^CHF\s*([\d.]+)\s*\/\s*(.+)$/);
  if (m) return { priceAmount: m[1], priceUnit: m[2].trim() };
  return { priceAmount: str.replace(/^CHF\s*/, '').trim(), priceUnit: 'Tag' };
}

const HELP_ITEMS = [
  { icon: 'edit',      title: 'Titel & Beschreibung',  text: 'Wähle einen klaren Titel und beschreibe den Artikel so genau wie möglich.' },
  { icon: 'briefcase', title: 'Kategorie wählen',       text: 'Wähle die passende Kategorie für dein Inserat.' },
  { icon: 'coin',      title: 'Preis setzen',           text: 'Gib an, was du pro Einheit verlangst (z.B. CHF 5 / Tag).' },
  { icon: 'trash',     title: 'Inserat löschen',        text: 'Wenn du das Inserat löscht, ist es nicht mehr sichtbar. Das kann nicht rückgängig gemacht werden.' },
];

export default function EditListingScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, actions } = useStore();
  // Where to land after save/delete: marketplace if opened from there, otherwise profile
  const fromMarket = location.state?.from === 'marktplatz';
  const listing = state.listings.find(l => l.id === id);

  const { priceAmount: initPriceAmount, priceUnit: initPriceUnit } = parsePriceStr(listing?.price);
  const [type, setType] = useState(listing?.cat ?? 'Leihen');
  const [form, setForm] = useState({
    title:       listing?.title ?? '',
    description: listing?.description ?? '',
    priceAmount: initPriceAmount,
    priceUnit:   initPriceUnit,
    available:   listing?.available?.replace(/^Ab\s*/, '') ?? '',
  });
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [help, setHelp] = useState(false);
  const isGlass = useLayoutVariant() === 'glass';

  // Glass-Variante: Haupt-Aktionen in der immer sichtbaren unteren Leiste.
  useGlassPageActions([
    { key: 'cancel', label: 'Abbrechen', icon: 'close', tone: 'secondary', onClick: () => navigate(-1) },
    { key: 'save', label: 'Speichern', icon: 'check', tone: 'primary', onClick: () => handleSave() },
  ], isGlass && !!listing);

  if (!listing) {
    navigate(-1);
    return null;
  }

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: null }));
  };

  function validate() {
    const e = {};
    if (!form.title.trim())       e.title = 'Bitte einen Titel eingeben';
    if (form.title.length > 60)   e.title = 'Max. 60 Zeichen';
    if (!form.description.trim()) e.description = 'Bitte eine Beschreibung eingeben';
    if (form.priceUnit !== 'Tausch' && !form.priceAmount.trim()) e.priceAmount = 'Bitte einen Preis eingeben';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    actions.updateListing(id, {
      title:       form.title.trim(),
      cat:         type,
      price:       form.priceUnit === 'Tausch' ? 'Tausch' : `CHF ${form.priceAmount.trim()} / ${form.priceUnit}`,
      description: form.description.trim(),
      available:   form.available.trim() ? `Ab ${form.available.trim()}` : listing.available,
    });
    navigate(-1);
  }

  function handleDelete() {
    actions.removeListing(id);
    navigate(fromMarket ? '/marktplatz' : '/profil');
  }

  return (
    <Screen background="var(--surface)">
      <TopBar
        leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />}
        title="Inserat bearbeiten"
        onHelp={isGlass ? undefined : () => setHelp(true)}
      />

      <Body padding="16px 18px 24px">
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Art des Inserats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TYPES.map(t => {
              const active = type === t.label;
              return (
                <button
                  key={t.label}
                  onClick={() => setType(t.label)}
                  aria-pressed={active}
                  style={{
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                    background: active ? 'var(--primary-tint)' : 'var(--card)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <Icon name={t.icon} size={18} stroke={1.8} color={active ? 'var(--primary)' : 'var(--ink)'} />
                  <span style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: active ? 'var(--primary-ink)' : 'var(--ink)' }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Titel" required value={form.title} onChange={set('title')} error={errors.title}
            hint={errors.title || `${form.title.length} / 60`} />
          <Field label="Beschreibung" required multiline rows={4} value={form.description}
            onChange={set('description')} error={errors.description} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Einheit</span>
              <span style={{ color: 'var(--danger)', fontSize: 12 }}>*</span>
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {EINHEITEN.map(u => {
                const active = form.priceUnit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => { setForm(f => ({ ...f, priceUnit: u })); setErrors(er => ({ ...er, priceAmount: null })); }}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 20,
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary-tint)' : 'var(--card)',
                      fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                      color: active ? 'var(--primary-ink)' : 'var(--ink-2)',
                      cursor: 'pointer',
                    }}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
            {form.priceUnit !== 'Tausch' && (
              <Field label="Preis" required value={form.priceAmount} onChange={set('priceAmount')}
                error={errors.priceAmount} hint={errors.priceAmount || `CHF / ${form.priceUnit}`}
                trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>CHF</span>} />
            )}
          </div>
          <Field label="Verfügbar ab" value={form.available} onChange={set('available')}
            hint="z.B. sofort oder TT.MM.JJJJ" />
        </div>

        <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
          <button
            onClick={() => setConfirm(true)}
            style={{
              width: '100%', height: 44, borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--danger)', background: 'transparent',
              fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--danger)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer',
            }}
          >
            <Icon name="trash" size={16} color="var(--danger)" stroke={2} />
            Inserat löschen
          </button>
        </div>
        {/* Glass: Inhalt über der schwebenden Leiste freihalten. */}
        {isGlass && <div style={{ height: 96 }} />}
      </Body>

      {!isGlass && (
        <div style={{ padding: '12px 16px 22px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ flex: 1 }}><Button full size="lg" variant="outline" onClick={() => navigate(-1)}>Abbrechen</Button></div>
          <div style={{ flex: 1 }}><Button full size="lg" onClick={handleSave}>Speichern</Button></div>
        </div>
      )}

      <ConfirmDialog
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={handleDelete}
        tone="danger" icon="trash"
        title="Inserat wirklich löschen?"
        body={`«${listing.title}» wird gelöscht und ist danach nicht mehr sichtbar. Das kannst du nicht mehr rückgängig machen.`}
        cancelLabel="Abbrechen"
        confirmLabel="Löschen"
      />

      <HelpSheet
        open={help}
        onClose={() => setHelp(false)}
        title="Inserat bearbeiten"
        intro="Hier kannst du dein Inserat anpassen oder löschen."
        items={HELP_ITEMS}
      />
      {isGlass && <GlassHelpFab onClick={() => setHelp(true)} />}
    </Screen>
  );
}

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Body, ConfirmDialog, HelpSheet } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Button from '../components/Button.jsx';
import Field from '../components/Field.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const TYPES = [
  { icon: 'briefcase', label: 'Leihen' },
  { icon: 'paws',      label: 'Dienste' },
  { icon: 'reload',    label: 'Tausch' },
  { icon: 'car',       label: 'Jobs' },
];

const HELP_ITEMS = [
  { icon: 'edit',      title: 'Titel & Beschreibung',  text: 'Wähle einen klaren Titel und beschreibe den Artikel so genau wie möglich.' },
  { icon: 'briefcase', title: 'Kategorie wählen',       text: 'Wähle die passende Kategorie für dein Inserat.' },
  { icon: 'coin',      title: 'Preis setzen',           text: 'Gib an, was du pro Einheit verlangst (z.B. CHF 5 / Tag).' },
  { icon: 'trash',     title: 'Inserat löschen',        text: 'Wenn du das Inserat löscht, ist es nicht mehr sichtbar. Das kann nicht rückgängig gemacht werden.' },
];

export default function EditListingScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const listing = state.listings.find(l => l.id === id);

  const [type, setType] = useState(listing?.cat ?? 'Leihen');
  const [form, setForm] = useState({
    title:       listing?.title ?? '',
    description: listing?.description ?? '',
    price:       listing?.price?.replace(/^CHF\s*/, '') ?? '',
    available:   listing?.available?.replace(/^Ab\s*/, '') ?? '',
  });
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [help, setHelp] = useState(false);

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
    if (!form.price.trim())       e.price = 'Bitte einen Preis eingeben';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    actions.updateListing(id, {
      title:       form.title.trim(),
      cat:         type,
      price:       form.price.trim().startsWith('CHF') ? form.price.trim() : `CHF ${form.price.trim()}`,
      description: form.description.trim(),
      available:   form.available.trim() ? `Ab ${form.available.trim()}` : listing.available,
    });
    navigate('/profil');
  }

  function handleDelete() {
    actions.removeListing(id);
    navigate('/profil');
  }

  return (
    <Screen background="var(--surface)">
      <TopBar
        leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />}
        title="Inserat bearbeiten"
        onHelp={() => setHelp(true)}
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
          <Field label="Preis" required value={form.price} onChange={set('price')}
            error={errors.price} hint={errors.price || 'CHF / Einheit'}
            trailing={<span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>CHF</span>} />
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
      </Body>

      <div style={{ padding: '12px 16px 22px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <div style={{ flex: 1 }}><Button full size="lg" variant="outline" onClick={() => navigate(-1)}>Abbrechen</Button></div>
        <div style={{ flex: 1 }}><Button full size="lg" onClick={handleSave}>Speichern</Button></div>
      </div>

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
    </Screen>
  );
}

import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { HScroll, HelpSheet, Chip, CatChip } from '../../components/index.js';
import Avatar from '../../components/Avatar.jsx';
import Badge from '../../components/Badge.jsx';
import Photo from '../../components/Photo.jsx';
import Icon from '../../components/Icon.jsx';
import { GlassShell, GlassSearch, abPanel } from '../../components/glass/index.js';
import GlassOptionsSheet from './GlassOptionsSheet.jsx';
import { useStore } from '../../hooks/useStore.js';
import { useLayoutVariant } from '../../hooks/useLayoutVariant.js';
import { track } from '../../model/analytics.js';

const CATS = ['Leihen', 'Dienste', 'Tausch', 'Jobs'];

const HELP = {
  title: 'So funktioniert der Marktplatz',
  intro: 'Leihen, tauschen, Dienste anbieten — alles unter Nachbarn in Egnach.',
  items: [
    { icon: 'search', title: 'Suchen & filtern',      text: 'Tippe ins Suchfeld oder wähle eine Kategorie. Mit dem Filter sortierst du z. B. nach Distanz.' },
    { icon: 'store',  title: 'Kategorien',             text: '«Leihen» für Gegenstände, «Dienste» für Hilfe, «Tausch» ohne Geld, «Jobs» für bezahlte Arbeit.' },
    { icon: 'shield', title: 'Verifizierte Nachbarn',  text: 'Das blaue Häkchen zeigt geprüfte Mitglieder. So weisst du, mit wem du es zu tun hast.' },
    { icon: 'plus',   title: 'Eigenes Inserat',        text: 'Mit dem grünen «+ Inserat»-Knopf gibst du in wenigen Schritten dein eigenes Inserat auf.' },
  ],
};

function parseDistance(d) {
  const n = parseFloat(String(d ?? '').replace(',', '.'));
  if (Number.isNaN(n)) return Infinity;
  return String(d).includes('km') ? n * 1000 : n;
}
function parsePrice(p) {
  const m = String(p ?? '').match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}
const SORTS = [
  { id: 'distanz',   label: 'Distanz',   icon: 'pin',   fn: (a, b) => parseDistance(a.distance) - parseDistance(b.distance) },
  { id: 'preis',     label: 'Preis',     icon: 'swiss', fn: (a, b) => parsePrice(a.price) - parsePrice(b.price) },
  { id: 'bewertung', label: 'Bewertung', icon: 'star',  fn: (a, b) => (b.rating || 0) - (a.rating || 0) },
];

function CatFilterChip({ name, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
      <CatChip name={name} active={active}>{label}</CatChip>
    </button>
  );
}

export default function GlassMarketplaceScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const variant = useLayoutVariant();
  const [activeCat, setActiveCat] = useState('Alle');
  const [query, setQuery] = useState('');
  const [sortId, setSortId] = useState('distanz');
  const [options, setOptions] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [help, setHelp] = useState(false);

  const sort = SORTS.find(s => s.id === sortId) || SORTS[0];
  const filtersActive = onlyMine || verifiedOnly;
  const q = query.trim().toLowerCase();
  const filtered = state.listings.filter(l => {
    if (activeCat !== 'Alle' && l.cat !== activeCat) return false;
    // Eigene Inserate gehören nicht in den öffentlichen Feed (man kann sich
    // nicht selbst anschreiben) — nur über den Filter «Nur meine» sichtbar.
    if (onlyMine ? !l.own : l.own) return false;
    if (verifiedOnly && !l.verified) return false;
    if (q && ![l.title, l.description, l.neighborhood, l.ownerName, l.cat]
      .some(v => String(v ?? '').toLowerCase().includes(q))) return false;
    return true;
  }).sort(sort.fn);

  function resetFilters() {
    setActiveCat('Alle'); setQuery(''); setOnlyMine(false); setVerifiedOnly(false); setSortId('distanz');
  }

  function openHelp() { track('open_help', { screen: 'markt', variant }); setHelp(true); }
  function openCreate() {
    track('open_create_flow', { screen: 'markt', variant });
    navigate('/inserat-erstellen', { state: { defaultType: activeCat !== 'Alle' ? activeCat : null } });
  }

  const header = (
    <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 58, boxSizing: 'border-box' }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Marktplatz</h1>
        <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{state.listings.length} aktive Inserate</div>
      </div>
    </div>
  );

  return (
    <Fragment>
      <GlassShell headerH={58} header={header} createLabel="Inserat" createIcon="plus" onCreate={openCreate} onHelp={openHelp}>
        <div style={{ padding: '8px 16px 12px' }}>
          <GlassSearch placeholder="Was suchst du?" filter value={query} onChange={setQuery} onFilter={() => setOptions(true)} />
        </div>

        <HScroll padding="0 16px">
          <Chip active={activeCat === 'Alle'} onClick={() => setActiveCat('Alle')}>Alle</Chip>
          {CATS.map(c => (
            <CatFilterChip key={c} name={c} label={c} active={activeCat === c} onClick={() => setActiveCat(activeCat === c ? 'Alle' : c)} />
          ))}
        </HScroll>

        <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>
            {filtered.length} {filtered.length === 1 ? 'Ergebnis' : 'Ergebnisse'} · Egnach
          </span>
          <button
            onClick={() => setOptions(true)}
            aria-label="Sortieren und filtern"
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: filtersActive ? 'var(--primary)' : 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            <Icon name="filter" size={12} stroke={2} color={filtersActive ? 'var(--primary)' : 'var(--ink)'} /> {sort.label}{filtersActive ? ' · Filter' : ''}
          </button>
        </div>

        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '28px 16px', borderRadius: 'var(--radius)', textAlign: 'center', ...abPanel }}>
              <Icon name="search" size={24} color="var(--ink-3)" stroke={1.6} />
              <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Keine Inserate gefunden</div>
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', marginTop: 8, padding: 0 }}>Filter zurücksetzen →</button>
            </div>
          )}
          {filtered.map((it) => {
            const fav = state.favorites.includes(it.id);
            return (
              <div key={it.id} onClick={() => navigate(`/marktplatz/${it.id}`)} style={{ borderRadius: 'var(--radius)', overflow: 'hidden', cursor: 'pointer', ...abPanel }}>
                <div style={{ position: 'relative' }}>
                  <Photo width="100%" height={110} tone={it.tone} radius={0} hint="foto" />
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4 }}>
                    <CatChip name={it.cat} size="sm" />
                    {it.own && <Badge tone="success" size="sm">MEIN</Badge>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); actions.toggleFavorite(it.id); }}
                    aria-label={`${it.title} merken`}
                    className="ab-press"
                    style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...abPanel }}
                  >
                    <Icon name="heart" size={15} color={fav ? 'var(--danger)' : 'var(--ink)'} />
                  </button>
                </div>
                <div style={{ padding: '9px 10px 11px' }}>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{it.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                    <Avatar size={16} initials={it.avatar} verified={it.verified} />
                    <span style={{ fontFamily: 'var(--font)', fontSize: 10.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {it.neighborhood}{it.reviews > 0 ? ` · ⭐ ${it.rating}` : ''}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginTop: 7 }}>{it.price}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 12 }} />
      </GlassShell>

      <HelpSheet open={help} onClose={() => setHelp(false)} {...HELP} />

      <GlassOptionsSheet
        open={options}
        onClose={() => setOptions(false)}
        sorts={SORTS}
        sortId={sortId} setSortId={setSortId}
        onlyMine={onlyMine} setOnlyMine={setOnlyMine}
        verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
        onReset={() => { resetFilters(); setOptions(false); }}
      />
    </Fragment>
  );
}

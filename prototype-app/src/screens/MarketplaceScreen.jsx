import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Screen, Body, HScroll, HelpButton, HelpSheet } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Chip from '../components/Chip.jsx';
import Photo from '../components/Photo.jsx';
import Avatar from '../components/Avatar.jsx';
import Switch from '../components/Switch.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const CATS = ['Alle', 'Leihen', 'Dienste', 'Tausch', 'Jobs'];
const CAT_ICONS = { Leihen: 'briefcase', Dienste: 'paws', Tausch: 'reload', Jobs: 'car' };

const SORTS = [
  { id: 'distanz',   label: 'Distanz',   icon: 'pin' },
  { id: 'preis',     label: 'Preis',     icon: 'swiss' },
  { id: 'bewertung', label: 'Bewertung', icon: 'star' },
];

const HELP_ITEMS = [
  { icon: 'search',    title: 'Suchen & filtern',      text: 'Tippe in die Suchleiste oder wähle eine Kategorie, um Inserate zu filtern.' },
  { icon: 'briefcase', title: 'Kategorien',             text: 'Leihen, Dienste, Tausch, Jobs — wähle die passende Kategorie.' },
  { icon: 'user',      title: 'Meine Inserate',         text: 'Mit dem Filter «Meine Inserate» siehst du nur deine eigenen Angebote und kannst sie direkt bearbeiten.' },
  { icon: 'options',   title: 'Sortieren & Optionen',   text: 'Über das ⋮-Menü sortierst du nach Distanz, Preis oder Bewertung und setzt weitere Filter.' },
  { icon: 'shield',    title: 'Verifizierte Nachbarn',  text: 'Inserate mit grünem Häkchen stammen von verifizierten Einwohnern.' },
  { icon: 'plus',      title: 'Eigenes Inserat',        text: 'Tippe auf + unten rechts, um ein neues Inserat zu erstellen.' },
];

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const cardItem = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.26 } },
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

const sortFns = {
  distanz:   (a, b) => parseDistance(a.distance) - parseDistance(b.distance),
  preis:     (a, b) => parsePrice(a.price) - parsePrice(b.price),
  bewertung: (a, b) => (b.rating || 0) - (a.rating || 0),
};

const sheetSpring = { type: 'spring', damping: 28, stiffness: 320 };

/* Bottom sheet behind the ⋮ button and the filter icon: sorting + filters */
function OptionsSheet({ open, onClose, sort, setSort, onlyMine, setOnlyMine, verifiedOnly, setVerifiedOnly, onReset }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(13,22,34,0.42)' }}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={sheetSpring}
            role="dialog" aria-label="Sortieren und filtern"
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 91,
              background: 'var(--card)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              boxShadow: '0 -10px 40px rgba(13,22,34,0.22)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
            </div>

            <div style={{ padding: '12px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>Sortieren & filtern</div>
              <button
                onClick={onClose}
                aria-label="Schliessen"
                style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--surface-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Icon name="close" size={14} stroke={2} color="var(--ink-2)" />
              </button>
            </div>

            <div style={{ padding: '6px 20px 4px' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 8 }}>SORTIEREN NACH</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {SORTS.map(s => (
                  <Chip key={s.id} active={sort === s.id} onClick={() => setSort(s.id)}
                    leading={<Icon name={s.icon} size={12} stroke={2} />}>{s.label}</Chip>
                ))}
              </div>
            </div>

            <div style={{ padding: '14px 20px 4px' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1, marginBottom: 4 }}>FILTER</div>
              {[
                { icon: 'user',   label: 'Nur meine Inserate',          hint: 'Zeigt nur deine eigenen Angebote', on: onlyMine,     onToggle: () => setOnlyMine(!onlyMine) },
                { icon: 'shield', label: 'Nur verifizierte Anbieter',   hint: 'Von der Gemeinde Egnach geprüft',  on: verifiedOnly, onToggle: () => setVerifiedOnly(!verifiedOnly) },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i === 0 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={row.icon} size={16} stroke={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{row.label}</div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{row.hint}</div>
                  </div>
                  <Switch on={row.on} size="sm" onChange={row.onToggle} />
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px 24px', display: 'flex', gap: 10 }}>
              <button
                onClick={onReset}
                style={{
                  flex: 1, height: 48, borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line-2)', background: 'var(--card)',
                  fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer',
                }}
              >
                Zurücksetzen
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1, height: 48, borderRadius: 'var(--radius-sm)',
                  border: 'none', background: 'var(--primary)', color: '#fff',
                  fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Anwenden
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function MarketplaceScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [activeCat, setActiveCat] = useState('Alle');
  const [query, setQuery] = useState('');
  const [onlyMine, setOnlyMine] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState('distanz');
  const [options, setOptions] = useState(false);
  const [help, setHelp] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = state.listings.filter(l => {
    if (activeCat !== 'Alle' && l.cat !== activeCat) return false;
    if (onlyMine && !l.own) return false;
    if (verifiedOnly && !l.verified) return false;
    if (q && ![l.title, l.description, l.neighborhood, l.ownerName, l.cat]
      .some(v => String(v ?? '').toLowerCase().includes(q))) return false;
    return true;
  }).sort(sortFns[sort]);

  const activeSort = SORTS.find(s => s.id === sort);
  const filtersActive = onlyMine || verifiedOnly;

  function resetFilters() {
    setActiveCat('Alle');
    setQuery('');
    setOnlyMine(false);
    setVerifiedOnly(false);
    setSort('distanz');
  }

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Marktplatz</h1>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{state.listings.length} aktive Inserate</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton name="options" label="Sortieren und filtern" badge={filtersActive ? '•' : undefined} onClick={() => setOptions(true)} />
          <HelpButton onClick={() => setHelp(true)} />
        </div>
      </div>

      <Body>
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ height: 44, borderRadius: 22, background: 'var(--card)', border: '1px solid var(--line)', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="search" size={18} color="var(--ink-3)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Was suchst du?"
              aria-label="Inserate durchsuchen"
              style={{
                flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink)',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Suche löschen"
                style={{ width: 24, height: 24, borderRadius: 12, border: 'none', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <Icon name="close" size={12} stroke={2} color="var(--ink-2)" />
              </button>
            )}
            <div style={{ width: 1, height: 18, background: 'var(--line)' }} />
            <button
              onClick={() => setOptions(true)}
              aria-label="Filter öffnen"
              style={{ border: 'none', background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <Icon name="filter" size={18} color={filtersActive ? 'var(--primary)' : 'var(--ink)'} />
            </button>
          </div>
        </div>

        <HScroll padding="0 16px">
          <Chip active={activeCat === 'Alle'} onClick={() => setActiveCat('Alle')}>Alle</Chip>
          {CATS.slice(1).map(c => (
            <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}
              leading={<Icon name={CAT_ICONS[c]} size={12} stroke={2} />}>{c}</Chip>
          ))}
          <Chip active={onlyMine} onClick={() => setOnlyMine(!onlyMine)}
            leading={<Icon name="user" size={12} stroke={2} />}>Meine Inserate</Chip>
        </HScroll>

        <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>
            {filtered.length} {filtered.length === 1 ? 'Ergebnis' : 'Ergebnisse'} · {onlyMine ? 'Meine Inserate' : 'Egnach'}
          </span>
          <button
            onClick={() => setSort(SORTS[(SORTS.findIndex(s => s.id === sort) + 1) % SORTS.length].id)}
            aria-label={`Sortiert nach ${activeSort.label}, tippen zum Wechseln`}
            style={{
              border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
          >
            <Icon name="filter" size={12} stroke={2} /> {activeSort.label}
          </button>
        </div>

        <motion.div
          key={`${activeCat}-${sort}-${onlyMine}-${verifiedOnly}`}
          variants={stagger} initial="hidden" animate="visible"
          style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {filtered.length === 0 && (
            <motion.div variants={cardItem}>
              <div style={{ padding: '28px 16px', borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px dashed var(--line-2)', textAlign: 'center' }}>
                <Icon name="search" size={24} color="var(--ink-3)" stroke={1.6} />
                <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Keine Inserate gefunden</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                  {onlyMine && !q ? 'Du hast noch keine eigenen Inserate in dieser Kategorie.' : 'Passe deine Suche oder die Filter an.'}
                </div>
                <button
                  onClick={resetFilters}
                  style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', marginTop: 8, padding: 0 }}
                >
                  Filter zurücksetzen →
                </button>
              </div>
            </motion.div>
          )}
          {filtered.map((it) => (
            <motion.div key={it.id} variants={cardItem}>
            <Card padding={10} onClick={() => navigate(`/marktplatz/${it.id}`)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Photo width={84} height={84} tone={it.tone} radius={10} hint="foto" />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Badge tone={it.cat === 'Jobs' ? 'accent' : 'primary'} size="sm">{it.cat.toUpperCase()}</Badge>
                    {it.own && <Badge tone="success" size="sm">MEIN INSERAT</Badge>}
                  </div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{it.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                    <Avatar size={18} initials={it.avatar} verified={it.verified} />
                    <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>
                      {it.neighborhood}{it.reviews > 0 ? ` · ⭐ ${it.rating}` : ''}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>{it.price}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {it.own ? (
                    <IconButton
                      name="edit"
                      size={28}
                      label={`${it.title} bearbeiten`}
                      onClick={(e) => { e.stopPropagation(); navigate(`/inserat-bearbeiten/${it.id}`, { state: { from: 'marktplatz' } }); }}
                    />
                  ) : (
                    <IconButton
                      name="heart"
                      size={28}
                      label={`${it.title} merken`}
                      onClick={(e) => { e.stopPropagation(); actions.toggleFavorite(it.id); }}
                      style={{ color: state.favorites.includes(it.id) ? 'var(--danger)' : 'var(--ink-3)' }}
                    />
                  )}
                </div>
              </div>
            </Card>
            </motion.div>
          ))}
          <div style={{ height: 80 }} />
        </motion.div>
      </Body>

      <div style={{ position: 'absolute', right: 18, bottom: 20, zIndex: 5 }}>
        <motion.button
          onClick={() => navigate('/inserat-erstellen', {
            state: { defaultType: activeCat !== 'Alle' ? activeCat : null },
          })}
          aria-label="Inserat erstellen"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.18 }}
          whileTap={{ scale: 0.90 }}
          style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 6px 16px rgba(0,147,221,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="plus" size={26} color="#fff" stroke={2.4} />
        </motion.button>
      </div>

      <OptionsSheet
        open={options}
        onClose={() => setOptions(false)}
        sort={sort} setSort={setSort}
        onlyMine={onlyMine} setOnlyMine={setOnlyMine}
        verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
        onReset={() => { resetFilters(); setOptions(false); }}
      />

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Marktplatz" intro="Leihe, tausche und biete Dienste mit Nachbarn in Egnach." items={HELP_ITEMS} />
    </Screen>
  );
}

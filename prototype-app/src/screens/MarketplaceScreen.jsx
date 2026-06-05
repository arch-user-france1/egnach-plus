import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen, Body, HScroll, HelpButton, HelpSheet } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Chip from '../components/Chip.jsx';
import Photo from '../components/Photo.jsx';
import Avatar from '../components/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const CATS = ['Alle', 'Leihen', 'Dienste', 'Tausch', 'Jobs'];
const CAT_ICONS = { Leihen: 'briefcase', Dienste: 'paws', Tausch: 'reload', Jobs: 'car' };

const HELP_ITEMS = [
  { icon: 'search',    title: 'Suchen & filtern',      text: 'Tippe in die Suchleiste oder wähle eine Kategorie, um Inserate zu filtern.' },
  { icon: 'briefcase', title: 'Kategorien',             text: 'Leihen, Dienste, Tausch, Jobs — wähle die passende Kategorie.' },
  { icon: 'shield',    title: 'Verifizierte Nachbarn',  text: 'Inserate mit blauem Häkchen stammen von verifizierten Einwohnern.' },
  { icon: 'plus',      title: 'Eigenes Inserat',        text: 'Tippe auf + unten rechts, um ein neues Inserat zu erstellen.' },
];

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const cardItem = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.26 } },
};

export default function MarketplaceScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [activeCat, setActiveCat] = useState('Alle');
  const [help, setHelp] = useState(false);

  const filtered = activeCat === 'Alle' ? state.listings : state.listings.filter(l => l.cat === activeCat);

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Marktplatz</h1>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{state.listings.length} aktive Inserate</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton name="options" label="Optionen" />
          <HelpButton onClick={() => setHelp(true)} />
        </div>
      </div>

      <Body>
        <div style={{ padding: '4px 16px 12px' }}>
          <div style={{ height: 44, borderRadius: 22, background: 'var(--card)', border: '1px solid var(--line)', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="search" size={18} color="var(--ink-3)" />
            <span style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-3)' }}>Was suchst du?</span>
            <div style={{ width: 1, height: 18, background: 'var(--line)' }} />
            <Icon name="filter" size={18} color="var(--ink)" />
          </div>
        </div>

        <HScroll padding="0 16px">
          <Chip active={activeCat === 'Alle'} onClick={() => setActiveCat('Alle')}>Alle</Chip>
          {CATS.slice(1).map(c => (
            <Chip key={c} active={activeCat === c} onClick={() => setActiveCat(c)}
              leading={<Icon name={CAT_ICONS[c]} size={12} stroke={2} />}>{c}</Chip>
          ))}
        </HScroll>

        <div style={{ padding: '14px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>{filtered.length} Ergebnisse · Egnach</span>
          <span style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="filter" size={12} stroke={2} /> Distanz
          </span>
        </div>

        <motion.div
          key={activeCat}
          variants={stagger} initial="hidden" animate="visible"
          style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {filtered.map((it) => (
            <motion.div key={it.id} variants={cardItem}>
            <Card padding={10} onClick={() => navigate(`/marktplatz/${it.id}`)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Photo width={84} height={84} tone={it.tone} radius={10} hint="foto" />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Badge tone={it.cat === 'Jobs' ? 'accent' : 'primary'} size="sm">{it.cat.toUpperCase()}</Badge>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{it.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                    <Avatar size={18} initials={it.avatar} verified={it.verified} />
                    <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{it.neighborhood} · ⭐ {it.rating}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>{it.price}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <IconButton
                    name="heart"
                    size={28}
                    label={`${it.title} merken`}
                    onClick={(e) => { e.stopPropagation(); actions.toggleFavorite(it.id); }}
                    style={{ color: state.favorites.includes(it.id) ? 'var(--danger)' : 'var(--ink-3)' }}
                  />
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

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Marktplatz" intro="Leihe, tausche und biete Dienste mit Nachbarn in Egnach." items={HELP_ITEMS} />
    </Screen>
  );
}

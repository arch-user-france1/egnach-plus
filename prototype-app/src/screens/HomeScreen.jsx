import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen, Body, HScroll, SectionHeader } from '../components/index.js';
import Avatar from '../components/Avatar.jsx';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Chip from '../components/Chip.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TAB_PATHS = ['/home', '/marktplatz', '/anlaesse', '/chat', '/profil'];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { state } = useStore();

  const events = state.events.slice(0, 3);
  const listings = state.listings.slice(0, 2);

  return (
    <Screen background="var(--surface)">
      {/* Header */}
      <div style={{ padding: '10px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', flexShrink: 0 }}>
        <Avatar size={40} initials={state.user.initials} verified={state.user.verified} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>Grüezi, {state.user.name.split(' ')[0]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
            <Icon name="pin" size={12} color="var(--primary)" stroke={2} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{state.user.neighborhood}</span>
          </div>
        </div>
        <IconButton name="bell" badge="3" label="Benachrichtigungen" />
        <IconButton name="qr" label="QR-Scanner" onClick={() => navigate('/map')} />
      </div>

      <Body>
        {/* Search bar */}
        <div style={{ padding: '4px 16px 12px' }}>
          <button
            onClick={() => navigate('/marktplatz')}
            style={{ width: '100%', height: 44, borderRadius: 22, background: 'var(--card)', border: '1px solid var(--line)', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <Icon name="search" size={18} color="var(--ink-3)" />
            <span style={{ fontFamily: 'var(--font)', fontSize: 14, color: 'var(--ink-3)', flex: 1, textAlign: 'left' }}>Suche in Egnach…</span>
            <Icon name="mic" size={16} color="var(--ink-3)" />
          </button>
        </div>

        {/* Quartier chips */}
        <HScroll padding="0 16px 4px">
          <Chip active>Alle Quartiere</Chip>
          <Chip>Egnach Dorf</Chip>
          <Chip>Neuhof</Chip>
          <Chip>Seefeld</Chip>
          <Chip>Buchen</Chip>
          <Chip>Steinebrunn</Chip>
        </HScroll>

        {/* Hero spotlight */}
        <div style={{ padding: '16px 16px 0' }}>
          <Card padding={0} onClick={() => navigate('/anlaesse/ev1')} style={{ overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 140, position: 'relative', background: 'linear-gradient(135deg, var(--primary) 0%, #1a4f8a 100%)', padding: 16 }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'repeating-linear-gradient(135deg, transparent 0 12px, rgba(255,255,255,0.4) 12px 13px)' }} />
              <Badge tone="accent" size="sm">DORFFEST</Badge>
              <h3 style={{ margin: '10px 0 4px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -0.3, position: 'relative' }}>Hafenfest am Bodensee</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font)', fontSize: 12, color: 'rgba(255,255,255,0.85)', position: 'relative' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={12} stroke={2} color="rgba(255,255,255,0.85)" /> Sa, 14. Juni · 14:00</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="pin" size={12} stroke={2} color="rgba(255,255,255,0.85)" /> Seefeld</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Events */}
        <SectionHeader title="Anlässe diese Woche" action="Alle" onAction={() => navigate('/anlaesse')} />
        <HScroll>
          <motion.div style={{ display: 'flex', gap: 10 }} variants={stagger} initial="hidden" animate="visible">
            {events.map((e) => (
              <motion.div key={e.id} variants={item} style={{ flexShrink: 0 }}>
                <Card padding={0} onClick={() => navigate(`/anlaesse/${e.id}`)} style={{ width: 200, overflow: 'hidden', cursor: 'pointer' }}>
                  <Photo height={104} tone={e.tone} radius={0} hint={e.cats[0]} />
                  <div style={{ padding: 12 }}>
                    <Badge tone="neutral" size="sm">{e.cats[0]}</Badge>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 8, lineHeight: 1.3 }}>{e.title}</div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-2)', marginTop: 4 }}>{e.dateShort} · {e.location}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </HScroll>

        {/* Marketplace */}
        <SectionHeader title="Aus der Nachbarschaft" action="Marktplatz" onAction={() => navigate('/marktplatz')} />
        <motion.div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }} variants={stagger} initial="hidden" animate="visible">
          {listings.map((l) => (
            <motion.div key={l.id} variants={item}>
              <Card padding={10} onClick={() => navigate(`/marktplatz/${l.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Photo width={64} height={64} tone={l.tone} hint="bild" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{l.title}</div>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>{l.cat} · {l.price}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <Avatar size={22} initials={l.avatar} />
                      <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{l.neighborhood} · {l.distance}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ height: 24 }} />
      </Body>

    </Screen>
  );
}

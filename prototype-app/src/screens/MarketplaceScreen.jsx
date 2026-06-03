import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body, HScroll } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Chip from '../components/Chip.jsx';
import Photo from '../components/Photo.jsx';
import Avatar from '../components/Avatar.jsx';
import TabBar from '../components/TabBar.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const CATS = ['Alle', 'Leihen', 'Dienste', 'Tausch', 'Jobs'];
const CAT_ICONS = { Leihen: 'briefcase', Dienste: 'paws', Tausch: 'reload', Jobs: 'car' };

export default function MarketplaceScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [activeCat, setActiveCat] = useState('Alle');

  const filtered = activeCat === 'Alle' ? state.listings : state.listings.filter(l => l.cat === activeCat);

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Marktplatz</h1>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{state.listings.length} aktive Inserate</div>
        </div>
        <IconButton name="options" label="Optionen" />
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

        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((it) => (
            <Card key={it.id} padding={10} onClick={() => navigate(`/marktplatz/${it.id}`)} style={{ cursor: 'pointer' }}>
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
          ))}
          <div style={{ height: 80 }} />
        </div>
      </Body>

      <div style={{ position: 'absolute', right: 18, bottom: 92, zIndex: 5 }}>
        <button onClick={() => navigate('/inserat-erstellen')} aria-label="Inserat erstellen" style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 6px 16px rgba(217,119,87,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="plus" size={26} color="#fff" stroke={2.4} />
        </button>
      </div>

      <TabBar active={1} onNavigate={(p) => navigate(p)} />
    </Screen>
  );
}

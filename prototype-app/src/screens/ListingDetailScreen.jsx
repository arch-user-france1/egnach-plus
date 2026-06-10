import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Screen, HelpSheet, Toast } from '../components/index.js';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import Avatar from '../components/Avatar.jsx';
import Dots from '../components/Dots.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const HELP_ITEMS = [
  { icon: 'chat',      title: 'Anfrage senden',        text: 'Schreibe dem Anbieter direkt über den Chat an.' },
  { icon: 'heart',     title: 'Merken',                 text: 'Speichere Inserate mit dem Herz-Icon, um sie später zu finden.' },
  { icon: 'share',     title: 'Teilen',                 text: 'Teile das Inserat mit anderen Personen.' },
  { icon: 'shield',    title: 'Verifizierte Anbieter',  text: 'Anbieter mit grünem Häkchen wurden durch die Gemeinde Egnach verifiziert.' },
];

export default function ListingDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const listing = state.listings.find(l => l.id === id) || state.listings[0];
  const isOwn = !!listing.own;
  const isFav = state.favorites.includes(listing.id);
  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState(false);

  // Open the existing conversation for this listing, or a new one with its owner.
  const existingThread = state.chatThreads.find(t => t.listingId === listing.id);
  const chatThreadId = existingThread ? existingThread.id : `listing-${listing.id}`;
  const openChat = () => navigate(`/chat/${chatThreadId}?listingId=${listing.id}`);

  return (
    <Screen background="var(--surface)" style={{ overflowY: 'auto' }}>
      <div style={{ position: 'relative', height: 280, flexShrink: 0 }}>
        <Photo width="100%" height={280} radius={0} tone={listing.tone} hint="produktfoto" />
        <div style={{ position: 'absolute', top: 8, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }} aria-label="Zurück">
            <Icon name="back" size={20} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Teilen">
              <Icon name="share" size={18} />
            </button>
            {isOwn ? (
              <button onClick={() => navigate(`/inserat-bearbeiten/${listing.id}`, { state: { from: 'marktplatz' } })} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Inserat bearbeiten">
                <Icon name="edit" size={18} />
              </button>
            ) : (
              <button onClick={() => actions.toggleFavorite(listing.id)} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isFav ? 'var(--danger)' : 'var(--ink)' }} aria-label="Merken" aria-pressed={isFav}>
                <Icon name="heart" size={18} color={isFav ? 'var(--danger)' : 'currentColor'} />
              </button>
            )}
            <button onClick={() => setHelp(true)} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 16, fontWeight: 700, color: 'var(--ink-2)' }} aria-label="Hilfe">
              ?
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0 }}>
          <Dots count={4} active={0} accent="#fff" />
        </div>
      </div>

      <div style={{ padding: '18px 18px 12px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <Badge tone="primary" size="sm">{listing.cat.toUpperCase()}</Badge>
          <Badge tone="neutral" size="sm">{listing.neighborhood}</Badge>
          {isOwn && <Badge tone="success" size="sm">MEIN INSERAT</Badge>}
        </div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: -0.3, color: 'var(--ink)', lineHeight: 1.2 }}>{listing.title}</h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{listing.price.split(' ')[0]} {listing.price.split(' ')[1]}</span>
          <span style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)' }}>{listing.price.includes('/') ? listing.price.slice(listing.price.indexOf('/')) : ''}{listing.priceWeek ? ` · ${listing.priceWeek}` : ''}</span>
        </div>
      </div>

      <div style={{ padding: '8px 18px 14px' }}>
        <Card padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar size={48} initials={listing.avatar} verified={listing.verified} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{listing.ownerName}</span>
                {listing.verified && <Badge tone="success" size="sm">VERIFIZIERT</Badge>}
              </div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>⭐ {listing.rating} · {listing.reviews} Bewertungen · seit Mai 2024</div>
            </div>
            <button style={{ border: '1px solid var(--line-2)', background: 'transparent', borderRadius: 999, padding: '6px 12px', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', minHeight: 36 }}>Profil</button>
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 18px 16px' }}>
        <h3 style={{ margin: '4px 0 8px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Beschreibung</h3>
        <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' }}>{listing.description}</p>
      </div>

      {listing.pos && (
        <div style={{ padding: '0 18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="pin" size={18} stroke={2} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{listing.neighborhood}</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{listing.distance} entfernt</div>
          </div>
          <button
            onClick={() => navigate('/karte', { state: { pin: listing.id } })}
            aria-label="Auf der Karte anzeigen"
            style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-tint)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
          >
            <Icon name="map" size={20} stroke={1.8} color="var(--primary)" />
          </button>
        </div>
      )}

      <div style={{ padding: '0 18px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Verfügbar', value: listing.available },
            { label: 'Übergabe', value: listing.handover },
            { label: 'Kaution', value: listing.deposit },
            { label: 'Sprachen', value: listing.languages },
          ].map((f, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.8, fontWeight: 700 }}>{f.label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginTop: 4 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 18px 14px' }}>
        <h3 style={{ margin: '4px 0 10px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Bewertungen</h3>
        <Card padding={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{listing.rating}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)', marginTop: 4, letterSpacing: 0.5 }}>{listing.reviews} BEWERTUNGEN</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[5,4,3,2,1].map(n => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>
                  <span style={{ width: 8 }}>{n}</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{ width: n === 5 ? '88%' : n === 4 ? '60%' : n === 3 ? '8%' : '0', height: '100%', background: 'var(--accent)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ height: 100 }} />

      <div style={{ position: 'sticky', bottom: 0, padding: '12px 16px 22px', background: 'var(--card)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10, alignItems: 'center' }}>
        {isOwn ? (
          <div style={{ flex: 1 }}>
            <Button full size="lg" leading={<Icon name="edit" size={16} color="#fff" />} onClick={() => navigate(`/inserat-bearbeiten/${listing.id}`, { state: { from: 'marktplatz' } })}>Inserat bearbeiten</Button>
          </div>
        ) : (
          <>
            <button onClick={openChat} style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--line-2)', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Nachricht senden">
              <Icon name="chat" size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <Button full size="lg" onClick={() => { openChat(); setToast(true); }}>Anfrage senden</Button>
            </div>
          </>
        )}
      </div>

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Inserat" intro="So nutzt du dieses Inserat." items={HELP_ITEMS} />
      <Toast open={toast} onClose={() => setToast(false)} tone="success" title="Anfrage gesendet" msg="Der Anbieter wird sich bei dir melden." />
    </Screen>
  );
}

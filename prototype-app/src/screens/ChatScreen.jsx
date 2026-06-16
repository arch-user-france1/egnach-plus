import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Screen, HelpButton, HelpSheet, Toast } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Avatar from '../components/Avatar.jsx';
import Switch from '../components/Switch.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import GlassHelpFab from '../components/glass/GlassHelpFab.jsx';
import { useStore } from '../hooks/useStore.js';
import { useLayoutVariant } from '../hooks/useLayoutVariant.js';

function Bubble({ own, text, translatedFrom, translatedTo, translation, time, translateOn, partnerInitials, partnerName, listing, onListingClick }) {
  const showTrans = translateOn && (translatedFrom || translatedTo);
  return (
    <div style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
      {!own && <Avatar size={28} initials={partnerInitials} />}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: own ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          background: own ? 'var(--primary)' : 'var(--card)',
          color: own ? '#fff' : 'var(--ink)',
          border: own ? 'none' : '1px solid var(--line)',
          fontFamily: 'var(--font)', fontSize: 13, lineHeight: 1.45,
        }}>
          {listing && (
            <button
              onClick={() => onListingClick?.(listing.id)}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer',
                display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, padding: 6,
                borderRadius: 10, border: 'none',
                background: own ? 'rgba(255,255,255,0.18)' : 'var(--surface-2)',
              }}
            >
              <Photo width={38} height={38} tone={listing.tone} radius={8} hint="bild" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 9, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: own ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }}>Anfrage</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: own ? '#fff' : 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: own ? 'rgba(255,255,255,0.92)' : 'var(--ink-2)', marginTop: 1 }}>{listing.price}</div>
              </div>
            </button>
          )}
          {showTrans && translatedFrom && (
            <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5, textTransform: 'uppercase' }}>
              <Icon name="language" size={11} stroke={2} color="var(--accent)" /> Übersetzt aus {translatedFrom}
            </div>
          )}
          <div>{translatedFrom ? translation : text}</div>
          {showTrans && translatedFrom && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', fontFamily: 'var(--font)', fontSize: 11, opacity: 0.65, fontStyle: 'italic' }}>{text}</div>
          )}
          {showTrans && translatedTo && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.22)', fontFamily: 'var(--font)', fontSize: 11, lineHeight: 1.4 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, textTransform: 'uppercase' }}>
                <Icon name="language" size={11} stroke={2} color="rgba(255,255,255,0.75)" /> Gesendet an {partnerName} auf {translatedTo}
              </div>
              <div style={{ opacity: 0.92, fontStyle: 'italic' }}>{translation}</div>
            </div>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)', marginTop: 4, textAlign: own ? 'right' : 'left' }}>
          {time}{own && ' · Gelesen'}
        </div>
      </div>
    </div>
  );
}

const HELP_ITEMS = [
  { icon: 'store',    title: 'Direkt aus dem Marktplatz', text: 'Der Chat ist mit dem Marktplatz verbunden: Du kannst ein Inserat direkt anfragen und die Zahlung bequem im Chat abschliessen — alles an einem Ort.' },
  { icon: 'language', title: 'Auto-Übersetzung',   text: 'Aktiviere die Übersetzung, um eingehende Nachrichten auf Deutsch zu lesen.' },
  { icon: 'chat',     title: 'Anfrage stellen',    text: 'Schreibe direkt über diesen Chat, um ein Inserat anzufragen.' },
  { icon: 'send',     title: 'Nachricht senden',   text: 'Tippe deine Nachricht und sende sie mit dem Pfeil-Button.' },
  { icon: 'image',    title: 'Bilder & Dateien',   text: 'Du kannst Bilder über das Bild-Icon anhängen.' },
];

export default function ChatScreen() {
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId');
  const { state, actions } = useStore();
  const [translateOn, setTranslateOn] = useState(false);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState(false);
  const isGlass = useLayoutVariant() === 'glass';

  const seedThread = state.chatThreads.find(t => t.id === threadId);
  const listing = listingId ? state.listings.find(l => l.id === listingId) : null;

  // If the thread is not seeded yet, build a placeholder from the listing owner
  // so anfragen from any listing open a real-looking conversation.
  const thread = seedThread || (listing ? {
    id: threadId,
    name: listing.ownerName,
    initials: listing.avatar,
    verified: listing.verified,
    online: false,
    lang: (listing.languages || 'DE').split('·')[0].trim(),
    messages: [],
  } : null);

  // The listing carried in via the link starts attached to the composer as a
  // pending request; it can be dismissed before sending.
  const [attachment, setAttachment] = useState(() => listing);

  const localMessages = thread ? (state.chatMessages[thread.id] || []) : [];
  const allMessages = thread ? [...thread.messages, ...localMessages] : [];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [allMessages.length]);

  if (!thread) return <Navigate to="/chat" replace />;

  const partnerInitials = thread.initials;
  const partnerName = thread.name.split(' ')[0];
  const lang = thread.lang || 'DE';

  function handleSend() {
    if (!input.trim()) return;
    const att = attachment
      ? { id: attachment.id, title: attachment.title, price: attachment.price, tone: attachment.tone }
      : null;
    actions.sendMessage(thread.id, input, 'Faleminderit!', lang, att);
    setInput('');
    setAttachment(null);
    setToast(true);
  }

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />
        <Avatar size={36} initials={thread.initials} verified={thread.verified} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{thread.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
            <span style={{ width: 7, height: 7, borderRadius: 3.5, background: thread.online ? 'var(--success)' : 'var(--ink-3)' }} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>{thread.online ? 'Online' : 'Zuletzt online'} · spricht {lang} · DE</span>
          </div>
        </div>
        <IconButton name="bell" label="Stummschalten" />
        {!isGlass && <HelpButton onClick={() => setHelp(true)} />}
      </div>

      {/* Translation banner */}
      <div style={{ margin: '10px 12px 0', padding: '10px 12px', background: translateOn ? 'var(--accent-tint)' : 'var(--surface-2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: translateOn ? 'var(--accent)' : 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="language" size={18} stroke={2} color={translateOn ? '#fff' : 'var(--ink-3)'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: translateOn ? '#5e2410' : 'var(--ink-2)' }}>
            {translateOn ? `Übersetzung aktiv · ${lang} → DE` : `Übersetzung · ${lang} → DE`}
          </div>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: translateOn ? '#7a3318' : 'var(--ink-3)', marginTop: 1 }}>
            {translateOn ? 'Eingehende Nachrichten werden auf Deutsch übersetzt' : 'Deaktiviert'}
          </div>
        </div>
        <Switch on={translateOn} size="sm" onChange={setTranslateOn} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '8px 14px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', background: 'var(--surface-2)', padding: '4px 12px', borderRadius: 999 }}>Heute · 09:30</span>
        </div>
        {allMessages.map(m => (
          <Bubble key={m.id} {...m} translateOn={translateOn} partnerInitials={partnerInitials} partnerName={partnerName} onListingClick={(id) => navigate(`/marktplatz/${id}`)} />
        ))}
        {/* Typing indicator */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, alignItems: 'flex-end' }}>
          <Avatar size={28} initials={partnerInitials} />
          <div style={{ padding: '8px 14px', borderRadius: '4px 16px 16px 16px', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', gap: 4 }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ink-3)', display: 'inline-block', animation: `egnach-typ 1.4s ${d}s infinite` }} />
            ))}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Pending request attachment — sits right above the input, dismissable */}
      {attachment && (
        <div style={{ padding: '10px 12px 0', background: 'var(--card)', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 8, background: 'var(--primary-tint)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)' }}>
            <Photo width={42} height={42} tone={attachment.tone} radius={8} hint="bild" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--primary)' }}>Anfrage zu Inserat</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.title}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', marginTop: 1 }}>{attachment.price}</div>
            </div>
            <IconButton name="close" size={32} onClick={() => setAttachment(null)} label="Anfrage entfernen" />
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={{ padding: '10px 12px 18px', borderTop: attachment ? 'none' : '1px solid var(--line)', background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <IconButton name="plus" label="Anhang hinzufügen" />
        <div style={{ flex: 1, height: 40, borderRadius: 20, background: 'var(--surface-2)', padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Nachricht schreiben…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink)' }}
          />
          <Icon name="image" size={18} color="var(--ink-3)" />
          <Icon name="mic" size={18} color="var(--ink-3)" />
        </div>
        <button onClick={handleSend} aria-label="Senden" style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="send" size={18} color="#fff" stroke={2} />
        </button>
      </div>
      <HelpSheet open={help} onClose={() => setHelp(false)} title="Chat" intro="So kommunizierst du mit Nachbarn in Egnach Plus." items={HELP_ITEMS} />
      <Toast open={toast} onClose={() => setToast(false)} tone="success" title="Nachricht gesendet" msg="Deine Nachricht wurde zugestellt." />
      {isGlass && <GlassHelpFab onClick={() => setHelp(true)} />}
    </Screen>
  );
}

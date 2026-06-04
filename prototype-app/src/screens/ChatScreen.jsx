import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Screen } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import Avatar from '../components/Avatar.jsx';
import Switch from '../components/Switch.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

function Bubble({ own, text, translatedFrom, translatedTo, translation, time, translateOn }) {
  const showTrans = translateOn && (translatedFrom || translatedTo);
  return (
    <div style={{ display: 'flex', justifyContent: own ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
      {!own && <Avatar size={28} initials="LK" />}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '10px 14px',
          borderRadius: own ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
          background: own ? 'var(--primary)' : 'var(--card)',
          color: own ? '#fff' : 'var(--ink)',
          border: own ? 'none' : '1px solid var(--line)',
          fontFamily: 'var(--font)', fontSize: 13, lineHeight: 1.45,
        }}>
          {showTrans && translatedFrom && (
            <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 5, textTransform: 'uppercase' }}>
              <Icon name="language" size={11} stroke={2} color="var(--accent)" /> Übersetzt aus {translatedFrom}
            </div>
          )}
          <div>{showTrans && translatedFrom ? translation : text}</div>
          {showTrans && translatedFrom && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', fontFamily: 'var(--font)', fontSize: 11, opacity: 0.65, fontStyle: 'italic' }}>{text}</div>
          )}
          {showTrans && translatedTo && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.22)', fontFamily: 'var(--font)', fontSize: 11, lineHeight: 1.4 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, textTransform: 'uppercase' }}>
                <Icon name="language" size={11} stroke={2} color="rgba(255,255,255,0.75)" /> Gesendet an Luan auf {translatedTo}
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

export default function ChatScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listingId');
  const { state, actions } = useStore();
  const thread = state.chatThreads[0];
  const localMessages = state.chatMessages['luan-krasniqi'] || [];
  const allMessages = [...thread.messages, ...localMessages];
  const listing = listingId ? state.listings.find(l => l.id === listingId) : null;
  const [translateOn, setTranslateOn] = useState(true);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [allMessages.length]);

  function handleSend() {
    if (!input.trim()) return;
    actions.sendMessage('luan-krasniqi', input, 'Faleminderit!', 'SQ');
    setInput('');
  }

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />
        <Avatar size={36} initials="LK" verified />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>Luan Krasniqi</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
            <span style={{ width: 7, height: 7, borderRadius: 3.5, background: 'var(--success)' }} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>Online · spricht SQ · DE</span>
          </div>
        </div>
        <IconButton name="bell" label="Stummschalten" />
        <IconButton name="options" label="Mehr Optionen" />
      </div>

      {/* Listing reference card */}
      {listing && (
        <div style={{ margin: '10px 12px 0', padding: 10, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <Photo width={44} height={44} tone={listing.tone} radius={8} hint="bild" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{listing.title}</div>
            <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--primary)', fontWeight: 600, marginTop: 1 }}>{listing.price}</div>
          </div>
          <Badge tone="primary" size="sm">{listing.cat}</Badge>
        </div>
      )}

      {/* Translation banner */}
      <div style={{ margin: '10px 12px 0', padding: '10px 12px', background: 'var(--accent-tint)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="language" size={18} stroke={2} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 12, fontWeight: 700, color: '#5e2410' }}>Übersetzung aktiv · SQ → DE</div>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: '#7a3318', marginTop: 1 }}>Eingehende Nachrichten werden auf Deutsch übersetzt</div>
        </div>
        <Switch on={translateOn} size="sm" onChange={setTranslateOn} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '8px 14px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, WebkitOverflowScrolling: 'touch' }}>
        <div style={{ textAlign: 'center', margin: '4px 0' }}>
          <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', background: 'var(--surface-2)', padding: '4px 12px', borderRadius: 999 }}>Heute · 09:30</span>
        </div>
        {allMessages.map(m => (
          <Bubble key={m.id} {...m} translateOn={translateOn} />
        ))}
        {/* Typing indicator */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, alignItems: 'flex-end' }}>
          <Avatar size={28} initials="LK" />
          <div style={{ padding: '8px 14px', borderRadius: '4px 16px 16px 16px', background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', gap: 4 }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--ink-3)', display: 'inline-block', animation: `egnach-typ 1.4s ${d}s infinite` }} />
            ))}
          </div>
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div style={{ padding: '10px 12px 18px', borderTop: '1px solid var(--line)', background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
    </Screen>
  );
}

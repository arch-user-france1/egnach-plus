import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Screen, Body, HelpButton, HelpSheet } from '../components/index.js';
import IconButton from '../components/IconButton.jsx';
import Avatar from '../components/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

const HELP_ITEMS = [
  { icon: 'chat',     title: 'Unterhaltungen',    text: 'Hier siehst du alle deine Chats mit Nachbarn auf einen Blick.' },
  { icon: 'language', title: 'Auto-Übersetzung',  text: 'In jedem Chat kannst du Nachrichten automatisch auf Deutsch übersetzen lassen.' },
  { icon: 'search',   title: 'Chat finden',       text: 'Suche nach einer Person, um eine bestehende Unterhaltung zu öffnen.' },
  { icon: 'shield',   title: 'Verifizierte Profile', text: 'Profile mit grünem Häkchen wurden durch die Gemeinde Egnach verifiziert.' },
];

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };
const rowItem = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'tween', duration: 0.24 } },
};

function preview(thread) {
  const last = thread.messages[thread.messages.length - 1];
  if (!last) return 'Noch keine Nachrichten';
  const text = last.translation || last.text;
  return last.own ? `Du: ${text}` : text;
}

export default function ChatListScreen() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [help, setHelp] = useState(false);

  const threads = state.chatThreads;
  const unreadTotal = threads.reduce((n, t) => n + (t.unread || 0), 0);

  return (
    <Screen background="var(--surface)">
      <div style={{ padding: '10px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: 'var(--ink)' }}>Chat</h1>
          <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>
            {threads.length} Unterhaltungen{unreadTotal > 0 ? ` · ${unreadTotal} ungelesen` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconButton name="search" label="Suchen" />
          <HelpButton onClick={() => setHelp(true)} />
        </div>
      </div>

      <Body>
        <motion.div variants={stagger} initial="hidden" animate="visible" style={{ padding: '6px 12px 0', display: 'flex', flexDirection: 'column' }}>
          {threads.map(thread => (
            <motion.div key={thread.id} variants={rowItem}>
              <button
                onClick={() => navigate(`/chat/${thread.id}`)}
                style={{
                  width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
                  borderRadius: 'var(--radius-sm)', padding: '10px 8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar size={48} initials={thread.initials} verified={thread.verified} />
                  {thread.online && (
                    <span style={{ position: 'absolute', right: 0, top: 2, width: 11, height: 11, borderRadius: 6, background: 'var(--success)', border: '2px solid var(--surface)' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.name}</span>
                    {thread.lang && thread.lang !== 'DE' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font)', fontSize: 9, fontWeight: 700, letterSpacing: 0.4, color: 'var(--accent)', background: 'var(--accent-tint)', padding: '2px 6px', borderRadius: 999, flexShrink: 0 }}>
                        <Icon name="language" size={9} stroke={2} color="var(--accent)" />{thread.lang}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font)', fontSize: 12, marginTop: 3,
                    color: thread.unread ? 'var(--ink-2)' : 'var(--ink-3)',
                    fontWeight: thread.unread ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{preview(thread)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: thread.unread ? 'var(--accent)' : 'var(--ink-3)', fontWeight: thread.unread ? 700 : 400 }}>{thread.time}</span>
                  {thread.unread > 0 && (
                    <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: 'var(--accent)', color: '#fff', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{thread.unread}</span>
                  )}
                </div>
              </button>
              <div style={{ height: 1, background: 'var(--line)', marginLeft: 68 }} />
            </motion.div>
          ))}
        </motion.div>

        <div style={{ height: 96 }} />
      </Body>

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Chat" intro="Deine Unterhaltungen mit Nachbarn in Egnach Plus." items={HELP_ITEMS} />
    </Screen>
  );
}
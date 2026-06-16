import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Body, HelpSheet, Toast } from '../components/index.js';
import TopBar from '../components/TopBar.jsx';
import IconButton from '../components/IconButton.jsx';
import { useStore } from '../hooks/useStore.js';
import { useLayoutVariant } from '../hooks/useLayoutVariant.js';

/* ─── Local sub-components ──────────────────────────────────────── */
function FlipSwitch({ on, onChange }) {
  return (
    <div
      role="switch" aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 50, height: 30, borderRadius: 15,
        background: on ? 'var(--primary)' : 'var(--line-2)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3, left: on ? 23 : 3,
        width: 24, height: 24, borderRadius: 12,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
        transition: 'left 0.2s',
      }} />
    </div>
  );
}

function ToggleRow({ icon, label, value, on, onChange, sub = false, last = false }) {
  return (
    <div style={{
      padding: sub ? '10px 16px 10px 52px' : '13px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: last ? 'none' : '1px solid var(--line)',
      background: 'transparent',
    }}>
      {!sub && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font)', fontSize: sub ? 13 : 14, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
        {value && <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{value}</div>}
      </div>
      <FlipSwitch on={on} onChange={onChange} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ padding: '20px 16px 6px', fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', letterSpacing: 1 }}>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ margin: '0 16px', borderRadius: 'var(--radius)', background: 'var(--card)', border: '1px solid var(--line)', overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

/* ─── Help content ──────────────────────────────────────────────── */
const HELP_ITEMS = [
  { icon: 'info',     title: 'Einfach-Modus',      text: 'Blendet erweiterte Optionen aus, damit die App übersichtlicher wirkt.' },
  { icon: 'edit',     title: 'Schriftgrösse',       text: 'Passe die Schriftgrösse an, um die Lesbarkeit zu verbessern.' },
  { icon: 'bell',     title: 'Benachrichtigungen',  text: 'Steuere, welche Benachrichtigungen du erhalten möchtest.' },
  { icon: 'shield',   title: 'Datenschutz',         text: 'Bestimme, wer dein Profil und deinen Standort sehen darf.' },
];

const FONT_SIZES = [
  { label: 'A', px: 12, scale: 0.9 },
  { label: 'A', px: 15, scale: 1.0 },
  { label: 'A', px: 18, scale: 1.15 },
  { label: 'A', px: 21, scale: 1.32 },
];

const PROFILE_OPTIONS = ['Alle', 'Verifizierte', 'Niemand'];
const LOCATION_OPTIONS = ['Genau', 'Ungefähr', 'Aus'];

// A/B-Test: Layout-Darstellung. 'System' folgt der A/B-Zuteilung.
const LAYOUT_OPTIONS = [
  { value: 'system',  label: 'Automatisch' },
  { value: 'classic', label: 'Klassisch' },
  { value: 'glass',   label: 'Glas' },
];

/* ─── Screen ────────────────────────────────────────────────────── */
export default function SettingsScreen() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const activeVariant = useLayoutVariant();

  const [einfach, setEinfach] = useState(false);
  const fontIdx = FONT_SIZES.reduce(
    (best, f, i) => Math.abs(f.scale - state.textScale) < Math.abs(FONT_SIZES[best].scale - state.textScale) ? i : best,
    0,
  );

  const [notifMaster, setNotifMaster] = useState(true);
  const [notifChat, setNotifChat] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifMarket, setNotifMarket] = useState(false);
  const [notifWeekly, setNotifWeekly] = useState(true);

  const [profileVis, setProfileVis] = useState('Alle');
  const [locationVis, setLocationVis] = useState('Ungefähr');
  const [readReceipts, setReadReceipts] = useState(true);

  const [help, setHelp] = useState(false);
  const [toast, setToast] = useState(false);

  const showNotifSubs = notifMaster && !einfach;

  return (
    <Screen background="var(--surface)">
      <TopBar
        leading={<IconButton name="back" onClick={() => navigate(-1)} label="Zurück" />}
        title="Einstellungen"
        onHelp={() => setHelp(true)}
      />

      <Body>

        {/* Einfach-Modus */}
        <SectionLabel>MODUS</SectionLabel>
        <Card>
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: einfach ? '1px solid var(--line)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Einfach-Modus</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>Nur die wichtigsten Funktionen anzeigen</div>
            </div>
            <FlipSwitch on={einfach} onChange={setEinfach} />
          </div>
          {einfach && (
            <div style={{ padding: '10px 16px 12px 60px', fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>
              Erweiterte Optionen sind ausgeblendet.
            </div>
          )}
        </Card>

        {/* Schriftgrösse */}
        <SectionLabel>SCHRIFTGRÖSSE</SectionLabel>
        <Card>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {FONT_SIZES.map((f, i) => {
                const active = fontIdx === i;
                return (
                  <button
                    key={i}
                    onClick={() => actions.setTextScale(f.scale)}
                    style={{
                      flex: 1, height: 44, borderRadius: 'var(--radius-sm)',
                      border: `${active ? 1.5 : 1}px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary-tint)' : 'var(--card)',
                      fontFamily: 'var(--font)', fontSize: f.px, fontWeight: active ? 700 : 500,
                      color: active ? 'var(--primary)' : 'var(--ink)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            {/* Die App skaliert live mit – fixe 15px zeigen hier die tatsächlich angewendete Grösse */}
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
                Grüezi {state.user.name.split(' ')[0]}!
              </span>
            </div>
          </div>
        </Card>

        {/* Darstellung — A/B-Layout-Umschalter */}
        <SectionLabel>DARSTELLUNG</SectionLabel>
        <Card>
          <div style={{ padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Layout</div>
                <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>
                  «Automatisch» folgt dem laufenden A/B-Test · aktiv: {activeVariant === 'glass' ? 'Glas' : 'Klassisch'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {LAYOUT_OPTIONS.map(opt => {
                const active = (state.layoutOverride || 'system') === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => actions.setLayoutOverride(opt.value)}
                    aria-pressed={active}
                    style={{
                      flex: 1, height: 38, borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary)' : 'var(--card)',
                      fontFamily: 'var(--font)', fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? '#fff' : 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >{opt.label}</button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Benachrichtigungen */}
        <SectionLabel>BENACHRICHTIGUNGEN</SectionLabel>
        <Card>
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: showNotifSubs ? '1px solid var(--line)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Benachrichtigungen</div>
            </div>
            <FlipSwitch on={notifMaster} onChange={setNotifMaster} />
          </div>
          {showNotifSubs && (
            <>
              <div style={{ padding: '10px 16px 10px 52px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Nachrichten</div>
                <FlipSwitch on={notifChat} onChange={setNotifChat} />
              </div>
              <div style={{ padding: '10px 16px 10px 52px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Anlässe in der Nähe</div>
                <FlipSwitch on={notifEvents} onChange={setNotifEvents} />
              </div>
              <div style={{ padding: '10px 16px 10px 52px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Marktplatz-Antworten</div>
                <FlipSwitch on={notifMarket} onChange={setNotifMarket} />
              </div>
              <div style={{ padding: '10px 16px 10px 52px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, fontFamily: 'var(--font)', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>Wochenübersicht</div>
                <FlipSwitch on={notifWeekly} onChange={setNotifWeekly} />
              </div>
            </>
          )}
        </Card>

        {/* Datenschutz */}
        <SectionLabel>DATENSCHUTZ</SectionLabel>
        <Card>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Mein Profil sehen</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {PROFILE_OPTIONS.map(opt => {
                const active = profileVis === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setProfileVis(opt)}
                    style={{
                      flex: 1, height: 36, borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary)' : 'var(--card)',
                      fontFamily: 'var(--font)', fontSize: 12, fontWeight: active ? 700 : 500,
                      color: active ? '#fff' : 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >{opt}</button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>Mein Standort</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {LOCATION_OPTIONS.map(opt => {
                const active = locationVis === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setLocationVis(opt)}
                    style={{
                      flex: 1, height: 36, borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--line)'}`,
                      background: active ? 'var(--primary)' : 'var(--card)',
                      fontFamily: 'var(--font)', fontSize: 12, fontWeight: active ? 700 : 500,
                      color: active ? '#fff' : 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >{opt}</button>
                );
              })}
            </div>
          </div>
          {/* Lesebestätigungen is always visible */}
          <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>Lesebestätigungen</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>Zeigt an, wenn du eine Nachricht gelesen hast</div>
            </div>
            <FlipSwitch on={readReceipts} onChange={setReadReceipts} />
          </div>
        </Card>

        <div style={{ padding: '12px 16px 4px', fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)', textAlign: 'center' }}>
          Deine Daten bleiben bei der Gemeinde Egnach.
        </div>

        <div style={{ padding: '16px 16px 32px' }}>
          <button
            onClick={() => setToast(true)}
            style={{
              width: '100%', height: 52, borderRadius: 'var(--radius-sm)',
              background: 'var(--primary)', border: 'none',
              fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700, color: '#fff',
              cursor: 'pointer',
            }}
          >
            Einstellungen speichern
          </button>
        </div>
        {/* Glass: Inhalt über der schwebenden Navigation freihalten. */}
        {activeVariant === 'glass' && <div style={{ height: 96 }} />}
      </Body>

      <HelpSheet open={help} onClose={() => setHelp(false)} title="Einstellungen" intro="Passe Egnach Plus an deine Bedürfnisse an." items={HELP_ITEMS} />
      <Toast open={toast} onClose={() => setToast(false)} tone="success" title="Einstellungen gespeichert" msg="Deine Anpassungen wurden übernommen." />
    </Screen>
  );
}

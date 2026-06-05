import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';

/* ─── HelpButton ──────────────────────────────────────────────── */
export function HelpButton({ onClick, size = 32, tone = 'soft' }) {
  const ghost = tone === 'ghost';
  return (
    <button
      onClick={onClick}
      aria-label="Hilfe"
      style={{
        width: size, height: size, borderRadius: '50%',
        background: ghost ? 'transparent' : 'var(--surface-2)',
        border: ghost ? 'none' : '1px solid var(--line)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        fontFamily: 'var(--font)', fontSize: Math.round(size * 0.5), fontWeight: 700,
        color: 'var(--ink-2)',
      }}
    >
      ?
    </button>
  );
}

/* ─── Scrim ───────────────────────────────────────────────────── */
function Scrim({ zIndex = 90, onTap }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onTap}
      style={{
        position: 'absolute', inset: 0, zIndex,
        background: 'rgba(13,22,34,0.42)',
      }}
    />
  );
}

/* ─── HelpSheet ───────────────────────────────────────────────── */
const sheetSpring = { type: 'spring', damping: 28, stiffness: 320 };

export function HelpSheet({ open, onClose, title = 'Hilfe', intro, items = [] }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <Scrim onTap={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={sheetSpring}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 91,
              background: 'var(--card)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              boxShadow: '0 -10px 40px rgba(13,22,34,0.22)',
              maxHeight: '82%',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* grab handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
              <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
            </div>

            {/* header */}
            <div style={{ padding: '14px 20px 12px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: 'var(--primary-tint)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name="info" size={20} color="var(--primary)" stroke={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
                {intro && <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.5 }}>{intro}</div>}
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--surface-2)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Icon name="close" size={14} stroke={2} color="var(--ink-2)" />
              </button>
            </div>

            {/* items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 8px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: 'var(--surface-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={item.icon || 'info'} size={16} color="var(--ink-2)" stroke={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.title}</div>
                    {item.text && <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-2)', marginTop: 2, lineHeight: 1.5 }}>{item.text}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div style={{ padding: '12px 20px 24px', borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  height: 48, borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'var(--primary)', color: '#fff',
                  fontFamily: 'var(--font)', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Verstanden
              </button>
              <button
                style={{
                  height: 40, background: 'none', border: 'none',
                  fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600,
                  color: 'var(--primary)', cursor: 'pointer',
                }}
              >
                Support kontaktieren
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Toast ───────────────────────────────────────────────────── */
const TONE_COLORS = {
  success: '#1F8A5B',
  error:   'var(--danger)',
  info:    'var(--primary)',
};

export function Toast({ open, onClose, tone = 'success', title, msg, action, bottom = 24 }) {
  useEffect(() => {
    if (open) {
      const t = setTimeout(onClose, 3200);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 14, right: 14, bottom, zIndex: 80,
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 12px 32px rgba(13,22,34,0.20)',
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: tone === 'success' ? '#E6F5EC' : tone === 'error' ? '#FBEAE7' : 'var(--primary-tint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon
              name={tone === 'success' ? 'check' : tone === 'error' ? 'warning' : 'info'}
              size={16} color={TONE_COLORS[tone]} stroke={2.5}
            />
          </div>
          <div style={{ flex: 1 }}>
            {title && <div style={{ fontFamily: 'var(--font)', fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>}
            {msg && <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-2)', marginTop: 1 }}>{msg}</div>}
          </div>
          {action && (
            <button
              onClick={action.onClick}
              style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: TONE_COLORS[tone], cursor: 'pointer', flexShrink: 0 }}
            >
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── ConfirmDialog ───────────────────────────────────────────── */
const dialogSpring = { type: 'spring', damping: 28, stiffness: 380 };

export function ConfirmDialog({
  open, onCancel, onConfirm,
  tone = 'danger', icon = 'trash',
  title, body,
  cancelLabel = 'Abbrechen', confirmLabel = 'Löschen',
}) {
  const isDanger = tone === 'danger';
  const discBg    = isDanger ? '#FAE5E2' : 'var(--primary-tint)';
  const discColor = isDanger ? 'var(--danger)' : 'var(--primary)';
  const confirmBg = isDanger ? 'var(--danger)' : 'var(--primary)';

  return (
    <AnimatePresence>
      {open && (
        <>
          <Scrim zIndex={99} onTap={onCancel} />
          <div style={{
            position: 'absolute', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 24px',
            pointerEvents: 'none',
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={dialogSpring}
              style={{
                width: '100%', maxWidth: 320,
                background: 'var(--card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 60px rgba(13,22,34,0.32)',
                padding: '22px 20px 18px',
                textAlign: 'center',
                pointerEvents: 'all',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: discBg, margin: '0 auto 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={icon} size={22} color={discColor} stroke={2} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</div>
              {body && <div style={{ fontFamily: 'var(--font)', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 20 }}>{body}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={onCancel}
                  style={{
                    flex: 1, height: 48, borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--line-2)', background: 'var(--card)',
                    fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)',
                    cursor: 'pointer',
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  style={{
                    flex: 1, height: 48, borderRadius: 'var(--radius-sm)',
                    border: 'none', background: confirmBg,
                    fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── ErrorNote ───────────────────────────────────────────────── */
export function ErrorNote({ title, body, retryLabel, onRetry }) {
  return (
    <div style={{
      background: '#FBEAE7', border: '1px solid #F0C8C1',
      borderRadius: 'var(--radius-sm)', padding: 14,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name="warning" size={16} color="var(--danger)" stroke={2} />
      </div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, color: '#7a1a15', marginBottom: 2 }}>{title}</div>}
        {body && <div style={{ fontFamily: 'var(--font)', fontSize: 12.5, color: '#8a3a33', lineHeight: 1.5 }}>{body}</div>}
        {retryLabel && onRetry && (
          <button
            onClick={onRetry}
            style={{
              marginTop: 10, height: 36, padding: '0 14px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--danger)', background: 'transparent',
              fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, color: 'var(--danger)',
              cursor: 'pointer',
            }}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}

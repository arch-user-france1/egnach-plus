import { useNavigate, useParams } from 'react-router-dom';
import { Screen, Body } from '../components/index.js';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import Avatar from '../components/Avatar.jsx';
import Mark from '../components/Mark.jsx';
import Chip from '../components/Chip.jsx';
import Photo from '../components/Photo.jsx';
import Icon from '../components/Icon.jsx';
import { useStore } from '../hooks/useStore.js';

export default function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const event = state.events.find(e => e.id === id) || state.events[0];
  const isGoing = state.rsvp.includes(event.id);

  return (
    <Screen background="var(--surface)" style={{ overflowY: 'auto' }}>
      <div style={{ position: 'relative', height: 240, flexShrink: 0 }}>
        <Photo width="100%" height={240} radius={0} tone={event.tone} hint={event.title} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(15,30,55,0.55) 100%)' }} />
        <div style={{ position: 'absolute', top: 8, left: 12, right: 12, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Zurück">
            <Icon name="back" size={20} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Teilen">
              <Icon name="share" size={18} />
            </button>
            <button style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.92)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isGoing ? 'var(--danger)' : 'var(--ink)' }} aria-label="Merken">
              <Icon name="heart" size={18} color={isGoing ? 'var(--danger)' : 'currentColor'} />
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 18, right: 18, bottom: 14 }}>
          <Badge tone="accent" size="md">{event.cats.slice(0, 2).join(' · ').toUpperCase()}</Badge>
          <h1 style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: '#fff', lineHeight: 1.15 }}>{event.title}</h1>
        </div>
      </div>

      <div style={{ padding: '14px 18px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { icon: 'calendar', main: `${event.date} · ${event.time}`, sub: 'Bei jedem Wetter', action: '+ Kalender' },
          { icon: 'pin',      main: event.location, sub: event.address,
            action: { icon: 'map', label: 'Auf der Karte anzeigen', onAction: () => navigate('/karte', { state: { pin: event.id } }) } },
          { icon: 'euro',     main: event.free ? 'Eintritt frei' : 'Kostenpflichtig', sub: 'Verpflegung vor Ort' },
          { icon: 'language', main: event.languages, sub: `Programm in ${event.languages.split(' · ').length} Sprachen` },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-tint)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={row.icon} size={18} stroke={2} color="var(--primary)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{row.main}</div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{row.sub}</div>
            </div>
            {row.action && (
              typeof row.action === 'string'
                ? <button style={{ background: 'none', border: 'none', fontFamily: 'var(--font)', fontSize: 12, fontWeight: 600, color: 'var(--primary)', flexShrink: 0, cursor: 'pointer', padding: 0, minHeight: 44, display: 'flex', alignItems: 'center' }}>{row.action}</button>
                : <button onClick={row.action.onAction} aria-label={row.action.label} style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-tint)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--primary)' }}>
                    <Icon name={row.action.icon} size={20} stroke={1.8} color="var(--primary)" />
                  </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--line)', margin: '0 18px' }} />

      <div style={{ padding: '16px 18px 8px' }}>
        <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Über den Anlass</h3>
        <p style={{ margin: 0, fontFamily: 'var(--font)', fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)' }}>{event.description}</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {event.cats.map((c, i) => <Chip key={i} size="sm" tone="soft">{c}</Chip>)}
        </div>
      </div>

      <div style={{ padding: '14px 18px 8px' }}>
        <Card padding={14}>
          <div style={{ fontFamily: 'var(--font)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: 1, fontWeight: 700 }}>ORGANISIERT VON</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Mark size={42} variant="wappen" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{event.organizer}</span>
                <Badge tone="success" size="sm"><Icon name="check" size={9} stroke={3} color="#155E3E" /> Offiziell</Badge>
              </div>
              <div style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--ink-3)' }}>Offizielle Veranstaltung · seit 1987</div>
            </div>
            <Icon name="chevron" size={16} color="var(--ink-3)" />
          </div>
        </Card>
      </div>

      <div style={{ padding: '14px 18px 16px' }}>
        <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{event.attendees + (isGoing ? 1 : 0)} nehmen teil</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {['SM','TH','AR','LB','NK'].map((n, i) => (
            <div key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
              <Avatar size={34} initials={n} />
            </div>
          ))}
          <div style={{ marginLeft: -10, width: 34, height: 34, borderRadius: 17, background: 'var(--surface-2)', border: '2px solid var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)', fontSize: 10, fontWeight: 700, color: 'var(--ink-2)' }}>+{event.attendees - 5}</div>
          <div style={{ marginLeft: 12, fontFamily: 'var(--font)', fontSize: 12, color: 'var(--ink-3)' }}>davon {event.neighbors} Nachbarn aus deinem Quartier</div>
        </div>
      </div>

      <div style={{ height: 100 }} />

      <div style={{ position: 'sticky', bottom: 0, padding: '12px 16px 22px', background: 'var(--card)', borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
        <button style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--line-2)', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Teilen">
          <Icon name="share" size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <Button
            full size="lg"
            variant={isGoing ? 'outline' : 'primary'}
            leading={<Icon name={isGoing ? 'check' : 'check'} size={18} color={isGoing ? 'var(--ink)' : '#fff'} stroke={2.2} />}
            onClick={() => actions.toggleRsvp(event.id)}
          >
            {isGoing ? 'Abmelden' : 'Teilnehmen'}
          </Button>
        </div>
      </div>
    </Screen>
  );
}

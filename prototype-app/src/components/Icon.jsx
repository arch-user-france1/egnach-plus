const PATHS = {
  search:     'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm5.3 11.3 4.2 4.2',
  bell:       'M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Zm4 4a2 2 0 0 0 4 0',
  user:       'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  chat:       'M4 5h16v11H8l-4 4V5Z',
  home:       'M3 11 12 4l9 7v9h-6v-6H9v6H3v-9Z',
  store:      'M4 9h16l-1 11H5L4 9Zm0 0 1.5-4h13L20 9M9 13a3 3 0 0 0 6 0',
  calendar:   'M5 6h14v14H5V6Zm0 4h14M9 3v4m6-4v4',
  map:        'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-14v14',
  pin:        'M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13Zm0-10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  back:       'M14 5l-7 7 7 7',
  chevron:    'M9 5l7 7-7 7',
  chevronDown:'M5 9l7 7 7-7',
  close:      'M6 6l12 12M18 6 6 18',
  plus:       'M12 5v14M5 12h14',
  send:       'M3 12 21 4 15 21l-3-8-9-1Z',
  filter:     'M4 6h16M7 12h10m-7 6h4',
  options:    'M12 6h.01M12 12h.01M12 18h.01',
  share:      'M4 12v7h16v-7M12 3v12m0-12-4 4m4-4 4 4',
  heart:      'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z',
  check:      'M4 12l5 5 11-11',
  globe:      'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 0c3 3 3 15 0 18M3 12h18M5 7h14M5 17h14',
  shield:     'M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z',
  camera:     'M4 8h4l1-2h6l1 2h4v11H4V8Zm8 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  image:      'M4 5h16v14H4V5Zm0 11 5-5 4 4 3-3 4 4',
  star:       'M12 4l2.6 5.4 5.9.8-4.3 4 1 5.8L12 17.3 6.8 20l1-5.8-4.3-4 5.9-.8L12 4Z',
  arrow:      'M5 12h14m-5-5 5 5-5 5',
  arrowSmall: 'M4 12h12m-3-3 3 3-3 3',
  info:       'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 7v6m0-9v.01',
  lock:       'M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3',
  euro:       'M16 6a6 6 0 1 0 0 12M4 10h7M4 14h7',
  swiss:      'M9 4h6v5h5v6h-5v5H9v-5H4V9h5V4Z',
  briefcase:  'M4 8h16v12H4V8Zm5 0V5h6v3M4 13h16',
  car:        'M5 13l2-6h10l2 6v4h-2v2h-2v-2H9v2H7v-2H5v-4Zm2 0h10',
  language:   'M3 6h10M8 4v2c0 5-2.5 9-5 11m2-7c1 2 3 4 7 5M14 20l4-9 4 9m-7-2h6',
  qr:         'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4 4h2v2h-2v-2Zm4 0h2v2h-2v-2Z',
  fingerprint:'M12 4a8 8 0 0 0-8 8m4 8a8 8 0 0 1 0-12m4 14a4 4 0 0 0 0-12m4 12a8 8 0 0 0 0-12',
  paperclip:  'M18 7 9 16a3 3 0 0 0 4 4l9-9a5 5 0 0 0-7-7L5 14a7 7 0 0 0 10 10',
  mic:        'M12 4a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V7a3 3 0 0 0-3-3Zm-6 8a6 6 0 0 0 12 0M12 18v3',
  edit:       'M4 20h4l11-11-4-4L4 16v4Zm10-13 4 4',
  log:        'M5 5h14v14H5V5Zm3 4h8M8 12h8M8 15h5',
  trash:      'M5 7h14M9 7V5h6v2m-7 0 1 13h8l1-13',
  pause:      'M9 5v14m6-14v14',
  play:       'M7 5l11 7-11 7V5Z',
  warning:    'M12 4 3 20h18L12 4Zm0 6v5m0 2v.01',
  reload:     'M4 12a8 8 0 0 1 14-5l2-2m0 7V5M20 12a8 8 0 0 1-14 5l-2 2m0-7v7',
  paws:       'M6 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-3 7c-3 0-5-2-5-4 0-1.5 2-3 5-3s5 1.5 5 3-2 4-5 4Z',
};

export default function Icon({ name, size = 20, stroke = 1.6, color = 'currentColor' }) {
  const d = PATHS[name];
  if (!d) return <div style={{ width: size, height: size, border: '1px dashed currentColor', opacity: 0.4, flexShrink: 0 }} />;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

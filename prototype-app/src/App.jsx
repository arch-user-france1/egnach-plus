import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { buildCssVars } from './theme/theme.js';
import { useStore } from './hooks/useStore.js';
import { useLayoutVariant } from './hooks/useLayoutVariant.js';
import { trackExposureOnce } from './model/analytics.js';
import TabBar from './components/TabBar.jsx';
import GlassBottomBar from './components/glass/GlassBottomBar.jsx';
import { GlassChromeProvider } from './components/glass/GlassChrome.jsx';
import CookieBanner from './components/CookieBanner.jsx';

import SplashScreen        from './screens/SplashScreen.jsx';
import OnboardingScreen    from './screens/OnboardingScreen.jsx';
import LoginScreen         from './screens/LoginScreen.jsx';
import RegisterScreen      from './screens/RegisterScreen.jsx';
import VerifyScreen        from './screens/VerifyScreen.jsx';
import HomeScreen          from './screens/HomeScreen.jsx';
import MapScreen           from './screens/MapScreen.jsx';
import MarketplaceScreen   from './screens/MarketplaceScreen.jsx';
import ListingDetailScreen from './screens/ListingDetailScreen.jsx';
import CreateListingScreen from './screens/CreateListingScreen.jsx';
import EventsScreen        from './screens/EventsScreen.jsx';
import EventDetailScreen   from './screens/EventDetailScreen.jsx';
import ChatListScreen      from './screens/ChatListScreen.jsx';
import ChatScreen          from './screens/ChatScreen.jsx';
import ProfileScreen       from './screens/ProfileScreen.jsx';
import AvailabilityScreen  from './screens/AvailabilityScreen.jsx';
import CreateEventScreen   from './screens/CreateEventScreen.jsx';
import EditListingScreen   from './screens/EditListingScreen.jsx';

// Variante B (Glass) — neu gestaltete Browse-Screens des A/B-Tests
import GlassHomeScreen        from './screens/glass/GlassHomeScreen.jsx';
import GlassMarketplaceScreen from './screens/glass/GlassMarketplaceScreen.jsx';
import GlassEventsScreen      from './screens/glass/GlassEventsScreen.jsx';

const TAB_ROUTES = {
  '/home':       0,
  '/karte':      0,
  '/map':        0,
  '/marktplatz': 1,
  '/anlaesse':   2,
  '/chat':       3,
  '/profil':     4,
};

// Routen des Anmelde-/Onboarding-Flusses — hier erscheint keine Navigation.
const CHROMELESS = new Set(['/', '/splash', '/onboarding', '/login', '/register', '/verify']);

// In der Glass-Variante bleibt die Navigation überall sichtbar (auch beim
// Erstellen). Diese Zuordnung hebt für eine beliebige Route den passenden Tab
// hervor (Detail-/Erstellen-Seiten markieren ihren Eltern-Tab).
function glassNavTab(pathname) {
  if (pathname.startsWith('/marktplatz') || pathname.startsWith('/inserat')) return 1;
  if (pathname.startsWith('/anlaesse') || pathname.startsWith('/anlass'))    return 2;
  if (pathname.startsWith('/chat'))                                          return 3;
  if (pathname.startsWith('/profil') || pathname.startsWith('/verfuegbarkeit')) return 4;
  if (pathname.startsWith('/home') || pathname.startsWith('/karte') || pathname.startsWith('/map')) return 0;
  return -1;
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.96 },
  in:      { opacity: 1, scale: 1 },
  out:     { opacity: 0, scale: 0.96 },
};
const pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.2 };

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useStore();
  // Eine Entscheidung, so hoch wie möglich im Baum: Welche Variante rendert?
  const variant = useLayoutVariant();
  const isGlass = variant === 'glass';

  const activeTab = TAB_ROUTES[location.pathname];
  const showTabBar = activeTab !== undefined;

  // Exposure/Assignment loggen, sobald der Nutzer eine Variante erstmals sieht.
  useEffect(() => { trackExposureOnce(variant); }, [variant]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={pageTransition}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Routes location={location}>
              <Route path="/"              element={<Navigate to={state.onboarded ? '/home' : '/splash'} replace />} />
              <Route path="/splash"        element={<SplashScreen />} />
              <Route path="/onboarding"    element={<OnboardingScreen />} />
              <Route path="/login"         element={<LoginScreen />} />
              <Route path="/register"      element={<RegisterScreen />} />
              <Route path="/verify"        element={<VerifyScreen />} />
              {/* Die drei Browse-Screens wechseln je Variante (gleiche Daten, andere Chrome). */}
              <Route path="/home"          element={isGlass ? <GlassHomeScreen /> : <HomeScreen />} />
              <Route path="/karte"         element={<MapScreen />} />
              <Route path="/map"           element={<MapScreen />} />
              <Route path="/marktplatz"    element={isGlass ? <GlassMarketplaceScreen /> : <MarketplaceScreen />} />
              <Route path="/marktplatz/:id" element={<ListingDetailScreen />} />
              <Route path="/inserat-erstellen" element={<CreateListingScreen />} />
              <Route path="/inserat-bearbeiten/:id" element={<EditListingScreen />} />
              <Route path="/anlass-erstellen"  element={<CreateEventScreen />} />
              <Route path="/anlaesse"      element={isGlass ? <GlassEventsScreen /> : <EventsScreen />} />
              <Route path="/anlaesse/:id"  element={<EventDetailScreen />} />
              <Route path="/chat"          element={<ChatListScreen />} />
              <Route path="/chat/:threadId" element={<ChatScreen />} />
              <Route path="/profil"        element={<ProfileScreen />} />
              <Route path="/verfuegbarkeit" element={<AvailabilityScreen />} />
              <Route path="*"              element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
        {/* Glass-Variante: schwebende Navigation bleibt überall sichtbar (auch
            beim Erstellen). Seiten mit Hauptaktion melden diese via Kontext;
            die Leiste rückt sie dann neben eine kompakte Navigation. */}
        {isGlass && !CHROMELESS.has(location.pathname) && !location.pathname.startsWith('/chat/') && (
          <GlassBottomBar active={glassNavTab(location.pathname)} onNavigate={(p) => navigate(p)} />
        )}
      </div>
      {/* Classic-Variante: fixe TabBar am unteren Rand. */}
      {showTabBar && !isGlass && <TabBar active={activeTab} onNavigate={(p) => navigate(p)} />}
    </div>
  );
}

function ThemeProvider({ children }) {
  const { state } = useStore();
  useEffect(() => {
    const vars = buildCssVars({ palette: 'egnach', font: 'inter', displayFont: 'fraunces', radius: 14, dark: false });
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, []);
  return children;
}

function PhoneShell({ children }) {
  const { state } = useStore();
  const scale = state.textScale || 1;
  return (
    <div className="phone-shell">
      {/* zoom (statt transform) skaliert mit Reflow, damit das Layout kohärent bleibt */}
      <div style={{ zoom: scale, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <GlassChromeProvider>
          <PhoneShell>
            <AnimatedRoutes />
            <CookieBanner />
          </PhoneShell>
        </GlassChromeProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { buildCssVars } from './theme/theme.js';
import { useStore } from './hooks/useStore.js';
import TabBar from './components/TabBar.jsx';
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
import SettingsScreen      from './screens/SettingsScreen.jsx';

const TAB_ROUTES = {
  '/home':       0,
  '/karte':      0,
  '/map':        0,
  '/marktplatz': 1,
  '/anlaesse':   2,
  '/chat':       3,
  '/profil':     4,
};

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

  const activeTab = TAB_ROUTES[location.pathname];
  const showTabBar = activeTab !== undefined;

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
              <Route path="/home"          element={<HomeScreen />} />
              <Route path="/karte"         element={<MapScreen />} />
              <Route path="/map"           element={<MapScreen />} />
              <Route path="/marktplatz"    element={<MarketplaceScreen />} />
              <Route path="/marktplatz/:id" element={<ListingDetailScreen />} />
              <Route path="/inserat-erstellen" element={<CreateListingScreen />} />
              <Route path="/inserat-bearbeiten/:id" element={<EditListingScreen />} />
              <Route path="/anlass-erstellen"  element={<CreateEventScreen />} />
              <Route path="/anlaesse"      element={<EventsScreen />} />
              <Route path="/anlaesse/:id"  element={<EventDetailScreen />} />
              <Route path="/chat"          element={<ChatListScreen />} />
              <Route path="/chat/:threadId" element={<ChatScreen />} />
              <Route path="/profil"        element={<ProfileScreen />} />
              <Route path="/verfuegbarkeit" element={<AvailabilityScreen />} />
              <Route path="/einstellungen" element={<SettingsScreen />} />
              <Route path="*"              element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      {showTabBar && <TabBar active={activeTab} onNavigate={(p) => navigate(p)} />}
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
        <PhoneShell>
          <AnimatedRoutes />
          <CookieBanner />
        </PhoneShell>
      </ThemeProvider>
    </HashRouter>
  );
}

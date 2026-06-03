import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { buildCssVars } from './theme/theme.js';
import { useStore } from './hooks/useStore.js';

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
import ChatScreen          from './screens/ChatScreen.jsx';
import ProfileScreen       from './screens/ProfileScreen.jsx';
import AvailabilityScreen  from './screens/AvailabilityScreen.jsx';
import CreateEventScreen   from './screens/CreateEventScreen.jsx';

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  in:      { opacity: 1, x: 0 },
  out:     { opacity: 0, x: -40 },
};
const pageTransition = { type: 'tween', ease: 'easeInOut', duration: 0.22 };

function AnimatedRoutes() {
  const location = useLocation();
  const { state } = useStore();

  return (
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
          <Route path="/anlass-erstellen"  element={<CreateEventScreen />} />
          <Route path="/anlaesse"      element={<EventsScreen />} />
          <Route path="/anlaesse/:id"  element={<EventDetailScreen />} />
          <Route path="/chat"          element={<ChatScreen />} />
          <Route path="/profil"        element={<ProfileScreen />} />
          <Route path="/verfuegbarkeit" element={<AvailabilityScreen />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
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

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <div className="phone-shell" style={{ position: 'relative' }}>
          <AnimatedRoutes />
        </div>
      </ThemeProvider>
    </HashRouter>
  );
}

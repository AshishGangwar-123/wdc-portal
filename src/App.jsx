import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CustomCursor from './components/CustomCursor';
import CursorVisualEffects from './components/CursorVisualEffects';
import AdminPanel from './components/AdminPanel';
import AdminAuthModal from './components/AdminAuthModal';
import Loader from './components/Loader';
import UserDashboard from './components/UserDashboard';

import GameRoom from './gameroom/GameRoom';

export default function App() {
  const [view, setView] = useState(() => {
    return window.location.hash === '#wdcadmin' ? 'admin' : 'landing';
  });
  const [isSiteLoaded, setIsSiteLoaded] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showGameRoom, setShowGameRoom] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      const token = sessionStorage.getItem('wdc_admin_auth_token');
      return Boolean(token && token.startsWith('wdc_admin_token_'));
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#wdcadmin') {
        setView('admin');
      } else if (window.location.hash === '#home' || window.location.hash === '') {
        setView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchView = (newView) => {
    setView(newView);
    if (newView === 'admin') {
      window.location.hash = 'wdcadmin';
    } else if (window.location.hash === '#wdcadmin' || window.location.hash === '#admin') {
      window.location.hash = '';
    }
  };

  // Persistent User Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wdc_student_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLoginSuccess = (userSession) => {
    setCurrentUser(userSession);
    try {
      localStorage.setItem('wdc_student_user', JSON.stringify(userSession));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('wdc_student_user');
    } catch (e) {}
  };

  // Trigger smooth scroll to AI Concierge section on Landing Page
  const handleLaunchAI = () => {
    setView('landing');
    setTimeout(() => {
      const el = document.querySelector('#ai-concierge') || document.querySelector('#hero');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#080914' }}>
      {/* 0. INITIAL SITE PRELOADER */}
      {!isSiteLoaded && <Loader onComplete={() => setIsSiteLoaded(true)} />}

      {/* Custom Mouse Follower Cursor & Particle Torch Visual Effects */}
      <CustomCursor />
      <CursorVisualEffects />

      {/* Global Glass Navbar */}
      <Navbar
        onStartAI={handleLaunchAI}
        currentView={view}
        onGoLanding={() => switchView('landing')}
        onOpenDashboard={() => setShowDashboardModal(true)}
        onOpenGameRoom={() => setShowGameRoom(true)}
        currentUser={currentUser}
      />

      {/* 1. LANDING PAGE VIEW (Includes AI Concierge Widget) */}
      {view === 'landing' && (
        <LandingPage
          isSiteLoaded={isSiteLoaded}
          onLaunchAI={handleLaunchAI}
          onOpenGameRoom={() => setShowGameRoom(true)}
        />
      )}

      {/* 2. ADMIN DASHBOARD PANEL VIEW (PASSWORD PROTECTED) */}
      {view === 'admin' && (
        isAdminAuthenticated ? (
          <AdminPanel onBack={() => switchView('landing')} />
        ) : (
          <AdminAuthModal
            onSuccess={() => setIsAdminAuthenticated(true)}
            onCancel={() => switchView('landing')}
          />
        )
      )}

      {/* 3. STUDENT DASHBOARD & LOGIN MODAL */}
      {showDashboardModal && (
        <UserDashboard
          onClose={() => setShowDashboardModal(false)}
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
      )}

      {/* 4. CODEFUEL GAME ROOM */}
      {showGameRoom && (
        <GameRoom onClose={() => setShowGameRoom(false)} />
      )}
    </div>
  );
}

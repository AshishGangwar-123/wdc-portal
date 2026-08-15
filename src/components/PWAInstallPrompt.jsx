import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if running as installed standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setInstalled(true);
      return;
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice && !window.navigator.standalone) {
      setIsIOS(true);
      const dismissed = sessionStorage.getItem('wdc_pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    // Listen for browser PWA install prompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = sessionStorage.getItem('wdc_pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 2500);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('wdc_pwa_prompt_dismissed', 'true');
  };

  if (installed || !showPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '460px',
        zIndex: 9999,
        background: 'linear-gradient(135deg, rgba(12, 14, 38, 0.96) 0%, rgba(24, 10, 40, 0.96) 100%)',
        border: '1px solid rgba(0, 242, 254, 0.4)',
        borderRadius: '20px',
        padding: '18px 20px',
        boxShadow: '0 16px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'pwa-slide-up 0.5s ease-out',
      }}
    >
      <style>{`
        @keyframes pwa-slide-up {
          from { transform: translate(-50%, 60px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      {/* Dismiss X button */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'none', border: 'none', color: '#64748b',
          cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center'
        }}
        onMouseEnter={(e) => e.target.style.color = '#fff'}
        onMouseLeave={(e) => e.target.style.color = '#64748b'}
      >
        <X size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <img
          src="/wdc_logo.png"
          alt="WDC Logo"
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            objectFit: 'cover', flexShrink: 0,
            border: '2px solid #00f2fe',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.5)'
          }}
        />
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📱 Install WDC RECB App <Sparkles size={14} color="#00f2fe" />
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.35, marginTop: '2px' }}>
            Add shortcut to your mobile Home Screen for instant 1-tap app launch & smooth access!
          </div>
        </div>
      </div>

      {isIOS ? (
        <div style={{
          padding: '10px 14px', borderRadius: '10px',
          background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.25)',
          fontSize: '0.78rem', color: '#00f2fe', textAlign: 'center', fontWeight: 600
        }}>
          💡 Tap <b>Share</b> button in Safari browser, then tap <b>'Add to Home Screen'</b> 📲
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleInstallClick}
            className="cta-primary-btn"
            style={{
              flex: 1, padding: '10px 16px', borderRadius: '12px',
              fontSize: '0.85rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
              color: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
            }}
          >
            <Download size={16} /> 📲 INSTALL APP NOW
          </button>
          <button
            onClick={handleDismiss}
            style={{
              padding: '10px 16px', borderRadius: '12px',
              fontSize: '0.82rem', fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer'
            }}
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
}

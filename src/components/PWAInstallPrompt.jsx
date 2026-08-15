import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Exclusively allow mobile devices (screen width <= 768px OR mobile userAgent)
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      return isMobileUA || isSmallScreen;
    };

    if (!checkMobile()) {
      setIsMobileDevice(false);
      return; // Completely hide for desktop/laptop users!
    }

    setIsMobileDevice(true);

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
    }

    // Always reveal prompt on mobile after 1.5 seconds unless dismissed in this session
    const dismissed = sessionStorage.getItem('wdc_pwa_prompt_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 1500);
      return () => clearTimeout(timer);
    }

    // Listen for browser PWA install prompt (Android / Mobile Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
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
    const promptEvent = deferredPrompt || window.deferredPWAEvent;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setInstalled(true);
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
        window.deferredPWAEvent = null;
      } catch (err) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('wdc_pwa_prompt_dismissed', 'true');
  };

  if (!isMobileDevice || installed || !showPrompt) return null;

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

      {/* Guide Modal for Manual PWA Installation */}
      {showGuideModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10050,
            background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setShowGuideModal(false)}
        >
          <div
            style={{
              background: '#090d24', border: '2px solid #00f2fe', borderRadius: '20px',
              padding: '24px', maxWidth: '380px', width: '100%', textAlign: 'center',
              boxShadow: '0 0 40px rgba(0, 242, 254, 0.3)', color: '#fff'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: '#00f2fe' }}>
              📲 Add WDC App to Home Screen
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, textAlign: 'left', marginBottom: '18px' }}>
              <p style={{ marginBottom: '8px' }}><b>Step 1:</b> Tap browser menu button (<b>⋮ 3-Dots</b> or <b>Share</b> icon).</p>
              <p style={{ marginBottom: '8px' }}><b>Step 2:</b> Tap <b>"Add to Home screen"</b> or <b>"Install app"</b>.</p>
              <p><b>Step 3:</b> Open WDC RECB directly from your phone app drawer!</p>
            </div>
            <button
              onClick={() => { setShowGuideModal(false); setShowPrompt(false); }}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', background: '#00f2fe',
                color: '#05060f', fontWeight: 900, border: 'none', cursor: 'pointer'
              }}
            >
              GOT IT! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

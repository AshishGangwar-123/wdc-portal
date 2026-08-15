import React, { useEffect, useRef, useState } from 'react';
import { Code2, Sparkles, Menu, X, Gamepad2 } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar({ onStartAI, currentView, onGoLanding, onOpenDashboard, onOpenGameRoom }) {
  const navRef  = useRef(null);
  const logoRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Navbar entrance
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', delay: 0.1 }
    );

    // Logo pulse
    gsap.to(logoRef.current, {
      boxShadow: '0 0 30px rgba(0, 242, 254, 0.6), 0 0 60px rgba(121, 40, 202, 0.3)',
      duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });

    // Scroll shrink effect
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      padding: scrolled ? '10px 20px' : '14px 24px',
      background: scrolled ? 'rgba(5, 6, 15, 0.94)' : 'rgba(12, 14, 32, 0.85)',
      duration: 0.4, ease: 'power2.out',
    });
  }, [scrolled]);

  const navLinks = [
    { label: 'Home',       action: onGoLanding, href: null },
    { label: 'Domains',    action: onGoLanding, href: '#domains' },
    { label: 'Workshops',  action: onGoLanding, href: '#workshops' },
    { label: 'AI Concierge', action: onStartAI, href: '#ai-concierge' },
  ];

  return (
    <nav
      ref={navRef}
      aria-label="Main Navigation"
      style={{
        position: 'fixed', top: '12px',
        left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 24px)', maxWidth: '1300px',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px', borderRadius: '20px',
        background: 'rgba(12, 14, 32, 0.85)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'padding 0.4s ease',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => { onGoLanding?.(); setMobileMenuOpen(false); }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <img
          ref={logoRef}
          src="/wdc_logo.png"
          alt="Web Dev Club Logo"
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 0 20px rgba(255, 115, 0, 0.4), 0 0 10px rgba(0, 242, 254, 0.3)',
            flexShrink: 0,
            border: '1.5px solid rgba(255, 115, 0, 0.5)'
          }}
        />
        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.08rem', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            WDC <span style={{ color: '#00f2fe' }}>RECB</span>
          </div>
          <div style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: 'Fira Code', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Web Dev Club · Banda
          </div>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Outfit', fontWeight: 500, fontSize: '0.9rem' }}>
        {navLinks.map((link, i) => (
          <button
            key={i}
            onClick={() => {
              if (link.href) {
                onGoLanding?.();
                setTimeout(() => { document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
              } else link.action?.();
            }}
            style={{
              background: 'none', border: 'none',
              color: '#94a3b8', cursor: 'pointer',
              fontFamily: 'Outfit', fontSize: '0.9rem', fontWeight: 500,
              padding: '8px 12px', borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#f0f4ff'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={(e) => { e.target.style.color = '#94a3b8'; e.target.style.background = 'none'; }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Action Buttons (Desktop & Tablet) */}
      <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenDashboard}
          className="glass-btn"
          style={{
            padding: '8px 14px', fontSize: '0.8rem',
            background: 'rgba(0, 242, 254, 0.12)',
            borderColor: 'rgba(0, 242, 254, 0.4)',
            color: '#00f2fe',
            fontWeight: 700,
          }}
        >
          🎓 Dashboard
        </button>

        <button
          onClick={onOpenGameRoom}
          className="glass-btn"
          style={{
            padding: '8px 16px', fontSize: '0.82rem',
            background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%)',
            borderColor: 'rgba(121, 40, 202, 0.6)',
            color: '#f8fafc',
            fontWeight: 800,
            boxShadow: '0 0 15px rgba(121, 40, 202, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Gamepad2 size={16} style={{ color: '#00f2fe' }} /> GAME ROOM
        </button>

        <button
          onClick={onStartAI}
          className="glass-btn glass-btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.84rem' }}
        >
          <Sparkles size={14} />
          AI Concierge
        </button>
      </div>

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-menu-btn"
        aria-label="Toggle navigation menu"
        style={{
          display: 'none',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#00f2fe',
          padding: '8px',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-dropdown-drawer"
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            background: 'rgba(8, 9, 24, 0.96)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1001,
          }}
        >
          {navLinks.map((link, i) => (
            <button
              key={i}
              onClick={() => {
                setMobileMenuOpen(false);
                if (link.href) {
                  onGoLanding?.();
                  setTimeout(() => { document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' }); }, 100);
                } else link.action?.();
              }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{link.label}</span>
            </button>
          ))}

          <div style={{ marginTop: '6px' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
              className="glass-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem', color: '#00f2fe', borderColor: '#00f2fe' }}
            >
              🎓 Dashboard
            </button>
          </div>

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenGameRoom?.(); }}
            className="glass-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem', color: '#a78bfa', borderColor: 'rgba(121, 40, 202, 0.5)', marginTop: '4px' }}
          >
            <Gamepad2 size={16} /> Game Room
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onStartAI(); }}
            className="glass-btn glass-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '4px' }}
          >
            <Sparkles size={16} /> AI Concierge Assistant
          </button>
        </div>
      )}
    </nav>
  );
}


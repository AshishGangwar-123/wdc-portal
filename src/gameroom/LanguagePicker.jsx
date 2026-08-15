/* ==========================================================================
   CodeFuel — Language Picker
   Futuristic holographic card selector for choosing a programming language
   ========================================================================== */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Gamepad2 } from 'lucide-react';
import { LANGUAGE_THEMES } from './gameConstants';
import soundManager from './soundManager';

const languageOrder = ['langchain', 'sql', 'htmlcss', 'python', 'javascript', 'cpp', 'c', 'java'];

export default function LanguagePicker({ onSelect }) {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Title animation
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { y: -40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7 }
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }

    // Cards staggered entrance
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length > 0) {
      tl.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.85, rotationY: -15 },
        { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.6)' },
        '-=0.3'
      );
    }
  }, []);

  const handleSelect = (langKey) => {
    const theme = LANGUAGE_THEMES[langKey];
    if (theme?.locked) return;

    soundManager.init();
    soundManager.playClick();

    // Call onSelect immediately to set selectedLanguage state in parent
    onSelect(langKey);
  };

  return (
    <div ref={containerRef} className="gameroom-picker">
      {/* Background animated grid */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        background: `
          linear-gradient(rgba(0,242,254,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,242,254,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        animation: 'none',
        opacity: 0.5,
      }} />

      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '15%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(55, 118, 171, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '10%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(255, 212, 59, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <h1 ref={titleRef} className="gameroom-picker-title">
        <span style={{ color: '#f0f4ff' }}>Choose Your </span>
        <span style={{
          background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Language
        </span>
        <Sparkles size={24} color="#00f2fe" style={{ display: 'inline', marginLeft: '8px' }} />
      </h1>

      <p ref={subtitleRef} className="gameroom-picker-subtitle">
        {'//'} select a programming language to begin your CodeFuel journey
      </p>

      {/* Language Grid */}
      <div className="gameroom-picker-grid">
        {languageOrder.map((key, idx) => {
          const lang = LANGUAGE_THEMES[key];
          return (
            <div
              key={key}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`gameroom-lang-card ${lang.locked ? 'gameroom-lang-locked' : ''}`}
              style={{ '--card-glow-color': lang.glowColor }}
              onClick={() => handleSelect(key)}
              onMouseEnter={(e) => {
                if (!lang.locked) {
                  gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
                }
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' });
              }}
            >
              {lang.locked && (
                <div className="gameroom-lock-badge">🔒 SOON</div>
              )}

              {lang.iconUrl ? (
                <img
                  src={lang.iconUrl}
                  alt={lang.name}
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: 'contain',
                    marginBottom: 10,
                    filter: 'drop-shadow(0 4px 12px rgba(255, 212, 59, 0.4))',
                  }}
                />
              ) : (
                <span className="gameroom-lang-icon">{lang.icon}</span>
              )}
              <div className="gameroom-lang-name" style={{ color: lang.locked ? '#64748b' : lang.primary }}>
                {lang.name}
              </div>
              <div className="gameroom-lang-tag">
                {lang.locked ? lang.tagline : lang.tagline}
              </div>

              {/* Active glow ring for unlocked languages */}
              {!lang.locked && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60%',
                  height: '3px',
                  background: `linear-gradient(90deg, transparent, ${lang.primary}, transparent)`,
                  borderRadius: '4px',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

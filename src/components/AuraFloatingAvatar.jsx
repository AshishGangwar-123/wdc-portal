import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

/**
 * AuraFloatingAvatar
 * ------------------
 * Uses clean transparent robot PNG (aura_bot.png) for 100% seamless landing page integration.
 * - Gentle idle floating animation when silent.
 * - Dynamic animated bounce, glow aura, and soundwave when speaking (isSpeaking === true).
 * - Clicking opens the full chatbot overlay modal in-place.
 */
export default function AuraFloatingAvatar({ isSiteLoaded, onOpenChat }) {
  const [showBubble, setShowBubble] = useState(false);
  const [typedBubble, setTypedBubble] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bubbleTimeout = useRef(null);
  const typeTimeout = useRef(null);

  const welcomeText = "Namaste! Main hun AURA - WDC ka AI Assistant. Aap mujhse bolkar ya chat karke baat kar sakte hain!";

  const typeWriter = (text, onDone) => {
    let i = 0;
    setTypedBubble('');
    const tick = () => {
      if (i <= text.length) {
        setTypedBubble(text.slice(0, i));
        i++;
        typeTimeout.current = setTimeout(tick, 28);
      } else {
        if (onDone) onDone();
      }
    };
    tick();
  };

  useEffect(() => {
    if (!isSiteLoaded || hasGreeted) return;

    setHasGreeted(true);
    let spoken = false;

    const speakNow = () => {
      if (spoken || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(
          "Namaste! Main hun AURA. W D C ka A I Assistant. Aap mujhse bolkar ya chat karke baat kar sakte hain!"
        );
        utter.lang = 'hi-IN';
        utter.rate = 0.95;
        utter.pitch = 1.1;

        const voices = window.speechSynthesis.getVoices() || [];
        const hindiVoice = voices.find(v => v.lang && v.lang.includes('hi'));
        if (hindiVoice) utter.voice = hindiVoice;

        utter.onstart = () => {
          spoken = true;
          setIsSpeaking(true);
          setShowBubble(true);
        };

        utter.onend = () => {
          setIsSpeaking(false);
          setTimeout(() => setShowBubble(false), 3500);
        };

        utter.onerror = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utter);
        spoken = true;
      } catch (e) {
        setIsSpeaking(false);
      }
    };

    // Show speech bubble & start typewriter immediately when loader finishes
    setShowBubble(true);
    typeWriter(welcomeText);

    // Call voice greeting immediately!
    speakNow();

    // Backup gesture listener in case browser blocked autoplay audio before user interaction
    const unlockAndSpeak = () => {
      if (!spoken) speakNow();
      window.removeEventListener('click', unlockAndSpeak);
      window.removeEventListener('keydown', unlockAndSpeak);
      window.removeEventListener('touchstart', unlockAndSpeak);
      window.removeEventListener('scroll', unlockAndSpeak);
    };

    window.addEventListener('click', unlockAndSpeak, { once: true });
    window.addEventListener('keydown', unlockAndSpeak, { once: true });
    window.addEventListener('touchstart', unlockAndSpeak, { once: true });
    window.addEventListener('scroll', unlockAndSpeak, { once: true });

    return () => {
      clearTimeout(bubbleTimeout.current);
      clearTimeout(typeTimeout.current);
      window.removeEventListener('click', unlockAndSpeak);
      window.removeEventListener('keydown', unlockAndSpeak);
      window.removeEventListener('touchstart', unlockAndSpeak);
      window.removeEventListener('scroll', unlockAndSpeak);
    };
  }, [isSiteLoaded, hasGreeted]);

  const handleAvatarClick = () => {
    setShowBubble(false);
    setIsSpeaking(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (onOpenChat) onOpenChat();
  };

  const SoundWave = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
      {[1, 1.6, 0.7, 1.4, 0.9, 1.5, 0.8].map((h, i) => (
        <div key={i} style={{
          width: '3px',
          borderRadius: '99px',
          background: 'linear-gradient(to top, #00f2fe, #7928ca)',
          height: isSpeaking ? `${h * 14}px` : '4px',
          transition: 'height 0.15s ease',
          animation: isSpeaking ? `waveBar 0.6s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      userSelect: 'none',
    }}>
      {/* Speech Bubble */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        width: '260px',
        background: 'rgba(8, 9, 20, 0.94)',
        border: '1px solid rgba(0, 242, 254, 0.45)',
        borderRadius: '16px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: '#e2e8f0',
        lineHeight: 1.5,
        zIndex: 20,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 12px 40px rgba(0, 242, 254, 0.2)',
        pointerEvents: 'none',
        opacity: showBubble ? 1 : 0,
        transform: showBubble ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-12px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'Fira Code', fontSize: '0.68rem', color: '#00f2fe', fontWeight: 600 }}>AURA - ONLINE</span>
        </div>
        <div>{typedBubble}<span style={{ opacity: isSpeaking ? 1 : 0, animation: 'blink 0.7s steps(1) infinite' }}>|</span></div>
        <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid rgba(0,242,254,0.45)' }} />
      </div>

      {/* Floating Robot PNG Avatar Container */}
      <div
        onClick={handleAvatarClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          marginTop: showBubble ? '120px' : '10px',
          transition: 'margin-top 0.4s ease, transform 0.3s ease',
          position: 'relative',
          cursor: 'pointer',
          width: '280px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isHovered ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
        }}
      >
        {/* Soft Ambient Radial Cyan Glow */}
        <div style={{
          position: 'absolute',
          inset: '20px',
          borderRadius: '50%',
          background: isSpeaking
            ? 'radial-gradient(circle, rgba(0,242,254,0.3) 0%, rgba(121,40,202,0.15) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(0,242,254,0.12) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transition: 'all 0.4s ease',
          pointerEvents: 'none',
        }} />

        {/* Robot Image Element with Dynamic Speaking Animation */}
        <img
          src="/aura_bot.png"
          alt="AURA Robot Assistant"
          style={{
            width: '220px',
            height: '220px',
            objectFit: 'contain',
            zIndex: 2,
            filter: isSpeaking
              ? 'drop-shadow(0 0 25px rgba(0, 242, 254, 0.75)) drop-shadow(0 0 40px rgba(121, 40, 202, 0.4))'
              : isHovered
              ? 'drop-shadow(0 0 18px rgba(0, 242, 254, 0.5))'
              : 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))',
            animation: isSpeaking
              ? 'talkBounce 0.55s ease-in-out infinite alternate'
              : 'idleFloat 3.5s ease-in-out infinite alternate',
            transition: 'filter 0.3s ease',
          }}
        />

        {/* Floating Click to Chat Pill */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8, 9, 20, 0.94)',
            border: '1.5px solid #00f2fe',
            borderRadius: '99px',
            padding: '6px 16px',
            fontSize: '0.75rem',
            color: '#00f2fe',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            zIndex: 10,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            animation: 'fadeInUp 0.2s ease',
          }}>
            <MessageSquare size={14} color="#00f2fe" style={{ flexShrink: 0 }} /> Click to Chat
          </div>
        )}
      </div>

      {/* Label + Sound Wave Indicator */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 3 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(8,9,20,0.85)',
          border: `1px solid ${isSpeaking ? '#00f2fe' : 'rgba(0,242,254,0.3)'}`,
          borderRadius: '99px',
          padding: '6px 18px',
          backdropFilter: 'blur(10px)',
          boxShadow: isSpeaking ? '0 0 18px rgba(0,242,254,0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isSpeaking ? '#00f2fe' : '#10b981',
            boxShadow: isSpeaking ? '0 0 12px #00f2fe' : '0 0 8px #10b981',
            transition: 'all 0.3s ease',
            animation: isSpeaking ? 'pulse 0.8s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#fff', letterSpacing: '0.08em' }}>AURA</span>
          <span style={{ fontFamily: 'Fira Code', fontSize: '0.68rem', color: isSpeaking ? '#00f2fe' : '#64748b', fontWeight: 600 }}>
            {isSpeaking ? 'SPEAKING...' : 'AI ASSISTANT'}
          </span>
        </div>

        <div style={{ height: '22px', display: 'flex', alignItems: 'center' }}>
          {isSpeaking ? (
            <SoundWave />
          ) : (
            <div
              onClick={handleAvatarClick}
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '0.78rem',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#00f2fe'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            >
              <Sparkles size={13} color="#00f2fe" style={{ flexShrink: 0 }} /> Tap to interact
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes idleFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes talkBounce {
          0% { transform: translateY(0px) scale(1) rotate(-1deg); }
          50% { transform: translateY(-10px) scale(1.06) rotate(2deg); }
          100% { transform: translateY(-2px) scale(1.02) rotate(-1deg); }
        }
        @keyframes waveBar { 0% { transform: scaleY(0.3); } 100% { transform: scaleY(1.3); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateX(-50%) translateY(6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}

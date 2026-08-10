import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AIAvatar({ avatarState = 'idle' }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Synchronize video playback automatically with AI speech state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (avatarState === 'speaking') {
      video.muted = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => console.log('Video play catch:', err));
      }
    } else {
      video.pause();
    }
  }, [avatarState]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Rectangular Video Frame filling the avatar box */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(0, 242, 254, 0.15)',
          background: 'linear-gradient(135deg, #050614 0%, #0a0d24 100%)',
          transition: 'all 0.4s ease',
        }}
      >
        <video
          ref={videoRef}
          src="/avatar_video.mp4"
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Low-Intensity Theme Color Layer (Blends Video seamlessly into WDC Neon Theme) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 45%, rgba(0, 242, 254, 0.16) 0%, rgba(121, 40, 202, 0.24) 60%, rgba(5, 6, 20, 0.4) 100%)',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Subtle Ambient Radial Glow Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.08) 0%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Status Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 14px',
            borderRadius: '99px',
            background: avatarState === 'speaking'
              ? 'rgba(0, 242, 254, 0.25)'
              : avatarState === 'listening'
              ? 'rgba(255, 0, 122, 0.35)'
              : 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${
              avatarState === 'speaking'
                ? '#00f2fe'
                : avatarState === 'listening'
                ? '#ff007a'
                : 'rgba(255,255,255,0.12)'
            }`,
            color: avatarState === 'speaking' ? '#00f2fe' : avatarState === 'listening' ? '#ff007a' : '#94a3b8',
            fontFamily: 'Fira Code',
            fontSize: '0.72rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 2,
            boxShadow: avatarState === 'listening' ? '0 0 20px rgba(255, 0, 122, 0.6)' : 'none',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: avatarState === 'speaking' ? '#00f2fe' : avatarState === 'listening' ? '#ff007a' : '#10b981',
              boxShadow: `0 0 8px ${avatarState === 'speaking' ? '#00f2fe' : avatarState === 'listening' ? '#ff007a' : '#10b981'}`,
            }}
          />
          {avatarState === 'speaking' ? 'TALKING...' : avatarState === 'listening' ? '🔴 LISTENING...' : 'READY'}
        </div>
      </div>

      {/* Dynamic Soundwave Audio Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px' }}>
        {[18, 28, 12, 34, 20, 30, 14].map((h, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              height: `${avatarState === 'speaking' ? h * 1.2 : avatarState === 'listening' ? h * 1.3 : 8}px`,
              background: avatarState === 'listening' ? '#ff007a' : '#00f2fe',
              borderRadius: '2px',
              boxShadow: `0 0 8px ${avatarState === 'listening' ? '#ff007a' : '#00f2fe'}`,
              transition: 'all 0.15s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

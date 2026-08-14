import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Bot, Cpu, Sparkles } from 'lucide-react';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const iconRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );

    const ctx = gsap.context(() => {
      // Counter object to animate number
      const counter = { value: 0 };

      // Icon pulse
      gsap.to(iconRef.current, {
        scale: 1.15,
        duration: 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      // Timeline for progress
      gsap.to(counter, {
        value: 100,
        duration: isMobile ? 0.7 : 1.1,
        ease: 'power2.inOut',
        onUpdate: () => {
          const val = Math.round(counter.value);
          setProgress(val);
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${val}%`;
          }
        },
        onComplete: () => {
          // Notify app immediately so components render and speech triggers with 0 delay
          if (onComplete) onComplete();

          // Final curtain reveal exit animation
          const exitTl = gsap.timeline();

          exitTl
            .to(loaderRef.current, {
              scale: 1.05,
              opacity: 0,
              filter: 'blur(10px)',
              duration: 0.5,
              ease: 'power3.in',
            })
            .to(loaderRef.current, {
              display: 'none',
            });
        },
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#04050d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
      }}
    >
      {/* Background Matrix Mesh */}
      <div className="bg-grid" style={{ opacity: 0.3 }} />
      <div className="bg-orb bg-orb-1" style={{ opacity: 0.6 }} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Animated WDC Logo Ring Icon */}
        <div
          ref={iconRef}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 0 50px rgba(255, 115, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.4)',
            border: '2px solid rgba(255, 115, 0, 0.6)',
            background: '#04050d'
          }}
        >
          <img src="/wdc_logo.png" alt="WDC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Counter Number */}
        <div style={{ textAlign: 'center' }}>
          <div
            ref={counterRef}
            style={{
              fontFamily: 'Outfit',
              fontSize: '4.5rem',
              fontWeight: 900,
              letterSpacing: '-2px',
              background: 'linear-gradient(90deg, #00f2fe, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}
          >
            {progress}%
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#94a3b8',
              fontFamily: 'Fira Code',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={14} color="#00f2fe" /> INITIALIZING WDC AI AGENT...
          </div>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '280px',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '99px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              width: '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #00f2fe, #7928ca, #ff007a)',
              borderRadius: '99px',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

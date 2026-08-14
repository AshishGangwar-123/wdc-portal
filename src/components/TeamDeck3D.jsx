import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

const LinkedInIcon = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const API_BASE = '';

const SUITS = ['♠️', '♦️', '♣️', '♥️'];

export default function TeamDeck3D() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFanned, setIsFanned] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/team`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
          setActiveIdx(0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Continuous Auto-swap Cards Loop (cycles every 3.2s)
  useEffect(() => {
    if (members.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % members.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [members.length, isPaused]);

  if (loading || members.length === 0) return null;

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % members.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + members.length) % members.length);
  };

  return (
    <section id="team" style={{ padding: isMobile ? '40px 16px' : '80px 24px', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
      
      {/* Header */}
      <div className="section-heading-reveal" style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' }}>
        <div
          className="section-tag"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '99px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)', color: '#00f2fe', fontSize: '0.82rem', marginBottom: '14px' }}
        >
          <Sparkles size={14} color="#00f2fe" />
          <span>WDC CORE TEAM SHOWCASE</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', marginBottom: '12px' }}>
          Meet Our <span className="text-gradient">Core Team</span> Members
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Interactive 3D Playing Cards Deck — Hover & click on cards to fan out the core members of Web Development Club.
        </p>

        {/* Deck Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsFanned(!isFanned)}
            className="glass-btn"
            style={{
              padding: '8px 20px',
              fontSize: '0.85rem',
              color: isFanned ? '#00f2fe' : '#e2e8f0',
              borderColor: isFanned ? 'rgba(0, 242, 254, 0.5)' : 'rgba(255,255,255,0.15)',
              background: isFanned ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              borderRadius: '99px',
            }}
          >
            <Layers size={16} color={isFanned ? '#00f2fe' : '#94a3b8'} />
            {isFanned ? 'Stack Cards Deck' : 'Spread 3D Cards Fan'}
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              className="glass-btn"
              style={{ padding: '8px 14px', borderRadius: '50%', color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="glass-btn"
              style={{ padding: '8px 14px', borderRadius: '50%', color: '#fff', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Playing Cards Stage */}
      <div
        onMouseEnter={() => { setIsFanned(true); setIsPaused(true); }}
        onMouseLeave={() => { setIsFanned(false); setIsPaused(false); }}
        style={{
          perspective: '1200px',
          minHeight: isMobile ? '360px' : '440px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          margin: '20px auto 40px',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        {members.map((member, idx) => {
          const offset = idx - activeIdx;
          const suit = SUITS[idx % SUITS.length];
          const isCenter = idx === activeIdx;

          // 3D Rotational & Fan-out Math
          let rotateZ = isFanned ? (isMobile ? offset * 7 : offset * 18) : (isMobile ? offset * 4 : offset * 9);
          let translateX = isFanned ? (isMobile ? offset * 42 : offset * 140) : (isMobile ? offset * 22 : offset * 75);
          let translateY = isFanned ? Math.abs(offset) * 10 : Math.abs(offset) * 10;
          let rotateY = isFanned ? offset * -4 : offset * -3;
          let scale = isCenter ? (isMobile ? 1.02 : 1.06) : (isMobile ? 0.92 : 0.94) - Math.abs(offset) * 0.04;
          let zIndex = isCenter ? 50 : 30 - Math.abs(offset);

          return (
            <div
              key={member.id || idx}
              onClick={() => setActiveIdx(idx)}
              style={{
                position: 'absolute',
                width: isMobile ? '230px' : '270px',
                height: isMobile ? '330px' : '380px',
                borderRadius: '20px',
                background: isCenter
                  ? 'linear-gradient(145deg, rgba(16, 24, 48, 0.95) 0%, rgba(8, 12, 28, 0.98) 100%)'
                  : 'linear-gradient(145deg, rgba(12, 16, 32, 0.92) 0%, rgba(5, 8, 20, 0.95) 100%)',
                border: isCenter ? '2px solid rgba(0, 242, 254, 0.7)' : '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: isCenter
                  ? '0 20px 50px rgba(0, 242, 254, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  : '0 12px 30px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(16px)',
                cursor: 'pointer',
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: zIndex,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                userSelect: 'none',
              }}
            >
              {/* Top Card Header (Suit & Card Rank) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00f2fe', fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{suit}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>WDC</span>
                </div>
                <div style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', border: '1px solid rgba(0,242,254,0.3)', fontFamily: 'Fira Code' }}>
                  CORE #{idx + 1}
                </div>
              </div>

              {/* Card Center: Member Avatar Image */}
              <div style={{ width: '100%', height: '180px', borderRadius: '14px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', background: '#0a0d1d', margin: '10px 0' }}>
                <img
                  src={member.image_url}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,9,20,0.9) 0%, transparent 60%)' }} />
              </div>

              {/* Card Bottom Info (Naam & Padwi) */}
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.name}
                </div>
                
                {/* Role / Padwi Tag */}
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00f2fe', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} color="#00f2fe" />
                  <span>{member.role}</span>
                </div>

                {/* Footer LinkedIn Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                  {member.linkedin_url ? (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.75rem', color: '#0077b5', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 119, 181, 0.15)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0, 119, 181, 0.3)' }}
                    >
                      <LinkedInIcon size={12} color="#0077b5" />
                      <span>LinkedIn</span>
                      <ExternalLink size={10} color="#0077b5" />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>WDC Member</span>
                  )}
                  <span style={{ fontSize: '0.9rem' }}>{suit}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Play, Image as ImageIcon, ChevronLeft, ChevronRight, Sparkles, Film, Maximize2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_BASE = '';

export default function MediaGalleryBox() {
  const [mediaList, setMediaList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  // 1. Fetch Live Gallery Items from Backend API
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setMediaList(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch gallery media:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // 2. GSAP ScrollTrigger Scroll-Driven Size & Scale Animation
  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Scroll-driven size expansion: tied directly to page scroll movement!
      gsap.fromTo(
        cardRef.current,
        { scale: 0.94, y: 25 },
        {
          scale: 1.02,
          y: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 92%',
            end: 'bottom 15%',
            scrub: 1, // Dynamic smooth scroll scrub animation!
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3. Autoplay Carousel Loop (Every 6 Seconds)
  useEffect(() => {
    if (mediaList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [mediaList]);

  // 4. Interactive Mouse Scale & Dynamic 3D Size Distortion
  const handleMouseEnter = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.05,
        boxShadow: '0 30px 70px rgba(0, 242, 254, 0.35), 0 0 50px rgba(121, 40, 202, 0.4)',
        duration: 0.4,
        ease: 'back.out(1.6)',
      });
    }
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate distance from center for dynamic elastic size pulse
    const dist = Math.sqrt(x * x + y * y);
    const maxDist = Math.sqrt((rect.width / 2) ** 2 + (rect.height / 2) ** 2);
    const dynamicScale = 1.04 + (dist / maxDist) * 0.03;

    gsap.to(card, {
      rotateY: (x / rect.width) * 18,
      rotateX: (-y / rect.height) * 18,
      scale: dynamicScale,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformStyle: 'preserve-3d',
    });
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 242, 254, 0.15)',
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  };

  const currentItem = mediaList[currentIndex] || {
    title: 'WDC 3D AI Concierge Media Showcase',
    url: '/avatar_video.mp4',
    media_type: 'video',
    category: 'Highlight',
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        marginTop: '24px',
        position: 'relative',
      }}
    >
      {/* Outer Border Glowing Card Wrapper with Increased Height (340px) */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          height: '340px', // Increased height for rich cinematic display!
          borderRadius: '24px',
          padding: '2px', // For animated gradient border
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.5), rgba(121, 40, 202, 0.5), rgba(255, 0, 122, 0.5))',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 242, 254, 0.15)',
          transition: 'box-shadow 0.3s ease',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Animated Neon Border Inner Shell */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '22px',
            background: '#050614',
            overflow: 'hidden',
          }}
        >
          {/* Media Content (Video or Image) */}
          {currentItem.media_type === 'video' ? (
            <video
              ref={videoRef}
              key={currentItem.url}
              src={currentItem.url}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              key={currentItem.url}
              src={currentItem.url}
              alt={currentItem.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}

          {/* Low-Intensity Theme Color Layer (Blends media into WDC Neon aesthetic) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.14) 0%, rgba(121, 40, 202, 0.22) 60%, rgba(5, 6, 20, 0.65) 100%)',
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
            }}
          />

          {/* Dark Vignette Overlay for Crisp Text Readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5, 6, 20, 0.95) 0%, rgba(5, 6, 20, 0.25) 60%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Header Badge Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '18px',
              right: '18px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              zIndex: 3,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '99px',
                background: 'rgba(5, 6, 20, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#00f2fe',
                fontFamily: 'Fira Code',
              }}
            >
              <Sparkles size={14} color="#00f2fe" />
              <span>WDC MEDIA SHOWCASE</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '99px',
                background: 'rgba(255, 0, 122, 0.25)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 0, 122, 0.4)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#ff007a',
                fontFamily: 'Fira Code',
              }}
            >
              {currentItem.media_type === 'video' ? <Film size={13} /> : <ImageIcon size={13} />}
              <span>{currentItem.category || 'Highlight'}</span>
            </div>
          </div>

          {/* Bottom Title & Navigation Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '18px',
              right: '18px',
              display: 'flex',
              alignItems: 'flex-end',
              justify: 'space-between',
              gap: '14px',
              zIndex: 3,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', lineHeight: 1.35, marginBottom: '4px' }}>
                {currentItem.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontFamily: 'Fira Code', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Maximize2 size={12} color="#00f2fe" />
                <span>Scroll & Mouse Interactive • Autoplayed</span>
              </div>
            </div>

            {/* Pagination Controls */}
            {mediaList.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '10px',
                    padding: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '0.78rem', color: '#00f2fe', fontFamily: 'Fira Code', fontWeight: 700, padding: '0 4px' }}>
                  {currentIndex + 1}/{mediaList.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '10px',
                    padding: '6px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

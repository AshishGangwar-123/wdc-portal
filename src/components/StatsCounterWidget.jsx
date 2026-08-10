import React, { useEffect, useRef, useState } from 'react';
import { Users, Calendar, Code, Rocket, Award, BookOpen, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: Users,    label: 'Active Members',       value: 500,  suffix: '+',  color: '#00f2fe', desc: 'RECB students across all branches' },
  { icon: Calendar, label: 'Workshops Conducted',  value: 48,   suffix: '+',  color: '#ff007a', desc: 'Expert-led technical sessions' },
  { icon: Code,     label: 'Projects Built',        value: 120,  suffix: '+',  color: '#7928ca', desc: 'Real-world club projects shipped' },
  { icon: Trophy,   label: 'Hackathon Victories',  value: 24,   suffix: '+',  color: '#10b981', desc: 'National & state level wins' },
  { icon: BookOpen, label: 'Learning Hours',        value: 2400, suffix: '+',  color: '#f59e0b', desc: 'Total knowledge-sharing hours' },
  { icon: Award,    label: 'Certificates Issued',  value: 1200, suffix: '+',  color: '#6366f1', desc: 'Members recognized & certified' },
];

export default function StatsCounterWidget() {
  const containerRef = useRef(null);
  const numberRefs   = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Entrance animation via ScrollTrigger
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (hasAnimated) return;
          setHasAnimated(true);

          // Stagger card entrance
          gsap.fromTo('.stat-card',
            { y: 50, opacity: 0, scale: 0.88 },
            { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.1, ease: 'back.out(1.4)' }
          );

          // Counter animate numbers
          STATS.forEach((stat, index) => {
            const el = numberRefs.current[index];
            if (!el) return;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: stat.value,
              duration: 2.8,
              delay: index * 0.1,
              ease: 'power2.out',
              onUpdate: () => {
                el.innerText = Math.round(obj.val).toLocaleString() + stat.suffix;
              },
            });
          });
        },
      });

      // Continuous subtle hover effect on each card
      const cards = containerRef.current.querySelectorAll('.stat-card');
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -10, scale: 1.04, duration: 0.35, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        width: '100%',
      }}
    >
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="stat-card glass-panel"
            style={{
              padding: '28px 24px',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'linear-gradient(135deg, rgba(18,22,48,0.8) 0%, rgba(8,10,24,0.9) 100%)',
              border: `1px solid ${stat.color}22`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 20px ${stat.color}10`,
              cursor: 'default',
              position: 'relative',
              overflow: 'hidden',
              opacity: 0,
            }}
          >
            {/* Background glow dot */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: `${stat.color}15`, filter: 'blur(20px)',
              pointerEvents: 'none',
            }} />

            {/* Icon */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `${stat.color}12`, border: `1px solid ${stat.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, boxShadow: `0 0 18px ${stat.color}20`,
            }}>
              <Icon size={22} />
            </div>

            {/* Number */}
            <div>
              <div
                ref={(el) => (numberRefs.current[i] = el)}
                style={{
                  fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 900,
                  color: '#f0f4ff', lineHeight: 1, marginBottom: '4px',
                }}
              >
                0{stat.suffix}
              </div>
              <div style={{ color: '#f0f4ff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'Fira Code' }}>
                {stat.desc}
              </div>
            </div>

            {/* Bottom accent bar */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
              opacity: 0.5,
            }} />
          </div>
        );
      })}
    </div>
  );
}

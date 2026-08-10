import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Code2, Terminal, Cpu, GitBranch, Database, Layers, Flame, FileCode, Braces } from 'lucide-react';

// Colorful Programming Language & Code Snippets with Soft Intensity
const TECH_ELEMENTS = [
  { text: '</React.js>', color: '#61DAFB', top: '10%', left: '6%', size: '0.9rem', delay: 0 },
  { text: 'def wdc_club():', color: '#FFD43B', top: '20%', left: '84%', size: '0.85rem', delay: 1 },
  { text: 'const [code, setCode]', color: '#F7DF1E', top: '48%', left: '4%', size: '0.85rem', delay: 0.5 },
  { text: 'async function build()', color: '#10b981', top: '68%', left: '86%', size: '0.82rem', delay: 1.5 },
  { text: 'import { GSAP }', color: '#88ce02', top: '82%', left: '10%', size: '0.85rem', delay: 0.8 },
  { text: 'FastAPI(app)', color: '#059669', top: '35%', left: '92%', size: '0.8rem', delay: 2 },
  { text: '<html lang="en">', color: '#E34F26', top: '56%', left: '80%', size: '0.85rem', delay: 1.2 },
  { text: 'git push origin main', color: '#F05032', top: '90%', left: '74%', size: '0.82rem', delay: 1.8 },
  { text: '{ status: 200, WDC: true }', color: '#3178C6', top: '14%', left: '48%', size: '0.82rem', delay: 2.2 },
  { text: 'npm run dev', color: '#CB3837', top: '38%', left: '8%', size: '0.8rem', delay: 2.5 },
  { text: 'fn main() -> Rust', color: '#DEA584', top: '76%', left: '46%', size: '0.82rem', delay: 1.4 },
];

// Colorful Floating Tech Stack Icons
const FLOATING_ICONS = [
  { Icon: Code2, color: '#61DAFB', top: '16%', left: '20%', size: 26 },
  { Icon: Terminal, color: '#FFD43B', top: '62%', left: '16%', size: 28 },
  { Icon: Cpu, color: '#9900F0', top: '26%', left: '74%', size: 28 },
  { Icon: GitBranch, color: '#F05032', top: '78%', left: '84%', size: 24 },
  { Icon: Database, color: '#3178C6', top: '46%', left: '94%', size: 26 },
  { Icon: Layers, color: '#E10098', top: '84%', left: '36%', size: 28 },
  { Icon: Braces, color: '#F7DF1E', top: '8%', left: '90%', size: 24 },
  { Icon: FileCode, color: '#10b981', top: '40%', left: '10%', size: 24 },
];

export default function FloatingCodeElements() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = containerRef.current.querySelectorAll('.floating-code-item');

      elements.forEach((el, index) => {
        // Smooth floating physics
        gsap.to(el, {
          y: 'random(-22, 22)',
          x: 'random(-14, 14)',
          rotation: 'random(-10, 10)',
          duration: 'random(4, 7)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });

        // Soft intensity pulsing opacity (ultra subtle, non-distracting)
        gsap.to(el, {
          opacity: 'random(0.08, 0.22)',
          duration: 'random(3.5, 6)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // Mouse Parallax movement
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xOffset = (clientX / window.innerWidth - 0.5) * 30;
        const yOffset = (clientY / window.innerHeight - 0.5) * 30;

        gsap.to(elements, {
          x: (i) => (i % 2 === 0 ? xOffset * 0.6 : -xOffset * 0.6),
          y: (i) => (i % 2 === 0 ? yOffset * 0.6 : -yOffset * 0.6),
          duration: 1.2,
          ease: 'power1.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Floating Colorful Code Text Badges */}
      {TECH_ELEMENTS.map((item, i) => (
        <div
          key={`code-${i}`}
          className="floating-code-item"
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            color: item.color,
            fontSize: item.size,
            fontFamily: 'Fira Code, monospace',
            fontWeight: 600,
            background: 'rgba(6, 8, 20, 0.3)',
            border: `1px solid ${item.color}18`,
            padding: '5px 12px',
            borderRadius: '8px',
            boxShadow: `0 0 12px ${item.color}10`,
            backdropFilter: 'blur(4px)',
            userSelect: 'none',
            letterSpacing: '0.5px',
            opacity: 0.15, // Faint initial intensity
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Floating Colorful Language Icons */}
      {FLOATING_ICONS.map(({ Icon, color, top, left, size }, i) => (
        <div
          key={`icon-${i}`}
          className="floating-code-item"
          style={{
            position: 'absolute',
            top,
            left,
            width: `${size + 18}px`,
            height: `${size + 18}px`,
            borderRadius: '14px',
            background: `${color}08`,
            border: `1px solid ${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 12px ${color}12`,
            backdropFilter: 'blur(4px)',
            opacity: 0.15, // Faint initial intensity
          }}
        >
          <Icon size={size} color={color} />
        </div>
      ))}
    </div>
  );
}

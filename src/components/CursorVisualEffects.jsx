import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorVisualEffects() {
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile touch devices — disable canvas sparkles and cursor spotlight
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    if (checkTouch()) {
      setIsTouchDevice(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // rAF throttle flag — prevents spawning particles faster than 60fps during scroll
    let mouseMoveScheduled = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Color palette for mouse sparks
    const COLORS = ['#00f2fe', '#ff007a', '#7928ca', '#10b981', '#f59e0b', '#61dafb'];

    // Particle Class
    class SparkParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1.5;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = (Math.random() - 0.5) * 1.8;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.035 + 0.018;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.95;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(this.size, 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Shockwave Ring Class on Click
    class ClickRipple {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = 60;
        this.alpha = 0.8;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      }

      update() {
        this.radius += 3.5;
        this.alpha -= 0.025;
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    let ripples = [];

    // Mouse move handler — rAF throttled to prevent main thread blocking during scroll
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Update torch spotlight via GSAP (internally batched)
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: mouse.x,
          y: mouse.y,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // rAF throttle: only ONE particle spawn per animation frame maximum
      if (!mouseMoveScheduled) {
        mouseMoveScheduled = true;
        requestAnimationFrame(() => {
          // 1 particle per frame (was 2) — 50% lighter
          particles.push(new SparkParticle(mouse.x, mouse.y));
          mouseMoveScheduled = false;
        });
      }
    };

    // Mouse click shockwave ripple handler
    const onMouseDown = (e) => {
      ripples.push(new ClickRipple(e.clientX, e.clientY));
      // 10 burst particles on click (was 15)
      for (let i = 0; i < 10; i++) {
        particles.push(new SparkParticle(e.clientX, e.clientY));
      }
    };

    // passive: true = browser does NOT need to wait for JS before scrolling
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });

    // Animation Loop - Optimized: only clear & draw when active particles/ripples exist
    const render = () => {
      if (particles.length > 0 || ripples.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let idx = particles.length - 1; idx >= 0; idx--) {
          const p = particles[idx];
          p.update();
          p.draw();
          if (p.alpha <= 0 || p.size <= 0.2) {
            particles.splice(idx, 1);
          }
        }

        for (let idx = ripples.length - 1; idx >= 0; idx--) {
          const r = ripples[idx];
          r.update();
          r.draw();
          if (r.alpha <= 0) {
            ripples.splice(idx, 1);
          }
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Torch Spotlight Glow following cursor — GPU promoted layer */}
      <div
        ref={spotlightRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.10) 0%, rgba(121, 40, 202, 0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 2,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(28px)',
          mixBlendMode: 'screen',
          willChange: 'transform', // GPU composite layer
        }}
      />

      {/* Canvas for Sparkle Particle Trail — GPU promoted */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9997,
          willChange: 'contents',
        }}
      />
    </>
  );
}

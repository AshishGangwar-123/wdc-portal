import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorVisualEffects() {
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let particles = [];
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color palette for mouse sparks
    const COLORS = ['#00f2fe', '#ff007a', '#7928ca', '#10b981', '#f59e0b', '#61dafb'];

    // Particle Class
    class SparkParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
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
        ctx.shadowBlur = 10;
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
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    let ripples = [];

    // Mouse move handler
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Update torch spotlight
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: mouse.x,
          y: mouse.y,
          duration: 0.25,
          ease: 'power2.out',
        });
      }

      // Spawn spark particles on move
      for (let i = 0; i < 2; i++) {
        particles.push(new SparkParticle(mouse.x, mouse.y));
      }
    };

    // Mouse click shockwave ripple handler
    const onMouseDown = (e) => {
      ripples.push(new ClickRipple(e.clientX, e.clientY));

      // Burst of particles
      for (let i = 0; i < 15; i++) {
        particles.push(new SparkParticle(e.clientX, e.clientY));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & update particles
      particles.forEach((p, idx) => {
        p.update();
        p.draw();
        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(idx, 1);
        }
      });

      // Render & update ripples
      ripples.forEach((r, idx) => {
        r.update();
        r.draw();
        if (r.alpha <= 0) {
          ripples.splice(idx, 1);
        }
      });

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

  return (
    <>
      {/* Torch Spotlight Glow following cursor */}
      <div
        ref={spotlightRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(121, 40, 202, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 2,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Canvas for Sparkle Particle Trail */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9997,
        }}
      />
    </>
  );
}

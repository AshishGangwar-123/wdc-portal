/* ==========================================================================
   CodeFuel v2 — Game Over Screen
   Stats focused on runner mechanics: gates, tokens, bugs
   ========================================================================== */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GameOverScreen({ stats, onRetry, onHome }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (containerRef.current) tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    if (titleRef.current) tl.fromTo(titleRef.current, { y: -30, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, '-=0.2');
    if (statsRef.current) {
      const cards = statsRef.current.querySelectorAll('.gameroom-gameover-stat');
      tl.fromTo(cards, { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08 }, '-=0.2');
    }
    if (actionsRef.current) tl.fromTo(actionsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.1');
  }, []);

  const {
    score = 0, distance = 0,
    gatesCorrect = 0, gatesWrong = 0,
    tokensCollected = 0, bugsDodged = 0, bugsHit = 0,
    maxCombo = 0, difficulty = 'ROOKIE',
  } = stats || {};

  const totalGates = gatesCorrect + gatesWrong;
  const gateAccuracy = totalGates > 0 ? Math.round((gatesCorrect / totalGates) * 100) : 0;

  let rating = '🌟', ratingLabel = 'Beginner';
  if (score > 5000) { rating = '🔥🔥🔥'; ratingLabel = 'Legendary'; }
  else if (score > 2000) { rating = '🔥🔥'; ratingLabel = 'Expert'; }
  else if (score > 800) { rating = '🔥'; ratingLabel = 'Skilled'; }
  else if (score > 300) { rating = '⚡'; ratingLabel = 'Promising'; }

  return (
    <div ref={containerRef} className="gameroom-gameover">
      <div ref={titleRef} style={{ textAlign: 'center' }}>
        <div className="gameroom-gameover-title">FUEL EMPTY</div>
        <div className="gameroom-gameover-subtitle">{rating} {ratingLabel} · reached {difficulty}</div>
      </div>

      <div ref={statsRef} className="gameroom-gameover-stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 420 }}>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: '#00f2fe' }}>{Math.floor(score).toLocaleString()}</div>
          <div className="gameroom-gameover-stat-label">SCORE</div>
        </div>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: '#4facfe' }}>{Math.floor(distance).toLocaleString()}m</div>
          <div className="gameroom-gameover-stat-label">DISTANCE</div>
        </div>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: gateAccuracy >= 70 ? '#10b981' : '#f59e0b' }}>{gateAccuracy}%</div>
          <div className="gameroom-gameover-stat-label">GATE ACCURACY ({gatesCorrect}/{totalGates})</div>
        </div>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: maxCombo >= 5 ? '#ff007a' : '#00f2fe' }}>x{maxCombo}</div>
          <div className="gameroom-gameover-stat-label">MAX COMBO</div>
        </div>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: '#c3e88d' }}>{tokensCollected}</div>
          <div className="gameroom-gameover-stat-label">TOKENS COLLECTED</div>
        </div>
        <div className="gameroom-gameover-stat">
          <div className="gameroom-gameover-stat-value" style={{ color: '#ff5370' }}>{bugsDodged}</div>
          <div className="gameroom-gameover-stat-label">BUGS DODGED</div>
        </div>
      </div>

      <div ref={actionsRef} className="gameroom-gameover-actions">
        <button className="gameroom-btn-retry" onClick={onRetry}>🔄 Try Again</button>
        <button className="gameroom-btn-home" onClick={onHome}>← Back to Home</button>
      </div>
    </div>
  );
}

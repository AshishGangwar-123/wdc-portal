/* ==========================================================================
   CodeFuel v2 — Code Canyon Runner Game Engine
   Canvas 2D lane runner with code-integrated game elements
   ========================================================================== */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { renderFrame, initCodeRain } from './canvasRenderer';
import { getRandomGate } from './codeGates';
import soundManager from './soundManager';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import {
  FUEL, LANES, ROAD, SPEED, SPAWN, COMBO, VISUAL,
  getDifficulty, getSpawnInterval,
  TOKEN_TYPES, BUG_TYPES, POWERUP_TYPES,
  LANGUAGE_THEMES,
} from './gameConstants';

export default function CodeFuelGame({ language, onExit, onRestart }) {
  const theme = LANGUAGE_THEMES[language] || LANGUAGE_THEMES.python;

  // ── React state (for HUD — throttled updates) ──────────────────────────
  const [fuel, setFuel] = useState(FUEL.INITIAL);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePowerups, setActivePowerups] = useState([]);
  const [statsData, setStatsData] = useState(null);

  // ── Refs ────────────────────────────────────────────────────────────────
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const gameRef = useRef(null);

  // ── Initialize & Run Game ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Size canvas
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (gameRef.current) {
        gameRef.current.w = w;
        gameRef.current.h = h;
        gameRef.current.codeRain = initCodeRain(w);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Init sound
    soundManager.init();
    soundManager.resume();

    // Init game state
    const w = window.innerWidth;
    const h = window.innerHeight;
    const g = {
      w, h,
      // Player
      player: {
        currentLane: 1,
        targetLane: 1,
        smoothX: 0,   // -1 to 1, smoothly interpolated
        shield: false,
        immune: false,
        boosted: false,
      },
      // Objects
      gates: [],
      tokens: [],
      bugs: [],
      powerups: [],
      particles: [],
      // Timing
      lastGateSpawn: 0,
      lastTokenSpawn: 0,
      lastBugSpawn: 0,
      lastPowerSpawn: 0,
      recentGateExprs: [],
      // State
      fuel: FUEL.INITIAL,
      score: 0,
      combo: 0,
      maxCombo: 0,
      distance: 0,
      speed: SPEED.BASE,
      scrollOffset: 0,
      // Powerup timers
      boostTimer: 0,
      immuneTimer: 0,
      slowmoTimer: 0,
      // Stats
      gatesCorrect: 0,
      gatesWrong: 0,
      tokensCollected: 0,
      bugsDodged: 0,
      bugsHit: 0,
      // Meta
      gameOver: false,
      lastFrame: performance.now(),
      lastHudUpdate: 0,
      codeRain: initCodeRain(w),
    };
    gameRef.current = g;

    // ── Input Handling ────────────────────────────────────────────────────
    const handleKeyDown = (e) => {
      if (g.gameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        g.player.targetLane = Math.max(0, g.player.targetLane - 1);
        soundManager.playClick();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        g.player.targetLane = Math.min(2, g.player.targetLane + 1);
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Touch controls
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (g.gameOver) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      // Swipe detection (horizontal)
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          g.player.targetLane = Math.max(0, g.player.targetLane - 1);
        } else {
          g.player.targetLane = Math.min(2, g.player.targetLane + 1);
        }
        soundManager.playClick();
      } else if (Math.abs(dx) < 15 && Math.abs(dy) < 15) {
        // Tap: left half = go left, right half = go right
        const tapX = e.changedTouches[0].clientX;
        if (tapX < g.w * 0.4) {
          g.player.targetLane = Math.max(0, g.player.targetLane - 1);
        } else if (tapX > g.w * 0.6) {
          g.player.targetLane = Math.min(2, g.player.targetLane + 1);
        }
        soundManager.playClick();
      }
    };
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    // ── Game Loop ─────────────────────────────────────────────────────────
    const loop = (now) => {
      if (g.gameOver) return;

      const delta = Math.min((now - g.lastFrame) / 1000, 0.1);
      g.lastFrame = now;

      const diff = getDifficulty(g.distance);

      // ── Update player position (smooth lane lerp) ──
      const targetX = g.player.targetLane - 1; // -1, 0, 1
      g.player.smoothX += (targetX - g.player.smoothX) * LANES.SWITCH_SPEED * delta;
      g.player.currentLane = g.player.targetLane;

      // ── Speed calculation ──
      const diffSpeedMult = 1 + (g.distance / 3500) * (SPEED.MAX_SPEED_MULT - 1);
      let effectiveSpeed = SPEED.BASE * diffSpeedMult;
      if (g.boostTimer > 0) effectiveSpeed += SPEED.BOOST_AMOUNT;
      if (g.slowmoTimer > 0) effectiveSpeed *= SPEED.SLOWMO_FACTOR;
      g.speed = effectiveSpeed;

      // ── Move objects toward player ──
      const moveAmount = effectiveSpeed * delta;
      g.scrollOffset += delta * (effectiveSpeed / SPEED.BASE);
      g.distance += moveAmount * SPEED.DISTANCE_PER_UNIT;
      g.score += moveAmount * 0.3;

      // ── Fuel drain ──
      g.fuel -= FUEL.DRAIN_BASE * diff.drainMult * delta;
      if (g.fuel <= 0) {
        g.fuel = 0;
        g.gameOver = true;
        setGameOver(true);
        setStatsData({
          score: g.score,
          distance: g.distance,
          gatesCorrect: g.gatesCorrect,
          gatesWrong: g.gatesWrong,
          tokensCollected: g.tokensCollected,
          bugsDodged: g.bugsDodged,
          bugsHit: g.bugsHit,
          maxCombo: g.maxCombo,
          difficulty: diff.label,
        });
        soundManager.playGameOver();
        return;
      }

      // ── Powerup timers ──
      if (g.boostTimer > 0) { g.boostTimer -= delta; if (g.boostTimer <= 0) g.player.boosted = false; }
      if (g.immuneTimer > 0) { g.immuneTimer -= delta; if (g.immuneTimer <= 0) g.player.immune = false; }
      if (g.slowmoTimer > 0) { g.slowmoTimer -= delta; }

      // ── Move game objects ──
      for (const gate of g.gates) gate.z -= moveAmount;
      for (const token of g.tokens) token.z -= moveAmount;
      for (const bug of g.bugs) bug.z -= moveAmount;
      for (const pu of g.powerups) pu.z -= moveAmount;

      // ── Collision Detection ──
      // Gates
      for (const gate of g.gates) {
        if (!gate.passed && gate.z <= 3 && gate.z > -3) {
          gate.passed = true;
          gate.hitLane = g.player.currentLane;
          const opt = gate.options[g.player.currentLane];
          if (opt.isCorrect) {
            g.gatesCorrect++;
            g.fuel = Math.min(FUEL.MAX, g.fuel + FUEL.GATE_CORRECT);
            g.combo++;
            if (g.combo > g.maxCombo) g.maxCombo = g.combo;
            g.score += 50 * g.combo;
            soundManager.playCorrect();
            if (g.combo >= 2) soundManager.playCombo(g.combo);
            spawnParticles(g, g.w / 2 + g.player.smoothX * g.w * ROAD.WIDTH_FRACTION * 0.30,
              g.h * ROAD.BOTTOM_Y - 30, '#10b981', 15);
          } else {
            g.gatesWrong++;
            if (!g.player.shield && !g.player.immune) {
              g.fuel = Math.max(0, g.fuel - FUEL.GATE_WRONG);
              soundManager.playWrong();
            } else if (g.player.shield) {
              g.player.shield = false;
              soundManager.playClick();
            }
            g.combo = 0;
            spawnParticles(g, g.w / 2 + g.player.smoothX * g.w * ROAD.WIDTH_FRACTION * 0.30,
              g.h * ROAD.BOTTOM_Y - 30, '#ff4d6d', 12);
          }
        }
      }

      // Tokens
      for (const token of g.tokens) {
        if (!token.collected && token.lane === g.player.currentLane && token.z <= 5 && token.z > -2) {
          token.collected = true;
          g.tokensCollected++;
          g.fuel = Math.min(FUEL.MAX, g.fuel + FUEL.TOKEN_COLLECT);
          g.score += token.points;
          soundManager.playClick();
          spawnParticles(g, g.w / 2 + g.player.smoothX * g.w * ROAD.WIDTH_FRACTION * 0.30,
            g.h * ROAD.BOTTOM_Y - 20, token.color, 8);
        }
      }

      // Bugs
      for (const bug of g.bugs) {
        if (!bug.hit && bug.lane === g.player.currentLane && bug.z <= 5 && bug.z > -2) {
          bug.hit = true;
          g.bugsHit++;
          if (!g.player.shield && !g.player.immune) {
            g.fuel = Math.max(0, g.fuel - FUEL.BUG_HIT);
            g.combo = 0;
            soundManager.playWrong();
          } else if (g.player.shield) {
            g.player.shield = false;
            soundManager.playClick();
          }
          spawnParticles(g, g.w / 2 + g.player.smoothX * g.w * ROAD.WIDTH_FRACTION * 0.30,
            g.h * ROAD.BOTTOM_Y - 20, '#ff4d6d', 10);
        }
        // Count dodged bugs
        if (!bug.hit && bug.z < -3 && !bug._dodgeCounted) {
          bug._dodgeCounted = true;
          g.bugsDodged++;
          g.score += 5;
        }
      }

      // Powerups
      for (const pu of g.powerups) {
        if (!pu.collected && pu.lane === g.player.currentLane && pu.z <= 5 && pu.z > -2) {
          pu.collected = true;
          activatePowerup(g, pu);
          soundManager.playBoost();
          spawnParticles(g, g.w / 2 + g.player.smoothX * g.w * ROAD.WIDTH_FRACTION * 0.30,
            g.h * ROAD.BOTTOM_Y - 20, pu.color, 20);
        }
      }

      // ── Spawning ──
      const nowSec = now / 1000;
      const spawnMult = diff.spawnMult;

      // Gates
      const gateInterval = getSpawnInterval(SPAWN.GATE_INTERVAL, SPAWN.GATE_INTERVAL_MIN, spawnMult);
      if (nowSec - g.lastGateSpawn > gateInterval) {
        g.lastGateSpawn = nowSec;
        const gateData = getRandomGate(diff.maxTier, g.recentGateExprs);
        g.recentGateExprs.push(gateData.expr);
        if (g.recentGateExprs.length > 10) g.recentGateExprs.shift();
        g.gates.push({ ...gateData, z: ROAD.SPAWN_Z, passed: false, hitLane: -1 });
      }

      // Tokens
      const tokenInterval = getSpawnInterval(SPAWN.TOKEN_INTERVAL, SPAWN.TOKEN_INTERVAL_MIN, spawnMult);
      if (nowSec - g.lastTokenSpawn > tokenInterval) {
        g.lastTokenSpawn = nowSec;
        const tokenType = TOKEN_TYPES[Math.floor(Math.random() * TOKEN_TYPES.length)];
        const text = tokenType.texts[Math.floor(Math.random() * tokenType.texts.length)];
        g.tokens.push({
          z: ROAD.SPAWN_Z + Math.random() * 20,
          lane: Math.floor(Math.random() * 3),
          type: tokenType.type,
          text,
          color: tokenType.color,
          points: tokenType.points,
          collected: false,
        });
      }

      // Bugs
      const bugInterval = getSpawnInterval(SPAWN.BUG_INTERVAL, SPAWN.BUG_INTERVAL_MIN, spawnMult);
      if (nowSec - g.lastBugSpawn > bugInterval) {
        g.lastBugSpawn = nowSec;
        g.bugs.push({
          z: ROAD.SPAWN_Z + Math.random() * 15,
          lane: Math.floor(Math.random() * 3),
          type: BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)],
          hit: false,
        });
      }

      // Powerups
      if (nowSec - g.lastPowerSpawn > SPAWN.POWERUP_INTERVAL) {
        g.lastPowerSpawn = nowSec;
        if (Math.random() < SPAWN.POWERUP_CHANCE) {
          const puType = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
          g.powerups.push({
            z: ROAD.SPAWN_Z,
            lane: Math.floor(Math.random() * 3),
            ...puType,
            collected: false,
          });
        }
      }

      // ── Cleanup far-gone objects ──
      g.gates = g.gates.filter(o => o.z > -20);
      g.tokens = g.tokens.filter(o => o.z > -10 && !o.collected);
      g.bugs = g.bugs.filter(o => o.z > -10);
      g.powerups = g.powerups.filter(o => o.z > -10 && !o.collected);

      // ── Update particles ──
      for (const p of g.particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 80 * delta; // gravity
        p.life -= delta;
      }
      g.particles = g.particles.filter(p => p.life > 0);

      // ── Update code rain ──
      for (const col of g.codeRain) {
        col.offset += col.speed * delta;
      }

      // ── Render ──
      renderFrame(ctx, g, g.w, g.h);

      // ── Update HUD (throttled) ──
      if (now - g.lastHudUpdate > 80) {
        g.lastHudUpdate = now;
        setFuel(g.fuel);
        setScore(g.score);
        setCombo(g.combo);
        setDistance(g.distance);
        const ap = [];
        if (g.player.shield) ap.push({ type: 'shield', icon: '🛡️' });
        if (g.player.immune) ap.push({ type: 'immunity', time: g.immuneTimer.toFixed(1) });
        if (g.player.boosted) ap.push({ type: 'boost', time: g.boostTimer.toFixed(1) });
        if (g.slowmoTimer > 0) ap.push({ type: 'slowmo', time: g.slowmoTimer.toFixed(1) });
        setActivePowerups(ap);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // Start game after brief delay
    const startTimeout = setTimeout(() => {
      g.lastFrame = performance.now();
      g.lastGateSpawn = performance.now() / 1000;
      g.lastTokenSpawn = performance.now() / 1000;
      g.lastBugSpawn = performance.now() / 1000;
      g.lastPowerSpawn = performance.now() / 1000;
      rafRef.current = requestAnimationFrame(loop);
    }, 300);

    return () => {
      clearTimeout(startTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toggle sound ───────────────────────────────────────────────────────
  const toggleSound = useCallback(() => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
  }, []);

  // ── Retry ──────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    // Full page reload of the game is cleanest for reset
    setGameOver(false);
    setStatsData(null);
    setFuel(FUEL.INITIAL);
    setScore(0);
    setCombo(0);
    setDistance(0);
    setActivePowerups([]);

    const g = gameRef.current;
    if (!g) return;

    // Reset all state
    Object.assign(g, {
      fuel: FUEL.INITIAL, score: 0, combo: 0, maxCombo: 0, distance: 0,
      speed: SPEED.BASE, scrollOffset: 0,
      boostTimer: 0, immuneTimer: 0, slowmoTimer: 0,
      gatesCorrect: 0, gatesWrong: 0, tokensCollected: 0, bugsDodged: 0, bugsHit: 0,
      gates: [], tokens: [], bugs: [], powerups: [], particles: [],
      recentGateExprs: [],
      gameOver: false,
    });
    g.player = { currentLane: 1, targetLane: 1, smoothX: 0, shield: false, immune: false, boosted: false };

    const now = performance.now();
    g.lastFrame = now;
    g.lastGateSpawn = now / 1000;
    g.lastTokenSpawn = now / 1000;
    g.lastBugSpawn = now / 1000;
    g.lastPowerSpawn = now / 1000;
    g.lastHudUpdate = 0;

    // Restart render loop
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const loop = (time) => {
      if (g.gameOver) return;
      // Re-run the same loop logic...
      // Instead of duplicating, trigger a re-mount
      rafRef.current = requestAnimationFrame(loop);
    };
    // Simplest: just re-mount the component
    if (onRestart) onRestart();
    else onExit();
  }, [onExit, onRestart]);

  // ── Difficulty ─────────────────────────────────────────────────────────
  const difficulty = getDifficulty(distance);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: '#020208' }}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
        }}
      />

      {/* HUD Overlay */}
      {!gameOver && (
        <HUD
          fuel={fuel}
          score={score}
          combo={combo}
          distance={distance}
          difficulty={difficulty}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          activePowerups={activePowerups}
        />
      )}

      {/* Mobile Control Hints */}
      {!gameOver && (
        <div style={{
          position: 'fixed',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          zIndex: 10003,
          opacity: 0.3,
          pointerEvents: 'none',
          fontFamily: 'Fira Code, monospace',
          fontSize: '0.6rem',
          color: '#64748b',
        }}>
          <span>← A/SWIPE</span>
          <span>·</span>
          <span>D/SWIPE →</span>
        </div>
      )}

      {/* Game Over */}
      {gameOver && statsData && (
        <GameOverScreen
          stats={statsData}
          onRetry={handleRetry}
          onHome={onExit}
        />
      )}
    </div>
  );
}

// ── Helper: Spawn particles at a position ────────────────────────────────
function spawnParticles(g, x, y, color, count) {
  for (let i = 0; i < Math.min(count, VISUAL.PARTICLE_LIMIT - g.particles.length); i++) {
    g.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 200,
      vy: (Math.random() - 0.5) * 200 - 50,
      color,
      size: 2 + Math.random() * 4,
      life: 0.5 + Math.random() * 0.5,
      maxLife: 1,
    });
  }
}

// ── Helper: Activate a powerup ───────────────────────────────────────────
function activatePowerup(g, pu) {
  switch (pu.type) {
    case 'shield':
      g.player.shield = true;
      break;
    case 'refuel':
      g.fuel = Math.min(FUEL.MAX, g.fuel + FUEL.POWERUP_REFUEL);
      break;
    case 'boost':
      g.boostTimer = SPEED.BOOST_DURATION;
      g.player.boosted = true;
      break;
    case 'immunity':
      g.immuneTimer = 4;
      g.player.immune = true;
      break;
    case 'slowmo':
      g.slowmoTimer = SPEED.SLOWMO_DURATION;
      break;
  }
}

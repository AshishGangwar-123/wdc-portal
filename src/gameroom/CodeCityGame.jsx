/* ==========================================================================
   Code City Explorer — Main Game Loop & State Orchestrator v4.1 (Cache Bump)
   20 Questions per level, dynamic Level Themes, Level unlock progression
   ========================================================================== */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { generateLevelQuests, evaluateSolution } from './quests';
import { renderCityFrame, toAlphaColor } from './cityCanvasRenderer';
import { clampToRoad } from './roadGeometry';
import CodeDeckSidebar from './CodeDeckSidebar';
import soundManager from './soundManager';
import HUD from './HUD';
import { CITY_MAP, CAR_PHYSICS, SCORING, VEHICLES, getLevelTheme } from './gameConstants';

export default function CodeCityGame({ selectedLevel = 1, level: legacyLevel, language = 'python', onExit, onUnlockNextLevel }) {
  const safeLevel = Math.max(1, parseInt(selectedLevel || legacyLevel, 10) || 1);
  const level = safeLevel;

  // Generate 20 questions for selected level and language
  const levelQuests = useMemo(() => generateLevelQuests(safeLevel, language), [safeLevel, language]);
  const levelTheme = useMemo(() => getLevelTheme(safeLevel), [safeLevel]);

  const [questIndex, setQuestIndex] = useState(0);
  const currentQuest = levelQuests[questIndex] || levelQuests[0] || {
    title: 'L1-M1: Supply Addition',
    topic: 'Variables & Addition',
    story: 'Calculate energy sum.',
    problemStatement: 'Set a = 10, b = 5, calculate total = a + b',
    expectedOutput: 'Energy: 15',
    solutionSequence: [],
    destinations: [],
  };

  // Game Progression & Garage State
  const [assembledBlocks, setAssembledBlocks] = useState([]);
  const [activeNearDest, setActiveNearDest] = useState(null);
  const [testCount, setTestCount] = useState(0);
  const [testResult, setTestResult] = useState(null);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(1000);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Gamification & Garage States
  const [xp, setXp] = useState(() => {
    try {
      const parsed = parseInt(localStorage.getItem('code_city_xp') || '0', 10);
      return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
      return 0;
    }
  });
  const [nitro, setNitro] = useState(100);
  const lastNitroRef = useRef(100);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [garageOpen, setGarageOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  // Mutable Game Engine Physics Ref
  const gameRef = useRef({
    car: { x: 550, y: 550, targetX: 550, targetY: 550, angle: 0, speed: 0 },
    vehicleConfig: VEHICLES[0],
    theme: levelTheme,
    destinations: currentQuest.destinations,
    collectedDestIds: [],
    activeNearDestId: null,
    particles: [],
    skidMarks: [],
    rainDrops: Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 12 + Math.random() * 15,
      speed: 400 + Math.random() * 300,
    })),
    npcs: [
      { x: 200, y: 550, angle: 0, speed: 180, axis: 'x', dir: 1 },
      { x: 900, y: 300, angle: Math.PI / 2, speed: 150, axis: 'y', dir: 1 },
      { x: 1300, y: 1200, angle: -Math.PI / 2, speed: 200, axis: 'y', dir: -1 },
      { x: 1650, y: 900, angle: Math.PI, speed: 160, axis: 'x', dir: -1 },
    ],
    isNitroActive: false,
    nitroAmount: 100,
    viewWidth: window.innerWidth,
    viewHeight: window.innerHeight,
    isDragging: false,
    keys: { left: false, right: false, up: false, down: false, space: false },
    lastTime: performance.now(),
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('code_city_xp', xp.toString());
  }, [xp]);

  // Restart / Next Quest in 20-Question Series
  const startNextQuest = useCallback(() => {
    if (questIndex < 19) {
      const nextIdx = questIndex + 1;
      const q = levelQuests[nextIdx];

      setQuestIndex(nextIdx);
      setAssembledBlocks([]);
      setActiveNearDest(null);
      setTestCount(0);
      setTestResult(null);
      setQuestCompleted(false);

      if (gameRef.current) {
        gameRef.current.destinations = q.destinations;
        gameRef.current.collectedDestIds = [];
        gameRef.current.activeNearDestId = null;
        gameRef.current.car = { x: 550, y: 550, targetX: 550, targetY: 550, angle: 0, speed: 0 };
      }
    } else {
      // Completed all 20 questions of this level!
      setIsLevelFinished(true);
      const curUnlocked = parseInt(localStorage.getItem('code_city_unlocked_level') || '1', 10);
      if (selectedLevel >= curUnlocked) {
        const nextLvl = selectedLevel + 1;
        localStorage.setItem('code_city_unlocked_level', nextLvl.toString());
      }
    }
  }, [questIndex, levelQuests, selectedLevel]);

  // Collect Code Block
  const handleCollectBlock = useCallback((dest) => {
    const g = gameRef.current;
    if (g.collectedDestIds.includes(dest.id)) return;

    try { soundManager.playClick(); soundManager.playCorrect(); } catch (e) {}

    g.collectedDestIds.push(dest.id);
    setAssembledBlocks((prev) => [...prev, dest]);

    // Award Block Collection XP
    setXp((prevXp) => {
      const newXp = prevXp + SCORING.BLOCK_COLLECT_XP;
      const calculatedLvl = Math.floor(newXp / SCORING.XP_PER_LEVEL) + 1;
      if (calculatedLvl > safeLevel) {
        try { soundManager.playLevelUp(); } catch (e) {}
      }
      return newXp;
    });

    // Collection Sparkle Burst
    for (let i = 0; i < 30; i++) {
      g.particles.push({
        x: dest.x,
        y: dest.y,
        vx: (Math.random() - 0.5) * 350,
        vy: (Math.random() - 0.5) * 350,
        color: selectedVehicle.color || '#00f2fe',
        size: 3 + Math.random() * 5,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
      });
    }
  }, [safeLevel, selectedVehicle]);

  // Drop / Discard Code Block
  const handleDropBlock = useCallback((blockId) => {
    try { soundManager.playClick(); } catch (e) {}
    const g = gameRef.current;
    g.collectedDestIds = g.collectedDestIds.filter((id) => id !== blockId);
    setAssembledBlocks((prev) => prev.filter((b) => b.id !== blockId));
  }, []);

  // Reorder Code Block in Deck
  const handleMoveBlock = useCallback((fromIndex, direction) => {
    try { soundManager.playClick(); } catch (e) {}
    setAssembledBlocks((prev) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }, []);

  // Test Code Execution
  const handleTestCode = useCallback(() => {
    const newCount = testCount + 1;
    setTestCount(newCount);

    const result = evaluateSolution(currentQuest, assembledBlocks, language);
    setTestResult(result);

    if (result?.success) {
      try { soundManager.playBoost(); soundManager.playCombo(4); } catch (e) {}

      const extraChecks = Math.max(0, newCount - SCORING.FREE_CHECKS);
      const scoreDeduction = extraChecks * SCORING.PENALTY_PER_EXTRA_CHECK;
      const calculatedScore = Math.max(SCORING.MIN_SCORE, SCORING.BASE_QUEST_POINTS - scoreDeduction);

      setFinalScore(calculatedScore);
      setQuestCompleted(true);

      // Award Quest Solve XP
      setXp((prevXp) => prevXp + SCORING.QUEST_SOLVE_XP);
    } else {
      try { soundManager.playWrong(); } catch (e) {}
    }
  }, [testCount, currentQuest, assembledBlocks, level, language]);

  // Main Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    soundManager.init();
    soundManager.resume();

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
        gameRef.current.viewWidth = w;
        gameRef.current.viewHeight = h;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const g = gameRef.current;
    g.destinations = currentQuest.destinations;
    g.vehicleConfig = selectedVehicle;
    g.language = language;

    // Controls Pointer Handler
    const updateTargetFromPointer = (clientX, clientY) => {
      const camX = Math.max(g.viewWidth / 2, Math.min(CITY_MAP.WIDTH - g.viewWidth / 2, g.car.x));
      const camY = Math.max(g.viewHeight / 2, Math.min(CITY_MAP.HEIGHT - g.viewHeight / 2, g.car.y));

      const worldX = clientX - (g.viewWidth / 2 - camX);
      const worldY = clientY - (g.viewHeight / 2 - camY);

      g.car.targetX = Math.max(30, Math.min(CITY_MAP.WIDTH - 30, worldX));
      g.car.targetY = Math.max(30, Math.min(CITY_MAP.HEIGHT - 30, worldY));
    };

    const handlePointerDown = (e) => {
      g.isDragging = true;
      updateTargetFromPointer(e.clientX, e.clientY);
    };

    const handlePointerMove = (e) => {
      if (g.isDragging || e.buttons === 1) {
        updateTargetFromPointer(e.clientX, e.clientY);
      }
    };

    const handlePointerUp = () => {
      g.isDragging = false;
    };

    // Keyboard WASD & Spacebar (Nitro) Controls
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') g.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') g.keys.down = true;
      if (e.key === ' ' || e.code === 'Space') {
        g.keys.space = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') g.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') g.keys.right = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') g.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') g.keys.down = false;
      if (e.key === ' ' || e.code === 'Space') g.keys.space = false;
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let lastProximityCheck = 0;

    // Main Loop
    const loop = (now) => {
      const delta = Math.min((now - g.lastTime) / 1000, 0.1);
      g.lastTime = now;

      // Handle Nitro Boost
      const wantsNitro = g.keys.space && g.nitroAmount > 5;
      if (wantsNitro) {
        g.nitroAmount = Math.max(0, g.nitroAmount - CAR_PHYSICS.NITRO_DRAIN_RATE * delta);
        if (!g.isNitroActive) soundManager.playNitro();
        g.isNitroActive = true;
      } else {
        g.nitroAmount = Math.min(CAR_PHYSICS.NITRO_MAX, g.nitroAmount + CAR_PHYSICS.NITRO_RECHARGE_RATE * delta);
        g.isNitroActive = false;
      }
      const nextNitroInt = Math.floor(g.nitroAmount);
      if (nextNitroInt !== lastNitroRef.current) {
        lastNitroRef.current = nextNitroInt;
        setNitro(nextNitroInt);
      }

      // ── Steering & Movement Physics ─────────────────────────────────────
      const isKeyPressed = g.keys.left || g.keys.right || g.keys.up || g.keys.down;
      const maxSpeed = (selectedVehicle.maxSpeed || CAR_PHYSICS.MAX_SPEED) * (g.isNitroActive ? CAR_PHYSICS.NITRO_MULTIPLIER : 1);

      if (isKeyPressed) {
        let dx = 0, dy = 0;
        if (g.keys.left) dx -= 1;
        if (g.keys.right) dx += 1;
        if (g.keys.up) dy -= 1;
        if (g.keys.down) dy += 1;

        if (dx !== 0 || dy !== 0) {
          const len = Math.hypot(dx, dy);
          const prevX = g.car.x;
          const prevY = g.car.y;

          // Direct frame-based step (only moves while key is held down!)
          const step = maxSpeed * delta;
          g.car.x += (dx / len) * step;
          g.car.y += (dy / len) * step;

          // Keep target synced to current position so no target overshooting occurs
          g.car.targetX = g.car.x;
          g.car.targetY = g.car.y;

          // Clamp to road surface
          const clamped = clampToRoad(g.car.x, g.car.y);
          g.car.x = clamped.x;
          g.car.y = clamped.y;
          g.car.targetX = g.car.x;
          g.car.targetY = g.car.y;

          // Rotate car towards movement angle
          const targetAngle = Math.atan2(dy, dx);
          let diff = targetAngle - g.car.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          const turnSharpness = Math.abs(diff);
          g.car.angle += diff * Math.min(1, CAR_PHYSICS.ROTATION_SPEED * delta);

          // Drift Skid Marks on Sharp Turns
          if (turnSharpness > 0.8 && step > 2) {
            soundManager.playDrift();
            g.skidMarks.push({
              x1: prevX, y1: prevY,
              x2: g.car.x, y2: g.car.y,
              life: 1.0,
            });
          }

          soundManager.updateEngine(1.0, true);
        }
      } else {
        // Mouse / Touch Drag Lerp
        const dx = g.car.targetX - g.car.x;
        const dy = g.car.targetY - g.car.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 4) {
          const prevX = g.car.x;
          const prevY = g.car.y;

          const moveDist = Math.min(dist, maxSpeed * delta * (dist > 80 ? 1.4 : 1));
          g.car.x += (dx / dist) * moveDist;
          g.car.y += (dy / dist) * moveDist;

          const clamped = clampToRoad(g.car.x, g.car.y);
          g.car.x = clamped.x;
          g.car.y = clamped.y;

          const targetAngle = Math.atan2(dy, dx);
          let diff = targetAngle - g.car.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          g.car.angle += diff * Math.min(1, CAR_PHYSICS.ROTATION_SPEED * delta);

          const speedRatio = Math.min(1, moveDist / (maxSpeed * delta));
          soundManager.updateEngine(speedRatio, dist > 60);
        } else {
          // Stationary — Reset target to car pos
          g.car.targetX = g.car.x;
          g.car.targetY = g.car.y;
          soundManager.updateEngine(0, false);
        }
      }

      // Update Skid Marks Decay
      for (const sm of g.skidMarks) {
        sm.life -= delta * 0.4;
      }
      g.skidMarks = g.skidMarks.filter((sm) => sm.life > 0);

      // Update Traffic NPCs Movement
      for (const npc of g.npcs) {
        if (npc.axis === 'x') {
          npc.x += npc.speed * npc.dir * delta;
          if (npc.x > CITY_MAP.WIDTH - 150) npc.dir = -1;
          if (npc.x < 150) npc.dir = 1;
          npc.angle = npc.dir === 1 ? 0 : Math.PI;
        } else {
          npc.y += npc.speed * npc.dir * delta;
          if (npc.y > CITY_MAP.HEIGHT - 150) npc.dir = -1;
          if (npc.y < 150) npc.dir = 1;
          npc.angle = npc.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
        }
      }

      // Update Cyber Rain
      for (const r of g.rainDrops) {
        r.y += r.speed * delta;
        if (r.y > g.viewHeight) {
          r.y = -10;
          r.x = Math.random() * g.viewWidth;
        }
      }

      // Proximity Detection
      if (now - lastProximityCheck > 100) {
        lastProximityCheck = now;
        let nearest = null;
        let minD = CITY_MAP.PROXIMITY_RADIUS;

        for (const dest of g.destinations) {
          const d = Math.hypot(dest.x - g.car.x, dest.y - g.car.y);
          if (d < minD) {
            minD = d;
            nearest = dest;
          }
        }

        if (nearest && nearest.id !== g.activeNearDestId) {
          g.activeNearDestId = nearest.id;
          setActiveNearDest(nearest);
          soundManager.playClick();
        } else if (!nearest && g.activeNearDestId !== null) {
          g.activeNearDestId = null;
          setActiveNearDest(null);
        }
      }

      // Update Particles
      for (const p of g.particles) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.life -= delta;
      }
      g.particles = g.particles.filter((p) => p.life > 0);

      // Render Frame
      try {
        renderCityFrame(ctx, g, g.viewWidth, g.viewHeight);
      } catch (err) {
        console.error('Canvas Frame Error:', err);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      soundManager.stopEngine();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentQuest, selectedVehicle]);

  // Toggle Sound Effects
  const toggleSound = useCallback(() => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
  }, []);

  // Toggle Synthwave BGM
  const toggleMusic = useCallback(() => {
    const enabled = soundManager.toggleMusic();
    setMusicEnabled(enabled);
  }, []);

  const isNearCollected = activeNearDest ? assembledBlocks.some((b) => b.id === activeNearDest.id) : false;

  return (
    <div
      onSelectStart={(e) => e.preventDefault()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#04060f',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
      }}
    >
      {/* 2D City Canvas */}
      <canvas
        ref={canvasRef}
        onSelectStart={(e) => e.preventDefault()}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
          cursor: 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      />

      {/* Top Cyber HUD */}
      <HUD
        questTitle={currentQuest.title}
        problemStatement={currentQuest.problemStatement}
        testCount={testCount}
        score={finalScore}
        level={selectedLevel}
        missionNumber={questIndex + 1}
        levelTheme={levelTheme}
        xp={xp}
        nitro={nitro}
        activeVehicle={selectedVehicle}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={toggleSound}
        onToggleMusic={toggleMusic}
        onOpenGarage={() => setGarageOpen(true)}
        onOpenHint={() => setHintOpen(true)}
      />

      {/* Code Deck Sidebar & Proximity Signboard Popup */}
      <CodeDeckSidebar
        assembledBlocks={assembledBlocks}
        activeNearDest={activeNearDest}
        isNearCollected={isNearCollected}
        onCollect={handleCollectBlock}
        onDropBlock={handleDropBlock}
        onMoveBlock={handleMoveBlock}
        onTestCode={handleTestCode}
        testCount={testCount}
        score={finalScore}
        testResult={testResult}
      />

      {/* Control Instruction Hint */}
      <div
        style={{
          position: 'fixed',
          bottom: 12,
          left: 20,
          zIndex: 10003,
          background: 'rgba(8, 10, 28, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '6px 14px',
          fontSize: '0.65rem',
          color: '#64748b',
          fontFamily: '"Fira Code", monospace',
          display: 'flex',
          gap: 12,
        }}
      >
        <span>🚗 DRAG MOUSE / WASD TO STEER</span>
        <span style={{ color: levelTheme.accent, fontWeight: 700 }}>⚡ HOLD SPACEBAR FOR NITRO</span>
      </div>

      {/* 🏎️ Cyber Garage Modal */}
      {garageOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10040,
            background: 'rgba(4, 6, 15, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          <div
            style={{
              background: 'rgba(10, 14, 38, 0.96)',
              border: `2px solid ${levelTheme.accent}`,
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: `0 20px 60px ${levelTheme.glowColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f0f4ff', margin: 0 }}>
                  🏎️ Cyber Garage
                </h2>
                <div style={{ fontSize: '0.75rem', color: levelTheme.accent, fontFamily: '"Fira Code", monospace' }}>
                  Select your vehicle (Current Level: {selectedLevel})
                </div>
              </div>
              <button
                onClick={() => setGarageOpen(false)}
                style={{
                  background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              {VEHICLES.map((v) => {
                const isUnlocked = selectedLevel >= v.unlockedAtLevel;
                const isSelected = selectedVehicle.id === v.id;

                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedVehicle(v);
                        soundManager.playClick();
                      }
                    }}
                    style={{
                      background: isSelected ? toAlphaColor(levelTheme.accent, 0.1) : 'rgba(0,0,0,0.4)',
                      border: `1.5px solid ${isSelected ? v.color : isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '16px',
                      padding: '14px',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.5,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 6 }}>{v.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isUnlocked ? '#f0f4ff' : '#64748b' }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', margin: '4px 0 8px 0' }}>
                      {v.desc}
                    </div>
                    <div style={{ fontSize: '0.65rem', fontFamily: '"Fira Code", monospace', color: isUnlocked ? v.color : '#ff0055' }}>
                      {isUnlocked ? (isSelected ? 'EQUIPPED ✓' : 'SELECT VEHICLE') : `UNLOCKS AT LEVEL ${v.unlockedAtLevel}`}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setGarageOpen(false)}
              style={{
                width: '100%',
                background: `linear-gradient(135deg, ${levelTheme.accent} 0%, ${levelTheme.secondary} 100%)`,
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                color: '#030308',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Done & Drive 🚀
            </button>
          </div>
        </div>
      )}

      {/* 🤖 "Ask Byte" AI Assistant Hint Modal */}
      {hintOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10040,
            background: 'rgba(4, 6, 15, 0.88)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          <div
            style={{
              background: 'rgba(10, 14, 38, 0.96)',
              border: `2px solid ${levelTheme.accent}`,
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: `0 20px 60px ${levelTheme.glowColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ fontSize: '2rem' }}>🤖</div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: levelTheme.accent, margin: 0 }}>
                  Byte — AI Assistant Clue
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
                  Mission Hint & Logic Breakdown
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${toAlphaColor(levelTheme.accent, 0.25)}`, borderRadius: '12px', padding: '14px', marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', color: '#f0f4ff', lineHeight: 1.5 }}>
                {currentQuest.story}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ffd43b', fontFamily: '"Fira Code", monospace', marginTop: 10 }}>
                💡 <b>Smart Tip:</b> Make sure to assemble variables first, then operations, then the final print output statement!
              </div>
            </div>

            <button
              onClick={() => setHintOpen(false)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '10px',
                color: '#f0f4ff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Got it, thanks Byte! 👍
            </button>
          </div>
        </div>
      )}

      {/* 🏆 Single Mission Complete or 🎉 Full Level 20/20 Complete Modal */}
      {questCompleted && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10030,
            background: 'rgba(4, 6, 15, 0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            fontFamily: '"Outfit", sans-serif',
          }}
        >
          <div
            style={{
              background: 'rgba(10, 14, 38, 0.95)',
              border: `2px solid ${levelTheme.accent}`,
              borderRadius: '24px',
              padding: '36px 28px',
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 20px 60px ${levelTheme.glowColor}`,
              animation: 'gameroom-pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>
              {questIndex === 19 ? '👑🎉' : '🏆'}
            </div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#f0f4ff',
                marginBottom: 6,
              }}
            >
              {questIndex === 19 ? `LEVEL ${selectedLevel} CLEARED!` : `MISSION ${questIndex + 1}/20 PASSED!`}
            </h2>
            <div
              style={{
                fontSize: '0.9rem',
                color: levelTheme.accent,
                fontFamily: '"Fira Code", monospace',
                marginBottom: 20,
              }}
            >
              {currentQuest.title}
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: 24,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>{finalScore}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
                  SCORE
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffd43b' }}>+{SCORING.QUEST_SOLVE_XP}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
                  XP GAINED
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {questIndex < 19 ? (
                <button
                  onClick={startNextQuest}
                  style={{
                    background: `linear-gradient(135deg, ${levelTheme.accent} 0%, ${levelTheme.secondary} 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    color: '#030308',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  🚀 Next Mission ({questIndex + 2}/20)
                </button>
              ) : (
                <button
                  onClick={() => onUnlockNextLevel(selectedLevel + 1)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  🔓 Unlock Level {selectedLevel + 1} ▶
                </button>
              )}

              <button
                onClick={onExit}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                ← Level Select Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


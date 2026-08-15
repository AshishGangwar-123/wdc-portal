/* ==========================================================================
   Code City Explorer — Heads-Up Display (HUD) v2
   Shows active quest title, problem statement, score, XP level, Nitro meter,
   Cyber Garage button, Synthwave BGM toggle, and AI Hint assistant!
   ========================================================================== */

import React from 'react';
import { SCORING } from './gameConstants';
import { toAlphaColor } from './cityCanvasRenderer';

export default function HUD({
  questTitle,
  problemStatement,
  testCount,
  score,
  level,
  missionNumber = 1,
  levelTheme,
  xp,
  nitro,
  activeVehicle,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onOpenGarage,
  onOpenHint,
}) {
  const extraChecks = Math.max(0, testCount - SCORING.FREE_CHECKS);
  const accentColor = levelTheme?.accent || '#00f2fe';

  // XP progress calculation
  const currentLvlXP = xp % SCORING.XP_PER_LEVEL;
  const xpPercent = Math.min(100, (currentLvlXP / SCORING.XP_PER_LEVEL) * 100);

  // 20-Question Level Mission Progress percentage
  const missionPercent = (missionNumber / 20) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        top: 14,
        left: 16,
        right: 16,
        zIndex: 10005,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* ── Left Side: Active Quest & Mission Banner ── */}
      <div
        style={{
          pointerEvents: 'auto',
          background: 'rgba(8, 10, 28, 0.92)',
          backdropFilter: 'blur(16px)',
          border: `1.5px solid ${toAlphaColor(accentColor, 0.4)}`,
          borderRadius: '16px',
          padding: '10px 16px',
          maxWidth: '520px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${toAlphaColor(accentColor, 0.15)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: accentColor, fontFamily: '"Fira Code", monospace', fontWeight: 800 }}>
            <span>LEVEL {level} · MISSION {missionNumber}/20</span>
          </div>

          {/* AI Hint Button */}
          <button
            onClick={onOpenHint}
            style={{
              background: toAlphaColor(accentColor, 0.1),
              border: `1px solid ${toAlphaColor(accentColor, 0.3)}`,
              borderRadius: '8px',
              padding: '2px 8px',
              color: accentColor,
              fontSize: '0.65rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>🤖</span> Ask Byte (Hint)
          </button>
        </div>

        {/* Quest Title & Problem Statement */}
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f0f4ff', lineHeight: 1.3 }}>
          {questTitle}: <span style={{ fontWeight: 400, color: '#cbd5e1' }}>{problemStatement}</span>
        </div>

        {/* 20-Mission Level Progress Bar */}
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: '"Fira Code", monospace', fontWeight: 700 }}>
            LVL {level} PROGRESS ({missionNumber}/20)
          </span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${missionPercent}%`, background: accentColor }} />
          </div>
        </div>

        {/* Nitro Meter Bar */}
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: '"Fira Code", monospace', fontWeight: 700 }}>
            ⚡ NITRO (SPACEBAR)
          </span>
          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${nitro}%`,
                background: nitro > 30 ? `linear-gradient(90deg, ${accentColor}, #7928ca)` : '#ff0055',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Right Side: Level, XP, Score & Controls ── */}
      <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Level & XP Gauge */}
        <div
          style={{
            background: 'rgba(8, 10, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 212, 59, 0.3)',
            borderRadius: '16px',
            padding: '8px 14px',
            minWidth: '110px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.6rem', color: '#ffd43b', fontFamily: '"Fira Code", monospace', fontWeight: 800 }}>
              LEVEL {level}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
              {currentLvlXP}/1000 XP
            </span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPercent}%`, background: '#ffd43b' }} />
          </div>
        </div>

        {/* Score Display */}
        <div
          style={{
            background: 'rgba(8, 10, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '0.58rem', color: '#64748b', fontFamily: '"Fira Code", monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            SCORE
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: extraChecks > 0 ? '#f59e0b' : '#00f2fe' }}>
            {score}
          </div>
        </div>

        {/* Garage Selection Button */}
        <button
          onClick={onOpenGarage}
          style={{
            height: 38,
            padding: '0 12px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            background: 'rgba(8, 10, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            color: '#00f2fe',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          title="Open Cyber Garage"
        >
          <span>{activeVehicle?.icon || '🏎️'}</span> Garage
        </button>

        {/* BGM Music Toggle Button */}
        <button
          onClick={onToggleMusic}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: `1px solid ${musicEnabled ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            background: 'rgba(8, 10, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            color: musicEnabled ? '#00f2fe' : '#64748b',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={musicEnabled ? 'Mute BGM Music' : 'Play Synthwave BGM'}
        >
          🎵
        </button>

        {/* SFX Mute Button */}
        <button
          onClick={onToggleSound}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(8, 10, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            color: '#94a3b8',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
    </div>
  );
}


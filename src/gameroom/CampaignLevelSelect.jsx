/* ==========================================================================
   Code City Explorer — Campaign Level Select Map
   Infinite sequential level progression grid with locked/unlocked states,
   star ratings, level themes, and topic titles!
   ========================================================================== */

import React, { useState } from 'react';
import { getLevelTheme, CAMPAIGN } from './gameConstants';
import soundManager from './soundManager';

export default function CampaignLevelSelect({
  unlockedLevel = 1,
  onSelectLevel,
  onBack,
  selectedLanguage = 'python',
}) {
  const [activePage, setActivePage] = useState(1);
  const levelsPerPage = 6;

  const safeUnlocked = Math.max(1, parseInt(unlockedLevel, 10) || 1);

  const maxDisplayLevel = Math.max(safeUnlocked + 3, 12);
  const totalPages = Math.ceil(maxDisplayLevel / levelsPerPage);

  const startIdx = (activePage - 1) * levelsPerPage + 1;
  const currentLevels = Array.from(
    { length: levelsPerPage },
    (_, i) => startIdx + i
  );

  const handleLevelClick = (lvlNum, isUnlocked) => {
    soundManager.init();
    soundManager.resume();

    if (isUnlocked) {
      soundManager.playClick();
      onSelectLevel(lvlNum);
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10010,
        background: 'radial-gradient(circle at center, #0c102b 0%, #04060f 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 20px',
        overflowY: 'auto',
        fontFamily: '"Outfit", sans-serif',
      }}
    >
      {/* ── Top Header Navigation ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '10px 18px',
            color: '#94a3b8',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Change Language
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {(selectedLanguage || 'python').toUpperCase()} CAMPAIGN
          </h1>
          <div
            style={{
              fontSize: '0.8rem',
              color: '#64748b',
              fontFamily: '"Fira Code", monospace',
              marginTop: 2,
            }}
          >
            20 Questions Per Level · Sequential Difficulty Unlock
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '12px',
            padding: '8px 16px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '0.62rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
            MAX UNLOCKED
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00f2fe' }}>
            LEVEL {unlockedLevel}
          </div>
        </div>
      </div>

      {/* ── Level Grid Container ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 20,
          marginBottom: 30,
        }}
      >
        {currentLevels.map((lvlNum) => {
          const isUnlocked = lvlNum <= safeUnlocked;
          const theme = getLevelTheme(lvlNum, selectedLanguage);

          return (
            <div
              key={lvlNum}
              onClick={() => handleLevelClick(lvlNum, isUnlocked)}
              style={{
                position: 'relative',
                background: isUnlocked
                  ? 'rgba(10, 14, 38, 0.88)'
                  : 'rgba(6, 8, 20, 0.5)',
                border: `2px solid ${
                  isUnlocked ? theme.accent : 'rgba(255, 255, 255, 0.06)'
                }`,
                borderRadius: '20px',
                padding: '22px',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                boxShadow: isUnlocked
                  ? `0 10px 30px ${theme.glowColor}`
                  : 'none',
                opacity: isUnlocked ? 1 : 0.45,
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (isUnlocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Level Badge Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    background: isUnlocked ? theme.accent : '#1e293b',
                    color: isUnlocked ? '#030308' : '#64748b',
                    fontSize: '1.3rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isUnlocked
                      ? `0 4px 14px ${theme.glowColor}`
                      : 'none',
                  }}
                >
                  {isUnlocked ? lvlNum : '🔒'}
                </div>

                <div
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: '"Fira Code", monospace',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: isUnlocked
                      ? `${theme.accent}22`
                      : 'rgba(255,255,255,0.05)',
                    color: isUnlocked ? theme.accent : '#64748b',
                    border: `1px solid ${
                      isUnlocked ? theme.accent + '44' : 'transparent'
                    }`,
                  }}
                >
                  {isUnlocked ? `${CAMPAIGN.QUESTIONS_PER_LEVEL} Missions` : 'LOCKED'}
                </div>
              </div>

              {/* Level Title & Topic */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: isUnlocked ? '#f0f4ff' : '#64748b',
                    marginBottom: 4,
                  }}
                >
                  {theme.icon} {theme.name}
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: isUnlocked ? theme.accent : '#475569',
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {theme.topic}
                </div>

                {/* 📋 Level Topics Syllabus Note */}
                <div
                  style={{
                    background: isUnlocked ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${isUnlocked ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)'}`,
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '0.68rem',
                    color: isUnlocked ? '#cbd5e1' : '#475569',
                    fontFamily: '"Fira Code", monospace',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ fontWeight: 800, color: isUnlocked ? '#f0f4ff' : '#64748b', marginBottom: 2 }}>
                    📋 TOPICS SYLLABUS NOTE:
                  </div>
                  {theme.topicsNote?.map((noteItem, idx) => (
                    <div key={idx} style={{ lineHeight: 1.3 }}>
                      {noteItem}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar / Locked Status */}
              {isUnlocked ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    fontSize: '0.75rem',
                    color: theme.accent,
                    fontWeight: 700,
                  }}
                >
                  <span>PLAY LEVEL {lvlNum} ▶</span>
                  <span>20 / 20 Tasks</span>
                </div>
              ) : (
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: '#ff4d6d',
                    fontFamily: '"Fira Code", monospace',
                    marginTop: 10,
                  }}
                >
                  Complete Level {lvlNum - 1} to Unlock 🔑
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination Buttons ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => {
            soundManager.playClick();
            setActivePage((p) => Math.max(1, p - 1));
          }}
          disabled={activePage === 1}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '8px 16px',
            color: activePage === 1 ? '#475569' : '#00f2fe',
            fontWeight: 800,
            cursor: activePage === 1 ? 'default' : 'pointer',
          }}
        >
          ◀ Previous Page
        </button>

        <span
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            fontFamily: '"Fira Code", monospace',
          }}
        >
          Page {activePage} of {totalPages}
        </span>

        <button
          onClick={() => {
            soundManager.playClick();
            setActivePage((p) => Math.min(totalPages, p + 1));
          }}
          disabled={activePage === totalPages}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            padding: '8px 16px',
            color: activePage === totalPages ? '#475569' : '#00f2fe',
            fontWeight: 800,
            cursor: activePage === totalPages ? 'default' : 'pointer',
          }}
        >
          Next Page ▶
        </button>
      </div>
    </div>
  );
}

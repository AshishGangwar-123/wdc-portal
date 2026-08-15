/* ==========================================================================
   Code City Explorer — Code Deck Sidebar & Proximity Banner
   Assembly panel, block reordering, drop actions, test runner & output log
   ========================================================================== */

import React, { useState } from 'react';
import { SCORING } from './gameConstants';

export default function CodeDeckSidebar({
  assembledBlocks,
  activeNearDest,
  isNearCollected,
  onCollect,
  onDropBlock,
  onMoveBlock,
  onTestCode,
  testCount,
  score,
  testResult,
}) {
  const [deckOpen, setDeckOpen] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [draggedBlockIdx, setDraggedBlockIdx] = useState(null);

  const extraChecks = Math.max(0, testCount - SCORING.FREE_CHECKS);
  const currentPenalty = extraChecks * SCORING.PENALTY_PER_EXTRA_CHECK;

  // Handle Panel Mouse Dragging
  const handlePanelPointerDown = (e) => {
    // Only drag when clicking header area
    if (e.target.closest('button')) return;

    setIsDraggingPanel(true);
    const startX = e.clientX - dragOffset.x;
    const startY = e.clientY - dragOffset.y;

    const handlePointerMove = (moveEvent) => {
      setDragOffset({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const handlePointerUp = () => {
      setIsDraggingPanel(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // HTML5 Drag & Drop Reordering
  const handleBlockDragStart = (e, index) => {
    setDraggedBlockIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragOver = (e, index) => {
    e.preventDefault();
    if (draggedBlockIdx === null || draggedBlockIdx === index) return;
    const direction = index > draggedBlockIdx ? 1 : -1;
    onMoveBlock(draggedBlockIdx, direction);
    setDraggedBlockIdx(index);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlockIdx(null);
  };

  return (
    <>
      {/* ── Proximity Signboard Popup Banner (when near a destination) ── */}
      {activeNearDest && (
        <div className="code-deck-proximity-banner" style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10015,
          width: 'calc(100% - 32px)',
          maxWidth: '520px',
          background: 'rgba(8, 10, 28, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(0, 242, 254, 0.4)',
          borderRadius: '20px',
          padding: '16px 20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 30px rgba(0, 242, 254, 0.15)',
          fontFamily: '"Outfit", sans-serif',
          animation: 'gameroom-pop-in 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f0f4ff' }}>
                  {activeNearDest.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
                  {activeNearDest.explanation}
                </div>
              </div>
            </div>

            {/* Collect Button */}
            {!isNearCollected ? (
              <button
                onClick={() => onCollect(activeNearDest)}
                style={{
                  background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  color: '#030308',
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span>📥</span> Collect Code
              </button>
            ) : (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                ✓ Collected
              </span>
            )}
          </div>

          {/* Code Snippet on Banner */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontFamily: '"Fira Code", monospace',
            fontSize: '0.82rem',
            color: '#00f2fe',
            lineHeight: 1.4,
            overflowX: 'auto',
          }}>
            {activeNearDest.code}
          </div>
        </div>
      )}

      {/* ── Code Deck Sidebar (Assembly Panel — Mouse Draggable) ── */}
      <div className="code-deck-sidebar-panel" style={{
        position: 'fixed',
        top: 80 + dragOffset.y,
        right: deckOpen ? 16 - dragOffset.x : -340,
        width: 320,
        maxHeight: 'calc(100vh - 100px)',
        zIndex: 10010,
        background: 'rgba(8, 10, 28, 0.94)',
        backdropFilter: 'blur(24px)',
        border: `1.5px solid ${isDraggingPanel ? '#00f2fe' : 'rgba(255, 255, 255, 0.12)'}`,
        borderRadius: '20px',
        padding: '16px',
        boxShadow: isDraggingPanel ? '0 20px 60px rgba(0, 242, 254, 0.3)' : '0 16px 48px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: isDraggingPanel ? 'none' : 'right 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fontFamily: '"Outfit", sans-serif',
      }}>
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setDeckOpen(!deckOpen)}
          style={{
            position: 'absolute',
            left: -36,
            top: 16,
            width: 36,
            height: 44,
            background: 'rgba(8, 10, 28, 0.94)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRight: 'none',
            borderRadius: '12px 0 0 12px',
            color: '#00f2fe',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {deckOpen ? '▶' : '◀'}
        </button>

        {/* Deck Header (Mouse Draggable Handle) */}
        <div
          onPointerDown={handlePanelPointerDown}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isDraggingPanel ? 'grabbing' : 'grab',
            userSelect: 'none',
            paddingBottom: 4,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f0f4ff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#00f2fe', fontSize: '0.85rem' }}>⣿</span> 📦 Code Assembly Deck
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontFamily: '"Fira Code", monospace' }}>
              {assembledBlocks.length} block(s) · Drag panel or blocks ✋
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Explicit Hide / Show Toggle Button */}
            <button
              onClick={() => setDeckOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '6px 10px',
                color: '#94a3b8',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Hide Code Deck"
            >
              👁️ Hide
            </button>

            {/* Test Code Button */}
            <button
              onClick={onTestCode}
              disabled={assembledBlocks.length === 0}
              style={{
                background: assembledBlocks.length > 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                color: assembledBlocks.length > 0 ? '#fff' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: assembledBlocks.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>▶</span> Test Code
            </button>
          </div>
        </div>

        {/* Check Attempts & Penalty Status */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '10px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          fontFamily: '"Fira Code", monospace',
        }}>
          <div>
            <span style={{ color: '#64748b' }}>Test Attempts: </span>
            <span style={{ fontWeight: 700, color: testCount <= SCORING.FREE_CHECKS ? '#10b981' : '#f59e0b' }}>
              {testCount} ({SCORING.FREE_CHECKS - Math.min(testCount, SCORING.FREE_CHECKS)} Free Left)
            </span>
          </div>
          {currentPenalty > 0 && (
            <span style={{ color: '#ff4d6d', fontWeight: 700 }}>
              -{currentPenalty} pts
            </span>
          )}
        </div>

        {/* Assembled Blocks List (HTML5 Mouse Drag & Drop Reordering) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingRight: 4,
        }}>
          {assembledBlocks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '30px 10px',
              color: '#64748b',
              fontSize: '0.78rem',
              fontStyle: 'italic',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '12px',
            }}>
              🚗 Drive your car to destination signboards and click 📥 Collect to build your code here!
            </div>
          ) : (
            assembledBlocks.map((block, idx) => (
              <div
                key={block.id + '_' + idx}
                draggable={true}
                onDragStart={(e) => handleBlockDragStart(e, idx)}
                onDragOver={(e) => handleBlockDragOver(e, idx)}
                onDragEnd={handleBlockDragEnd}
                style={{
                  background: draggedBlockIdx === idx ? 'rgba(0, 242, 254, 0.18)' : 'rgba(12, 16, 40, 0.8)',
                  border: `1px solid ${draggedBlockIdx === idx ? '#00f2fe' : 'rgba(0, 242, 254, 0.25)'}`,
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  cursor: 'grab',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  opacity: draggedBlockIdx === idx ? 0.7 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: '"Fira Code", monospace', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ cursor: 'grab', color: '#00f2fe' }}>⣿</span> Line {idx + 1} · {block.name}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {/* Up / Down Controls */}
                    <button
                      onClick={() => onMoveBlock(idx, -1)}
                      disabled={idx === 0}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: 'none',
                        color: idx === 0 ? '#475569' : '#00f2fe',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        cursor: idx === 0 ? 'default' : 'pointer',
                        fontSize: '0.65rem',
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => onMoveBlock(idx, 1)}
                      disabled={idx === assembledBlocks.length - 1}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: 'none',
                        color: idx === assembledBlocks.length - 1 ? '#475569' : '#00f2fe',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        cursor: idx === assembledBlocks.length - 1 ? 'default' : 'pointer',
                        fontSize: '0.65rem',
                      }}
                    >
                      ▼
                    </button>

                    {/* Drop / Leave Block Button */}
                    <button
                      onClick={() => onDropBlock(block.id)}
                      title="Drop this block back to city"
                      style={{
                        background: 'rgba(255, 0, 80, 0.12)',
                        border: '1px solid rgba(255, 0, 80, 0.3)',
                        color: '#ff4d6d',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                      }}
                    >
                      🗑️ Drop
                    </button>
                  </div>
                </div>

                <div style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '0.78rem',
                  color: '#00f2fe',
                  whiteSpace: 'pre-wrap',
                }}>
                  {block.code}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Execution Output Console */}
        {testResult && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 0, 80, 0.4)'}`,
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '0.72rem',
            fontFamily: '"Fira Code", monospace',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <div style={{ fontWeight: 700, color: testResult.success ? '#10b981' : '#ff4d6d' }}>
              {testResult.success ? '✅ TEST PASSED!' : '❌ TEST FAILED'}
            </div>
            {testResult.logs.map((line, i) => (
              <div key={i} style={{ color: line.startsWith('>>> SUCCESS') ? '#10b981' : line.startsWith('>>> ERROR') ? '#ff4d6d' : '#94a3b8' }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Show Code Deck Button when minimized */}
      {!deckOpen && (
        <button
          onClick={() => setDeckOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 10020,
            padding: '10px 18px',
            borderRadius: '99px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.84rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0, 242, 254, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          📦 Show Code Deck ({assembledBlocks.length}) 👁️
        </button>
      )}
    </>
  );
}

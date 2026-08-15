/* ==========================================================================
   CodeFuel — Question Panel
   Animated coding challenge panel with syntax highlighting
   ========================================================================== */

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// ── Syntax highlighter for Python code ───────────────────────────────────
function highlightPython(code) {
  if (!code) return null;

  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    // Tokenize the line
    const tokens = [];
    let remaining = line;
    let pos = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Comments
      const commentMatch = remaining.match(/^(#.*)/);
      if (commentMatch) {
        tokens.push(<span key={pos} className="gameroom-syn-cmt">{commentMatch[1]}</span>);
        remaining = '';
        matched = true;
      }

      // Blank placeholder
      if (!matched) {
        const blankMatch = remaining.match(/^(___)/);
        if (blankMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-blank">{blankMatch[1]}</span>);
          remaining = remaining.slice(blankMatch[1].length);
          pos += blankMatch[1].length;
          matched = true;
        }
      }

      // Decorator
      if (!matched) {
        const decMatch = remaining.match(/^(@\w+)/);
        if (decMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-dec">{decMatch[1]}</span>);
          remaining = remaining.slice(decMatch[1].length);
          pos += decMatch[1].length;
          matched = true;
        }
      }

      // Strings (double or single quoted)
      if (!matched) {
        const strMatch = remaining.match(/^(f?"[^"]*"|f?'[^']*')/);
        if (strMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-str">{strMatch[1]}</span>);
          remaining = remaining.slice(strMatch[1].length);
          pos += strMatch[1].length;
          matched = true;
        }
      }

      // Keywords
      if (!matched) {
        const kwMatch = remaining.match(
          /^(def|class|import|from|return|if|elif|else|for|while|in|not|and|or|is|try|except|finally|raise|with|as|yield|lambda|pass|break|continue|nonlocal|global|async|await)\b/
        );
        if (kwMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-kw">{kwMatch[1]}</span>);
          remaining = remaining.slice(kwMatch[1].length);
          pos += kwMatch[1].length;
          matched = true;
        }
      }

      // self
      if (!matched) {
        const selfMatch = remaining.match(/^(self)\b/);
        if (selfMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-self">{selfMatch[1]}</span>);
          remaining = remaining.slice(selfMatch[1].length);
          pos += selfMatch[1].length;
          matched = true;
        }
      }

      // Booleans & None
      if (!matched) {
        const boolMatch = remaining.match(/^(True|False|None)\b/);
        if (boolMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-bool">{boolMatch[1]}</span>);
          remaining = remaining.slice(boolMatch[1].length);
          pos += boolMatch[1].length;
          matched = true;
        }
      }

      // Built-in functions
      if (!matched) {
        const fnMatch = remaining.match(
          /^(print|len|range|int|str|float|list|dict|set|tuple|type|isinstance|sorted|map|filter|reduce|sum|max|min|all|any|enumerate|zip|open|iter|next|super|input|abs|round|hasattr|getattr|setattr|delattr|staticmethod|classmethod|property|frozenset)\b/
        );
        if (fnMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-fn">{fnMatch[1]}</span>);
          remaining = remaining.slice(fnMatch[1].length);
          pos += fnMatch[1].length;
          matched = true;
        }
      }

      // Numbers
      if (!matched) {
        const numMatch = remaining.match(/^(\d+\.?\d*)/);
        if (numMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-num">{numMatch[1]}</span>);
          remaining = remaining.slice(numMatch[1].length);
          pos += numMatch[1].length;
          matched = true;
        }
      }

      // Operators
      if (!matched) {
        const opMatch = remaining.match(/^([+\-*/%=<>!&|^~]+|[()[\]{},.:;])/);
        if (opMatch) {
          tokens.push(<span key={pos} className="gameroom-syn-op">{opMatch[1]}</span>);
          remaining = remaining.slice(opMatch[1].length);
          pos += opMatch[1].length;
          matched = true;
        }
      }

      // Anything else (identifiers, spaces)
      if (!matched) {
        const otherMatch = remaining.match(/^(\s+|\w+)/);
        if (otherMatch) {
          tokens.push(<span key={pos}>{otherMatch[1]}</span>);
          remaining = remaining.slice(otherMatch[1].length);
          pos += otherMatch[1].length;
        } else {
          // Single character fallback
          tokens.push(<span key={pos}>{remaining[0]}</span>);
          remaining = remaining.slice(1);
          pos++;
        }
      }
    }

    return (
      <React.Fragment key={lineIdx}>
        {tokens}
        {lineIdx < lines.length - 1 && '\n'}
      </React.Fragment>
    );
  });
}

// ── Tier badge info ──────────────────────────────────────────────────────
const TIER_STYLES = {
  1: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)', label: 'ROOKIE' },
  2: { bg: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', border: 'rgba(0, 242, 254, 0.3)', label: 'CODER' },
  3: { bg: 'rgba(79, 172, 254, 0.12)', color: '#4facfe', border: 'rgba(79, 172, 254, 0.3)', label: 'HACKER' },
  4: { bg: 'rgba(121, 40, 202, 0.12)', color: '#7928ca', border: 'rgba(121, 40, 202, 0.3)', label: 'ARCHITECT' },
  5: { bg: 'rgba(255, 0, 122, 0.12)', color: '#ff007a', border: 'rgba(255, 0, 122, 0.3)', label: 'LEGENDARY' },
};

// ── Type badge ───────────────────────────────────────────────────────────
const TYPE_LABELS = {
  output: '🖥️ Output',
  fill: '✏️ Fill-in',
  fix: '🔧 Debug',
  concept: '💡 Concept',
  complete: '📝 Complete',
};

export default function QuestionPanel({
  question,
  timeLeft,
  timeLimit,
  onAnswer,
  answered,
  selectedIdx,
  correctIdx,
}) {
  const panelRef = useRef(null);

  // Slide-in animation
  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }
  }, [question]);

  if (!question) return null;

  const tierStyle = TIER_STYLES[question.tier] || TIER_STYLES[1];
  const timerPercent = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 100;
  const timerColor = timerPercent > 50 ? '#00f2fe' : timerPercent > 25 ? '#f59e0b' : '#ff4d6d';

  return (
    <div className="gameroom-question-overlay">
      <div ref={panelRef} className="gameroom-question-panel">
        {/* Header: Tier + Type */}
        <div className="gameroom-question-header">
          <span
            className="gameroom-question-tier"
            style={{ background: tierStyle.bg, color: tierStyle.color, border: `1px solid ${tierStyle.border}` }}
          >
            T{question.tier} · {tierStyle.label}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {TYPE_LABELS[question.type] || question.type}
          </span>
        </div>

        {/* Timer bar */}
        <div className="gameroom-question-timer">
          <div
            className="gameroom-question-timer-fill"
            style={{
              width: `${timerPercent}%`,
              background: `linear-gradient(90deg, ${timerColor}, ${timerColor}88)`,
              boxShadow: `0 0 8px ${timerColor}40`,
            }}
          />
        </div>

        {/* Question text */}
        <div className="gameroom-question-text">{question.question}</div>

        {/* Code block (if any) */}
        {question.code && (
          <div className="gameroom-question-code">
            {highlightPython(question.code)}
          </div>
        )}

        {/* Answer options */}
        <div className="gameroom-options-grid">
          {question.shuffledOptions.map((opt, idx) => {
            let extraClass = '';
            if (answered) {
              if (idx === correctIdx) extraClass = 'gameroom-option-correct';
              else if (idx === selectedIdx && idx !== correctIdx) extraClass = 'gameroom-option-wrong';
            }

            return (
              <button
                key={idx}
                className={`gameroom-option-btn ${extraClass}`}
                disabled={answered}
                onClick={() => onAnswer(idx)}
              >
                <span style={{ marginRight: '8px', opacity: 0.4, fontSize: '0.75rem' }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after answer) */}
        {answered && question.explanation && (
          <div className="gameroom-explanation">
            💡 {question.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

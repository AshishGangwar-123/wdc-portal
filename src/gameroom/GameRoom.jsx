/* ==========================================================================
   Code City Explorer — Game Room Container v4.1 (Cache Bump)
   Top-level: Language Picker → Campaign Level Select → Loading → Code City Explorer
   ========================================================================== */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './GameRoom.css';
import LanguagePicker from './LanguagePicker';
import CampaignLevelSelect from './CampaignLevelSelect';
import CodeCityGame from './CodeCityGame';
import soundManager from './soundManager';
import LangChainCommandRoom from './LangChainCommandRoom';
import SQLCommandRoom from './SQLCommandRoom';
import HTMLCSSCommandRoom from './HTMLCSSCommandRoom';

export default function GameRoom({ onClose }) {
  const [phase, setPhase] = useState('picker'); // 'picker' | 'campaign' | 'loading' | 'playing' | 'langchain' | 'sql' | 'htmlcss'
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameKey, setGameKey] = useState(0);
  const overlayRef = useRef(null);

  const getSanitizedUnlockedLevel = () => {
    try {
      const raw = parseInt(localStorage.getItem('code_city_unlocked_level') || '1', 10);
      return isNaN(raw) || raw < 1 ? 1 : raw;
    } catch (e) {
      return 1;
    }
  };

  const [unlockedLevel, setUnlockedLevel] = useState(getSanitizedUnlockedLevel);

  // Sync unlockedLevel state from localStorage
  const refreshUnlockedLevel = useCallback(() => {
    setUnlockedLevel(getSanitizedUnlockedLevel());
  }, []);

  // Entrance animation
  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, []);

  // Language Selection -> Moves to Campaign Level Map
  const handleLanguageSelect = useCallback((lang) => {
    setSelectedLanguage(lang);
    if (lang === 'langchain') {
      setPhase('langchain');
    } else if (lang === 'sql') {
      setPhase('sql');
    } else if (lang === 'htmlcss') {
      setPhase('htmlcss');
    } else {
      refreshUnlockedLevel();
      setPhase('campaign');
    }
  }, [refreshUnlockedLevel]);

  // Level Selection on Campaign Map -> Start 20-Question Level
  const handleSelectLevel = useCallback((lvlNum) => {
    setSelectedLevel(lvlNum);
    setPhase('loading');

    setTimeout(() => {
      setPhase('playing');
    }, 400);
  }, []);

  // Unlock Next Level
  const handleUnlockNextLevel = useCallback((nextLvlNum) => {
    localStorage.setItem('code_city_unlocked_level', nextLvlNum.toString());
    setUnlockedLevel(nextLvlNum);
    setSelectedLevel(nextLvlNum);
    setGameKey((k) => k + 1);
    setPhase('loading');
    setTimeout(() => setPhase('playing'), 400);
  }, []);

  // Close Game Room
  const handleClose = useCallback(() => {
    soundManager.destroy();

    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => onClose(),
      });
    } else {
      onClose();
    }
  }, [onClose]);

  // Return to Level Map
  const handleReturnToMap = useCallback(() => {
    refreshUnlockedLevel();
    setPhase('campaign');
  }, [refreshUnlockedLevel]);

  return (
    <div ref={overlayRef} className="gameroom-overlay">
      {/* Close button */}
      <button
        className="gameroom-close-btn"
        onClick={handleClose}
        aria-label="Close Game Room"
      >
        ✕
      </button>

      {/* 1. Language Picker */}
      {phase === 'picker' && (
        <LanguagePicker onSelect={handleLanguageSelect} />
      )}

      {/* LangChain Command Room */}
      {phase === 'langchain' && (
        <LangChainCommandRoom onBack={() => setPhase('picker')} />
      )}

      {/* SQL Database Command Center */}
      {phase === 'sql' && (
        <SQLCommandRoom onBack={() => setPhase('picker')} />
      )}

      {/* HTML & CSS Holo-Architect Lab */}
      {phase === 'htmlcss' && (
        <HTMLCSSCommandRoom onBack={() => setPhase('picker')} />
      )}

      {/* 2. Campaign Level Select Map */}
      {phase === 'campaign' && (
        <CampaignLevelSelect
          unlockedLevel={unlockedLevel}
          onSelectLevel={handleSelectLevel}
          onBack={() => setPhase('picker')}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* 3. Loading Transition */}
      {phase === 'loading' && (
        <div className="gameroom-loading">
          <div className="gameroom-loading-spinner" />
          <div className="gameroom-loading-text">
            Generating Level {selectedLevel} (20 Missions) for {selectedLanguage?.toUpperCase() || 'PYTHON'}...
          </div>
        </div>
      )}

      {/* 4. Playing: 20-Question Level Drive */}
      {phase === 'playing' && (
        <CodeCityGame
          key={gameKey}
          selectedLevel={selectedLevel}
          language={selectedLanguage || 'python'}
          onExit={handleReturnToMap}
          onUnlockNextLevel={handleUnlockNextLevel}
        />
      )}
    </div>
  );
}


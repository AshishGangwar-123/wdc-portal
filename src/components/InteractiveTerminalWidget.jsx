import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Copy, Check, Sparkles, Code2, Cpu } from 'lucide-react';
import gsap from 'gsap';

const CODE_SNIPPETS = {
  react: `// Web Development Club (WDC) - React 19 Component
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export function WDCClubPortal() {
  const [members, setMembers] = useState(500);
  const [activeWorkshop, setActiveWorkshop] = useState('Full-Stack AI & GSAP');

  useEffect(() => {
    gsap.to('.hero-title', { duration: 1, y: 0, opacity: 1 });
  }, []);

  return (
    <div className="wdc-portal-card">
      <h1>🚀 Welcome to Web Development Club!</h1>
      <p>Active Workshop: {activeWorkshop}</p>
    </div>
  );
}`,
  python: `# WDC FastAPI + LangChain AI Agent Backend
from fastapi import FastAPI
from langchain.agents import AgentExecutor

app = FastAPI(title="WDC AI Assistant API")

@app.get("/api/workshops")
async def get_next_workshop():
    return {
        "status": "success",
        "club": "Web Development Club (WDC)",
        "topic": "Full-Stack AI & GSAP Animations",
        "date": "August 15, 2026",
        "seats_available": 12
    }`,
  gsap: `// WDC Smooth Scroll & Kinetic Timeline Animation
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ scrollTrigger: { trigger: '.wdc-section', start: 'top center' } });
tl.fromTo('.wdc-card', 
  { y: 80, opacity: 0, scale: 0.9 }, 
  { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
);`,
};

export default function InteractiveTerminalWidget() {
  const [activeTab, setActiveTab] = useState('react');
  const [typedText, setTypedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState(null);
  const terminalRef = useRef(null);

  // Simulated live typing effect when activeTab changes
  useEffect(() => {
    const fullCode = CODE_SNIPPETS[activeTab];
    let currentIndex = 0;
    setTypedText('');
    setOutput(null);

    const interval = setInterval(() => {
      if (currentIndex < fullCode.length) {
        setTypedText(fullCode.slice(0, currentIndex + 1));
        currentIndex += 3; // speed up typing
      } else {
        setTypedText(fullCode);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput(null);

    // GSAP button pulse
    gsap.fromTo(terminalRef.current, { scale: 0.99 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

    setTimeout(() => {
      setIsExecuting(false);
      if (activeTab === 'react') {
        setOutput('✓ Rendered <WDCClubPortal /> successfully! (FPS: 60, GSAP Ready)');
      } else if (activeTab === 'python') {
        setOutput('✓ FastAPI App Started on http://localhost:8000 (200 OK)');
      } else {
        setOutput('✓ GSAP ScrollTrigger timeline compiled with 0 errors!');
      }
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={terminalRef}
      className="glass-panel"
      style={{
        borderRadius: '24px',
        background: 'linear-gradient(150deg, rgba(14, 17, 40, 0.9) 0%, rgba(6, 8, 20, 0.95) 100%)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 242, 254, 0.15)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Top Terminal Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'rgba(5, 7, 18, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Window control dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontFamily: 'Fira Code', fontSize: '0.8rem', color: '#94a3b8', marginLeft: '8px' }}>
            wdc-terminal-editor.jsx
          </span>
        </div>

        {/* Code Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['react', 'python', 'gsap'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: activeTab === tab ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                border: activeTab === tab ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
                color: activeTab === tab ? '#00f2fe' : '#64748b',
                fontFamily: 'Fira Code',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'react' ? 'JSX' : tab === 'python' ? 'PY' : 'GSAP'}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopy}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontFamily: 'Fira Code',
            }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="glass-btn glass-btn-primary"
            style={{ padding: '6px 14px', fontSize: '0.78rem' }}
          >
            <Play size={12} /> {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div style={{ padding: '20px', fontFamily: 'Fira Code, monospace', fontSize: '0.85rem', lineHeight: 1.6, minHeight: '220px', color: '#e2e8f0' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {typedText}
          <span style={{ display: 'inline-block', width: '8px', height: '16px', background: '#00f2fe', marginLeft: '4px', animation: 'orbFloat 1s infinite alternate' }} />
        </pre>

        {/* Terminal Execution Output */}
        {output && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontFamily: 'Fira Code',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={16} /> {output}
          </div>
        )}
      </div>
    </div>
  );
}

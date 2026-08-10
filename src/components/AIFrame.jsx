import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, Send, Calendar, ArrowRight, Sparkles, CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import WorkshopForm from './WorkshopForm';

export default function AIFrame({ onStateChange }) {
  // Step flow state:
  // 1: Welcome ("Sunaiye mai aapki kaise help kar sakta hu?")
  // 2: Workshop Info Shown ("Next workshop schedule...")
  // 3: Form Button Offered ("To fill form please click on this button")
  // 4: Form Page Active inside frame
  const [step, setStep] = useState(1);
  const [inputVal, setInputVal] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Namaste! 👋 Sunaiye, main aapki kaise help kar sakta hu?',
      timestamp: 'Just now',
    },
  ]);

  const frameRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll chat log
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatLog, step]);

  // Handle User Action for Step 2: Workshop Schedule Query
  const triggerWorkshopQuery = () => {
    const userMsg = 'Koi next workshop schedule hui hai kya?';
    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, timestamp: 'Now' },
    ]);

    if (onStateChange) onStateChange('speaking');

    setTimeout(() => {
      setStep(2);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Haan bilkul! Ek super exciting workshop schedule hui hai. Niche card par details dekhiye! 👇',
          type: 'workshop_card',
          timestamp: 'Now',
        },
      ]);
    }, 600);
  };

  // Handle User Action for Step 3: Form Request
  const triggerFormRequest = () => {
    const userMsg = 'Mujhe workshop ka form fill karna tha, aap provide kijiye.';
    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, timestamp: 'Now' },
    ]);

    if (onStateChange) onStateChange('pointing');

    setTimeout(() => {
      setStep(3);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Zaroor! To fill form, please click on this button below to open the registration form in this frame.',
          type: 'form_button',
          timestamp: 'Now',
        },
      ]);
    }, 700);
  };

  // Handle Clicking the Form Button -> Step 4 (Form Page inside Frame)
  const openFormInFrame = () => {
    if (onStateChange) onStateChange('form_opened');
    gsap.fromTo(
      frameRef.current,
      { scale: 0.96, opacity: 0.8 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    setStep(4);
  };

  // Custom text submit
  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal.toLowerCase();
    setInputVal('');

    if (query.includes('workshop') || query.includes('schedule') || query.includes('next')) {
      triggerWorkshopQuery();
    } else if (query.includes('form') || query.includes('fill') || query.includes('register')) {
      triggerFormRequest();
    } else {
      setChatLog((prev) => [
        ...prev,
        { sender: 'user', text: inputVal, timestamp: 'Now' },
        {
          sender: 'ai',
          text: `Main samajh gaya! Workshop schedule check karne ke liye 'Next Workshop' button click karein, ya form request karein!`,
          timestamp: 'Now',
        },
      ]);
    }
  };

  return (
    <div
      ref={frameRef}
      className="glass-panel"
      style={{
        width: '100%',
        maxWidth: '560px',
        minHeight: '520px',
        borderRadius: '28px',
        background: 'linear-gradient(160deg, rgba(16, 20, 48, 0.85) 0%, rgba(8, 10, 24, 0.95) 100%)',
        border: '1.5px solid rgba(0, 242, 254, 0.3)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 242, 254, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* Top Frame Status Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#00f2fe',
              boxShadow: '0 0 12px #00f2fe',
            }}
          />
          <span style={{ fontFamily: 'Fira Code', fontSize: '0.85rem', color: '#00f2fe', fontWeight: 600 }}>
            WDC AGENT FRAME
          </span>
        </div>

        {/* View mode switcher indicator */}
        <span
          style={{
            fontSize: '0.75rem',
            fontFamily: 'Fira Code',
            color: '#94a3b8',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 10px',
            borderRadius: '6px',
          }}
        >
          {step === 4 ? 'MODE: FORM VIEW' : 'MODE: AI CHAT'}
        </span>
      </div>

      {/* Frame Body Content */}
      {step === 4 ? (
        // STEP 4: EMBEDDED FORM PAGE
        <WorkshopForm onResetForm={() => setStep(1)} />
      ) : (
        // STEPS 1, 2, 3: INTERACTIVE AI CHAT & SUGGESTIONS
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {/* Scrollable Chat Area */}
          <div
            ref={chatScrollRef}
            style={{
              flex: 1,
              maxHeight: '340px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              paddingRight: '6px',
              marginBottom: '16px',
            }}
          >
            {chatLog.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Speech Bubble */}
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '14px 18px',
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background:
                      msg.sender === 'user'
                        ? 'linear-gradient(135deg, #7928ca, #ff007a)'
                        : 'rgba(255, 255, 255, 0.06)',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(0, 242, 254, 0.25)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {msg.text}

                  {/* Render Workshop Details Card if Step 2 */}
                  {msg.type === 'workshop_card' && (
                    <div
                      style={{
                        marginTop: '12px',
                        background: 'rgba(8, 9, 20, 0.8)',
                        border: '1px solid rgba(0, 242, 254, 0.4)',
                        borderRadius: '16px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f2fe', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                        <Calendar size={16} /> SCHEDULED WORKSHOP
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', marginBottom: '4px' }}>
                        Full-Stack AI & GSAP Masterclass 2026
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>
                        🗓 Date: August 15, 2026 | ⏰ Time: 6:00 PM IST
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(0,242,254,0.1)', color: '#00f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                          React 19
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(121,40,202,0.15)', color: '#7928ca', padding: '2px 8px', borderRadius: '4px' }}>
                          LangChain & FastAPI
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
                          GSAP Animations
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Render Form Button inside Frame if Step 3 */}
                  {msg.type === 'form_button' && (
                    <div style={{ marginTop: '16px' }}>
                      <button
                        onClick={openFormInFrame}
                        className="glass-btn glass-btn-primary"
                        style={{
                          width: '100%',
                          padding: '14px 20px',
                          fontSize: '0.98rem',
                          justifyContent: 'center',
                          animation: 'orbFloat 3s ease-in-out infinite alternate',
                        }}
                      >
                        <FileText size={18} />
                        To fill form please click on this button
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Guided Suggestion Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'Fira Code' }}>GUIDED PROMPTS:</div>

            {step === 1 && (
              <button
                onClick={triggerWorkshopQuery}
                className="glass-btn"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.88rem',
                  justifyContent: 'space-between',
                  background: 'rgba(0, 242, 254, 0.08)',
                  borderColor: 'rgba(0, 242, 254, 0.3)',
                }}
              >
                <span>📅 "Koi next workshop schedule hui hai kya?"</span>
                <ChevronRight size={16} color="#00f2fe" />
              </button>
            )}

            {(step === 1 || step === 2) && (
              <button
                onClick={triggerFormRequest}
                className="glass-btn"
                style={{
                  padding: '10px 16px',
                  fontSize: '0.88rem',
                  justifyContent: 'space-between',
                  background: 'rgba(121, 40, 202, 0.12)',
                  borderColor: 'rgba(121, 40, 202, 0.4)',
                }}
              >
                <span>📋 "Mujhe workshop ka form fill karna tha, aap provide kijiye"</span>
                <ChevronRight size={16} color="#7928ca" />
              </button>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleCustomSend} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask AI agent or type query..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 18px',
                borderRadius: '99px',
                background: 'rgba(8, 9, 20, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <button
              type="submit"
              className="glass-btn glass-btn-primary"
              style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Calendar, 
  FileText, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  Mic,
  Volume2,
  VolumeX,
  Languages,
  Mail,
  Loader2,
  X,
} from 'lucide-react';
import AIAvatar from './AIAvatar';
import WorkshopForm from './WorkshopForm';

// Relative URL — works on both local dev (via Vite proxy) and deployed Render server
const API_BASE = '';

// Helper dictionary to convert responses to proper Devanagari Hindi script for 100% natural TTS pronunciation
const HINDI_DEVANAGARI_MAP = [
  { match: 'namaste', replacement: 'नमस्ते! वेब डेवलपमेंट क्लब में आपका स्वागत है। मैं आपकी एआई असिस्टेंट ओरा हूँ।' },
  { match: 'workshop', replacement: 'यह रही आने वाली वर्कशॉप की पूरी जानकारी।' },
  { match: 'registration form', replacement: 'रजिस्ट्रेशन फॉर्म आपकी स्क्रीन पर लोड कर दिया गया है। कृपया अपनी जानकारी भरें।' },
  { match: 'broadcast announcements', replacement: 'यह रहे नवीनतम आधिकारिक समाचार और घोषणाएँ।' },
  { match: 'save ho gaya', replacement: 'आपका नाम सफलता पूर्वक सेव हो गया है।' },
];

export default function AIConciergeWidget({ isSiteLoaded, isOpen, onClose }) {
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [conciergeState, setConciergeState] = useState('main_menu');
  const [avatarState, setAvatarState] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [speechLang, setSpeechLang] = useState('hi'); // 'hi' (Proper Pure Hindi) | 'en' (Proper Pure English)

  const [activeMessage, setActiveMessage] = useState({
    sender: 'ai',
    text: 'Namaste! Welcome to WDC RECB. Main hun aapka AI Voice Assistant AURA! Niche buttons ya mic se mujhse baat karein.',
    timestamp: 'Live Assistant',
  });
  const [inputVal, setInputVal] = useState('');

  // Live data from SQLite DB
  const [liveWorkshops, setLiveWorkshops] = useState([]);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [currentFormWorkshop, setCurrentFormWorkshop] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Email Subscription State (for fallback alert notifications)
  const [subscribeEmailInput, setSubscribeEmailInput] = useState('');
  const [subscribingEmail, setSubscribingEmail] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  const widgetRef = useRef(null);
  const recognitionRef = useRef(null);

  // Convert Hinglish text into proper Devanagari for Hindi TTS voice engine
  const getDevanagariSpeech = (text) => {
    let lower = text.toLowerCase();
    for (let item of HINDI_DEVANAGARI_MAP) {
      if (lower.includes(item.match)) return item.replacement;
    }
    // Clean emojis
    return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').replace(/[•\*\#]/g, '');
  };

  // 1. Text-To-Speech (TTS) Voice Engine with Instant Avatar Synchronization
  const speakText = (text) => {
    if (voiceMuted || !('speechSynthesis' in window)) return;
    try {
      // Cancel any stuck synthesis & resume engine
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Clean markdown, symbols, bullet points, emojis for smooth pronunciation
      let cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[•\*\#\_]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Dynamic language & voice selection based on text content & input language
      const hasDevanagari = /[\u0900-\u097F]/.test(cleanText);
      const isHindi = speechLang === 'hi' || hasDevanagari;

      const voices = window.speechSynthesis.getVoices() || [];
      if (isHindi) {
        utterance.lang = 'hi-IN';
        const hindiVoice = voices.find(
          (v) => (v.lang && (v.lang.includes('hi') || v.lang.includes('HI'))) ||
                 (v.name && v.name.toLowerCase().includes('hindi'))
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        utterance.lang = 'en-US';
        const engVoice = voices.find(
          (v) => (v.lang && (v.lang.includes('en-US') || v.lang.includes('en-IN') || v.lang.includes('en'))) ||
                 (v.name && v.name.toLowerCase().includes('english'))
        );
        if (engVoice) utterance.voice = engVoice;
      }

      // IMMEDIATELY set avatarState to 'speaking' so video & soundwave animate instantly!
      setAvatarState('speaking');

      utterance.onstart = () => {
        setAvatarState('speaking');
      };

      utterance.onend = () => {
        setAvatarState('idle');
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis utterance error:', err);
        setAvatarState('idle');
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      setAvatarState('idle');
    }
  };

  // 2. Speech-To-Text (STT) Voice Input with Real-Time Feedback & Permissions Handling
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is supported in Google Chrome, Microsoft Edge, and Opera browsers.');
      return;
    }

    // Stop speaking if AI is talking
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
      setAvatarState('idle');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = speechLang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.interimResults = true; // Enables live real-time transcript as user speaks!
      recognition.maxAlternatives = 1;

      // IMMEDIATELY set active listening UI states so button and avatar glow active!
      setIsListening(true);
      setAvatarState('listening');

      recognition.onstart = () => {
        setIsListening(true);
        setAvatarState('listening');
      };

      recognition.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }

        // Live real-time feedback in input box!
        if (transcript) {
          setInputVal(transcript);
        }

        if (e.results[0] && e.results[0].isFinal) {
          setIsListening(false);
          setAvatarState('idle');
          if (transcript.trim()) {
            handleQueryProcessing(transcript.trim(), true); // Voice mode = true: speaks answer aloud + renders cards!
          }
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err.error);
        setIsListening(false);
        setAvatarState('idle');

        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          setActiveMessage({
            sender: 'ai',
            text: '🎤 Mic permission needed! Browser URL bar mein Lock/Camera icon par click karke Microphone allow karein.',
            timestamp: 'Now',
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setAvatarState('idle');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setAvatarState('idle');
    }
  };

  // Fetch live DB data on mount
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [wsRes, notifRes] = await Promise.all([
          fetch(`${API_BASE}/api/workshops`),
          fetch(`${API_BASE}/api/notifications`),
        ]);
        if (wsRes.ok && notifRes.ok) {
          const wsData = await wsRes.json();
          const notifData = await notifRes.json();
          setLiveWorkshops(wsData);
          setLiveNotifications(notifData);
          setBackendOnline(true);
          if (wsData.length > 0) setCurrentFormWorkshop(wsData[0]);
        }
      } catch (err) {
        setBackendOnline(false);
      }
    };
    fetchLiveData();

    const savedName = localStorage.getItem('wdc_user_name');
    if (savedName) {
      setUserName(savedName);
    }

    // Preload SpeechSynthesis voices in browser
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

  }, []);

  // Voice welcome trigger — Browser Autoplay Policy Fix:
  // Browsers block speech synthesis until the user has interacted with the page.
  // We wait for the first user interaction (click/keydown/scroll) AFTER the site has loaded,
  // then fire the welcome speech exactly once.
  const welcomeTriggered = useRef(false);
  const siteLoadedRef = useRef(false);

  // Track when site finishes loading
  useEffect(() => {
    if (isSiteLoaded) {
      siteLoadedRef.current = true;
    }
  }, [isSiteLoaded]);

  useEffect(() => {
    const fireWelcome = () => {
      // Only fire if site is loaded and welcome hasn't been spoken yet
      if (siteLoadedRef.current && !welcomeTriggered.current) {
        welcomeTriggered.current = true;
        const welcomeSpeech = speechLang === 'hi'
          ? `नमस्ते! वेब डेवलपमेंट क्लब बांदा में आपका स्वागत है। मैं आपकी एआई असिस्टेंट ऑरा हूँ।`
          : `Welcome to Web Development Club RECB! I am your AI Voice Assistant AURA. How can I help you today?`;
        // Small delay so speech engine is fully ready
        setTimeout(() => speakText(welcomeSpeech), 300);
        // Remove listeners after first interaction
        window.removeEventListener('click', fireWelcome);
        window.removeEventListener('keydown', fireWelcome);
        window.removeEventListener('touchstart', fireWelcome);
        window.removeEventListener('scroll', fireWelcome, { once: true });
      }
    };

    // Listen for the very first user interaction to unlock audio context
    window.addEventListener('click', fireWelcome);
    window.addEventListener('keydown', fireWelcome);
    window.addEventListener('touchstart', fireWelcome);
    window.addEventListener('scroll', fireWelcome, { once: true });

    return () => {
      window.removeEventListener('click', fireWelcome);
      window.removeEventListener('keydown', fireWelcome);
      window.removeEventListener('touchstart', fireWelcome);
    };
  }, [speechLang]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const formatted = nameInput.trim();
    setUserName(formatted);
    localStorage.setItem('wdc_user_name', formatted);
    setNameInput('');

    const msgText = speechLang === 'hi'
      ? `आपका नाम ${formatted} सेव हो गया है! अब से मैं आपको नाम से गाइड करूँगी।`
      : `Your name ${formatted} is saved! I will guide you personally.`;

    setActiveMessage({
      sender: 'ai',
      text: msgText,
      timestamp: 'Now',
    });
    speakText(msgText);
  };

  const handleQueryProcessing = async (queryText, isVoiceMode = false) => {
    if (!queryText || !queryText.trim()) return;

    setActiveMessage({
      sender: 'user',
      text: queryText,
      timestamp: 'Just now',
    });

    try {
      const res = await fetch(`${API_BASE}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName || 'Guest',
          query: queryText,
          current_context: conciergeState,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.action_type === 'form_view' && data.payload) {
          setCurrentFormWorkshop(data.payload);
          setConciergeState('form_view');
        } else if (data.action_type === 'workshop_card' && data.payload) {
          setCurrentFormWorkshop(data.payload);
          setConciergeState('workshop_info');
        } else if (data.action_type === 'all_workshops_card') {
          setConciergeState('all_workshops');
        } else if (data.action_type === 'notifications_card' && data.payload) {
          setLiveNotifications(data.payload);
          setConciergeState('notifications_view');
        } else if (data.action_type === 'subscribe_email_card') {
          setEmailSubscribed(false);
          setConciergeState('subscribe_email');
        }

        setActiveMessage({
          sender: 'ai',
          text: data.response_text,
          type: data.action_type,
          workshop: data.payload,
          notifications: data.action_type === 'notifications_card' ? data.payload : null,
          timestamp: 'Just now',
        });

        // Speak aloud ONLY if user asked via Voice Mode!
        if (isVoiceMode) {
          speakText(data.response_text);
        }
        return;
      }
    } catch (e) {}

    const q = queryText.toLowerCase();
    if (q.includes('workshop') || q.includes('schedule') || q.includes('class')) {
      handleDeliverWorkshopInfo();
    } else if (q.includes('form') || q.includes('fill') || q.includes('register')) {
      handleDeliverForm();
    } else if (q.includes('notif') || q.includes('announc') || q.includes('news')) {
      handleDeliverNotifications();
    } else {
      const reply = speechLang === 'hi'
        ? `जी ${userName || 'दोस्त'}! आप नीचे दिए गए बटन्स क्लिक करके वर्कशॉप चेक कर सकते हैं या डायरेक्ट फॉर्म भर सकते हैं!`
        : `Yes ${userName || 'Friend'}! You can click the buttons below to check workshops or fill out registration form!`;
      setActiveMessage({ sender: 'ai', text: reply, timestamp: 'Now' });
      if (isVoiceMode) {
        speakText(reply);
      }
    }
  };

  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const t = inputVal;
    setInputVal('');
    handleQueryProcessing(t, false); // Text mode: submit internally, show output on screen, stay silent
  };

  const handleSubscribeEmail = async (e) => {
    e.preventDefault();
    if (!subscribeEmailInput.trim()) return;
    setSubscribingEmail(true);
    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmailInput.trim() }),
      });
      if (res.ok) {
        setEmailSubscribed(true);
        const successMsg = speechLang === 'hi'
          ? `धन्यवाद! आपका ईमेल ${subscribeEmailInput.trim()} सफलतापूर्वक सब्सक्राइब हो गया है। जैसे ही नई वर्कशॉप या नोटिफिकेशन आएगी आपको तुरंत ईमेल मिल जाएगा!`
          : `Thank you! Your email ${subscribeEmailInput.trim()} is subscribed. You will receive immediate email alerts when new workshops are announced!`;
        setActiveMessage({
          sender: 'ai',
          text: successMsg,
          timestamp: 'Just now',
        });
        speakText(successMsg);
      }
    } catch (e) {
      alert('Subscription failed. Please try again.');
    } finally {
      setSubscribingEmail(false);
    }
  };

  const handleDeliverWorkshopInfo = async () => {
    setConciergeState('workshop_info');
    const hasWs = liveWorkshops.length > 0;
    const msg = speechLang === 'hi'
      ? (hasWs ? `यह रही हमारी आगामी वर्कशॉप की पूरी जानकारी:` : `अभी डेटाबेस में कोई एक्टिव वर्कशॉप उपलब्ध नहीं है।`)
      : (hasWs ? `Here are the details for our upcoming scheduled workshop:` : `Currently no active workshops are scheduled in the database.`);
    setActiveMessage({
      sender: 'ai',
      text: msg,
      type: 'workshop_card',
      timestamp: 'Now',
    });
    speakText(msg);
  };

  const handleDeliverForm = (workshopId = null) => {
    setConciergeState('form_view');
    if (workshopId && liveWorkshops.length > 0) {
      const target = liveWorkshops.find((w) => w.id === workshopId);
      if (target) setCurrentFormWorkshop(target);
    }
    const msg = speechLang === 'hi'
      ? `रजिस्ट्रेशन फॉर्म आपकी स्क्रीन पर लोड कर दिया गया है। सीट रिज़र्व करने के लिए डिटेल्स भरें!`
      : `Registration form has been loaded on your screen. Fill details to reserve your seat!`;
    setActiveMessage({
      sender: 'ai',
      text: msg,
      timestamp: 'Now',
    });
    speakText(msg);
  };

  const handleDeliverNotifications = () => {
    setConciergeState('notifications_view');
    const msg = speechLang === 'hi'
      ? `यह रहे डब्लू डी सी के नवीनतम आधिकारिक समाचार और ब्रॉडकास्ट:`
      : `Here are the latest official WDC broadcast announcements:`;
    setActiveMessage({
      sender: 'ai',
      text: msg,
      type: 'notifications_card',
      timestamp: 'Now',
    });
    speakText(msg);
  };

  const handleDeliverAllWorkshops = () => {
    setConciergeState('all_workshops');
    const msg = speechLang === 'hi'
      ? `यह रही हमारी सभी एक्टिव वर्कशॉप्स की लिस्ट! जिस वर्कशॉप में रजिस्टर करना है उसके Form button पर क्लिक करें:`
      : `Here is the list of all active WDC workshops! Click the registration button for your specific workshop:`;
    setActiveMessage({
      sender: 'ai',
      text: msg,
      type: 'all_workshops_card',
      timestamp: 'Now',
    });
    speakText(msg);
  };

  const nextWorkshop = liveWorkshops[0];
  const activeNotifications = liveNotifications.filter((n) => n.active);

  if (isOpen === false) return null;

  const modalWrapper = (children) => {
    if (isOpen) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(4, 6, 15, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && onClose) onClose();
          }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '1050px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '32px' }}>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '-18px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(8, 9, 20, 0.95)',
                  border: '1.5px solid rgba(0, 242, 254, 0.5)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <X size={20} color="#00f2fe" />
              </button>
            )}
            {children}
          </div>
        </div>
      );
    }
    return children;
  };

  return modalWrapper(
    <div
      ref={widgetRef}
      className="glass-panel ai-concierge-grid"
      style={{
        width: '100%',
        maxWidth: '1050px',
        minHeight: '480px',
        borderRadius: '32px',
        background: 'linear-gradient(160deg, rgba(16, 20, 48, 0.9) 0%, rgba(8, 10, 24, 0.97) 100%)',
        border: '1.5px solid rgba(0, 242, 254, 0.35)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px rgba(0, 242, 254, 0.15)',
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
        gap: '24px',
      }}
    >
      {/* LEFT COLUMN: ANIMATED CARTOON BOT + VOICE SPEECH ENGINE */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#191b23',
          borderRadius: '24px',
          padding: '20px 16px',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          position: 'relative',
        }}
      >
        {/* Top Controls Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: avatarState === 'speaking' ? '#00f2fe' : '#10b981',
                boxShadow: `0 0 12px ${avatarState === 'speaking' ? '#00f2fe' : '#10b981'}`,
              }}
            />
            <span style={{ fontFamily: 'Fira Code', fontSize: '0.8rem', color: '#00f2fe', fontWeight: 700 }}>
              {avatarState === 'speaking' ? 'AURA — SPEAKING' : 'AURA — ONLINE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Switcher Button (Pure Hindi / Pure English Voice) */}
            <button
              onClick={() => setSpeechLang(speechLang === 'hi' ? 'en' : 'hi')}
              title="Switch Voice Language (Hindi / English)"
              style={{
                background: 'rgba(0, 242, 254, 0.12)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#00f2fe',
                fontSize: '0.75rem',
                fontFamily: 'Fira Code',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Languages size={14} /> {speechLang === 'hi' ? 'हिन्दी Voice' : 'English Voice'}
            </button>

            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              title={voiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px',
                color: voiceMuted ? '#ff007a' : '#00f2fe',
                cursor: 'pointer',
              }}
            >
              {voiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>

        {/* Animated Video Avatar */}
        <div style={{ width: '100%', margin: '8px 0' }}>
          <AIAvatar avatarState={avatarState} />
        </div>

        {/* Microphone Button with Active Glowing Pulse Effect */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
          <button
            onClick={toggleListening}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '16px',
              background: isListening
                ? 'linear-gradient(135deg, #ff007a 0%, #7928ca 100%)'
                : 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(121, 40, 202, 0.2))',
              border: `1.5px solid ${isListening ? '#ff007a' : '#00f2fe'}`,
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'Outfit, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: isListening
                ? '0 0 35px rgba(255, 0, 122, 0.8), 0 0 70px rgba(255, 0, 122, 0.4)'
                : '0 0 20px rgba(0, 242, 254, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            {isListening ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 10px #fff',
                    animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
                <Mic size={18} color="#fff" />
                <span>🔴 Listening... {speechLang === 'hi' ? 'बोलिए (Bolie)...' : 'Speak now...'}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={18} color="#00f2fe" />
                <span>Tap to Speak ({speechLang === 'hi' ? 'हिन्दी में बोलें' : 'Speak English'})</span>
              </div>
            )}
          </button>

          {isListening ? (
            <span style={{ fontSize: '0.74rem', color: '#ff007a', fontWeight: 600, textAlign: 'center', fontFamily: 'Fira Code' }}>
              ⚡ Speak now — live transcript active below...
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center' }}>
              {userName ? `Serving: ${userName}` : 'Speak or type any question'}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: SMART ASSISTANT DISPLAY PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f0f4ff', fontFamily: 'Outfit' }}>
              WDC AI Assistant Panel
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'Fira Code' }}>
              Mode: {speechLang === 'hi' ? 'Proper Hindi Voice' : 'Proper English Voice'} • {backendOnline ? 'Live System' : 'Offline'}
            </div>
          </div>


        </div>

        {/* Display Content Area */}
        <div style={{ flex: 1, padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              color: '#fff',
              fontSize: '0.92rem',
              lineHeight: 1.55,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1 }}>{activeMessage.text}</div>
              <button
                onClick={() => speakText(activeMessage.text)}
                title="Read response aloud"
                style={{
                  background: 'rgba(0, 242, 254, 0.1)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  color: '#00f2fe',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.72rem',
                  flexShrink: 0,
                  fontFamily: 'Fira Code',
                }}
              >
                <Volume2 size={13} /> Listen
              </button>
            </div>

            {!userName && (
              <form onSubmit={handleNameSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter your name here..."
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(8, 9, 20, 0.9)',
                    border: '1px solid #00f2fe',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem',
                  }}
                />
                <button
                  type="submit"
                  className="glass-btn glass-btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Save Name
                </button>
              </form>
            )}
          </div>

          {/* Form View */}
          {conciergeState === 'form_view' && (
            <div style={{ background: 'rgba(8, 9, 20, 0.9)', borderRadius: '20px', padding: '16px', border: '1px solid rgba(0,242,254,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#00f2fe', fontFamily: 'Fira Code' }}>
                  📋 WORKSHOP REGISTRATION FORM
                </span>
                <button
                  onClick={() => setConciergeState('main_menu')}
                  className="glass-btn"
                  style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                >
                  Close Form
                </button>
              </div>
              <WorkshopForm
                workshopData={currentFormWorkshop}
                onResetForm={() => setConciergeState('main_menu')}
              />
            </div>
          )}

          {/* Workshop Details Card */}
          {conciergeState === 'workshop_info' && (() => {
            const ws = currentFormWorkshop || nextWorkshop;
            if (!ws) return null;
            return (
              <div
                style={{
                  background: 'rgba(8, 9, 20, 0.9)',
                  border: `1px solid ${ws.color || '#00f2fe'}60`,
                  borderRadius: '18px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: ws.color || '#00f2fe', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                  <Calendar size={15} /> UPCOMING WORKSHOP
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>
                  {ws.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>
                  🗓 {ws.date} | ⏰ {ws.time} | 👨‍🏫 {ws.mentor}
                </div>
                <button
                  onClick={() => handleDeliverForm(ws.id)}
                  className="glass-btn glass-btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <FileText size={16} /> Fill Registration Form Now
                </button>
              </div>
            );
          })()}

          {/* All Workshops List View with Per-Workshop Form Buttons */}
          {conciergeState === 'all_workshops' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
              {liveWorkshops.length === 0 ? (
                <div style={{ padding: '12px', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                  No active workshops in database.
                </div>
              ) : (
                liveWorkshops.map((ws) => (
                  <div
                    key={ws.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: 'rgba(8, 9, 20, 0.9)',
                      border: `1px solid ${ws.color || '#00f2fe'}40`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>{ws.title}</div>
                      <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
                        🗓 {ws.date} • ⏰ {ws.time} | 👨‍🏫 {ws.mentor}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: ws.color || '#00f2fe', marginTop: '2px', fontWeight: 600 }}>
                        {ws.enrolled}/{ws.seats} seats filled ({ws.seats - ws.enrolled} seats left)
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeliverForm(ws.id)}
                      className="glass-btn glass-btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem', whiteSpace: 'nowrap' }}
                    >
                      <FileText size={13} /> Fill Form
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Email Subscription Alert Card (When no workshop or notification is active) */}
          {conciergeState === 'subscribe_email' && (
            <div
              style={{
                background: 'rgba(8, 9, 20, 0.95)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                borderRadius: '18px',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0, 242, 254, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f2fe', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Mail size={16} /> INSTANT EMAIL ALERTS SUBSCRIPTION
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px', lineHeight: 1.4 }}>
                Abhi koi active schedule DB me nahi hai. Niche apna email id fill kijiye — jaise hi admin naya workshop ya notification live karega, aapko mail par notification mil jayega!
              </p>

              {emailSubscribed ? (
                <div style={{ padding: '10px 14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#10b981', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                  🎉 Dhanyawad! Aapka email successfully subscribe ho gaya hai.
                </div>
              ) : (
                <form onSubmit={handleSubscribeEmail} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={subscribeEmailInput}
                    onChange={(e) => setSubscribeEmailInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subscribingEmail}
                    className="glass-btn glass-btn-primary"
                    style={{ padding: '10px 16px', fontSize: '0.82rem', whitespace: 'nowrap' }}
                  >
                    {subscribingEmail ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Subscribe
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Notifications Card */}
          {conciergeState === 'notifications_view' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {activeNotifications.length === 0 ? (
                <div style={{ padding: '12px', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                  No active broadcast notifications in database.
                </div>
              ) : (
                activeNotifications.map((n, i) => (
                  <div
                    key={n.id || i}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(0, 242, 254, 0.2)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{n.title}</div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#94a3b8', fontSize: '0.74rem', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {n.category || 'Announcement'}
                      </span>
                      <span>🗓 {n.date || 'Today'}</span>
                      {n.time && <span>⏰ {n.time}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modern Quick Action Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <button
            onClick={handleDeliverWorkshopInfo}
            style={{
              padding: '10px 8px',
              borderRadius: '14px',
              background: conciergeState === 'workshop_info'
                ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.25), rgba(79, 172, 254, 0.2))'
                : 'rgba(0, 242, 254, 0.08)',
              border: `1.5px solid ${conciergeState === 'workshop_info' ? '#00f2fe' : 'rgba(0, 242, 254, 0.3)'}`,
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              boxShadow: conciergeState === 'workshop_info' ? '0 0 20px rgba(0, 242, 254, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#00f2fe';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = conciergeState === 'workshop_info' ? '#00f2fe' : 'rgba(0, 242, 254, 0.3)';
              e.currentTarget.style.boxShadow = conciergeState === 'workshop_info' ? '0 0 20px rgba(0, 242, 254, 0.3)' : 'none';
            }}
          >
            <Calendar size={15} color="#00f2fe" style={{ flexShrink: 0 }} /> Check Workshop
          </button>

          <button
            onClick={handleDeliverNotifications}
            style={{
              padding: '10px 8px',
              borderRadius: '14px',
              background: conciergeState === 'notifications_view'
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.2))'
                : 'rgba(16, 185, 129, 0.08)',
              border: `1.5px solid ${conciergeState === 'notifications_view' ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`,
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              boxShadow: conciergeState === 'notifications_view' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = conciergeState === 'notifications_view' ? '#10b981' : 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.boxShadow = conciergeState === 'notifications_view' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none';
            }}
          >
            <Bell size={15} color="#10b981" style={{ flexShrink: 0 }} /> Notifications
          </button>

          <button
            onClick={handleDeliverAllWorkshops}
            style={{
              padding: '10px 8px',
              borderRadius: '14px',
              background: conciergeState === 'all_workshops'
                ? 'linear-gradient(135deg, rgba(255, 0, 122, 0.25), rgba(121, 40, 202, 0.2))'
                : 'rgba(255, 0, 122, 0.08)',
              border: `1.5px solid ${conciergeState === 'all_workshops' ? '#ff007a' : 'rgba(255, 0, 122, 0.3)'}`,
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'Outfit, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              boxShadow: conciergeState === 'all_workshops' ? '0 0 20px rgba(255, 0, 122, 0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#ff007a';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 122, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = conciergeState === 'all_workshops' ? '#ff007a' : 'rgba(255, 0, 122, 0.3)';
              e.currentTarget.style.boxShadow = conciergeState === 'all_workshops' ? '0 0 20px rgba(255, 0, 122, 0.3)' : 'none';
            }}
          >
            <Sparkles size={15} color="#ff007a" style={{ flexShrink: 0 }} /> All Courses
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCustomSend} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder={userName ? `Ask AURA anything, ${userName}...` : 'Type prompt or speak via mic...'}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '99px',
              background: 'rgba(8, 9, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              outline: 'none',
              fontSize: '0.85rem',
            }}
          />
          <button
            type="submit"
            className="glass-btn glass-btn-primary"
            style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
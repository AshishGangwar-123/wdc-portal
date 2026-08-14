import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink, 
  BookOpen, 
  Code, 
  Video, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  AlertCircle,
  Loader2,
  X,
  Layers,
  BrainCircuit,
  Play,
  Pause,
  Award,
  CheckSquare,
  Square,
  Circle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

const API_BASE = '';

export default function UserDashboard({ onClose, currentUser, onLoginSuccess, onLogout }) {
  const containerRef = useRef(null);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);

  // Online Test Player State
  const [publishedTests, setPublishedTests] = useState([]);
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [activeTestModal, setActiveTestModal] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submittingTest, setSubmittingTest] = useState(false);
  const [testResultModal, setTestResultModal] = useState(null);

  // Workshop Feedback State
  const [submittedFeedbackIds, setSubmittedFeedbackIds] = useState([]);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuggestions, setFeedbackSuggestions] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);


  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  // Fetch student dashboard data if user is already logged in
  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchDashboardData(currentUser.email);
      fetchSubmissions(currentUser.email);
    }
  }, [currentUser]);

  const fetchSubmissions = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/test-submissions?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setUserSubmissions(await res.json());
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (selectedWorkshopId) {
      fetchWorkshopTests(selectedWorkshopId);
    }
  }, [selectedWorkshopId]);

  const fetchWorkshopTests = async (wsId) => {
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${wsId}/tests?for_student=true`);
      if (res.ok) {
        setPublishedTests(await res.json());
      }
    } catch (e) {}
  };

  const fetchSubmittedFeedbacks = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/student/submitted-feedbacks?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setSubmittedFeedbackIds(await res.json());
      }
    } catch (e) {}
  };

  const handleSubmitFeedback = async (workshopId) => {
    if (!feedbackText.trim()) return alert('Please enter your feedback text.');
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`${API_BASE}/api/workshops/${workshopId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: currentUser?.email || '',
          student_name: currentUser?.name || 'Student',
          rating: feedbackRating,
          feedback_text: feedbackText,
          suggestions: feedbackSuggestions,
        }),
      });

      if (res.ok) {
        setSubmittedFeedbackIds((prev) => [...prev, workshopId]);
        setFeedbackText('');
        setFeedbackSuggestions('');
        alert('🎉 Feedback submitted successfully! Thank you for helping us improve.');
      } else {
        alert('Failed to submit feedback');
      }
    } catch (e) {
      alert('Error submitting feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const fetchDashboardData = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/dashboard?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        fetchSubmittedFeedbacks(email);
        if (data.registrations && data.registrations.length > 0) {
          const allowed = data.registrations.find(r => r.allowed === 1);
          setSelectedWorkshopId(allowed ? allowed.workshop_id : data.registrations[0].workshop_id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;
    setLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data);
        setDashboardData({ email: data.email, registrations: data.registrations });
        if (data.registrations && data.registrations.length > 0) {
          const allowed = data.registrations.find(r => r.allowed === 1);
          setSelectedWorkshopId(allowed ? allowed.workshop_id : data.registrations[0].workshop_id);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setLoginError(errData.detail || 'Login failed. Verify your email & password.');
      }
    } catch (err) {
      setLoginError('Backend server offline or network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper for resource icon & badge colors
  const getResourceMeta = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'test':
      case 'quiz':
        return { icon: HelpCircle, color: '#ff007a', label: 'Online Test / Quiz' };
      case 'notes':
        return { icon: BookOpen, color: '#00f2fe', label: 'Study Notes' };
      case 'code':
      case 'practice':
        return { icon: Code, color: '#10b981', label: 'Code & Assignments' };
      case 'video':
        return { icon: Video, color: '#7928ca', label: 'Video Lecture' };
      default:
        return { icon: FileText, color: '#3b82f6', label: 'Learning Material' };
    }
  };

  // Student Test Player Handlers
  const handleStartTest = (test) => {
    if (test.is_live !== 1) {
      alert('This test session is currently locked. Admin will start the test live during the workshop!');
      return;
    }
    setActiveTestModal(test);
    setCurrentQIndex(0);
    setUserAnswers({});
  };

  const handleSelectOption = (qId, optionIdx, isMulti) => {
    const key = String(qId);
    setUserAnswers((prev) => {
      const current = prev[key] || [];
      if (isMulti) {
        if (current.includes(optionIdx)) {
          return { ...prev, [key]: current.filter((i) => i !== optionIdx) };
        } else {
          return { ...prev, [key]: [...current, optionIdx] };
        }
      } else {
        return { ...prev, [key]: [optionIdx] };
      }
    });
  };

  const handleSubmitTestPlayer = async () => {
    if (!activeTestModal || !currentUser) return;
    setSubmittingTest(true);
    try {
      const res = await fetch(`${API_BASE}/api/tests/${activeTestModal.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_email: currentUser.email,
          student_name: currentUser.name || 'Student',
          answers: userAnswers,
        }),
      });

      if (res.ok) {
        const evalData = await res.json();
        setActiveTestModal(null);
        setTestResultModal(evalData);
        fetchSubmissions(currentUser.email);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7928ca', '#10b981'],
        });
      } else {
        alert('Test submission failed');
      }
    } catch (err) {
      alert('Error submitting test');
    } finally {
      setSubmittingTest(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2000,
        background: 'rgba(5, 6, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        ref={containerRef}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: currentUser ? '1000px' : '460px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '28px',
          padding: '32px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 242, 254, 0.15)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
        >
          <X size={18} />
        </button>

        {/* =================================================================== */}
        {/* VIEW 1: USER LOGIN FORM (If not logged in) */}
        {/* =================================================================== */}
        {!currentUser ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 30px rgba(255, 115, 0, 0.5), 0 0 15px rgba(0, 242, 254, 0.3)',
                  border: '2px solid rgba(255, 115, 0, 0.5)'
                }}
              >
                <img src="/wdc_logo.png" alt="WDC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                Student <span className="text-gradient">Portal Login</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '6px', lineHeight: 1.4 }}>
                Enter your email and the login credentials assigned by Admin after your workshop approval.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                  Registered Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'rgba(8, 9, 20, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
                  Admin Assigned Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      background: 'rgba(8, 9, 20, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>
              </div>

              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} flexShrink={0} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="glass-btn glass-btn-primary"
                style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '0.95rem', marginTop: '6px' }}
              >
                {loading ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Verifying Credentials...</>
                ) : (
                  <>Login to Student Dashboard <ChevronRight size={18} /></>
                )}
              </button>
            </form>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.78rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Sparkles size={18} color="#00f2fe" style={{ flexShrink: 0 }} />
              <span>
                Don't have login credentials? Ensure you have registered for a workshop. Admin sets your credentials upon approving your workshop request.
              </span>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* VIEW 2: LOGGED-IN STUDENT DASHBOARD & WORKSHOP RESOURCES */
          /* =================================================================== */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header / User Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '20px',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                  }}
                >
                  <User size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#00f2fe', fontFamily: 'Fira Code', fontWeight: 600 }}>
                    ● STUDENT DASHBOARD SESSION
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
                    Welcome, {currentUser.name || 'Student'}!
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="glass-btn"
                style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>

            {/* Dashboard Content Grid */}
            {dashboardData && dashboardData.registrations && dashboardData.registrations.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(320px, 2fr)', gap: '24px' }}>
                {/* Left Sidebar: My Enrolled Workshops */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={16} color="#00f2fe" /> My Workshop Registrations
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {dashboardData.registrations.map((reg) => {
                      const isSelected = selectedWorkshopId === reg.workshop_id;
                      const isAllowed = reg.allowed === 1;

                      return (
                        <div
                          key={reg.id}
                          onClick={() => setSelectedWorkshopId(reg.workshop_id)}
                          style={{
                            padding: '16px',
                            borderRadius: '16px',
                            background: isSelected ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.06)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.72rem', fontFamily: 'Fira Code', color: '#00f2fe' }}>
                              {reg.id}
                            </span>
                            {isAllowed ? (
                              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={10} /> Allowed
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={10} /> Pending
                              </span>
                            )}
                          </div>

                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>
                            {reg.full_workshop_title || reg.workshop_title || 'Workshop'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            {reg.workshop_date ? `🗓 ${reg.workshop_date}` : ''} {reg.workshop_time ? `• ⏰ ${reg.workshop_time}` : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Selected Workshop Details & Resources */}
                {(() => {
                  const activeReg = dashboardData.registrations.find(r => r.workshop_id === selectedWorkshopId) || dashboardData.registrations[0];
                  if (!activeReg) return null;

                  const isAllowed = activeReg.allowed === 1;
                  const resources = activeReg.resources || [];

                  return (
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Active Workshop Banner */}
                      <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: activeReg.color || '#00f2fe' }}>
                              WORKSHOP: {activeReg.workshop_id}
                            </span>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                              {activeReg.full_workshop_title || activeReg.workshop_title}
                            </h3>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                              Mentor: <span style={{ color: '#f8fafc', fontWeight: 600 }}>{activeReg.mentor || 'WDC Mentor'}</span>
                            </div>
                          </div>

                          {isAllowed ? (
                            <span style={{ padding: '6px 14px', borderRadius: '99px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <CheckCircle2 size={14} /> Access Granted
                            </span>
                          ) : (
                            <span style={{ padding: '6px 14px', borderRadius: '99px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} /> Pending Approval
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content: Allowed vs Pending */}
                      {!isAllowed ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '16px', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                          <Clock size={40} color="#f59e0b" style={{ marginBottom: '12px' }} />
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                            Workshop Resources Pending Admin Approval
                          </h4>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '420px', margin: '8px auto 0 auto', lineHeight: 1.5 }}>
                            Admin is reviewing your workshop registration. Once allowed, all tests, study notes, practice code, and video lectures added for this workshop will instantly appear here!
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                          {/* PUBLISHED AI TESTS SECTION */}
                          {publishedTests.length > 0 && (
                            <div>
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BrainCircuit size={18} color="#00f2fe" /> Interactive Workshop Tests & Quizzes ({publishedTests.length})
                              </h4>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {publishedTests.map((test) => {
                                  const submission = userSubmissions.find((s) => s.test_id === test.id);
                                  const isLive = test.is_live === 1;

                                  return (
                                    <div
                                      key={test.id}
                                      style={{
                                        padding: '18px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.08) 0%, rgba(121, 40, 202, 0.08) 100%)',
                                        border: isLive ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '14px',
                                      }}
                                    >
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.2)', color: '#00f2fe', fontWeight: 700 }}>
                                            AI ONLINE TEST
                                          </span>
                                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            🎯 {test.level} • ⏱ {test.duration_mins} Mins
                                          </span>
                                        </div>

                                        <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{test.title}</h5>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{test.description}</p>
                                      </div>

                                      {/* Live / Lock / Completed Button Status */}
                                      {submission ? (
                                        <div style={{ textAlign: 'right' }}>
                                          <span style={{ fontSize: '0.82rem', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Award size={14} /> Score: {submission.score}/{submission.max_score} ({submission.percentage}%)
                                          </span>
                                        </div>
                                      ) : !isLive ? (
                                        <div style={{ textAlign: 'right' }}>
                                          <button
                                            disabled
                                            className="glass-btn"
                                            style={{ opacity: 0.6, cursor: 'not-allowed', padding: '8px 14px', fontSize: '0.8rem', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                                            title="Admin has not started this live test session yet"
                                          >
                                            <Lock size={14} /> Locked by Admin
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleStartTest(test)}
                                          className="glass-btn glass-btn-primary"
                                          style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                                        >
                                          <Play size={14} /> Start Test Now
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* WORKSHOP RESOURCES LIST */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={18} color="#00f2fe" /> Workshop Learning Materials ({resources.length})
                              </h4>
                            </div>

                            {resources.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', color: '#94a3b8', fontSize: '0.85rem' }}>
                                No study materials added for this workshop yet.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {resources.map((res) => {
                                  const meta = getResourceMeta(res.resource_type);
                                  const IconComponent = meta.icon;

                                  return (
                                    <div
                                      key={res.id}
                                      style={{
                                        padding: '16px',
                                        borderRadius: '14px',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: `1px solid ${meta.color}35`,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '14px',
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                        <div
                                          style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: `${meta.color}20`,
                                            border: `1px solid ${meta.color}50`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                          }}
                                        >
                                          <IconComponent size={20} color={meta.color} />
                                        </div>

                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: `${meta.color}20`, color: meta.color, fontWeight: 700 }}>
                                              {meta.label}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                              {res.date_added}
                                            </span>
                                          </div>
                                          <h5 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                                            {res.title}
                                          </h5>
                                          {res.description && (
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                                              {res.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {res.link_url && (
                                        <a
                                          href={res.link_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="glass-btn glass-btn-primary"
                                          style={{ padding: '8px 16px', fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}
                                        >
                                          Open <ExternalLink size={14} />
                                        </a>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* WORKSHOP FEEDBACK & SUGGESTIONS SECTION FOR ENDED WORKSHOPS */}
                          {activeReg.is_ended === 1 && (
                            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                              <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(121, 40, 202, 0.08) 100%)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                  <span style={{ fontSize: '1.4rem' }}>🏁</span>
                                  <div>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                                      Workshop Completed — Share Your Feedback & Suggestions
                                    </h4>
                                    <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                                      {activeReg.feedback_prompt || 'What did you learn in this workshop and how can we improve future sessions?'}
                                    </p>
                                  </div>
                                </div>

                                {submittedFeedbackIds.includes(activeReg.workshop_id) ? (
                                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle2 size={20} color="#10b981" />
                                    <span>🎉 Feedback Submitted! Thank you for helping Web Development Club grow.</span>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                                    {/* Star Rating Selector */}
                                    <div>
                                      <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Rate Workshop Experience *</label>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFeedbackRating(star)}
                                            style={{
                                              background: 'transparent',
                                              border: 'none',
                                              fontSize: '1.5rem',
                                              cursor: 'pointer',
                                              opacity: star <= feedbackRating ? 1 : 0.3,
                                              transition: 'transform 0.1s',
                                            }}
                                          >
                                            ⭐
                                          </button>
                                        ))}
                                        <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700, alignSelf: 'center', marginLeft: '6px' }}>
                                          {feedbackRating} / 5 Stars
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Your Feedback & Experience *</label>
                                      <textarea
                                        rows="3"
                                        required
                                        placeholder="Write what you learned and your overall experience..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: 'rgba(8, 9, 20, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none', resize: 'none' }}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', display: 'block', fontWeight: 600 }}>Suggestions for Future Workshops (Optional)</label>
                                      <input
                                        type="text"
                                        placeholder="Topics or features you want in future workshops..."
                                        value={feedbackSuggestions}
                                        onChange={(e) => setFeedbackSuggestions(e.target.value)}
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', background: 'rgba(8, 9, 20, 0.9)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '0.88rem', outline: 'none' }}
                                      />
                                    </div>

                                    <button
                                      onClick={() => handleSubmitFeedback(activeReg.workshop_id)}
                                      disabled={submittingFeedback}
                                      className="glass-btn glass-btn-primary"
                                      style={{ padding: '12px 24px', fontSize: '0.9rem', alignSelf: 'flex-start', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderColor: '#f59e0b' }}
                                    >
                                      {submittingFeedback ? 'Submitting...' : '🚀 Submit Feedback'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                You have not registered for any workshops yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: INTERACTIVE STUDENT TEST PLAYER */}
      {activeTestModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2200, background: 'rgba(5, 6, 18, 0.92)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '28px', padding: '32px', border: '1px solid rgba(0, 242, 254, 0.4)', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)', position: 'relative' }}>
            <button onClick={() => setActiveTestModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>

            {/* Test Player Header */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'Fira Code', color: '#00f2fe' }}>INTERACTIVE WORKSHOP TEST SESSION</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{activeTestModal.title}</h3>
                </div>
                <div style={{ padding: '6px 14px', borderRadius: '99px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe', fontFamily: 'Fira Code', fontSize: '0.85rem', fontWeight: 700 }}>
                  Question {currentQIndex + 1} of {activeTestModal.questions ? activeTestModal.questions.length : 0}
                </div>
              </div>
            </div>

            {/* Active Question Content */}
            {(() => {
              const questions = activeTestModal.questions || [];
              const q = questions[currentQIndex];
              if (!q) return null;

              const isMulti = activeTestModal.type === 'multi_correct';
              const qKey = String(q.id);
              const selectedOpts = userAnswers[qKey] || [];

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5 }}>
                    {q.question}
                  </div>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(q.options || []).map((optText, optIdx) => {
                      const isSelected = selectedOpts.includes(optIdx);

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx, isMulti)}
                          style={{
                            padding: '14px 18px',
                            borderRadius: '14px',
                            background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isSelected ? '#fff' : '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s',
                            fontSize: '0.92rem',
                          }}
                        >
                          <div style={{ color: isSelected ? '#00f2fe' : '#64748b' }}>
                            {isMulti ? (isSelected ? <CheckSquare size={20} /> : <Square size={20} />) : (isSelected ? <CheckCircle2 size={20} /> : <Circle size={20} />)}
                          </div>
                          <span>{optText}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation & Submit Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', marginTop: '12px' }}>
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                      className="glass-btn"
                      style={{ opacity: currentQIndex === 0 ? 0.4 : 1, padding: '10px 20px' }}
                    >
                      Previous Question
                    </button>

                    {currentQIndex < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                        className="glass-btn glass-btn-primary"
                        style={{ padding: '10px 24px' }}
                      >
                        Next Question <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        disabled={submittingTest}
                        onClick={handleSubmitTestPlayer}
                        className="glass-btn glass-btn-primary"
                        style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #10b981 0%, #00f2fe 100%)' }}
                      >
                        {submittingTest ? 'Evaluating Answers...' : 'Submit Test Now 🚀'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL: AUTOCHECK TEST SCORE & DETAILED EVALUATION RESULTS */}
      {testResultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2300, background: 'rgba(5, 6, 18, 0.95)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '28px', padding: '32px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)', position: 'relative' }}>
            <button onClick={() => setTestResultModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>

            {/* Score Banner */}
            <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
                <Award size={36} color="#10b981" />
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Test Completed 🎉</h3>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#10b981', margin: '8px 0', fontFamily: 'Outfit' }}>
                {testResultModal.score} / {testResultModal.max_score} <span style={{ fontSize: '1.4rem', color: '#00f2fe' }}>({testResultModal.percentage}%)</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Autocheck Evaluation completed automatically by AI Test System.</p>
            </div>

            {/* Question Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Detailed Autocheck Breakdown</h4>

              {(testResultModal.evaluation || []).map((evalItem, idx) => (
                <div key={idx} style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: evalItem.is_correct ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>Q{idx + 1}. {evalItem.question}</span>
                    <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: evalItem.is_correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: evalItem.is_correct ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                      {evalItem.is_correct ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>

                  {evalItem.explanation && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', marginTop: '6px' }}>
                      💡 <span style={{ color: '#cbd5e1' }}>{evalItem.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
              <button onClick={() => setTestResultModal(null)} className="glass-btn glass-btn-primary" style={{ padding: '10px 28px' }}>
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


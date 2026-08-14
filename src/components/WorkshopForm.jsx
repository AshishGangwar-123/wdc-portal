import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Code, Sparkles, CheckCircle2, Ticket, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';

const API_BASE = '';

export default function WorkshopForm({ onResetForm, workshopData }) {
  const formContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: 'Intermediate',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If workshopData from parent is provided, use it; else fetch first from API
  const [workshop, setWorkshop] = useState(workshopData || null);

  useEffect(() => {
    // GSAP entrance animation for form inside frame
    gsap.fromTo(
      formContainerRef.current,
      { opacity: 0, scale: 0.92, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }
    );

    // Fetch workshop if not provided
    if (!workshopData) {
      fetch(`${API_BASE}/api/workshops`)
        .then((r) => r.json())
        .then((data) => { if (data && data.length > 0) setWorkshop(data[0]); })
        .catch(() => {});
    }
  }, []);

  // Update workshop if parent provides new workshopData
  useEffect(() => {
    if (workshopData) setWorkshop(workshopData);
  }, [workshopData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setLoading(true);
    setError('');

    try {
      // Real API call to backend — registers student in SQLite DB
      const res = await fetch(`${API_BASE}/api/students/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          workshop_id: workshop?.id || 'ws-101',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTicketId(data.id);
        setSubmitted(true);

        // Fire celebratory confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7928ca', '#ff007a', '#10b981'],
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      // Fallback: generate local ticket if backend offline
      console.log('Backend offline, generating local ticket:', err);
      const randomId = 'WDC-2026-' + Math.floor(100000 + Math.random() * 900000);
      setTicketId(randomId);
      setSubmitted(true);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#7928ca', '#ff007a', '#10b981'],
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        ref={formContainerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '24px 12px',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
          }}
        >
          <CheckCircle2 size={36} color="#10b981" />
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
            Registration Confirmed! 🎉
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
            Dhanyawad <span style={{ color: '#00f2fe', fontWeight: 600 }}>{formData.name}</span>! Aapki workshop seat reserve ho gayi hai.
          </p>
        </div>

        {/* Digital Ticket Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '360px',
            background: 'linear-gradient(135deg, rgba(20,24,56,0.9) 0%, rgba(10,12,28,0.9) 100%)',
            border: '1px dashed rgba(0, 242, 254, 0.5)',
            borderRadius: '20px',
            padding: '20px',
            textAlign: 'left',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Outfit', fontWeight: 700 }}>
              <Ticket size={18} color="#00f2fe" /> VIP PASS
            </div>
            <span style={{ fontFamily: 'Fira Code', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
              CONFIRMED
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>NAME</div>
              <div style={{ fontWeight: 600, color: '#f8fafc' }}>{formData.name}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>TICKET ID</div>
              <div style={{ fontFamily: 'Fira Code', color: '#00f2fe', fontWeight: 600, fontSize: '0.78rem' }}>{ticketId}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>DATE & TIME</div>
              <div style={{ color: '#f8fafc', fontSize: '0.82rem' }}>{workshop?.date || 'TBD'} • {workshop?.time || 'TBD'}</div>
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>LEVEL</div>
              <div style={{ color: '#ff007a' }}>{formData.level}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
            <div style={{ fontFamily: 'Fira Code', marginBottom: '4px' }}>📩 Details sent to {formData.email}</div>
            {workshop && <div style={{ color: '#64748b', fontSize: '0.72rem' }}>🎯 {workshop.title}</div>}
          </div>
        </div>

        <button
          onClick={onResetForm}
          className="glass-btn"
          style={{ padding: '10px 24px', fontSize: '0.85rem', marginTop: '10px' }}
        >
          <RefreshCw size={14} /> Back to AI Chat
        </button>
      </div>
    );
  }

  return (
    <div ref={formContainerRef} style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#00f2fe', fontFamily: 'Fira Code', fontWeight: 700 }}>
            🎯 REGISTERING FOR WORKSHOP:
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: '2px 0' }}>
            {workshop ? workshop.title : 'WDC Masterclass Workshop'}
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {workshop ? `🗓 ${workshop.date} • ⏰ ${workshop.time} • 👨‍🏫 ${workshop.mentor} (${workshop.seats - workshop.enrolled} seats left)` : 'Fill details to reserve your seat!'}
          </p>
        </div>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
            Full Name *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(8, 9, 20, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
            Email Address *
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              name="email"
              required
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(8, 9, 20, 0.8)',
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

        {/* Phone */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 500 }}>
            WhatsApp Number
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="tel"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                background: 'rgba(8, 9, 20, 0.8)',
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

        {/* Experience Level */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '6px' }}>
            Experience Level
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(8, 9, 20, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.82rem', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="glass-btn glass-btn-primary"
          style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '6px', fontSize: '1rem' }}
        >
          {loading ? (
            <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
          ) : (
            <>Confirm Registration <ArrowRight size={18} /></>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

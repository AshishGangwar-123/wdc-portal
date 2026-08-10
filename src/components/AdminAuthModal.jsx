import React, { useState } from 'react';
import { User, Lock, ShieldCheck, Eye, EyeOff, X, ArrowRight, AlertCircle, KeyRound, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function AdminAuthModal({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Kripya Admin User ID aur Password dono enter karein.');
      triggerShake();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        // Save secure server session token in sessionStorage
        try {
          sessionStorage.setItem('wdc_admin_auth_token', data.token);
          sessionStorage.setItem('wdc_admin_user', username.trim());
        } catch (e) {}
        onSuccess();
      } else {
        setError(data.detail || 'Galat Admin User ID ya Password! Access denied.');
        triggerShake();
      }
    } catch (err) {
      console.error('Admin authentication error:', err);
      setError('Backend server se connect nahi ho paya. Kripya check karein backend running hai.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div className="admin-auth-overlay">
      <style>{`
        .admin-auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
          background: rgba(4, 5, 14, 0.88);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }

        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        .admin-auth-card {
          width: 100%;
          max-width: 440px;
          background: linear-gradient(145deg, rgba(16, 20, 38, 0.95), rgba(10, 12, 26, 0.98));
          border: 1px solid rgba(0, 242, 254, 0.25);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 242, 254, 0.15);
          border-radius: 24px;
          padding: 36px 32px;
          position: relative;
          color: #ffffff;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: rotate(90deg);
        }

        .lock-icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 70, 229, 0.25));
          border: 1px solid rgba(0, 242, 254, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
        }

        .auth-title {
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #ffffff 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-subtitle {
          font-size: 0.88rem;
          color: #94a3b8;
          text-align: center;
          margin-bottom: 26px;
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .auth-input {
          width: 100%;
          padding: 14px 44px 14px 44px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.25s;
        }

        .auth-input:focus {
          border-color: #00f2fe;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.25);
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #00f2fe;
          opacity: 0.8;
        }

        .eye-icon-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .eye-icon-btn:hover {
          color: #ffffff;
        }

        .error-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          color: #f87171;
          font-size: 0.84rem;
          margin-bottom: 20px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #00f2fe 0%, #4f46e5 100%);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(0, 242, 254, 0.3);
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 242, 254, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .security-footer-tip {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
          color: #64748b;
          text-align: center;
          line-height: 1.4;
        }
      `}</style>

      <div className={`admin-auth-card ${isShaking ? 'shake-animation' : ''}`}>
        <button className="close-btn" onClick={onCancel} title="Exit to Website">
          <X size={18} />
        </button>

        <div className="lock-icon-wrapper" style={{ borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255, 115, 0, 0.5)' }}>
          <img src="/wdc_logo.png" alt="WDC Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <h2 className="auth-title">WDC Admin Portal Access</h2>
        <p className="auth-subtitle">Protected Route: <code>#wdcadmin</code></p>

        {error && (
          <div className="error-badge">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Admin User ID Field */}
          <div className="input-group">
            <User size={18} className="field-icon" />
            <input
              type="text"
              className="auth-input"
              placeholder="Admin User ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          {/* Admin Security Password Field */}
          <div className="input-group">
            <KeyRound size={18} className="field-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="eye-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Authenticate & Access</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="security-footer-tip">
          🛡️ Credentials are verified directly by the backend server. Zero hardcoded passwords in frontend source code.
        </div>
      </div>
    </div>
  );
}

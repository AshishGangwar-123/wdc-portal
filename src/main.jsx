import React, { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#05060f', color: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px', fontFamily: 'Outfit, sans-serif', textAlign: 'center'
        }}>
          <h1 style={{ color: '#00f2fe', fontSize: '2rem', marginBottom: '12px' }}>⚡ WDC Portal Reloading</h1>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Something went wrong. Please click below to refresh the site.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #00f2fe, #7928ca)',
              color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer'
            }}
          >
            🔄 Refresh Portal
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

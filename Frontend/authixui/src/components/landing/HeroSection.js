import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext.jsx';
import Button from '../ui/Button';

function HeroSection() {
  const { theme } = useTheme();

  return (
    <section className="hero">
      <div className="container">
        <h4 className="text-gradient" style={{ marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>
          Welcome to the Future of Mentorship
        </h4>
        <h1>Complete Multi-Tenant Mentorship Platform.</h1>
        <p className="subtitle">
          Launch your own branded academy in minutes. Secure authentication, diverse user roles, seamless payments, and interactive learning all in one sleek workspace.
        </p>
        
        {theme?.tenantId && (
          <div className="glass" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '24px', marginBottom: '32px' }}>
            <span className="muted">Currently viewing tenant: </span>
            <strong style={{ color: '#fff' }}>{theme.tenantId}</strong>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/auth">
            <Button>Get Started Now</Button>
          </Link>
          <a href="#features">
            <Button className="secondary">Explore Features</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

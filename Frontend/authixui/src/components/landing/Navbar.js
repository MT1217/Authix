import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 0',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.2rem',
            display: 'grid',
            placeItems: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)'
          }}>
            A
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Authix
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" className="muted" style={{ fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='white'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'}>Features</a>
          <a href="#contact" className="muted" style={{ fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='white'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'}>Contact</a>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }}></div>
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

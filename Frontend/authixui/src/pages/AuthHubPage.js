import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function AuthHubPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgId, setOrgId] = useState('');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [error, setError] = useState('');
  const { login, mentorRegister, adminRegister, signup } = useAuth();
  const navigate = useNavigate();

  const mentorOrgStorageKey = useMemo(() => {
    const normalized = String(email || '').trim().toLowerCase();
    return normalized ? `mentorOrgId:${normalized}` : '';
  }, [email]);

  const savedMentorOrgId = useMemo(() => {
    if (!mentorOrgStorageKey) return '';
    try {
      return localStorage.getItem(mentorOrgStorageKey) || '';
    } catch {
      return '';
    }
  }, [mentorOrgStorageKey]);

  useEffect(() => {
    // Auto-hydrate orgId during mentor signup if we've seen this email before.
    if (mode === 'signup' && role === 'mentor' && savedMentorOrgId && !orgId) {
      setOrgId(savedMentorOrgId);
    }
  }, [mode, role, savedMentorOrgId, orgId]);

  function redirectByRole(userRole) {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'mentor':
        navigate('/mentor');
        break;
      case 'student':
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        const user = await login({ email, password });
        redirectByRole(user.role);
      } else {
        let user;
        if (role === 'admin') {
          // Tenant Admin signup bootstraps a brand-new organization + immutable tenantId.
          user = await adminRegister({ email, ownerName: name, password });
        } else if (role === 'mentor') {
          // Mentor must provide tenant/org ID once at account creation.
          user = await mentorRegister({ orgId, email, password, name, expertise });
          if (mentorOrgStorageKey && orgId) {
            try {
              localStorage.setItem(mentorOrgStorageKey, String(orgId).trim());
            } catch {
              // ignore storage errors
            }
          }
        } else {
          user = await signup({ email, password, role, name, expertise });
        }
        redirectByRole(user.role);
      }
    } catch (e) {
      const msg = e.message || 'Authentication failed.';
      setError(msg);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="glass-panel auth-card" onSubmit={handleSubmit}>
        <h2 className="text-gradient" style={{ marginBottom: '16px', fontSize: '2rem' }}>
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="muted" style={{ marginBottom: '24px' }}>
          {mode === 'login'
            ? 'Access your unified platform using your secure credentials.'
            : 'Join the interactive mentorship platform.'}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input className="field" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="Email address" type="email" required />
          <input
            className="field"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          {mode === 'signup' && (
            <>
              <select className="field" value={role} onChange={(ev) => setRole(ev.target.value)} style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <option value="student">🎓 Student (Learner)</option>
                <option value="mentor">👨‍🏫 Mentor (Creator)</option>
                <option value="admin">🏢 Tenant Admin (Owner)</option>
              </select>
              
              <input className="field" value={name} onChange={(ev) => setName(ev.target.value)} placeholder={role === 'admin' ? 'Owner Name' : 'Full Name'} type="text" required />
              
              {role === 'mentor' && (
                <>
                  <input
                    className="field"
                    value={orgId}
                    onChange={(ev) => setOrgId(ev.target.value)}
                    placeholder="Organization ID / Tenant ID (required once)"
                    type="text"
                    required
                  />
                  <input className="field" value={expertise} onChange={(ev) => setExpertise(ev.target.value)} placeholder="Your Expertise (e.g. System Design, Product Management)" type="text" required />
                </>
              )}
            </>
          )}
        </div>

        {error && <div style={{ color: 'var(--danger)', marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button type="submit" style={{ flex: 1 }}>{mode === 'login' ? 'Login Securely' : 'Create Profile'}</Button>
          <Button
            type="button"
            className="secondary"
            style={{ flex: 1 }}
            onClick={() => {
              setError('');
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
          >
            {mode === 'login' ? 'Need an account?' : 'Already have one?'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AuthHubPage;

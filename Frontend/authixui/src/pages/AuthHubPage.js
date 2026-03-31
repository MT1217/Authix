import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function AuthHubPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

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
        const user = await signup({ email, password, role });
        redirectByRole(user.role);
      }
    } catch (e) {
      const msg = e.message || 'Authentication failed.';
      setError(msg);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="glass auth-card" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="muted">
          {mode === 'login'
            ? 'Use the same email/password you registered with for this organization.'
            : 'Choose a role for this first account. You need header tenant platform-main (localhost) and npm run seed:demo on the backend.'}
        </p>
        <input className="field" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="Email" />
        <input
          className="field"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          type="password"
        />
        {mode === 'signup' && (
          <select className="field" value={role} onChange={(ev) => setRole(ev.target.value)}>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button type="submit">{mode === 'login' ? 'Login' : 'Sign up'}</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setError('');
              setMode(mode === 'login' ? 'signup' : 'login');
            }}
          >
            Switch to {mode === 'login' ? 'Sign up' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AuthHubPage;

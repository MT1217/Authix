import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const rolePath = {
  admin: '/admin',
  mentor: '/content',
  student: '/marketplace',
};

function AuthHubPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        const user = await login({ email, password });
        navigate(rolePath[user.role] || '/');
      } else {
        setError('Signup endpoint can be wired similarly to login.');
      }
    } catch (e) {
      setError('Authentication failed. Check backend and credentials.');
    }
  }

  return (
    <div className="auth-wrap">
      <form className="glass auth-card" onSubmit={handleSubmit}>
        <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="muted">Role redirect is based on backend response.</p>
        {mode === 'signup' && (
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
        )}
        <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input
          className="field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Button type="submit">{mode === 'login' ? 'Login' : 'Signup'}</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            Switch to {mode === 'login' ? 'Signup' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AuthHubPage;

import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn, signUp, signInWithGoogle, isConfigured } = useAuth();

  const redirectTo = location.state?.from || '/app';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn({ email: email.trim(), password });
        navigate(redirectTo, { replace: true });
      } else {
        const result = await signUp({ email: email.trim(), password, name: name.trim() });
        // If email confirmation is on, there's no session yet.
        if (result?.session) {
          navigate('/onboarding/start', { replace: true });
        } else {
          setInfo('Check your inbox to confirm your email, then sign in.');
          setMode('signin');
        }
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError('');
    try {
      await signInWithGoogle();
      // Redirect handled by Supabase OAuth flow.
    } catch (err) {
      setError(err?.message || 'Google sign-in failed.');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-home">← Home</Link>
        <Brand />
        <h1>{mode === 'signin' ? 'Sign in to postadoria' : 'Create your account'}</h1>
        <p className="auth-sub">Use your email or continue with Google.</p>

        {!isConfigured && (
          <p className="auth-error">Backend not configured yet — set Supabase env vars to enable login.</p>
        )}

        <div className="auth-tabs">
          <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError(''); setInfo(''); }}>Sign in</button>
          <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); setInfo(''); }}>Sign up</button>
        </div>

        <button type="button" className="button ghost full auth-google" onClick={handleGoogle} disabled={!isConfigured}>
          Continue with Google
        </button>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}
          <button type="submit" className="button primary full" disabled={busy || !isConfigured}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

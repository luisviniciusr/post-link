import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('postlinklab@gmail.com');
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn } = useAuth();

  const redirectTo = location.state?.from || '/app';

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  function completeSignIn(nextEmail = email) {
    signIn({
      email: nextEmail.trim(),
      name: nextEmail.trim().toLowerCase() === 'postlinklab@gmail.com' ? 'Post Link Lab' : undefined,
    });
    navigate(redirectTo, { replace: true });
  }

  function enterApp(event) {
    event.preventDefault();
    completeSignIn();
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-home">← Home</Link>
        <Brand />
        <h1>{mode === 'signin' ? 'Sign in to post-link' : 'Create your account'}</h1>
        <p className="auth-sub">Use your email or continue with Google. Demo mode stores a local session only.</p>

        <div className="auth-tabs">
          <button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>Sign in</button>
          <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>Sign up</button>
        </div>

        <button type="button" className="button ghost full auth-google" onClick={() => completeSignIn('postlinklab@gmail.com')}>
          Sign in with Google
        </button>

        <form className="auth-form" onSubmit={enterApp}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="postlinklab@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="button primary full">Continue to workspace</button>
        </form>

        <button type="button" className="auth-link">Use password</button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';
import { getConnections } from '../data/connections';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';

const PLATFORMS = [
  { id: 'bluesky', label: 'Bluesky', color: '#0085ff', live: true },
  { id: 'instagram', label: 'Instagram', color: '#e4405f', live: false },
  { id: 'twitter', label: 'Twitter / X', color: '#000000', live: false },
  { id: 'tiktok', label: 'TikTok', color: '#010101', live: false },
  { id: 'youtube', label: 'YouTube', color: '#ff0000', live: false },
  { id: 'facebook', label: 'Facebook', color: '#1877f2', live: false },
  { id: 'linkedin', label: 'LinkedIn', color: '#0a66c2', live: false },
  { id: 'threads', label: 'Threads', color: '#000000', live: false },
  { id: 'pinterest', label: 'Pinterest', color: '#e60023', live: false },
];

export default function OnboardingConnectPage() {
  const [connections, setConnections] = useState([]);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  async function refresh() {
    setConnections(await getConnections());
  }
  useEffect(() => { refresh(); }, []);

  async function finish() {
    await updateProfile({ onboarded: true });
    navigate('/app');
  }

  const hasConnection = connections.length > 0;

  return (
    <div className="onboarding-page">
      <div className="onboarding-card wide">
        <Brand />
        <div className="onboarding-progress">
          <span className="done">1</span><span className="active">2</span><span>3</span>
        </div>
        <h1>Connect your accounts</h1>
        <p className="onboarding-kicker">Connect and manage all your social accounts from one place.</p>

        <div className="connect-grid">
          {PLATFORMS.map((p) => {
            const linked = connections.some((c) => c.platform === p.id);
            return (
              <div key={p.id} className="connect-card">
                <span className="platform-icon small" style={{ backgroundColor: p.color }}>{p.label.slice(0, 2)}</span>
                <strong>{p.label}</strong>
                {linked ? (
                  <span className="connect-linked"><Check size={14} /> Connected</span>
                ) : (
                  <button
                    type="button"
                    className="button ghost small"
                    onClick={() => p.live ? setModal(true) : showToast(`${p.label} is coming soon — pending API approval.`, 'error')}
                  >
                    {p.live ? '+ Add' : 'Soon'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="onboarding-actions">
          <button type="button" className="button ghost" onClick={finish}>Skip for now</button>
          <button type="button" className="button primary" onClick={finish} disabled={!hasConnection}>
            {hasConnection ? 'Continue →' : 'Connect one to continue'}
          </button>
        </div>
      </div>

      {modal && <BlueskyModal onClose={() => setModal(false)} onConnected={() => { setModal(false); refresh(); }} />}
    </div>
  );
}

function BlueskyModal({ onClose, onConnected }) {
  const [identifier, setIdentifier] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleConnect(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/connect-bluesky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ identifier: identifier.trim(), appPassword: appPassword.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Connection failed');
      showToast(`Connected @${result.connection.account_handle}!`, 'success');
      onConnected();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="connect-modal-backdrop" onClick={onClose}>
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <div className="connect-modal-head"><strong>Connect Bluesky</strong></div>
        <p className="dash-muted">Use an <strong>app password</strong> from Bluesky → Settings → App Passwords.</p>
        <form className="auth-form" onSubmit={handleConnect}>
          <label>Handle</label>
          <input type="text" required placeholder="yourname.bsky.social" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <label>App password</label>
          <input type="password" required placeholder="xxxx-xxxx-xxxx-xxxx" value={appPassword} onChange={(e) => setAppPassword(e.target.value)} />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="button primary full" disabled={busy}>{busy ? 'Connecting…' : 'Connect'}</button>
        </form>
      </div>
    </div>
  );
}

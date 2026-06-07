import { useEffect, useState } from 'react';
import { Check, Info, LoaderCircle, X, Trash2 } from 'lucide-react';
import { getConnections, removeConnection } from '../../data/connections';
import { supabase } from '../../lib/supabase';
import { showToast } from '../../components/Toast';

// Platforms we support. Bluesky is LIVE; the rest show "coming soon" until
// their OAuth apps are approved.
const PLATFORMS = [
  { id: 'bluesky', label: 'Bluesky', color: '#0085ff', live: true },
  { id: 'twitter', label: 'Twitter / X', color: '#000000', live: false },
  { id: 'instagram', label: 'Instagram', color: '#e4405f', live: false },
  { id: 'linkedin', label: 'LinkedIn', color: '#0a66c2', live: false },
  { id: 'facebook', label: 'Facebook', color: '#1877f2', live: false },
  { id: 'tiktok', label: 'TikTok', color: '#010101', live: false },
  { id: 'youtube', label: 'YouTube', color: '#ff0000', live: false },
  { id: 'threads', label: 'Threads', color: '#000000', live: false },
  { id: 'pinterest', label: 'Pinterest', color: '#e60023', live: false },
];

function platformMeta(id) {
  return PLATFORMS.find((p) => p.id === id) || { label: id, color: '#888' };
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectTarget, setConnectTarget] = useState(null);

  async function refresh() {
    setLoading(true);
    const data = await getConnections();
    setConnections(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleRemove(id) {
    try {
      await removeConnection(id);
      showToast('Account disconnected.', 'success');
      refresh();
    } catch (err) {
      showToast(err.message || 'Could not disconnect.', 'error');
    }
  }

  return (
    <div className="dash-page connections-page">
      <header className="connections-page-head">
        <div>
          <h1>Connections</h1>
          <p className="dash-muted">Link your social accounts once — postadoria handles distribution from there.</p>
        </div>
      </header>

      <section className="dash-panel connections-panel">
        <div className="dash-toolbar connections-toolbar">
          <h2>Connected accounts</h2>
        </div>

        {loading ? (
          <div className="connections-loading">
            <LoaderCircle size={28} className="spin" />
            <p>Loading connected accounts…</p>
          </div>
        ) : connections.length === 0 ? (
          <div className="connections-empty">
            <p>No accounts connected yet. Connect Bluesky below to start posting for real.</p>
          </div>
        ) : (
          <div className="accounts-list flat">
            {connections.map((account) => {
              const platform = platformMeta(account.platform);
              return (
                <div className="account-row flat" key={account.id}>
                  <span className="platform-icon small" style={{ backgroundColor: platform.color }}>
                    {platform.label.slice(0, 2)}
                  </span>
                  <div>
                    <strong>{account.account_name || account.account_handle}</strong>
                    <p>{account.account_handle} · {platform.label}</p>
                  </div>
                  <button type="button" className="button ghost small" onClick={() => handleRemove(account.id)}>
                    <Trash2 size={14} /> Disconnect
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="dash-panel">
        <h3>Connect a platform</h3>
        <div className="platform-grid compact">
          {PLATFORMS.map((platform) => {
            const isLinked = connections.some((c) => c.platform === platform.id);
            return (
              <button
                type="button"
                className="platform-connect"
                key={platform.id}
                onClick={() => platform.live ? setConnectTarget(platform.id) : showToast(`${platform.label} connection is coming soon — pending API approval.`, 'error')}
              >
                <span className="platform-icon small" style={{ backgroundColor: platform.color }}>
                  {platform.label.slice(0, 2)}
                </span>
                <strong>{platform.label}</strong>
                <em>{isLinked ? 'Connected' : platform.live ? 'Connect' : 'Soon'}</em>
              </button>
            );
          })}
        </div>
      </section>

      <button type="button" className="help-link"><Info size={14} /> Get help connecting your accounts</button>

      {connectTarget === 'bluesky' && (
        <BlueskyConnectModal onClose={() => setConnectTarget(null)} onConnected={() => { setConnectTarget(null); refresh(); }} />
      )}
    </div>
  );
}

// ---- Bluesky connect modal (app-password flow) ----
function BlueskyConnectModal({ onClose, onConnected }) {
  const [identifier, setIdentifier] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleConnect(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/connect-bluesky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
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
        <div className="connect-modal-head">
          <strong>Connect Bluesky</strong>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X size={16} /></button>
        </div>
        <p className="dash-muted">
          Enter your Bluesky handle and an <strong>app password</strong> (not your main password).
          Create one at Bluesky → Settings → App Passwords.
        </p>
        <form className="auth-form" onSubmit={handleConnect}>
          <label>Handle</label>
          <input
            type="text"
            required
            placeholder="yourname.bsky.social"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <label>App password</label>
          <input
            type="password"
            required
            placeholder="xxxx-xxxx-xxxx-xxxx"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="button primary full" disabled={busy}>
            {busy ? 'Connecting…' : 'Connect account'}
          </button>
        </form>
      </div>
    </div>
  );
}

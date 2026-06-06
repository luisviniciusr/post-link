import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/ThemeToggle';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/signin');
  }

  return (
    <div className="dash-page settings-page">
      <header className="settings-head">
        <div>
          <h1>Settings</h1>
          <p className="dash-muted">Workspace preferences and appearance.</p>
        </div>
      </header>

      <section className="dash-panel">
        <h3>Account</h3>
        <p className="dash-muted">Signed in as <strong>{user?.email}</strong></p>
        <button type="button" className="button ghost small" onClick={handleSignOut}>Sign out</button>
      </section>

      <section className="dash-panel">
        <h3>Appearance</h3>
        <p className="dash-muted">Choose how post-link looks on this device.</p>
        <div className="theme-options">
          {[
            { id: 'light', label: 'Light', description: 'Bright panels and soft purple accents' },
            { id: 'dark', label: 'Dark', description: 'Low-glare surfaces for late-night batching' },
            { id: 'system', label: 'System', description: 'Follow your OS preference automatically' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              className={`theme-option ${theme === option.id ? 'active' : ''}`}
              onClick={() => setTheme(option.id)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
        <div className="theme-quick-toggle">
          <span>Quick toggle</span>
          <ThemeToggle className="theme-toggle theme-toggle-large" />
        </div>
      </section>

      <section className="dash-panel">
        <h3>Workspace</h3>
        <label>Name<input defaultValue="Creator HQ" /></label>
        <label>Timezone<select defaultValue="utc"><option value="utc">UTC</option><option value="est">US Eastern</option></select></label>
      </section>

      <section className="dash-panel">
        <h3>Billing</h3>
        <p className="dash-muted">Starter plan · $9/month · Renews Jul 3, 2026</p>
        <button type="button" className="button ghost small">Manage billing</button>
      </section>
    </div>
  );
}

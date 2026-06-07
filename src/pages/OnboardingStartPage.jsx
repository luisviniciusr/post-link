import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
import { useAuth } from '../context/AuthContext';

const USER_TYPES = [
  { id: 'founder', label: 'Founder', desc: 'Building a business' },
  { id: 'creator', label: 'Creator', desc: 'Growing an audience' },
  { id: 'agency', label: 'Agency', desc: 'Managing client accounts' },
  { id: 'enterprise', label: 'Enterprise', desc: 'Big company team' },
  { id: 'small_business', label: 'Small Business', desc: 'Running a small business' },
  { id: 'personal', label: 'Personal', desc: 'Just for me' },
];

export default function OnboardingStartPage() {
  const [selected, setSelected] = useState('personal');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  async function handleNext() {
    setBusy(true);
    try {
      await updateProfile({ user_type: selected });
      navigate('/onboarding/connect');
    } catch {
      navigate('/onboarding/connect');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <Brand />
        <div className="onboarding-progress">
          <span className="active">1</span><span>2</span><span>3</span>
        </div>
        <p className="onboarding-kicker">almost ready</p>
        <h1>What sounds most like you?</h1>

        <div className="usertype-grid">
          {USER_TYPES.map((t) => (
            <label key={t.id} className={`usertype-card ${selected === t.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name="usertype"
                checked={selected === t.id}
                onChange={() => setSelected(t.id)}
              />
              <strong>{t.label}</strong>
              <span>{t.desc}</span>
            </label>
          ))}
        </div>

        <div className="onboarding-actions">
          <button type="button" className="button primary" onClick={handleNext} disabled={busy}>
            {busy ? 'Saving…' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

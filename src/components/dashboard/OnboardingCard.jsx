import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { to: '/app/connections', label: 'Link your social accounts' },
  { to: '/app/create', label: 'Compose your first post' },
  { to: '/app/posts/calendar', label: 'Plan the week on your calendar' },
];

export default function OnboardingCard({ completed = 0 }) {
  const [visible, setVisible] = useState(completed < steps.length);

  if (!visible || completed >= steps.length) return null;

  return (
    <div className="onboarding-card">
      <div className="onboarding-card-head">
        <div>
          <strong>Get linked up</strong>
          <p>Three steps to a calmer posting routine.</p>
        </div>
        <button type="button" className="icon-btn" aria-label="Close" onClick={() => setVisible(false)}>
          <X size={14} />
        </button>
      </div>
      <div className="onboarding-card-progress">
        <span>{completed} of {steps.length} done</span>
        <div className="setup-progress">
          <span style={{ width: `${(completed / steps.length) * 100}%` }} />
        </div>
      </div>
      {steps.map((step, index) => (
        <Link key={step.to} to={step.to} className={`setup-step ${index < completed ? 'done' : ''}`}>
          <span className="setup-step-check" aria-hidden />
          {step.label}
          <ChevronRight size={14} />
        </Link>
      ))}
    </div>
  );
}

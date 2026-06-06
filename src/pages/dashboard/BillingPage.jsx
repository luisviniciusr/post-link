import { useState } from 'react';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';

const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/14A9AV8idg6Q7JFgVrawo00';

const plans = {
  free: {
    name: 'Free trial',
    price: 0,
    features: ['Up to 5 scheduled posts', '3 social accounts', 'Basic analytics'],
    cta: 'Current plan',
    highlight: false,
  },
  starter: {
    name: 'Starter',
    price: 9,
    features: ['Unlimited scheduled posts', '10 social accounts', 'Per-platform captions', 'Calendar view', 'Priority support'],
    cta: 'Upgrade to Starter',
    highlight: true,
  },
  team: {
    name: 'Team',
    price: 19,
    features: ['Everything in Starter', 'Unlimited accounts', '5 team members', 'Content studio', 'API access', 'Bulk scheduling'],
    cta: 'Upgrade to Team',
    highlight: false,
  },
};

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const price = (p) => (billingCycle === 'yearly' && p > 0 ? Math.round(p * 10 / 12) : p);

  // Only apply payment link to non-free tiers
  const getCheckoutUrl = (planName) => {
    if (planName === 'Free trial') return null;
    // Use same Stripe link for now — can be swapped per plan later
    return `${STRIPE_CHECKOUT_URL}?prefilled_promo_code=${planName.toLowerCase()}`;
  };

  return (
    <div className="dash-page">
      <h1>Billing & Plans</h1>

      {/* Current plan banner */}
      <section className="dash-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Current plan: <span style={{ color: 'var(--dash-accent, #7c3aed)' }}>Starter</span></h3>
            <p className="dash-muted" style={{ margin: '0.25rem 0 0' }}>
              $9/month · Renews Jul 3, 2026 · Next invoice: $9.00
            </p>
          </div>
          <a
            href={STRIPE_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Manage billing <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* Billing toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="view-tabs" style={{ display: 'inline-flex', borderRadius: '10px', overflow: 'hidden' }}>
          <button
            type="button"
            className={billingCycle === 'monthly' ? 'view-tab active' : 'view-tab'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={billingCycle === 'yearly' ? 'view-tab active' : 'view-tab'}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly — 2 months free
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
        }}
      >
        {Object.entries(plans).map(([key, plan]) => {
          const checkoutUrl = getCheckoutUrl(plan.name);
          return (
            <div
              key={key}
              className="dash-panel"
              style={{
                border: plan.highlight ? '2px solid var(--dash-accent, #7c3aed)' : undefined,
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--dash-accent, #7c3aed)',
                    color: '#fff',
                    padding: '2px 14px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Most popular
                </span>
              )}
              <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{plan.name}</h3>
              <div style={{ margin: '0.75rem 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700 }}>${price(plan.price)}</span>
                <span className="dash-muted">/mo</span>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'var(--dash-accent, #7c3aed)', marginLeft: '0.5rem' }}>
                    billed annually
                  </span>
                )}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', fontSize: '0.9rem' }}>
                    <Check size={14} style={{ color: 'var(--dash-accent, #7c3aed)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`button ${plan.highlight ? 'primary' : 'ghost'} small`}
                  style={{ width: '100%', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {plan.cta} <ArrowRight size={14} />
                </a>
              ) : (
                <button type="button" className="button ghost small" style={{ width: '100%' }} disabled>
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Invoice history placeholder */}
      <section className="dash-panel" style={{ marginTop: '2rem', maxWidth: '900px' }}>
        <h3>Invoice history</h3>
        <p className="dash-muted">No invoices yet. Your first invoice will appear here after your trial ends.</p>
      </section>
    </div>
  );
}

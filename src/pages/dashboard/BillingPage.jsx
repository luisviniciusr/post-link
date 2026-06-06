export default function BillingPage() {
  return (
    <div className="dash-page">
      <h1>Billing</h1>
      <section className="dash-panel">
        <h3>Current plan</h3>
        <p className="dash-muted">Starter · $9/month · Renews Jul 3, 2026</p>
        <button type="button" className="button primary small">Upgrade plan</button>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { Copy, Plus } from 'lucide-react';

export default function ApiKeysPage() {
  const [revealed, setRevealed] = useState(false);
  const sampleKey = 'pl_live_8f2c91a4b7e3d0f6a9c2b5e8';

  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div>
          <h2>API keys</h2>
          <p className="dash-muted">Available on Team plans with the API add-on.</p>
        </div>
        <button type="button" className="button primary small"><Plus size={16} /> Create key</button>
      </div>

      <section className="dash-panel">
        <div className="api-key-row">
          <div>
            <strong>Production key</strong>
            <p>Created Jun 1, 2026 · Last used 2 hours ago</p>
          </div>
          <code>{revealed ? sampleKey : 'pl_live_••••••••••••••••••••'}</code>
          <div className="api-key-actions">
            <button type="button" className="button ghost small" onClick={() => setRevealed(!revealed)}>
              {revealed ? 'Hide' : 'Reveal'}
            </button>
            <button type="button" className="button ghost small"><Copy size={14} /> Copy</button>
          </div>
        </div>
      </section>

      <section className="dash-panel docs-panel">
        <h3>Quick start</h3>
        <pre>{`curl https://api.post-link.app/v1/posts \\
  -H "Authorization: Bearer ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"caption":"Hello world","platforms":["x","linkedin"]}'`}</pre>
      </section>
    </div>
  );
}

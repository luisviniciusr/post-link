import { Link, useNavigate } from 'react-router-dom';

const templates = [
  { title: 'Product launch', duration: '15s', tag: 'Vertical', type: 'video' },
  { title: 'Quote card', duration: '10s', tag: 'Square', type: 'image' },
  { title: 'Before / after', duration: '20s', tag: 'Reel', type: 'video' },
  { title: 'Tutorial hook', duration: '12s', tag: 'Short', type: 'video' },
];

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div>
          <h2>Content studio</h2>
          <p className="dash-muted">Start from a template, customize, then send to Create.</p>
        </div>
        <Link to="/app/create" className="button primary small">New project</Link>
      </div>

      <div className="studio-grid">
        {templates.map((template) => (
          <article className="studio-card" key={template.title}>
            <div className="studio-preview" />
            <strong>{template.title}</strong>
            <p>{template.duration} · {template.tag}</p>
            <button
              type="button"
              className="button ghost small"
              onClick={() => navigate(`/app/create/${template.type}`)}
            >
              Use template
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

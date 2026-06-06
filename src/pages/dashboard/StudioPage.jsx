const templates = [
  { title: 'Product launch', duration: '15s', tag: 'Vertical' },
  { title: 'Quote card', duration: '10s', tag: 'Square' },
  { title: 'Before / after', duration: '20s', tag: 'Reel' },
  { title: 'Tutorial hook', duration: '12s', tag: 'Short' },
];

export default function StudioPage() {
  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div>
          <h2>Content studio</h2>
          <p className="dash-muted">Start from a template, customize, then send to Create.</p>
        </div>
        <button type="button" className="button primary small">New project</button>
      </div>

      <div className="studio-grid">
        {templates.map((template) => (
          <article className="studio-card" key={template.title}>
            <div className="studio-preview" />
            <strong>{template.title}</strong>
            <p>{template.duration} · {template.tag}</p>
            <button type="button" className="button ghost small">Use template</button>
          </article>
        ))}
      </div>
    </div>
  );
}

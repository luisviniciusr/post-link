export default function BulkToolsPage() {
  return (
    <div className="dash-page">
      <h1>Bulk tools</h1>
      <div className="studio-grid">
        <article className="studio-card dash-panel">
          <strong>Bulk schedule</strong>
          <p>Upload multiple videos and queue them across platforms.</p>
          <button type="button" className="button ghost small">Open</button>
        </article>
        <article className="studio-card dash-panel">
          <strong>CSV import</strong>
          <p>Import a spreadsheet of captions, links, and schedule times.</p>
          <button type="button" className="button ghost small">Open</button>
        </article>
      </div>
    </div>
  );
}

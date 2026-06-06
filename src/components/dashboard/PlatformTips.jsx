import { getPlatform, getPlatformMeta } from '../../data/mock';

export default function PlatformTips({ platformId, postType }) {
  const meta = getPlatformMeta(platformId);
  const platform = getPlatform(platformId);
  if (!meta?.editorTips?.length || !platform) return null;

  return (
    <div className="platform-tips dash-panel">
      <h4>{platform.label} tips</h4>
      <ul>
        {meta.editorTips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      {meta.uploadNotes?.[postType] && (
        <p className="field-hint"><strong>Format:</strong> {meta.uploadNotes[postType]}</p>
      )}
    </div>
  );
}

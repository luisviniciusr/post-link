import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CalendarClock,
  Check,
  CloudUpload,
  Link2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  connectedAccounts,
  getAccountsForPostType,
  getPlatform,
  platformCaptionLimits,
} from '../../data/mock';
import PlatformTips from '../../components/dashboard/PlatformTips';

const STEPS = ['Link', 'Upload', 'Write', 'Tweak', 'Schedule'];
const PREFERRED_ACCOUNT_IDS = ['1', '2', '4', '5', '3', '6'];

function getDefaultSelectedIds(eligibleAccounts) {
  const picked = PREFERRED_ACCOUNT_IDS.filter((id) => eligibleAccounts.some((account) => account.id === id));
  return (picked.length ? picked : eligibleAccounts.map((account) => account.id)).slice(0, 5);
}

function getSelectedPlatforms(accountIds, accounts = connectedAccounts) {
  const platforms = new Set();
  accounts
    .filter((account) => accountIds.includes(account.id))
    .forEach((account) => platforms.add(account.platformId));
  return [...platforms];
}

function stepProgress(selectedCount, uploaded, masterCaption, overrideCount, scheduled) {
  return [
    selectedCount > 0,
    uploaded,
    masterCaption.trim().length > 0,
    overrideCount >= 0,
    Boolean(scheduled),
  ];
}

export default function CreatePostPage() {
  const { type = 'video' } = useParams();
  const eligibleAccounts = useMemo(() => getAccountsForPostType(type), [type]);
  const [selectedIds, setSelectedIds] = useState(() => getDefaultSelectedIds(eligibleAccounts));
  const [uploaded, setUploaded] = useState(type === 'text');
  const [masterCaption, setMasterCaption] = useState('');
  const [syncedPlatforms, setSyncedPlatforms] = useState({});
  const [overrides, setOverrides] = useState({});
  const [activePlatform, setActivePlatform] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    setSelectedIds(getDefaultSelectedIds(eligibleAccounts));
    setUploaded(type === 'text');
    setMasterCaption('');
    setOverrides({});
    setSyncedPlatforms({});
  }, [type, eligibleAccounts]);

  const selectedPlatforms = useMemo(
    () => getSelectedPlatforms(selectedIds, eligibleAccounts),
    [selectedIds, eligibleAccounts],
  );
  const needsUpload = type !== 'text';
  const progress = stepProgress(
    selectedIds.length,
    !needsUpload || uploaded,
    masterCaption,
    Object.keys(overrides).length,
    scheduleDate && scheduleTime,
  );
  const activeStep = progress.findIndex((done) => !done);
  const currentStep = activeStep === -1 ? STEPS.length - 1 : activeStep;
  const canPublish = selectedIds.length > 0 && (!needsUpload || uploaded) && masterCaption.trim().length > 0;
  const showLinkedInTips = selectedPlatforms.includes('linkedin');

  function toggleAccount(id) {
    setSelectedIds((ids) => (
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
    ));
  }

  function toggleSync(platformId) {
    const isSynced = syncedPlatforms[platformId] !== false && !overrides[platformId];
    if (isSynced) {
      setSyncedPlatforms((current) => ({ ...current, [platformId]: false }));
      setOverrides((items) => ({ ...items, [platformId]: items[platformId] ?? masterCaption }));
      setActivePlatform(platformId);
      return;
    }
    setSyncedPlatforms((current) => ({ ...current, [platformId]: true }));
    setOverrides((items) => {
      const next = { ...items };
      delete next[platformId];
      return next;
    });
  }

  function captionForPlatform(platformId) {
    if (syncedPlatforms[platformId]) return masterCaption;
    return overrides[platformId] ?? masterCaption;
  }

  return (
    <div className="dash-page editor-page link-flow">
      <header className="editor-flow-head">
        <div>
          <p className="home-kicker">Write once · link everywhere</p>
          <h1>Compose {type} post</h1>
          <p className="dash-muted">One caption fans out to every linked destination — customize only where it matters.</p>
        </div>
        <Link to="/app/create" className="button ghost small">Change format</Link>
      </header>

      <ol className="editor-steps" aria-label="Compose steps">
        {STEPS.map((step, index) => (
          <li key={step} className={`editor-step ${index < currentStep ? 'done' : ''} ${index === currentStep ? 'current' : ''}`}>
            <span className="editor-step-marker">
              {index < currentStep ? <Check size={12} /> : index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="editor-layout link-editor">
        <aside className="editor-sidebar dash-panel">
          <div className="editor-sidebar-head">
            <strong><Link2 size={15} /> Link destinations</strong>
            <span className="step-badge">{selectedIds.length} selected</span>
          </div>
          <p className="field-hint">Pick where this post goes. Captions adapt per platform automatically.</p>
          <input className="search-input" placeholder="Filter accounts…" />
          <div className="account-picker vertical">
            {eligibleAccounts.map((account) => {
              const platform = getPlatform(account.platformId);
              const checked = selectedIds.includes(account.id);
              return (
                <label key={account.id} className={`account-row-select ${checked ? 'selected' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleAccount(account.id)} />
                  <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                  <div>
                    <strong>{account.name}</strong>
                    <em>{account.handle}{account.pageType ? ` · ${account.pageType}` : ''}</em>
                  </div>
                </label>
              );
            })}
          </div>
          {eligibleAccounts.length === 0 && (
            <p className="dash-muted">No connected accounts support {type} posts yet.</p>
          )}
        </aside>

        <section className="editor-main">
          {needsUpload && (
          <div className="dash-panel upload-panel">
            <div className="panel-step-label">Step 2 · Upload</div>
            <button
              type="button"
              className={`upload-zone large ${uploaded ? 'uploaded' : ''}`}
              onClick={() => setUploaded(true)}
            >
              {uploaded ? (
                <>
                  <Check size={32} />
                  <div>
                    <strong>product-demo-reel.mp4</strong>
                    <p>42 MB · 9:16 · ready to link</p>
                  </div>
                </>
              ) : (
                <>
                  <CloudUpload size={32} />
                  <div>
                    <strong>Drop your {type} here</strong>
                    <p>MP4 or MOV · click to simulate upload</p>
                  </div>
                </>
              )}
            </button>
          </div>
          )}

          {showLinkedInTips && <PlatformTips platformId="linkedin" postType={type} />}

          <div className="dash-panel write-once-panel">
            <div className="panel-step-label">Step 3 · Write once</div>
            <div className="caption-head">
              <div>
                <h3>Master caption</h3>
                <p className="field-hint">This syncs to all linked platforms unless you override below.</p>
              </div>
              <span className="char-count">{masterCaption.length} chars</span>
            </div>
            <textarea
              rows={5}
              placeholder="Write your post once — postadoria distributes it everywhere you linked."
              value={masterCaption}
              onChange={(event) => setMasterCaption(event.target.value)}
            />
          </div>

          {selectedPlatforms.length > 0 && (
            <div className="dash-panel platform-tweak-panel">
              <div className="panel-step-label">Step 4 · Tweak per platform</div>
              <div className="caption-head">
                <div>
                  <h3>Platform captions</h3>
                  <p className="field-hint">
                    <Sparkles size={14} /> {selectedPlatforms.length} destination{selectedPlatforms.length === 1 ? '' : 's'} · toggle sync to customize
                  </p>
                </div>
              </div>

              <div className="platform-caption-tabs">
                {selectedPlatforms.map((platformId) => {
                  const platform = getPlatform(platformId);
                  const synced = syncedPlatforms[platformId] !== false && !overrides[platformId];
                  return (
                    <button
                      key={platformId}
                      type="button"
                      className={`platform-caption-tab ${activePlatform === platformId || (!activePlatform && platformId === selectedPlatforms[0]) ? 'active' : ''}`}
                      onClick={() => setActivePlatform(platformId)}
                    >
                      <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                      {platform.label}
                      {!synced && <em className="override-dot" />}
                    </button>
                  );
                })}
              </div>

              {(activePlatform || selectedPlatforms[0]) && (() => {
                const platformId = activePlatform || selectedPlatforms[0];
                const platform = getPlatform(platformId);
                const synced = syncedPlatforms[platformId] !== false && !overrides[platformId];
                const text = captionForPlatform(platformId);
                const limit = platformCaptionLimits[platformId] || 2200;

                return (
                  <div className="platform-caption-editor">
                    <div className="platform-caption-toolbar">
                      <button
                        type="button"
                        className={`sync-toggle ${synced ? 'active' : ''}`}
                        onClick={() => toggleSync(platformId)}
                      >
                        <RefreshCw size={14} />
                        {synced ? 'Synced to master' : 'Custom caption'}
                      </button>
                      <span className={`char-count ${text.length > limit ? 'over' : ''}`}>
                        {text.length}/{limit}
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={text}
                      readOnly={synced}
                      onChange={(event) => setOverrides((items) => ({
                        ...items,
                        [platformId]: event.target.value,
                      }))}
                      placeholder={`Caption for ${platform.label}…`}
                    />
                    {synced && (
                      <p className="field-hint">Uncheck sync to write a platform-specific version.</p>
                    )}
                  </div>
                );
              })()}

              <div className="link-preview-strip">
                {selectedPlatforms.map((platformId) => {
                  const platform = getPlatform(platformId);
                  const text = captionForPlatform(platformId);
                  return (
                    <div key={platformId} className="link-preview-card">
                      <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                      <strong>{platform.label}</strong>
                      <p>{text || 'Waiting for master caption…'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="dash-panel schedule-inline">
            <div className="panel-step-label">Step 5 · Schedule</div>
            <label htmlFor="schedule-date">When should it go live?</label>
            <div className="schedule-fields">
              <input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(event) => setScheduleDate(event.target.value)}
              />
              <input
                type="time"
                value={scheduleTime}
                onChange={(event) => setScheduleTime(event.target.value)}
              />
            </div>
            <p className="field-hint"><CalendarClock size={14} /> Same time fires on every linked platform</p>
          </div>
        </section>
      </div>

      <div className="editor-actions">
        <Link to="/app/create" className="button ghost">Cancel</Link>
        <button type="button" className="button ghost" disabled={!canPublish}>Save draft</button>
        <button type="button" className="button primary" disabled={!canPublish}>Link & publish now</button>
        <button type="button" className="button primary" disabled={!canPublish || !scheduleDate}>Link & schedule</button>
      </div>
    </div>
  );
}

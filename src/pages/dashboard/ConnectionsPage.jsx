import { useMemo, useState } from 'react';
import { Check, Filter, Info, LoaderCircle, X } from 'lucide-react';
import {
  connectedAccounts as seedAccounts,
  getConnectedAccounts,
  getPlatform,
  getPlatformMeta,
  platformIcons,
} from '../../data/mock';

export default function ConnectionsPage() {
  const [accounts, setAccounts] = useState(seedAccounts);
  const [showIds, setShowIds] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [connectTarget, setConnectTarget] = useState(null);
  const [loading] = useState(false);

  const linkedAccounts = useMemo(() => getConnectedAccounts(accounts), [accounts]);

  function connectLinkedIn(pageType) {
    setAccounts((current) => current.map((account) => (
      account.platformId === 'linkedin' && account.pageType === pageType
        ? { ...account, connected: true }
        : account
    )));
    setConnectTarget(null);
  }

  function openConnect(platformId) {
    if (platformId === 'linkedin') {
      setConnectTarget('linkedin');
      return;
    }
    setConnectTarget(platformId);
  }

  return (
    <div className="dash-page connections-page">
      <header className="connections-page-head">
        <div>
          <h1>Connections</h1>
          <p className="dash-muted">Link your social accounts once — post-link handles distribution from there.</p>
        </div>
      </header>

      <section className="dash-panel connections-panel">
        <div className="dash-toolbar connections-toolbar">
          <h2>Connected accounts</h2>
          <div className="toolbar-actions">
            <label className="checkbox-row compact">
              <input type="checkbox" checked={showIds} onChange={(event) => setShowIds(event.target.checked)} />
              Show IDs
            </label>
            <button type="button" className="button ghost small filter-btn">
              all accounts <Filter size={14} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="connections-loading">
            <LoaderCircle size={28} className="spin" />
            <p>Loading connected accounts…</p>
          </div>
        ) : linkedAccounts.length === 0 ? (
          <div className="connections-empty">
            <p>No accounts connected yet.</p>
            <button type="button" className="button primary small" onClick={() => openConnect('linkedin')}>
              Connect LinkedIn
            </button>
          </div>
        ) : (
          <div className="accounts-list flat">
            {linkedAccounts.map((account) => {
              const platform = getPlatform(account.platformId);
              return (
                <div className="account-row flat" key={account.id}>
                  <span className="platform-icon small" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                  <div>
                    <strong>{account.name}</strong>
                    <p>
                      {account.handle}
                      {account.pageType ? ` · ${account.pageType}` : ''}
                      {showIds ? ` · ${account.id}` : ''}
                    </p>
                  </div>
                  <button type="button" className="button ghost small">Manage</button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="dash-panel linkedin-connect-panel">
        <div className="dash-toolbar">
          <div>
            <h3>LinkedIn</h3>
            <p className="dash-muted">{getPlatformMeta('linkedin')?.connectNote}</p>
          </div>
          <span className="status-pill scheduled">Supported</span>
        </div>
        <div className="linkedin-targets">
          {accounts.filter((account) => account.platformId === 'linkedin').map((account) => (
            <div key={account.id} className={`linkedin-target ${account.connected ? 'connected' : ''}`}>
              <div>
                <strong>{account.pageType || 'Account'}</strong>
                <p>{account.handle}</p>
              </div>
              {account.connected ? (
                <span className="linkedin-connected"><Check size={14} /> Connected</span>
              ) : (
                <button type="button" className="button primary small" onClick={() => connectLinkedIn(account.pageType)}>
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="dash-panel groups-panel">
        <div className="dash-toolbar">
          <h3>Manage groups</h3>
          {!creatingGroup && (
            <button type="button" className="button primary small" onClick={() => setCreatingGroup(true)}>
              Create group
            </button>
          )}
        </div>

        {creatingGroup ? (
          <div className="group-form">
            <h4>Create new group</h4>
            <input placeholder="Group name" />
            <p className="field-hint">Select accounts for this group:</p>
            <div className="accounts-list flat compact">
              {linkedAccounts.map((account) => {
                const platform = getPlatform(account.platformId);
                return (
                  <label key={account.id} className="account-row-select flat">
                    <input type="checkbox" />
                    <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                    <div>
                      <strong>{account.name}</strong>
                      <em>{account.handle}</em>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="group-form-actions">
              <button type="button" className="button primary small">Create group</button>
              <button type="button" className="button ghost small" onClick={() => setCreatingGroup(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p className="dash-muted">No groups yet. Create one to organize accounts for faster posting.</p>
        )}
      </section>

      <section className="dash-panel">
        <h3>Connect a platform</h3>
        <div className="platform-grid compact">
          {platformIcons.map((platform) => {
            const isLinked = linkedAccounts.some((account) => account.platformId === platform.id);
            return (
              <button type="button" className="platform-connect" key={platform.id} onClick={() => openConnect(platform.id)}>
                <span className="platform-icon small" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                <strong>{platform.label}</strong>
                <em>{isLinked ? 'Connected' : 'Connect'}</em>
              </button>
            );
          })}
        </div>
      </section>

      <button type="button" className="help-link"><Info size={14} /> Get help connecting your accounts</button>

      {connectTarget && connectTarget !== 'linkedin' && (
        <div className="connect-modal-backdrop" onClick={() => setConnectTarget(null)}>
          <div className="connect-modal" onClick={(event) => event.stopPropagation()}>
            <div className="connect-modal-head">
              <strong>Connect {getPlatform(connectTarget)?.label}</strong>
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => setConnectTarget(null)}><X size={16} /></button>
            </div>
            <p className="dash-muted">OAuth connection for {getPlatform(connectTarget)?.label} is coming soon. LinkedIn is available now.</p>
            <button type="button" className="button ghost small" onClick={() => setConnectTarget(null)}>Close</button>
          </div>
        </div>
      )}

      {connectTarget === 'linkedin' && (
        <div className="connect-modal-backdrop" onClick={() => setConnectTarget(null)}>
          <div className="connect-modal linkedin-modal" onClick={(event) => event.stopPropagation()}>
            <div className="connect-modal-head">
              <strong>Connect LinkedIn</strong>
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => setConnectTarget(null)}><X size={16} /></button>
            </div>
            <p className="dash-muted">Sign in with <strong>postlinklab@gmail.com</strong> to authorize post-link.</p>
            <div className="linkedin-targets compact">
              {accounts.filter((account) => account.platformId === 'linkedin').map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className={`linkedin-target ${account.connected ? 'connected' : ''}`}
                  disabled={account.connected}
                  onClick={() => connectLinkedIn(account.pageType)}
                >
                  <div>
                    <strong>{account.pageType || 'Account'}</strong>
                    <p>{account.handle}</p>
                  </div>
                  {account.connected ? 'Connected' : 'Authorize'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

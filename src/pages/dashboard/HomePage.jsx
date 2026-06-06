import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  FilePlus2,
  Link2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { connectedAccounts, getConnectedAccounts, getDashboardStats, getPlatform } from '../../data/mock';
import { useAuth } from '../../context/AuthContext';
import ContextStrip from '../../components/dashboard/ContextStrip';
import OnboardingCard from '../../components/dashboard/OnboardingCard';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const stats = useMemo(() => getDashboardStats(), []);
  const { user } = useAuth();
  const displayName = user?.name && user.name.length <= 18 ? user.name : user?.name?.split(' ')[0] || 'there';

  return (
    <div className="dash-page home-page">
      <ContextStrip />

      <header className="home-hero">
        <div>
          <p className="home-kicker">Your calm command center</p>
          <h1>{greeting()}, {displayName}</h1>
          <p className="dash-muted">
            {stats.scheduledCount} posts scheduled · {stats.connectedCount} accounts linked · {stats.draftCount} drafts waiting
          </p>
        </div>
        <Link to="/app/create" className="button primary">
          <FilePlus2 size={16} /> New post
        </Link>
      </header>

      <div className="home-grid">
        <section className="dash-panel home-stat-card">
          <span className="home-stat-label">Scheduled</span>
          <strong className="home-stat-value">{stats.scheduledCount}</strong>
          <Link to="/app/posts/scheduled" className="home-stat-link">View queue →</Link>
        </section>
        <section className="dash-panel home-stat-card">
          <span className="home-stat-label">Linked accounts</span>
          <strong className="home-stat-value">{stats.connectedCount}</strong>
          <Link to="/app/connections" className="home-stat-link">Manage links →</Link>
        </section>
        <section className="dash-panel home-stat-card">
          <span className="home-stat-label">Published</span>
          <strong className="home-stat-value">{stats.postedCount}</strong>
          <Link to="/app/posts/posted" className="home-stat-link">See history →</Link>
        </section>
      </div>

      <div className="home-split">
        <section className="dash-panel home-next">
          <div className="home-section-head">
            <h2>Next up</h2>
            <Link to="/app/posts/calendar" className="button ghost small">
              <CalendarDays size={14} /> Calendar
            </Link>
          </div>
          {stats.nextPost ? (
            <article className="next-post-card">
              <div>
                <strong>{stats.nextPost.title}</strong>
                <p>{stats.nextPost.caption}</p>
                <div className="calendar-platforms">
                  {stats.nextPost.platforms.map((platformId) => {
                    const platform = getPlatform(platformId);
                    return (
                      <span key={platformId} style={{ backgroundColor: platform.color }}>
                        {platform.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="next-post-meta">
                <span className="status-pill scheduled">Scheduled</span>
                <strong>{stats.nextPost.date}</strong>
                <em>{stats.nextPost.time}</em>
                <button type="button" className="button ghost small">Edit</button>
              </div>
            </article>
          ) : (
            <div className="home-empty">
              <p>Nothing queued yet. Your calendar is wide open.</p>
              <Link to="/app/create" className="button primary small">Schedule something →</Link>
            </div>
          )}
        </section>

        <section className="dash-panel home-quick">
          <h2>Quick links</h2>
          <div className="quick-link-grid">
            <Link to="/app/create/video" className="quick-link-card">
              <VideoIcon />
              <span>Video post</span>
            </Link>
            <Link to="/app/studio" className="quick-link-card">
              <Sparkles size={18} />
              <span>Content studio</span>
            </Link>
            <Link to="/app/connections" className="quick-link-card">
              <Link2 size={18} />
              <span>Link accounts</span>
            </Link>
            <Link to="/app/analytics" className="quick-link-card">
              <TrendingUp size={18} />
              <span>Analytics</span>
            </Link>
          </div>
        </section>
      </div>

      <section className="dash-panel home-recent">
        <div className="home-section-head">
          <h2>Recent activity</h2>
          <Link to="/app/posts" className="home-stat-link">All posts <ArrowRight size={14} /></Link>
        </div>
        <div className="recent-list">
          {stats.recentPosts.map((post) => (
            <article key={post.id} className="recent-row">
              <div>
                <strong>{post.title}</strong>
                <span className={`status-pill ${post.status}`}>{post.status}</span>
              </div>
              <span>{post.date} · {post.time}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dash-panel home-accounts">
        <div className="home-section-head">
          <h2>Linked platforms</h2>
          <Link to="/app/connections" className="home-stat-link">Add more →</Link>
        </div>
        <div className="linked-platforms">
          {getConnectedAccounts().slice(0, 6).map((account) => {
            const platform = getPlatform(account.platformId);
            return (
              <div key={account.id} className="linked-platform-chip">
                <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                <div>
                  <strong>{account.name}</strong>
                  <em>{account.handle}</em>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <OnboardingCard completed={Math.min(2, (stats.connectedCount > 0 ? 1 : 0) + (stats.scheduledCount > 0 ? 1 : 0))} />
    </div>
  );
}

function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 6 3-6 3V9Z" />
    </svg>
  );
}

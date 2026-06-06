import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye, Heart, Share2 } from 'lucide-react';

const metrics = [
  { label: 'Reach', value: '12.4k', change: '+18%', icon: Eye },
  { label: 'Engagement', value: '4.2%', change: '+0.6%', icon: Heart },
  { label: 'Shares', value: '386', change: '+22%', icon: Share2 },
];

const highlights = [
  { title: 'Weekly product update reel', platform: 'Instagram', stat: '3.1k views' },
  { title: 'Founder thread', platform: 'X', stat: '842 impressions' },
  { title: 'Launch recap', platform: 'LinkedIn', stat: '156 reactions' },
];

export default function AnalyticsPage() {
  return (
    <div className="dash-page analytics-page">
      <header className="analytics-head">
        <div>
          <h1>Performance snapshot</h1>
          <p className="dash-muted">Sample metrics from your linked accounts — real data connects when you publish.</p>
        </div>
        <span className="demo-badge">Demo data</span>
      </header>

      <div className="analytics-metrics">
        {metrics.map(({ label, value, change, icon: Icon }) => (
          <section key={label} className="dash-panel metric-card">
            <div className="metric-card-top">
              <Icon size={16} />
              <span>{label}</span>
            </div>
            <strong>{value}</strong>
            <em>{change} vs last 7 days</em>
          </section>
        ))}
      </div>

      <section className="dash-panel">
        <div className="home-section-head">
          <h2>Top posts this week</h2>
          <Link to="/app/posts/posted" className="home-stat-link">View published <ArrowUpRight size={14} /></Link>
        </div>
        <div className="analytics-highlights">
          {highlights.map((item) => (
            <article key={item.title} className="analytics-highlight-row">
              <div>
                <strong>{item.title}</strong>
                <span>{item.platform}</span>
              </div>
              <em>{item.stat}</em>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

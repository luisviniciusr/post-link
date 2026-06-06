import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  FilePlus2,
  KeyRound,
  Layers3,
  LayoutDashboard,
  Link2,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import Brand from '../../components/Brand';
import ThemeToggle from '../../components/ThemeToggle';
import UserMenu from '../../components/UserMenu';

const primaryLinks = [
  { to: '/app', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/posts/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/app/posts', label: 'Posts', end: true },
  { to: '/app/connections', label: 'Connections', icon: Link2 },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
];

const createLinks = [
  { to: '/app/create', label: 'Compose', end: true },
  { to: '/app/studio', label: 'Studio', icon: Sparkles },
  { to: '/app/bulk-tools', label: 'Bulk tools', icon: Layers3 },
];

const configLinks = [
  { to: '/app/teams', label: 'Teams', icon: Users },
  { to: '/app/settings', label: 'Settings', icon: Settings },
  { to: '/app/api-keys', label: 'API keys', icon: KeyRound },
  { to: '/app/billing', label: 'Billing', icon: Wallet },
];

function NavSection({ title, links }) {
  return (
    <div className="dash-section">
      <div className="dash-section-label">{title}</div>
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `dash-nav-item ${isActive ? 'active' : ''}`}>
          {Icon ? <Icon size={17} /> : <FilePlus2 size={17} />}
          {label}
        </NavLink>
      ))}
    </div>
  );
}

function pageTitle(pathname) {
  if (pathname === '/app' || pathname === '/app/') return 'Home';
  if (pathname.startsWith('/app/create')) return 'Compose';
  if (pathname.includes('/calendar')) return 'Calendar';
  if (pathname.includes('/posts')) return 'Posts';
  if (pathname.includes('/connections')) return 'Connections';
  if (pathname.includes('/analytics')) return 'Analytics';
  if (pathname.includes('/studio')) return 'Studio';
  if (pathname.includes('/settings')) return 'Settings';
  return 'Workspace';
}

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('post-link:open-palette'));
}

export default function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <Brand linkTo="/app" />

        <div className="workspace-picker">
          <span>Workspace</span>
          <button type="button" className="workspace-select">
            Main <ChevronDown size={14} />
          </button>
        </div>

        <Link to="/app/create" className="button primary full create-post-btn">
          <FilePlus2 size={16} /> Compose
        </Link>

        <nav className="dash-nav">
          <NavSection title="Overview" links={primaryLinks} />
          <NavSection title="Create" links={createLinks} />
          <NavSection title="Settings" links={configLinks} />
        </nav>

        <div className="dash-sidebar-links">
          <button type="button" className="dash-link-btn"><MessageCircle size={14} /> Help & support</button>
          <Link to="/" className="dash-link-btn">← Back to site</Link>
        </div>

        <UserMenu />
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <span className="dash-topbar-crumb">{pageTitle(pathname)}</span>
          <div className="dash-topbar-actions">
            <button type="button" className="dash-topbar-hint" onClick={openCommandPalette}>
              ⌘K quick actions
            </button>
            <ThemeToggle />
            <Link to="/app/create" className="button ghost small">New post</Link>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

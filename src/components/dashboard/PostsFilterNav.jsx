import { NavLink } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const filters = [
  { to: '/app/posts', label: 'All', end: true },
  { to: '/app/posts/scheduled', label: 'Scheduled' },
  { to: '/app/posts/posted', label: 'Posted' },
  { to: '/app/posts/drafts', label: 'Drafts' },
];

export default function PostsFilterNav({ active }) {
  return (
    <nav className="posts-filter-nav">
      {filters.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `filter-pill ${isActive || active === label.toLowerCase() ? 'active' : ''}`}>
          {label}
        </NavLink>
      ))}
      <NavLink to="/app/posts/calendar" className="filter-pill calendar-link">
        <CalendarDays size={14} /> Calendar view
      </NavLink>
    </nav>
  );
}

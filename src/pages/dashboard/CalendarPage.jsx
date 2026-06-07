import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, StickyNote } from 'lucide-react';
import { getStats, getAllPosts } from '../../data/store';
import ContextStrip from '../../components/dashboard/ContextStrip';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthCells(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function buildWeekCells(cursor) {
  const start = new Date(cursor);
  start.setDate(cursor.getDate() - cursor.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function CalendarPage() {
  const [view, setView] = useState('Month');
  const [cursor, setCursor] = useState(new Date(2026, 5, 3));
  const [stats, setStats] = useState({
    scheduledCount: 0,
    draftCount: 0,
    postedCount: 0,
    connectedCount: 0,
    nextPost: null,
    recentPosts: [],
  });
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    getStats().then(setStats);
    getAllPosts().then(setAllPosts);
  }, []);

  const cells = useMemo(
    () => (view === 'Month'
      ? buildMonthCells(cursor.getFullYear(), cursor.getMonth())
      : buildWeekCells(cursor)),
    [cursor, view],
  );

  const periodLabel = view === 'Month'
    ? cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : `${formatDayLabel(cells[0])} – ${formatDayLabel(cells[6])}`;

  const upcoming = allPosts.filter((post) => post.status === 'scheduled');

  function shiftPeriod(direction) {
    const next = new Date(cursor);
    if (view === 'Month') {
      next.setMonth(cursor.getMonth() + direction);
    } else {
      next.setDate(cursor.getDate() + (direction * 7));
    }
    setCursor(next);
  }

  return (
    <div className="dash-page calendar-page">
      <ContextStrip />

      <header className="calendar-page-head">
        <div>
          <h1>Content calendar</h1>
          <p className="dash-muted">See your week at a glance — drag-free scheduling for calm planning.</p>
        </div>
        <Link to="/app/create" className="button primary small"><Plus size={14} /> Schedule post</Link>
      </header>

      <div className="week-summary dash-panel">
        <span>This week</span>
        <strong>{stats.scheduledCount} scheduled</strong>
        <em>{stats.draftCount} drafts</em>
      </div>

      <div className="calendar-layout">
        <section className="calendar-main dash-panel">
          <div className="calendar-toolbar">
            <div className="calendar-nav">
              <button type="button" aria-label="Previous period" onClick={() => shiftPeriod(-1)}>
                <ChevronLeft size={18} />
              </button>
              <strong>{periodLabel}</strong>
              <button type="button" aria-label="Next period" onClick={() => shiftPeriod(1)}>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="calendar-controls">
              <button type="button" className="button ghost small">All platforms</button>
              <div className="view-tabs">
                {['Month', 'Week'].map((item) => (
                  <button key={item} type="button" className={view === item ? 'active' : ''} onClick={() => setView(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {view === 'Month' ? (
            <div className="month-grid">
              {weekdays.map((day) => <div key={day} className="month-grid-head">{day}</div>)}
              {cells.map((date) => {
                const key = date.toISOString().slice(0, 10);
                const inMonth = date.getMonth() === cursor.getMonth();
                const dayPosts = allPosts.filter((post) => post.date && post.date === key);
                const isToday = key === new Date().toISOString().slice(0, 10);

                return (
                  <div key={key} className={`month-cell ${inMonth ? '' : 'muted'} ${isToday ? 'today' : ''}`}>
                    <div className="month-cell-top">
                      <span>{formatDayLabel(date)}</span>
                      <button type="button" className="icon-btn" aria-label="Add note"><StickyNote size={14} /></button>
                    </div>
                    {dayPosts.length === 0 ? (
                      <p className="month-cell-empty">Open</p>
                    ) : dayPosts.map((post) => (
                      <Link key={post.id} to="/app/posts/scheduled" className="calendar-chip">{post.title}</Link>
                    ))}
                    <Link to="/app/create" className="month-cell-action">+ Add</Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="week-grid">
              {cells.map((date) => {
                const key = date.toISOString().slice(0, 10);
                const dayPosts = allPosts.filter((post) => post.date && post.date === key);
                const isToday = key === new Date().toISOString().slice(0, 10);

                return (
                  <div key={key} className={`week-column ${isToday ? 'today' : ''}`}>
                    <div className="week-column-head">
                      <span>{weekdays[date.getDay()]}</span>
                      <strong>{formatDayLabel(date)}</strong>
                    </div>
                    {dayPosts.length === 0 ? (
                      <p className="month-cell-empty">Nothing planned</p>
                    ) : dayPosts.map((post) => (
                      <Link key={post.id} to="/app/posts/scheduled" className="calendar-chip">{post.title}</Link>
                    ))}
                    <Link to="/app/create" className="month-cell-action visible">+ Add</Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="calendar-sidebar dash-panel">
          <h3>Queue</h3>
          {upcoming.length === 0 ? (
            <p className="dash-muted">Your queue is empty — a good moment to batch the week.</p>
          ) : upcoming.map((post) => (
            <article key={post.id} className="upcoming-item">
              <strong>{post.title}</strong>
              <span>{post.date} · {post.time}</span>
            </article>
          ))}
        </aside>
      </div>
    </div>
  );
}

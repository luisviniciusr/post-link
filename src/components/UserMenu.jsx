import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu({ className = 'dash-user-menu' }) {
  const { user, initials, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function handleSignOut() {
    signOut();
    setOpen(false);
    navigate('/signin');
  }

  if (!user) return null;

  return (
    <div className={className} ref={rootRef}>
      <button
        type="button"
        className="dash-user dash-user-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <div className="dash-user-avatar">{initials}</div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.plan} plan</span>
        </div>
        <ChevronDown size={14} className={open ? 'open' : ''} />
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-meta">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <Link to="/app/settings" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            <Settings size={15} /> Settings
          </Link>
          <button type="button" className="user-menu-item danger" role="menuitem" onClick={handleSignOut}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

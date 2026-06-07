import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  FilePlus2,
  Image,
  LayoutDashboard,
  Link2,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Type,
  Video,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const icons = {
  home: LayoutDashboard,
  calendar: CalendarDays,
  posts: FilePlus2,
  connections: Link2,
  analytics: BarChart3,
  compose: FilePlus2,
  studio: Sparkles,
  settings: Settings,
  text: Type,
  image: Image,
  video: Video,
  theme: Sun,
};

function buildCommands({ navigate, setTheme, resolvedTheme, inApp, signOut }) {
  const themeCommands = [
    {
      id: 'theme-light',
      label: 'Light mode',
      section: 'Appearance',
      icon: 'theme',
      keywords: 'appearance bright',
      action: () => setTheme('light'),
    },
    {
      id: 'theme-dark',
      label: 'Dark mode',
      section: 'Appearance',
      icon: 'theme',
      keywords: 'appearance night',
      action: () => setTheme('dark'),
    },
    {
      id: 'theme-system',
      label: 'Use system theme',
      section: 'Appearance',
      icon: 'theme',
      keywords: 'appearance auto',
      action: () => setTheme('system'),
    },
    {
      id: 'theme-toggle',
      label: resolvedTheme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode',
      section: 'Appearance',
      icon: 'theme',
      keywords: 'appearance switch',
      action: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    },
  ];

  const globalCommands = [
    {
      id: 'landing',
      label: 'Go to marketing site',
      section: 'Navigate',
      icon: 'home',
      keywords: 'home landing',
      action: () => navigate('/'),
    },
    {
      id: 'signin',
      label: 'Sign in',
      section: 'Navigate',
      icon: 'settings',
      keywords: 'auth login',
      action: () => navigate('/signin'),
    },
  ];

  if (!inApp) {
    return [...globalCommands, ...themeCommands];
  }

  return [
    {
      id: 'app-home',
      label: 'Go to Home',
      section: 'Navigate',
      icon: 'home',
      keywords: 'dashboard overview',
      action: () => navigate('/app'),
    },
    {
      id: 'app-calendar',
      label: 'Open Calendar',
      section: 'Navigate',
      icon: 'calendar',
      keywords: 'schedule plan week',
      action: () => navigate('/app/posts/calendar'),
    },
    {
      id: 'app-posts',
      label: 'View all posts',
      section: 'Navigate',
      icon: 'posts',
      keywords: 'timeline drafts scheduled',
      action: () => navigate('/app/posts'),
    },
    {
      id: 'app-connections',
      label: 'Manage connections',
      section: 'Navigate',
      icon: 'connections',
      keywords: 'accounts link platforms',
      action: () => navigate('/app/connections'),
    },
    {
      id: 'app-analytics',
      label: 'Open Analytics',
      section: 'Navigate',
      icon: 'analytics',
      keywords: 'stats performance',
      action: () => navigate('/app/analytics'),
    },
    {
      id: 'app-settings',
      label: 'Open Settings',
      section: 'Navigate',
      icon: 'settings',
      keywords: 'preferences workspace',
      action: () => navigate('/app/settings'),
    },
    {
      id: 'compose',
      label: 'Compose new post',
      section: 'Create',
      icon: 'compose',
      keywords: 'write create',
      action: () => navigate('/app/create'),
    },
    {
      id: 'compose-video',
      label: 'Compose video post',
      section: 'Create',
      icon: 'video',
      keywords: 'reel shorts upload',
      action: () => navigate('/app/create/video'),
    },
    {
      id: 'compose-text',
      label: 'Compose text post',
      section: 'Create',
      icon: 'text',
      keywords: 'thread tweet',
      action: () => navigate('/app/create/text'),
    },
    {
      id: 'compose-image',
      label: 'Compose image post',
      section: 'Create',
      icon: 'image',
      keywords: 'photo carousel',
      action: () => navigate('/app/create/image'),
    },
    {
      id: 'studio',
      label: 'Open Content Studio',
      section: 'Create',
      icon: 'studio',
      keywords: 'templates edit',
      action: () => navigate('/app/studio'),
    },
    {
      id: 'sign-out',
      label: 'Sign out',
      section: 'Account',
      icon: 'settings',
      keywords: 'logout exit auth',
      action: () => {
        signOut();
        navigate('/signin');
      },
    },
    ...themeCommands,
    ...globalCommands.filter((cmd) => cmd.id !== 'signin'),
  ];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setTheme, resolvedTheme } = useTheme();
  const { signOut } = useAuth();
  const inApp = pathname.startsWith('/app');

  const commands = useMemo(
    () => buildCommands({ navigate, setTheme, resolvedTheme, inApp, signOut }),
    [navigate, setTheme, resolvedTheme, inApp, signOut],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((cmd) => (
      cmd.label.toLowerCase().includes(q)
      || cmd.section.toLowerCase().includes(q)
      || (cmd.keywords && cmd.keywords.includes(q))
    ));
  }, [commands, query]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((cmd) => {
      if (!map.has(cmd.section)) map.set(cmd.section, []);
      map.get(cmd.section).push(cmd);
    });
    return [...map.entries()];
  }, [filtered]);

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    }
    function onOpenPalette() {
      setOpen(true);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('postadoria:open-palette', onOpenPalette);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('postadoria:open-palette', onOpenPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function runCommand(command) {
    command.action();
    setOpen(false);
  }

  function onInputKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter' && filtered[activeIndex]) {
      event.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  }

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div className="command-palette-backdrop" onClick={() => setOpen(false)}>
      <div className="command-palette" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="command-palette-input-wrap">
          <input
            ref={inputRef}
            className="command-palette-input"
            placeholder="Search actions…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <kbd className="command-palette-kbd">esc</kbd>
        </div>

        <div className="command-palette-list">
          {filtered.length === 0 ? (
            <p className="command-palette-empty">No matching actions.</p>
          ) : grouped.map(([section, items]) => (
            <div key={section} className="command-palette-group">
              <div className="command-palette-group-label">{section}</div>
              {items.map((command) => {
                itemIndex += 1;
                const Icon = icons[command.icon] || FilePlus2;
                const isActive = itemIndex === activeIndex;
                return (
                  <button
                    key={command.id}
                    type="button"
                    className={`command-palette-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                    onClick={() => runCommand(command)}
                  >
                    <Icon size={16} />
                    <span>{command.label}</span>
                    {command.id.startsWith('theme') && command.id === 'theme-toggle' ? (
                      resolvedTheme === 'dark' ? <Moon size={14} /> : <Sun size={14} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="command-palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>⌘</kbd><kbd>K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}

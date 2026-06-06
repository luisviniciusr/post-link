import { createContext, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'post-link-session';

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function displayNameFromEmail(email) {
  const local = email.split('@')[0] || 'User';
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function initialsFromName(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'PL';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  function signIn({ email, name, plan = 'Starter' }) {
    const nextUser = {
      email,
      name: name || displayNameFromEmail(email),
      plan,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    signIn,
    signOut,
    initials: user ? initialsFromName(user.name) : 'PL',
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

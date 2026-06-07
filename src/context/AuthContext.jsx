import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

function initialsFromName(name) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'PA'
  );
}

function displayNameFromEmail(email) {
  const local = (email || '').split('@')[0] || 'User';
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Shape a Supabase user + profile row into the app's `user` object.
function shapeUser(authUser, profile) {
  if (!authUser) return null;
  const name =
    profile?.name || authUser.user_metadata?.name || displayNameFromEmail(authUser.email);
  return {
    id: authUser.id,
    email: authUser.email,
    name,
    plan: profile?.plan === 'creator' ? 'Creator' : profile?.plan === 'pro' ? 'Pro' : 'Trial',
    userType: profile?.user_type || 'personal',
    onboarded: profile?.onboarded ?? false,
    stripeCustomerId: profile?.stripe_customer_id || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(authUser) {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    setUser(shapeUser(authUser, profile));
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Hydrate from any existing session, then subscribe to changes.
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp({ email, password, name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || displayNameFromEmail(email) } },
    });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Update profile fields (used by onboarding: user_type, onboarded flag).
  async function updateProfile(fields) {
    if (!user) return;
    const { error } = await supabase.from('profiles').update(fields).eq('id', user.id);
    if (error) throw error;
    setUser((prev) => ({
      ...prev,
      userType: fields.user_type ?? prev.userType,
      onboarded: fields.onboarded ?? prev.onboarded,
      plan: fields.plan
        ? fields.plan.charAt(0).toUpperCase() + fields.plan.slice(1)
        : prev.plan,
    }));
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isConfigured: isSupabaseConfigured,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      initials: user ? initialsFromName(user.name) : 'PA',
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

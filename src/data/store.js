import { supabase } from '../lib/supabase';

// ============================================================
// Posts data layer — backed by Supabase (posts + post_targets)
// All functions are async. Components fetch in useEffect.
// ============================================================

// Fetch all posts for the current user, newest first, with their targets.
export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, post_targets(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[store] getAllPosts failed:', error.message);
    return [];
  }

  // Normalize to the shape the UI expects (date/time/platforms/title).
  return (data || []).map(normalizePost);
}

function normalizePost(row) {
  const scheduled = row.scheduled_at ? new Date(row.scheduled_at) : null;
  return {
    id: row.id,
    title: (row.master_caption || '').slice(0, 60) || 'Untitled post',
    caption: row.master_caption,
    type: row.post_type,
    status: row.status,
    mediaUrl: row.media_url,
    date: scheduled ? scheduled.toISOString().slice(0, 10) : null,
    time: scheduled ? scheduled.toISOString().slice(11, 16) : null,
    scheduledAt: row.scheduled_at,
    createdAt: row.created_at,
    platforms: (row.post_targets || []).map((t) => t.platform),
    targets: row.post_targets || [],
  };
}

// Create a post + its per-platform targets.
// `payload` = { masterCaption, type, mediaUrl, status, scheduledAt, targets: [{platform, caption, connectionId}] }
export async function addPost(payload) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      master_caption: payload.masterCaption,
      post_type: payload.type || 'text',
      media_url: payload.mediaUrl || null,
      status: payload.status || 'draft',
      scheduled_at: payload.scheduledAt || null,
    })
    .select()
    .single();

  if (error) throw error;

  if (payload.targets?.length) {
    const targetRows = payload.targets.map((t) => ({
      post_id: post.id,
      connection_id: t.connectionId || null,
      platform: t.platform,
      caption: t.caption,
      status: 'pending',
    }));
    const { error: targetErr } = await supabase.from('post_targets').insert(targetRows);
    if (targetErr) throw targetErr;
  }

  return normalizePost(post);
}

// Dashboard stats derived from the user's real posts.
export async function getStats() {
  const [posts, connectionsCount] = await Promise.all([getAllPosts(), getConnectionCount()]);
  const scheduled = posts.filter((p) => p.status === 'scheduled');
  const drafts = posts.filter((p) => p.status === 'draft');
  const posted = posts.filter((p) => p.status === 'posted');
  const upcoming = [...scheduled]
    .filter((p) => p.scheduledAt && new Date(p.scheduledAt) >= new Date())
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))[0];

  return {
    scheduledCount: scheduled.length,
    draftCount: drafts.length,
    postedCount: posted.length,
    connectedCount: connectionsCount,
    nextPost: upcoming || scheduled[0] || null,
    recentPosts: posts.slice(0, 5),
  };
}

async function getConnectionCount() {
  const { count } = await supabase
    .from('connections')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'connected');
  return count || 0;
}

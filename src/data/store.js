import { scheduledPosts as demoScheduledPosts } from './mock';

const STORAGE_KEY = 'postadoria-posts';

export function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getAllPosts() {
  const userPosts = loadPosts();
  // Merge: if user has created posts, show those + demo as fallback for empty states
  if (userPosts.length > 0) return userPosts;
  return demoScheduledPosts;
}

export function addPost(post) {
  const posts = loadPosts();
  const newPost = {
    ...post,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function getStats(connectedCount = 6) {
  const posts = getAllPosts();
  const scheduled = posts.filter((p) => p.status === 'scheduled');
  const drafts = posts.filter((p) => p.status === 'draft');
  const posted = posts.filter((p) => p.status === 'posted');
  const sorted = [...posts].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.find(
    (p) => p.status === 'scheduled' && new Date(p.date + 'T' + (p.time || '00:00')) >= new Date(),
  );

  return {
    scheduledCount: scheduled.length,
    draftCount: drafts.length,
    postedCount: posted.length,
    connectedCount,
    nextPost: upcoming || scheduled[0] || null,
    recentPosts: sorted.slice(0, 5),
  };
}

// POST /api/publish  — Body: { postId }
// Publishes a post immediately (publish-now). Verifies caller owns the post.
import { getUserFromRequest, admin } from './_lib/supabaseAdmin.js';
import { publishPost } from './_lib/publish.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { postId } = req.body || {};
  if (!postId) return res.status(400).json({ error: 'postId required' });

  // Ownership check.
  const { data: post } = await admin.from('posts').select('user_id').eq('id', postId).single();
  if (!post || post.user_id !== user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const summary = await publishPost(postId);
    return res.status(200).json(summary);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

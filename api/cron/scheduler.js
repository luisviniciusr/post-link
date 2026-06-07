// GET /api/cron/scheduler — invoked by Vercel Cron.
// Finds scheduled posts whose time has arrived and publishes them.
import { admin } from '../_lib/supabaseAdmin.js';
import { publishPost } from '../_lib/publish.js';

export default async function handler(req, res) {
  // Vercel Cron sends a secret header; reject anything else in production.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.headers['authorization'] || '';
    if (provided !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const nowIso = new Date().toISOString();
  const { data: due, error } = await admin
    .from('posts')
    .select('id')
    .eq('status', 'scheduled')
    .lte('scheduled_at', nowIso);

  if (error) return res.status(500).json({ error: error.message });

  const results = [];
  for (const post of due || []) {
    try {
      const summary = await publishPost(post.id);
      results.push(summary);
    } catch (err) {
      results.push({ postId: post.id, status: 'failed', error: err.message });
    }
  }

  return res.status(200).json({ processed: results.length, results });
}

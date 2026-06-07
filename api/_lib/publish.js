// Shared publish logic — publishes one post to all its targets.
// Used by /api/publish (publish-now) and /api/cron/scheduler (scheduled).
import { admin } from './supabaseAdmin.js';
import { bskyPost } from '../_platforms/bluesky.js';

// Map platform -> publish function. Add more as platforms are approved.
const publishers = {
  bluesky: async (connection, caption) => {
    const { identifier, appPassword } = connection.credentials || {};
    const result = await bskyPost({ identifier, appPassword, text: caption });
    return result.uri; // remote_id
  },
};

// Publishes a single post (by id) to every target. Returns a summary.
export async function publishPost(postId) {
  // Load post + targets + their connections.
  const { data: post, error: postErr } = await admin
    .from('posts')
    .select('*, post_targets(*)')
    .eq('id', postId)
    .single();
  if (postErr || !post) throw new Error('Post not found');

  await admin.from('posts').update({ status: 'publishing' }).eq('id', postId);

  const results = [];
  for (const target of post.post_targets) {
    try {
      const publisher = publishers[target.platform];
      if (!publisher) {
        throw new Error(`${target.platform} not yet supported for publishing`);
      }

      // Load the connection (has credentials).
      const { data: connection } = await admin
        .from('connections')
        .select('*')
        .eq('id', target.connection_id)
        .single();
      if (!connection) throw new Error('Connection not found');

      const caption = target.caption || post.master_caption || '';
      const remoteId = await publisher(connection, caption);

      await admin
        .from('post_targets')
        .update({ status: 'posted', remote_id: remoteId, posted_at: new Date().toISOString(), error: null })
        .eq('id', target.id);
      results.push({ platform: target.platform, ok: true, remoteId });
    } catch (err) {
      await admin
        .from('post_targets')
        .update({ status: 'failed', error: err.message })
        .eq('id', target.id);
      results.push({ platform: target.platform, ok: false, error: err.message });
    }
  }

  // Roll up final post status.
  const anyOk = results.some((r) => r.ok);
  const allOk = results.every((r) => r.ok);
  const finalStatus = allOk ? 'posted' : anyOk ? 'posted' : 'failed';
  await admin
    .from('posts')
    .update({ status: finalStatus, updated_at: new Date().toISOString() })
    .eq('id', postId);

  return { postId, status: finalStatus, results };
}

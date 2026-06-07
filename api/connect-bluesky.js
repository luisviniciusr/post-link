// POST /api/connect-bluesky
// Body: { identifier, appPassword }
// Verifies Bluesky credentials, then stores the connection for the user.
import { getUserFromRequest, admin } from './_lib/supabaseAdmin.js';
import { bskyVerify } from './_platforms/bluesky.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { identifier, appPassword } = req.body || {};
  if (!identifier || !appPassword) {
    return res.status(400).json({ error: 'identifier and appPassword are required' });
  }

  // 1. Verify the credentials actually work against Bluesky.
  let verified;
  try {
    verified = await bskyVerify({ identifier, appPassword });
  } catch (err) {
    return res.status(400).json({ error: 'Bluesky login failed — check your handle and app password.' });
  }

  // 2. Store the connection (service_role bypasses RLS; we scope by user.id).
  const { data, error } = await admin
    .from('connections')
    .upsert(
      {
        user_id: user.id,
        platform: 'bluesky',
        account_handle: verified.handle,
        account_name: verified.handle,
        credentials: { identifier, appPassword, did: verified.did },
        status: 'connected',
      },
      { onConflict: 'user_id,platform,account_handle' }
    )
    .select('id, platform, account_handle, account_name, status')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ connection: data });
}

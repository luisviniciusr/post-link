import { supabase } from '../lib/supabase';

// ============================================================
// Connections data layer — social account connections
// ============================================================

export async function getConnections() {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[connections] fetch failed:', error.message);
    return [];
  }
  return data || [];
}

// Create/replace a connection. credentials is stored as jsonb.
export async function addConnection({ platform, accountHandle, accountName, credentials }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('connections')
    .upsert(
      {
        user_id: user.id,
        platform,
        account_handle: accountHandle,
        account_name: accountName,
        credentials,
        status: 'connected',
      },
      { onConflict: 'user_id,platform,account_handle' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeConnection(id) {
  const { error } = await supabase.from('connections').delete().eq('id', id);
  if (error) throw error;
}

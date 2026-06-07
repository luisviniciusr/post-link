// Bluesky platform adapter — uses the AT Protocol.
// Runs server-side only (serverless function), never in the browser.
import { AtpAgent } from '@atproto/api';

// Authenticate with a handle + app password, returning a live agent.
export async function bskyLogin({ identifier, appPassword }) {
  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier, password: appPassword });
  return agent;
}

// Verify credentials work (used during connect). Returns the resolved handle/did.
export async function bskyVerify({ identifier, appPassword }) {
  const agent = await bskyLogin({ identifier, appPassword });
  return {
    did: agent.session?.did,
    handle: agent.session?.handle || identifier,
  };
}

// Publish a text post. Returns the post URI + cid.
export async function bskyPost({ identifier, appPassword, text }) {
  const agent = await bskyLogin({ identifier, appPassword });
  const res = await agent.post({
    text: text.slice(0, 300), // Bluesky hard limit is 300 graphemes
    createdAt: new Date().toISOString(),
  });
  return { uri: res.uri, cid: res.cid };
}

export const platformIcons = [
  { id: 'x', name: 'X', color: '#111827', label: 'Twitter/X' },
  { id: 'instagram', name: 'IG', color: '#E1306C', label: 'Instagram' },
  { id: 'linkedin', name: 'in', color: '#0A66C2', label: 'LinkedIn' },
  { id: 'facebook', name: 'f', color: '#1877F2', label: 'Facebook' },
  { id: 'tiktok', name: 'TT', color: '#111827', label: 'TikTok' },
  { id: 'youtube', name: 'YT', color: '#FF0000', label: 'YouTube' },
  { id: 'bluesky', name: 'BS', color: '#0085FF', label: 'Bluesky' },
  { id: 'threads', name: '@', color: '#111827', label: 'Threads' },
  { id: 'pinterest', name: 'P', color: '#E60023', label: 'Pinterest' },
  { id: 'google', name: 'G', color: '#4285F4', label: 'Google Business' },
];

export const platformSupport = {
  x: { postTypes: ['text', 'image', 'video'], formats: ['Text', 'Image', 'Video'] },
  instagram: { postTypes: ['image', 'video', 'story'], formats: ['Image', 'Video', 'Story'] },
  linkedin: {
    postTypes: ['text', 'image', 'video'],
    formats: ['Text', 'Image', 'Video'],
    connectNote: 'Authorize your LinkedIn profile or Company Page. post-link uses the official LinkedIn Marketing API.',
    editorTips: [
      'Lead with a clear insight — LinkedIn rewards professional, value-first posts.',
      'Use line breaks for readability; walls of text get scrolled past.',
      'Add 3–5 relevant hashtags at the end (not in the first line).',
      'Native video and document carousels work on profiles and Company Pages.',
    ],
    uploadNotes: {
      video: 'MP4 up to 10 min · 16:9 or 1:1 recommended for feed video.',
      image: 'Single image or PDF carousel · up to 100MB for documents.',
      text: 'Optional image or link preview attachment supported.',
    },
  },
  facebook: { postTypes: ['text', 'image', 'video', 'story'], formats: ['Text', 'Image', 'Video', 'Story'] },
  tiktok: { postTypes: ['image', 'video'], formats: ['Image', 'Video'] },
  youtube: { postTypes: ['video'], formats: ['Video'] },
  bluesky: { postTypes: ['text', 'image'], formats: ['Text', 'Image'] },
  threads: { postTypes: ['text', 'image'], formats: ['Text', 'Image'] },
  pinterest: { postTypes: ['image'], formats: ['Image'] },
  google: { postTypes: ['image'], formats: ['Image'] },
};

export const connectedAccounts = [
  { id: '1', platformId: 'instagram', handle: '@postlinklab', name: 'Post Link Lab', connected: true },
  { id: '2', platformId: 'tiktok', handle: '@postlinklab', name: 'Post Link Lab', connected: true },
  { id: '3', platformId: 'youtube', handle: '@postlinklab', name: 'Post Link Lab', connected: true },
  { id: '4', platformId: 'x', handle: '@postlinklab', name: 'Post Link Lab', connected: true },
  {
    id: '5',
    platformId: 'linkedin',
    handle: 'linkedin.com/in/postlinklab',
    name: 'Post Link Lab',
    pageType: 'Profile',
    connected: true,
  },
  { id: '6', platformId: 'facebook', handle: 'Post Link Lab', name: 'Facebook Page', connected: true },
  { id: '7', platformId: 'linkedin', handle: 'linkedin.com/company/postlinklab', name: 'Post Link Lab Company', pageType: 'Company Page', connected: false },
];

export const scheduledPosts = [
  {
    id: 'p1',
    title: 'Weekly product update reel',
    caption: 'New features shipped this week — swipe to see what changed.',
    status: 'scheduled',
    date: '2026-06-05',
    time: '14:30',
    platforms: ['instagram', 'tiktok', 'youtube', 'x', 'linkedin'],
  },
  {
    id: 'p2',
    title: 'Founder thread',
    caption: 'Three lessons from launching our beta in public.',
    status: 'scheduled',
    date: '2026-06-06',
    time: '09:00',
    platforms: ['x', 'linkedin', 'threads'],
  },
  {
    id: 'p3',
    title: 'Customer story carousel',
    caption: 'How one team cut posting time in half with post-link.',
    status: 'draft',
    date: '2026-06-08',
    time: '12:00',
    platforms: ['instagram', 'facebook', 'linkedin'],
  },
  {
    id: 'p4',
    title: 'Launch recap',
    caption: 'Thank you for 1k signups in week one.',
    status: 'posted',
    date: '2026-06-01',
    time: '18:00',
    platforms: ['x', 'instagram', 'linkedin', 'facebook', 'tiktok'],
  },
];

export function getPlatform(id) {
  return platformIcons.find((p) => p.id === id);
}

export function platformSupportsType(platformId, postType) {
  return platformSupport[platformId]?.postTypes.includes(postType) ?? false;
}

export function getAccountsForPostType(postType, accounts = connectedAccounts) {
  return accounts.filter(
    (account) => account.connected !== false && platformSupportsType(account.platformId, postType),
  );
}

export function getPlatformMeta(platformId) {
  return platformSupport[platformId] ?? null;
}

export function getConnectedAccounts(accounts = connectedAccounts) {
  return accounts.filter((account) => account.connected !== false);
}

export function getDashboardStats() {
  const scheduled = scheduledPosts.filter((post) => post.status === 'scheduled');
  const drafts = scheduledPosts.filter((post) => post.status === 'draft');
  const posted = scheduledPosts.filter((post) => post.status === 'posted');

  return {
    scheduledCount: scheduled.length,
    draftCount: drafts.length,
    postedCount: posted.length,
    connectedCount: getConnectedAccounts().length,
    nextPost: scheduled.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0] ?? null,
    recentPosts: [...scheduledPosts]
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
      .slice(0, 3),
  };
}

export const contextTips = [
  'Write once in the editor, then tweak captions per platform before you link and publish.',
  'Batch your week on Sunday — most creators schedule 5–8 posts in one sitting.',
  'Groups on Connections let you pick “Brand” vs “Personal” accounts in one click.',
  'Drafts autosave while you compose. Nothing disappears if you close the tab.',
];

export const platformCaptionLimits = {
  x: 280,
  instagram: 2200,
  linkedin: 3000,
  facebook: 63206,
  tiktok: 2200,
  youtube: 5000,
  bluesky: 300,
  threads: 500,
  pinterest: 500,
  google: 1500,
};

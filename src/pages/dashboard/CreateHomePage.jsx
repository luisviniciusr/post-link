import { Link } from 'react-router-dom';
import { ArrowRight, Image, Sparkles, Type, Video } from 'lucide-react';
import { getPlatform } from '../../data/mock';

const postTypes = [
  {
    slug: 'text',
    label: 'Text',
    description: 'Threads, updates, and short takes',
    icon: Type,
    platforms: ['facebook', 'x', 'linkedin', 'threads', 'bluesky'],
  },
  {
    slug: 'image',
    label: 'Image',
    description: 'Carousels, photos, and graphics',
    icon: Image,
    platforms: ['instagram', 'pinterest', 'facebook', 'x', 'linkedin', 'tiktok'],
  },
  {
    slug: 'video',
    label: 'Video',
    description: 'Reels, shorts, and long-form clips',
    icon: Video,
    platforms: ['instagram', 'tiktok', 'youtube', 'facebook', 'linkedin', 'x'],
    featured: true,
  },
  {
    slug: 'story',
    label: 'Story',
    description: 'Ephemeral vertical content',
    icon: Sparkles,
    platforms: ['instagram', 'facebook'],
  },
];

export default function CreateHomePage() {
  const featured = postTypes.find((type) => type.featured) ?? postTypes[2];

  return (
    <div className="dash-page create-home">
      <header className="create-home-head">
        <div>
          <h1>What are you linking today?</h1>
          <p className="dash-muted">Pick a format. We will show only the platforms that support it.</p>
        </div>
      </header>

      <Link to={`/app/create/${featured.slug}`} className="create-featured dash-panel">
        <div className="create-featured-icon"><Video size={22} /></div>
        <div>
          <strong>Start with video</strong>
          <p>Most creators schedule reels and shorts first — captions sync across six platforms.</p>
        </div>
        <span className="create-featured-cta">Open editor <ArrowRight size={14} /></span>
      </Link>

      <div className="post-type-rail">
        {postTypes.map(({ slug, label, description, icon: Icon, platforms }) => (
          <Link key={slug} to={`/app/create/${slug}`} className="post-type-pill">
            <Icon size={18} />
            <div>
              <strong>{label}</strong>
              <span>{description}</span>
            </div>
            <div className="post-type-platforms compact">
              {platforms.slice(0, 4).map((id) => {
                const platform = getPlatform(id);
                return (
                  <span key={id} className="platform-icon tiny muted" title={platform.label}>
                    {platform.name}
                  </span>
                );
              })}
              {platforms.length > 4 && <span className="platform-more">+{platforms.length - 4}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

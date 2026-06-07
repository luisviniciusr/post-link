import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FilePlus2 } from 'lucide-react';
import { getAllPosts } from '../../data/store';
import { getPlatform } from '../../data/mock';
import PostsFilterNav from '../../components/dashboard/PostsFilterNav';

const emptyCopy = {
  all: 'No posts yet. Compose once and link it everywhere.',
  scheduled: 'Nothing in the queue. Batch a few posts and schedule them in one go.',
  posted: 'Published posts will show up here after your first send.',
  drafts: 'Drafts you save while composing land here.',
};

export default function PostsPage() {
  const { filter } = useParams();
  const mode = filter || 'all';

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then(setAllPosts);
  }, []);

  const posts = allPosts.filter((post) => {
    if (mode === 'all') return true;
    if (mode === 'scheduled') return post.status === 'scheduled';
    if (mode === 'posted') return post.status === 'posted';
    if (mode === 'drafts') return post.status === 'draft';
    return true;
  });

  if (mode === 'calendar') {
    return null;
  }

  return (
    <div className="dash-page posts-page">
      <header className="posts-page-head">
        <div>
          <h1>Your posts</h1>
          <p className="dash-muted">One timeline for drafts, scheduled sends, and published history.</p>
        </div>
        <Link to="/app/create" className="button primary small"><FilePlus2 size={14} /> Compose</Link>
      </header>

      <PostsFilterNav active={mode} />

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state dash-panel">
            <p>{emptyCopy[mode] || emptyCopy.all}</p>
            <Link to="/app/create" className="button primary small">Create a post</Link>
          </div>
        ) : posts.map((post) => (
          <article className="post-row" key={post.id}>
            <div>
              <div className="post-row-top">
                <strong>{post.title}</strong>
                <span className={`status-pill ${post.status}`}>{post.status}</span>
              </div>
              <p>{post.caption}</p>
              <div className="calendar-platforms">
                {post.platforms.map((platformId) => {
                  const platform = getPlatform(platformId);
                  return <span key={platformId} style={{ backgroundColor: platform.color }}>{platform.label}</span>;
                })}
              </div>
            </div>
            <div className="post-row-meta">
              <strong>{post.date}</strong>
              <span>{post.time}</span>
              <button type="button" className="button ghost small">Edit</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

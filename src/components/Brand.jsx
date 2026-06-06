import { Link } from 'react-router-dom';

export default function Brand({ linkTo = null }) {
  const content = (
    <span className="brand">
      post<span className="brand-accent">-link</span>
    </span>
  );

  if (linkTo) {
    return (
      <Link className="brand-link" to={linkTo} aria-label="post-link home">
        {content}
      </Link>
    );
  }

  return content;
}

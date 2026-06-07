import { Link } from 'react-router-dom';

export default function Brand({ linkTo = null }) {
  const content = (
    <span className="brand">
      post<span className="brand-accent">adoria</span>
    </span>
  );

  if (linkTo) {
    return (
      <Link className="brand-link" to={linkTo} aria-label="postadoria home">
        {content}
      </Link>
    );
  }

  return content;
}

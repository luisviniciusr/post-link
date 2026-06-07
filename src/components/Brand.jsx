import { Link } from 'react-router-dom';

export default function Brand({ linkTo = null }) {
  // "postador" carries the left→right gradient; "ia" (inteligência artificial / AI)
  // gets a subtle highlight + tooltip to hint at the AI angle.
  const content = (
    <span className="brand">
      <span className="brand-grad">postador</span>
      <span className="brand-ia" title="ia — inteligência artificial / AI">ia</span>
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

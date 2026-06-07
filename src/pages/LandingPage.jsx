import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Link2,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { platformSupport, platformIcons } from '../data/mock';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';


const featuredOn = ['Starter Story', 'Product Hunt', 'Indie Hackers', 'Hacker News'];

const heroPhrases = [
  'to link LinkedIn, Instagram, and X in one flow',
  'to batch their whole week in under an hour',
  'fair pricing without agency bloat',
];

const featureSections = [
  {
    tag: 'CROSS-POSTING',
    title: 'Post to all platforms instantly',
    body: 'Publish everywhere in minutes, not hours. Manage personal and brand accounts without switching apps. Connect once, pick destinations, and ship from a single workflow.',
    cta: 'Start posting',
    secondary: 'View platforms',
    preview: 'compose',
  },
  {
    tag: 'SCHEDULING',
    title: 'Schedule posts effortlessly',
    body: 'Plan ahead, queue content, and customize captions per platform. Set the timing once and let postadoria handle distribution while you focus on creating.',
    cta: 'Start scheduling',
    secondary: 'View demo',
    preview: 'calendar',
  },
  {
    tag: 'CONTENT MANAGEMENT',
    title: 'Manage content efficiently',
    body: 'See scheduled, published, and draft posts in one timeline. Track what went live, edit what is coming up, and stay on top of your content plan.',
    cta: 'Get started',
    secondary: 'See pricing',
    preview: 'timeline',
  },
  {
    tag: 'CONTENT STUDIO',
    title: 'Create videos easily',
    body: 'Use starter templates and a simple editor to turn raw clips into platform-ready posts without opening a separate design tool.',
    cta: 'Try studio',
    secondary: 'View examples',
    preview: 'studio',
  },
];

const testimonials = [
  { quote: 'I batch a full week of posts in under an hour now. That used to eat my Sundays.', name: 'Maya Chen', handle: '@mayacreates' },
  { quote: 'Clean UI, no enterprise bloat. Exactly what a solo founder needs.', name: 'Tom Reyes', handle: '@tombuilds' },
  { quote: 'We run three brand accounts without three separate tools. Huge time saver.', name: 'Priya Nair', handle: '@priyagrowth' },
  { quote: 'Scheduling across platforms finally feels straightforward.', name: 'Alex Kim', handle: '@alexkimstudio' },
  { quote: 'Fair pricing and it just works. Rare combo for social tools.', name: 'Jordan Lee', handle: '@jordanlee' },
  { quote: 'My team reviews drafts in one place instead of scattered screenshots.', name: 'Sam Ortiz', handle: '@samortiz' },
  { quote: 'The UI is as simple as adding an event to a calendar.', name: 'Fabian Ruiz', handle: '@fabianbuilds' },
  { quote: 'Best price-to-quality ratio I have found for multi-platform posting.', name: 'Fer Alvarez', handle: '@fer_chvs' },
  { quote: 'postadoria saves me at least an hour every day.', name: 'Noah Park', handle: '@noahpark' },
  { quote: 'Finally a scheduler that does not feel like enterprise software.', name: 'Elena Moss', handle: '@elenamoss' },
];

const faqs = [
  {
    q: 'Why switch from Buffer or Hootsuite?',
    a: 'postadoria focuses on the workflow most creators actually need: connect accounts, prepare one post, adapt per platform, and schedule. No bloated dashboards or pricing tiers built for agencies you are not running.',
  },
  {
    q: 'What social platforms do you support?',
    a: 'Instagram, TikTok, YouTube, X, LinkedIn, Facebook, Pinterest, Threads, Bluesky, and Google Business — with more integrations on the roadmap.',
  },
  {
    q: 'How many social accounts can I connect?',
    a: 'Free trial includes 3 accounts. Starter includes 8. Team includes unlimited connected accounts and shared workspaces.',
  },
  {
    q: 'What is a social account?',
    a: 'One connected profile on a supported platform. Connecting your Instagram and your TikTok counts as two social accounts.',
  },
  {
    q: 'Can I connect multiple accounts on the same platform?',
    a: 'Yes. You can connect several accounts per platform depending on your plan limits.',
  },
  {
    q: 'How many posts can I schedule per month?',
    a: 'Paid plans include unlimited scheduled posts. Free trial includes up to 5 scheduled posts to explore the workflow.',
  },
  {
    q: 'What types of content can I post?',
    a: 'Videos, images, text posts, carousels, and short-form clips. Platform-specific limits still apply based on each network’s rules.',
  },
  {
    q: 'Will scheduled posts get less reach?',
    a: 'Reach depends on the platform and your content — not the scheduling tool. postadoria publishes through official platform APIs the same way other reputable schedulers do.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel whenever you want and keep access through the end of your billing period.',
  },
  {
    q: 'Can I get a refund?',
    a: 'You can request a refund within 7 days of being charged. Email support and we will help.',
  },
  {
    q: 'Do I need to share my passwords?',
    a: 'No. Accounts connect through each platform’s official authorization flow.',
  },
  {
    q: 'I have another question',
    a: 'Reach us at hello@postadoria.com — we reply quickly.',
  },
];

const footerLinks = {
  product: ['Support', 'Pricing', 'Blog', 'Affiliates', 'Billing'],
  automation: ['AI Agents', 'API', 'Webhooks', 'Integrations'],
  schedulers: platformIcons.map((p) => `${p.label} scheduler`),
  tools: [
    'Growth Guide',
    'Caption templates',
    'Hashtag sets',
    'Best-time suggestions',
    'Media library',
    'Post preview',
  ],
  legal: ['Terms of service', 'Privacy policy'],
};

function Brand() {
  return (
    <span className="brand">
      <span className="brand-grad">postador</span>
      <span className="brand-ia" title="ia — inteligência artificial / AI">ia</span>
    </span>
  );
}

function Header({ menuOpen, setMenuOpen }) {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    setMenuOpen(false);
    navigate('/signin');
  }

  return (
    <header className="header">
      <Link className="brand-link" to="/" aria-label="postadoria home">
        <Brand />
      </Link>
      <nav className="nav" aria-label="Main">
        <a href="#demo">Demo</a>
        <a href="#features">Features</a>
        <a href="#platforms">Platforms</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        {isAuthenticated ? (
          <>
            <Link className="ghost-link" to="/app">Dashboard</Link>
            <button type="button" className="button ghost header-signout" onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <Link className="ghost-link" to="/signin">Sign in</Link>
            <Link className="button primary header-cta" to="/signin">Start free trial</Link>
          </>
        )}
        <button type="button" className="menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-top">
              <Brand />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={22} /></button>
            </div>
            <a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#platforms" onClick={() => setMenuOpen(false)}>Platforms</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            {isAuthenticated ? (
              <>
                <Link to="/app" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button type="button" className="mobile-signout" onClick={handleSignOut}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link className="button primary full" to="/signin" onClick={() => setMenuOpen(false)}>Start free trial</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function PlatformRow({ large, small }) {
  return (
    <div className={`platform-row ${large ? 'large' : ''} ${small ? 'small' : ''}`}>
      {platformIcons.map((platform) => (
        <span
          key={platform.label}
          className="platform-icon"
          style={{ backgroundColor: platform.color }}
          title={platform.label}
        >
          {platform.name}
        </span>
      ))}
    </div>
  );
}

function TypingSubtitle() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = heroPhrases[index];
    let delay;

    if (!deleting && text === phrase) {
      // Fully typed — hold so it's comfortable to read, then start deleting
      delay = 2200;
    } else if (deleting && text.length === 0) {
      // Fully deleted — brief beat before the next phrase
      delay = 500;
    } else {
      // Typing is a touch slower than deleting; both eased for calm motion
      delay = deleting ? 35 : 75;
    }

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text === phrase) {
          setDeleting(true);
        } else {
          setText(phrase.slice(0, text.length + 1));
        }
      } else if (text.length === 0) {
        setDeleting(false);
        setIndex((current) => (current + 1) % heroPhrases.length);
      } else {
        setText(phrase.slice(0, text.length - 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <p className="hero-sub">
      <span className="hero-sub-prefix">Built for creators who want</span>
      <span className="typing">{text}</span>
      <span className="typing-cursor" aria-hidden="true">|</span>
    </p>
  );
}

const heroPlatforms = [
  platformIcons.find((p) => p.id === 'linkedin'),
  platformIcons.find((p) => p.id === 'instagram'),
  platformIcons.find((p) => p.id === 'x'),
  platformIcons.find((p) => p.id === 'tiktok'),
  platformIcons.find((p) => p.id === 'youtube'),
].filter(Boolean);

function HeroMock() {
  return (
    <div className="hero-mock" aria-hidden="true">
      <div className="hero-mock-glow" />
      <div className="hero-mock-window">
        <div className="hero-mock-top">
          <div className="hero-mock-dots">
            <span /><span /><span />
          </div>
          <span className="hero-mock-title">Compose · postadoria</span>
          <span className="hero-mock-badge">Live preview</span>
        </div>

        <div className="hero-mock-body">
          <div className="hero-mock-caption">
            <span className="hero-mock-label">Master caption</span>
            <p>Shipped three features this week — here&apos;s what changed for creators scheduling across platforms…</p>
          </div>

          <div className="hero-mock-link-row">
            <span className="hero-mock-label"><Link2 size={12} /> Linking to</span>
            <div className="hero-mock-platforms">
              {heroPlatforms.map((platform) => (
                <span
                  key={platform.id}
                  className="hero-mock-platform"
                  style={{ '--platform-color': platform.color }}
                  title={platform.label}
                >
                  {platform.name}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-mock-cards">
            {heroPlatforms.slice(0, 3).map((platform) => (
              <div key={platform.id} className="hero-mock-card">
                <span className="platform-icon tiny" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                <strong>{platform.label}</strong>
                <em>Synced · Jun 5, 2:30 PM</em>
              </div>
            ))}
          </div>

          <div className="hero-mock-footer">
            <span><CalendarDays size={14} /> Scheduled for 5 platforms</span>
            <span className="hero-mock-pill">Link & publish</span>
          </div>
        </div>
      </div>

      <div className="hero-mock-float hero-mock-float-a">
        <Check size={14} /> LinkedIn ready
      </div>
      <div className="hero-mock-float hero-mock-float-b">
        <Sparkles size={14} /> 1 caption → 5 posts
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">Write once · link everywhere</span>
          <h1>
            Schedule once.
            <span className="hero-accent"> Link</span> it everywhere.
          </h1>
          <TypingSubtitle />
          <div className="hero-actions">
            <Link className="button primary hero-cta" to="/signin">
              Start free trial <ArrowRight size={18} />
            </Link>
            <a className="button ghost hero-secondary" href="#demo">
              <Play size={16} fill="currentColor" /> See it in action
            </a>
          </div>
          <ul className="hero-checklist">
            <li><Check size={16} /> LinkedIn, Instagram, X, TikTok &amp; more</li>
            <li><Check size={16} /> Per-platform captions from one draft</li>
            <li><Check size={16} /> From $9/mo · no password sharing</li>
          </ul>
          <div className="hero-proof">
            <span>Featured on</span>
            {featuredOn.slice(0, 3).map((name) => (
              <em key={name}>{name}</em>
            ))}
          </div>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function VideoMock({ variant }) {
  const labels = {
    compose: 'Compose once, publish everywhere',
    calendar: 'Drag posts onto your calendar',
    timeline: 'Track drafts, scheduled, and live posts',
    studio: 'Template-based video editing',
    demo: 'See postadoria in 2 minutes',
  };

  return (
    <div className={`video-mock ${variant}`}>
      <div className="video-mock-screen">
        <button type="button" className="video-play" aria-label="Play preview"><Play size={22} fill="currentColor" /></button>
        <span>{labels[variant] || 'Product preview'}</span>
      </div>
    </div>
  );
}

function FeaturePreview({ section }) {
  return <VideoMock variant={section.preview} />;
}

function CtaStrip() {
  return (
    <section className="cta-strip">
      <Link className="button primary" to="/signin">Start free trial <ArrowRight size={18} /></Link>
    </section>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen(!open)}>
        {question}
        <ChevronDown size={18} />
      </button>
      {open && <p className="faq-answer">{answer}</p>}
    </div>
  );
}

function TestimonialCarousel() {
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-carousel-wrap">
      <div className="testimonial-carousel">
        {loop.map((item, index) => (
          <blockquote className="testimonial-card" key={`${item.handle}-${index}`}>
            <p>&ldquo;{item.quote}&rdquo;</p>
            <footer>
              <strong>{item.name}</strong>
              <span>{item.handle}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer" id="signin">
      <div className="footer-top">
        <div className="footer-brand-block">
          <Link className="brand-link" to="/"><Brand /></Link>
          <p>Post to multiple social platforms from one workspace. Cross-posting without the chaos.</p>
          <a className="chat-link" href="mailto:hello@postadoria.com">
            <MessageCircle size={16} /> Chat with us
          </a>
        </div>
        <div className="footer-columns">
          <div>
            <h4>Product</h4>
            {footerLinks.product.map((link) => <a key={link} href="#pricing">{link}</a>)}
          </div>
          <div>
            <h4>Automation</h4>
            {footerLinks.automation.map((link) => <a key={link} href="#api">{link}</a>)}
          </div>
          <div>
            <h4>Schedulers</h4>
            {footerLinks.schedulers.slice(0, 6).map((link) => <a key={link} href="#platforms">{link}</a>)}
          </div>
          <div>
            <h4>Free tools</h4>
            {footerLinks.tools.slice(0, 6).map((link) => <a key={link} href="#features">{link}</a>)}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-legal">
          {footerLinks.legal.map((link) => <a key={link} href="#top">{link}</a>)}
        </div>
        <p className="copyright">© 2026 postadoria — All rights reserved</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const [yearly, setYearly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const starterPrice = yearly ? 90 : 9;
  const teamPrice = yearly ? 190 : 19;

  return (
    <div className="site" id="top">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <HeroSection />

      <section className="section demo-section" id="demo">
        <VideoMock variant="demo" />
      </section>

      <section className="section features" id="features">
        {featureSections.map((section, index) => (
          <article className={`feature-block ${index % 2 === 1 ? 'reverse' : ''}`} key={section.tag}>
            <div className="feature-copy">
              <span className="section-tag">{section.tag}</span>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              <div className="feature-actions">
                <a className="button primary" href="#pricing">{section.cta}</a>
                <a className="button ghost" href={section.secondary.includes('platform') ? '#platforms' : '#demo'}>{section.secondary}</a>
              </div>
            </div>
            <FeaturePreview section={section} />
          </article>
        ))}
      </section>

      <section className="section stats-block">
        <div className="stats-grid">
          <div className="stat-item">
            <strong>10</strong>
            <span>Social platforms supported</span>
          </div>
          <div className="stat-item">
            <strong>48k+</strong>
            <span>Posts scheduled by users</span>
          </div>
          <div className="stat-item">
            <strong>5 min</strong>
            <span>Average weekly batch time</span>
          </div>
        </div>
      </section>

      <CtaStrip />

      <section className="section testimonials">
        <h2>postadoria is loved by creators. Here&apos;s what they are saying.</h2>
        <TestimonialCarousel />
      </section>

      <CtaStrip />

      <section className="section founder" id="story">
        <div className="founder-card">
          <div className="founder-avatar">PL</div>
          <div>
            <h2>Built out of frustration, not a pitch deck</h2>
            <p className="founder-tag">Why we made postadoria</p>
            <p>
              We were tired of opening six apps, rewriting the same caption, and losing an hour every day
              just to stay visible. Existing tools were either too expensive or too complicated for what we needed.
            </p>
            <p>
              postadoria is the tool we wished existed: one place to prepare content, adapt it per platform,
              and schedule it — without enterprise pricing or a steep learning curve.
            </p>
            <Link className="button primary" to="/signin">Try postadoria free</Link>
          </div>
        </div>
      </section>

      <section className="section platforms" id="platforms">
        <h2>Supported platforms</h2>
        <p>Connect the channels you already use and manage them from one workspace.</p>
        <div className="platform-grid">
          {platformIcons.map((platform) => (
            <div className={`platform-tile ${platform.id === 'linkedin' ? 'featured-platform' : ''}`} key={platform.label}>
              <span className="platform-icon small" style={{ backgroundColor: platform.color }}>{platform.name}</span>
              <h3>{platform.label}</h3>
              {platformSupport[platform.id]?.formats && (
                <p className="platform-formats">{platformSupport[platform.id].formats.join(' · ')}</p>
              )}
            </div>
          ))}
          <div className="platform-tile muted">
            <span className="platform-icon small more">+</span>
            <h3>More coming soon</h3>
          </div>
        </div>
      </section>

      <section className="section api" id="api">
        <div className="api-card">
          <span className="section-tag">Developer API</span>
          <h2>Build with postadoria</h2>
          <p>
            Integrate multi-platform posting into your apps and workflows, or connect AI assistants
            to schedule content programmatically. Built for agencies, internal tools, and automation.
          </p>
          <p className="api-price">From $5/month · Requires active Team subscription</p>
          <div className="feature-actions">
            <a className="button ghost" href="#api">View API docs</a>
            <a className="button primary" href="#pricing">Get API keys</a>
          </div>
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <span className="section-tag">Pricing</span>
        <h2>Get more reach, with less effort.</h2>
        <div className="billing-toggle">
          <button type="button" className={!yearly ? 'active' : ''} onClick={() => setYearly(false)}>Monthly</button>
          <button type="button" className={yearly ? 'active' : ''} onClick={() => setYearly(true)}>Yearly <em>2 months free</em></button>
        </div>
        <div className="pricing-grid three-up">
          <article className="price-card">
            <h3>Free trial</h3>
            <p className="price-desc">Try the full workflow</p>
            <div className="price-amount">$0<span>/14 days</span></div>
            <ul>
              {['3 connected accounts', '5 scheduled posts', 'All core features', 'No card required'].map((item) => (
                <li key={item}><Check size={16} /> {item}</li>
              ))}
            </ul>
            <Link className="button ghost full" to="/signin">Start free trial →</Link>
          </article>
          <article className="price-card popular">
            <div className="price-badge">Most popular</div>
            <h3>Starter</h3>
            <p className="price-desc">For solo creators getting consistent</p>
            <div className="price-amount">${starterPrice}<span>/month</span></div>
            <ul>
              {['8 connected accounts', 'Multiple accounts per platform', 'Unlimited posts', 'Schedule posts', 'Caption variants', 'Draft library', 'Email support'].map((item) => (
                <li key={item}><Check size={16} /> {item}</li>
              ))}
            </ul>
            <button type="button" className="button primary full">Start 14-day trial →</button>
            <p className="price-note">$0.00 due today, cancel anytime</p>
          </article>
          <article className="price-card">
            <div className="price-badge deal">Best for teams</div>
            <h3>Team</h3>
            <p className="price-desc">For brands and small marketing teams</p>
            <div className="price-amount">${teamPrice}<span>/month</span></div>
            <ul>
              {['Unlimited connected accounts', 'Shared workspaces', 'Review & approval flow', 'Template library', 'Priority support', 'API add-on available'].map((item) => (
                <li key={item}><Check size={16} /> {item}</li>
              ))}
            </ul>
            <button type="button" className="button primary full">Start 14-day trial →</button>
            <p className="price-note">Cancel anytime</p>
          </article>
        </div>
        <div className="post-to-row">
          <span>Post to:</span>
          <PlatformRow small />
        </div>
      </section>

      <section className="section faq" id="faq">
        <span className="section-tag">FAQ</span>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((item) => <FaqItem key={item.q} question={item.q} answer={item.a} />)}
        </div>
      </section>

      <section className="section cta-final">
        <h2>Ready to get started?</h2>
        <p>Join creators and founders who save hours every week with postadoria. Start your free trial today.</p>
        <a className="button primary" href="#pricing">Start free trial</a>
      </section>

      <Footer />
    </div>
  );
}

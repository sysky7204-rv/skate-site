import { useState, useEffect } from 'react';
import { Play, AtSign, Film, MapPin, ArrowRight, Menu, X, Quote } from 'lucide-react';
import './App.css';
import skaterData from './data/skaterData.json';

/* ============================================================
   GRITTY — Single Skater Brand / Story Page
   Longform magazine-style layout inspired by
   "Gritty Culture Blog & Community" (Figma).
   ============================================================ */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1600&q=80';

const GALLERY_IMAGES = [];

function App() {
  const [skater, setSkater] = useState(skaterData);

  useEffect(() => {
    fetch(`${API_BASE}/api/skaters/1`)
      .then(res => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then(data => {
        const merged = { ...skaterData, ...data };
        setSkater(merged);
      })
      .catch(() => {
        console.log('API not available, using local data');
      });
  }, []);

  const YT_VIDEO_ID = skater.videos?.[0]?.id || skaterData.videos[0].id;

  return (
    <div className="app">
      <div className="grain-overlay" />
      <Nav />
      <Hero skater={skater} />
      <Story skater={skater} />
      <YouTubeGallery skater={skater} />
      <Lessons skater={skater} />
      <Career skater={skater} />
      <FeaturedVideo videoId={YT_VIDEO_ID} />
      <StatsStrip skater={skater} />
      <Footer skater={skater} videoId={YT_VIDEO_ID} />
    </div>
  );
}

/* ============== LESSONS (Soomgo) ============== */
function Lessons({ skater }) {
  const { lessons } = skater;

  return (
    <section id="lessons" className="lessons">
      <div className="lessons__container">
        <div className="section-label">
          <span className="mono-label">03 — 레슨</span>
          <div className="section-label__line" />
        </div>

        <h2 className="lessons__title display-lg">
          스케이트보드 레슨
        </h2>

        <p className="lessons__desc">
          {lessons.description}
        </p>

        <div className="lessons__pricing">
          <div className="lessons__price">
            <span className="mono-label">가격</span>
            <span className="lessons__pricevalue">{lessons.price}</span>
            <span className="lessons__pricenote">{lessons.groupPrice}</span>
          </div>
          <div className="lessons__cta">
            <a
              href={skater.soomgoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              레슨 문의하기 <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="lessons__qa">
          <h3 className="lessons__qahead">자주 묻는 질문</h3>
          {lessons.qa.map((item, i) => (
            <div key={i} className="lessons__qaitem">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============== YOUTUBE GALLERY ============== */
function YouTubeGallery({ skater }) {
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (videoId) => {
    setFailedImages(prev => ({ ...prev, [videoId]: true }));
  };

  const topVideos = (skater.videos || [])
    .filter(video => !failedImages[video.id])
    .sort((a, b) => {
      const viewsA = parseInt(a.views.replace(/,/g, ''));
      const viewsB = parseInt(b.views.replace(/,/g, ''));
      return viewsB - viewsA;
    })
    .slice(0, 6);

  return (
    <section id="videos" className="youtube-gallery">
      <div className="section-label section-label--centered">
        <div className="section-label__line" />
        <span className="mono-label">02 — 영상</span>
        <div className="section-label__line" />
      </div>

      <h2 className="youtube-gallery__title display-lg">
        Video Archive
      </h2>

      <div className="youtube-gallery__grid">
        {topVideos.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
            className="youtube-gallery__item"
          >
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              loading="lazy"
              onError={() => handleImageError(video.id)}
            />
            <div className="youtube-gallery__overlay">
              <Play size={48} />
            </div>
            <div className="youtube-gallery__info">
              <h3>{video.title}</h3>
              <span className="mono-label">{video.views} views · {video.published}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ============== NAV ============== */
function Nav({ skater }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
    >
      <div className="nav__inner">
        <a href="#top" className="nav__logo">
          GRITTY<span>.</span>
        </a>
        <div className="nav__links">
          <a href="#story">Story</a>
          <a href="#videos">Videos</a>
          <a href="#lessons">Lessons</a>
          <a href="#career">Career</a>
          <a href="#culture">Culture</a>
        </div>
        <div className="nav__right">
          <span className="nav__loc mono-label">{skater?.location || skaterData.location}</span>
          <a
            href={`https://instagram.com/${skater?.instagram || skaterData.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="nav__cta"
          >
            <AtSign size={16} />
            <span>Follow</span>
          </a>
          <button
            className="nav__burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav__mobile">
          <a href="#story" onClick={() => setMenuOpen(false)}>Story</a>
          <a href="#videos" onClick={() => setMenuOpen(false)}>Videos</a>
          <a href="#lessons" onClick={() => setMenuOpen(false)}>Lessons</a>
          <a href="#career" onClick={() => setMenuOpen(false)}>Career</a>
          <a href="#culture" onClick={() => setMenuOpen(false)}>Culture</a>
        </div>
      )}
    </nav>
  );
}

/* ============== HERO ============== */
function Hero({ skater }) {
  return (
    <header id="top" className="hero">
      {/* Background image */}
      <div className="hero__bg">
        <img src={HERO_IMAGE} alt="Skater in action" />
        <div className="hero__overlay" />
      </div>

      {/* Vertical side label */}
      <div className="hero__side">
        <span className="mono-label">{skater?.stance || skaterData.stance}</span>
      </div>

      {/* Main content */}
      <div className="hero__content">
        <div className="hero__tag">
          <span className="mono-label">{skater?.tagline || skaterData.tagline}</span>
        </div>

        <h1 className="hero__name">
          {skater?.englishName || skater?.name || skaterData.englishName}
        </h1>

        <p className="hero__slogan">
          {skater?.slogan || skaterData.slogan}
        </p>

        <div className="hero__meta">
          <span className="hero__metaitem">
            <MapPin size={14} /> {skater?.location || skaterData.location}
          </span>
          <span className="hero__metaitem-dot" />
          <span className="hero__metaitem">
            Est. {skater?.born || skaterData.born}
          </span>
          <span className="hero__metaitem-dot" />
          <span className="hero__metaitem">{skater?.stance || skaterData.stance} STANCE</span>
          <span className="hero__metaitem-dot" />
          <span className="hero__metaitem hero__metaitem--accent">{skater?.worldRank || skaterData.worldRank}</span>
        </div>

        <div className="hero__scroll">
          <span className="mono-label">Scroll</span>
          <ArrowRight size={16} className="hero__scrollarrow" />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="hero__strip">
        <span>{skater?.tagline || skaterData.tagline}</span>
        <span>{skater?.tagline || skaterData.tagline}</span>
        <span>{skater?.tagline || skaterData.tagline}</span>
      </div>
    </header>
  );
}

/* ============== STORY (longform magazine) ============== */
function Story({ skater }) {
  return (
    <section id="story" className="story">
      <div className="story__container">
        {/* Section label */}
        <div className="section-label">
          <span className="mono-label">01 — The Story</span>
          <div className="section-label__line" />
        </div>

        {/* Intro — big drop-cap paragraph */}
        <div className="story__intro">
          <p className="story__lede">
            {skater?.story?.intro || skaterData.story.intro}
          </p>
        </div>

        {/* Two-column body */}
        <div className="story__body">
          <div className="story__col">
            <p>{skater?.story?.paragraphs?.[0] || skaterData.story.paragraphs[0]}</p>
            <p>{skater?.story?.paragraphs?.[1] || skaterData.story.paragraphs[1]}</p>
          </div>
          <div className="story__col">
            <p>{skater?.story?.paragraphs?.[2] || skaterData.story.paragraphs[2]}</p>
            <p>{skater?.story?.paragraphs?.[3] || skaterData.story.paragraphs[3]}</p>
          </div>
        </div>

        {/* Pull quote */}
        <div className="story__quote">
          <Quote size={40} className="story__quotemark" />
          <p className="story__quotetext">
            {skater?.story?.pullQuote || skaterData.story.pullQuote}
          </p>
          <span className="story__quoteauthor">— {skater?.name || skaterData.name}</span>
        </div>

        {/* Quick facts sidebar */}
        <div className="story__facts">
          <div className="story__fact">
            <span className="mono-label">Name</span>
            <span className="story__factval">{skater?.name || skaterData.name}</span>
          </div>
          <div className="story__fact">
            <span className="mono-label">Based</span>
            <span className="story__factval">{skater?.location || skaterData.location}</span>
          </div>
          <div className="story__fact">
            <span className="mono-label">Stance</span>
            <span className="story__factval">{skater?.stance || skaterData.stance}</span>
          </div>
          <div className="story__fact">
            <span className="mono-label">Born</span>
            <span className="story__factval">{skater?.born || skaterData.born}</span>
          </div>
          <div className="story__fact">
            <span className="mono-label">Insta</span>
            <a
              href={`https://instagram.com/${skater?.instagram || skaterData.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="story__factval story__factlink"
            >
              @{skater?.instagram || skaterData.instagram}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== FEATURED VIDEO ============== */
function FeaturedVideo({ videoId }) {
  return (
    <section id="video" className="video">
      <div className="section-label section-label--centered">
        <div className="section-label__line" />
        <span className="mono-label">03 — In Motion</span>
        <div className="section-label__line" />
      </div>

      <h2 className="video__title display-lg">
        The Edit
      </h2>

      <div className="video__frame">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Featured Skate Edit"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="video__credit">
        <Play size={14} className="video__playicon" />
        <span className="mono-label">Filmed in the streets — raw, uncut, no warmup</span>
      </div>
    </section>
  );
}

/* ============== CAREER TIMELINE ============== */
function Career({ skater }) {
  return (
    <section id="career" className="career">
      <div className="section-label section-label--centered">
        <div className="section-label__line" />
        <span className="mono-label">04 — 커리어</span>
        <div className="section-label__line" />
      </div>

      <h2 className="career__title display-lg">
        Timeline
      </h2>

      <div className="career__timeline">
        {(skater?.career || skaterData.career).map((item, i) => (
          <div key={i} className="career__item">
            <div className="career__year">
              <span className="display-md">{item.year}</span>
            </div>
            <div className="career__content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="mono-label career__type">{item.type}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============== STATS STRIP ============== */
function StatsStrip({ skater }) {
  return (
    <div className="stats">
      {(skater?.stats || skaterData.stats).map((s, i) => (
        <div className="stats__item" key={i}>
          <span className="stats__num display-md">{s.value}</span>
          <span className="mono-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============== FOOTER / CULTURE ============== */
function Footer({ skater, videoId }) {
  return (
    <footer id="culture" className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <h2 className="footer__head display-lg">
            Stay Gritty.
          </h2>
          <p className="footer__sub">
            This ain\u2019t a brand. It\u2019s a way home.
          </p>
        </div>

        <div className="footer__connect">
          <span className="mono-label">Connect</span>
          <div className="footer__links">
          <a
            href={`https://instagram.com/${skater?.instagram || skaterData.instagram}`}
              target="_blank"
              rel="noreferrer"
            >
              <AtSign size={18} />
              <span>@{skater?.instagram || skaterData.instagram}</span>
            </a>
            <a
              href={`https://youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              <Film size={18} />
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bigtext">
        GRITTY
      </div>

      <div className="footer__bottom">
        <span>&copy; {new Date().getFullYear()} GRITTY. All streets reserved.</span>
        <span>Built on concrete. Powered by grit.</span>
      </div>
    </footer>
  );
}

export default App;

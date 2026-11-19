import HeroBehavior from './HeroBehavior';
import Link from 'next/link';
import './hero.css';
import Static from '@/components/theme/Static';

export default function Hero() {
  return (
    <>
      <HeroBehavior />
      <Static>
      <section
        id="snhero-template--23876058939495__hero"
        className="sn-s snhero snhero--silk snhero--left is-ready snhero--intro"
        style={{
          '--bg': '#161B29',
          '--tx': '#F4EEE4',
          '--ac': '#E3C793',
          '--pt': '120px',
          '--pb': '80px',
          colorScheme: 'dark',
          '--h': '95svh',
        }}
        data-snhero=""
        data-auto="7"
        data-sn-silk-host=""
      >
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id="snhero-template--23876058939495__hero-f" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" data-snhero-disp="" />
          </filter>
        </svg>
        <div className="snhero__silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed="0.9" data-amp="1" />
        <div className="snhero__fx" data-sn-feathers="35" data-color="#E3C793" />
        <div className="snhero__in sn-wrap">
          <div className="snhero__copy">
            <div className="snhero__txt is-on" data-snhero-txt="">
              <p className="sn-eyebrow snhero__eb">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
                </svg>
                {' The Sakooon bedroom'}
              </p>
              <h1 className="sn-h snhero__h">
                <span className="snhero__w">
                  <span style={{ '--wi': '0' }}>Sleep,</span>
                </span>{' '}
                <span className="snhero__w">
                  <span style={{ '--wi': '1' }}>softly</span>
                </span>{' '}
                <br />
                <span className="snhero__w">
                  <em style={{ '--wi': '2' }}>woven</em>
                </span>{' '}
                <span className="snhero__w">
                  <em style={{ '--wi': '3' }}>for</em>
                </span>{' '}
                <span className="snhero__w">
                  <em style={{ '--wi': '4' }}>you</em>
                </span>{' '}
              </h1>
              <p className="snhero__p">Grade bed sheets, duvets in breathable cotton — made for the deep, quiet sleep you deserve.</p>
              <div className="snhero__btns">
                <Link className="sn-btn sn-btn--light" href="/collections/all">
                  <span>Shop bed sheets</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link className="sn-btn sn-btn--glass" href="/collections">
                  <span>Find my weave</span>
                </Link>
              </div>
            </div>
            <div className="snhero__txt" data-snhero-txt="" aria-hidden="true">
              <p className="sn-eyebrow snhero__eb">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                </svg>
                {' T200 · T250 · T300'}
              </p>
              <h2 className="sn-h snhero__h">
                <span className="snhero__w">
                  <span style={{ '--wi': '0' }}>Thread</span>
                </span>{' '}
                <span className="snhero__w">
                  <span style={{ '--wi': '1' }}>counts</span>
                </span>{' '}
                <br />
                <span className="snhero__w">
                  <em style={{ '--wi': '2' }}>that</em>
                </span>{' '}
                <span className="snhero__w">
                  <em style={{ '--wi': '3' }}>feel</em>
                </span>{' '}
                <span className="snhero__w">
                  <em style={{ '--wi': '4' }}>like</em>
                </span>{' '}
                <span className="snhero__w">
                  <em style={{ '--wi': '5' }}>silk</em>
                </span>{' '}
              </h2>
              <p className="snhero__p">Hotel-grade bed sheets, duvets in breathable cotton — made for the deep, quiet sleep you deserve.</p>
              <div className="snhero__btns">
                <Link className="sn-btn sn-btn--light" href="/collections/all">
                  <span>Compare weaves</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <Link className="sn-btn sn-btn--glass" href="/collections">
                  <span>Find my weave</span>
                </Link>
              </div>
            </div>
            <ul className="snhero__chips">
              <li style={{ '--i': '0' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                  aria-hidden="true"
                >
                  <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
                  <circle cx="7.5" cy="17.5" r="1.8" />
                  <circle cx="17.5" cy="17.5" r="1.8" />
                </svg>
                <span>Best Delivery rates</span>
              </li>
              <li style={{ '--i': '1' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                  aria-hidden="true"
                >
                  <path d="M9 14 4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
                </svg>
                <span>7-day easy exchange</span>
              </li>
              <li style={{ '--i': '2' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="7.5" r="2.8" />
                  <circle cx="7.8" cy="11" r="2.8" />
                  <circle cx="16.2" cy="11" r="2.8" />
                  <circle cx="12" cy="13.5" r="2.8" />
                  <path d="M12 16.5V22M9 20.5l3-1.5 3 1.5" />
                </svg>
                <span>Pure cotton options</span>
              </li>
            </ul>
          </div>
          <div className="snhero__vis" data-snhero-vis="">
            <div className="snhero__frame">
              <figure className="snhero__fig is-on" data-snhero-bg="">
                <img
                  src="/_next/image?url=%2Fimages%2Fsakooon-white-bedding-bedroom.webp&w=1200&q=75"
                  srcSet="/_next/image?url=%2Fimages%2Fsakooon-white-bedding-bedroom.webp&w=750&q=75 700w, /_next/image?url=%2Fimages%2Fsakooon-white-bedding-bedroom.webp&w=1200&q=75 1200w"
                  sizes="(min-width: 990px) 42vw, 90vw"
                  alt="Bedroom with white duvet and pillows on a king bed – Sakooon Duvet Comfort Filling"
                  width="1744"
                  height="1136"
                  loading="eager"
                  fetchPriority="high"
                />
              </figure>
              <figure className="snhero__fig" data-snhero-bg="">
                <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="bgsh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#F1E9DD" />
                      <stop offset="1" stopColor="#E3D6C2" />
                    </linearGradient>
                    <radialGradient id="glsh" cx="50%" cy="30%" r="60%">
                      <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="600" height="750" fill="url(#bgsh)" />
                  <rect width="600" height="750" fill="url(#glsh)" />
                  <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
                  <ellipse cx="300" cy="640" rx="200" ry="20" fill="#1B2130" opacity="0.2" />
                  <g>
                    <rect x="130" y="528" width="340" height="62" rx="14" fill="#FFFDF9" />
                    <path d="M140 580h320" stroke="#E5DBCB" strokeWidth="2" opacity=".55" />
                    <path d="M130 559.0 Q300.0 566.44 470 559.0" stroke="#E5DBCB" strokeWidth="1.5" fill="none" opacity=".35" />
                  </g>
                  <g>
                    <rect x="128" y="472" width="344" height="62" rx="14" fill="#E8E1EE" />
                    <path d="M138 524h324" stroke="#CFC4DA" strokeWidth="2" opacity=".55" />
                    <path d="M128 503.0 Q300.0 510.44 472 503.0" stroke="#CFC4DA" strokeWidth="1.5" fill="none" opacity=".35" />
                  </g>
                  <g>
                    <rect x="126" y="416" width="348" height="62" rx="14" fill="#DCE5EC" />
                    <path d="M136 468h328" stroke="#BFCBD6" strokeWidth="2" opacity=".55" />
                    <path d="M126 447.0 Q300.0 454.44 474 447.0" stroke="#BFCBD6" strokeWidth="1.5" fill="none" opacity=".35" />
                  </g>
                  <g>
                    <rect x="124" y="360" width="352" height="62" rx="14" fill="#F2E3D5" />
                    <path d="M134 412h332" stroke="#DCC6B1" strokeWidth="2" opacity=".55" />
                    <path d="M124 391.0 Q300.0 398.44 476 391.0" stroke="#DCC6B1" strokeWidth="1.5" fill="none" opacity=".35" />
                  </g>
                  <rect x="282" y="374" width="36" height="216" fill="#A8834F" opacity=".9" />
                  <g transform="translate(330 406) rotate(-8)">
                    <rect width="96" height="58" rx="8" fill="#1B2130" />
                    <text x="48" y="37" fontFamily="Georgia,serif" fontSize="24" fontStyle="italic" fill="#D9BF8F" textAnchor="middle">
                      T300
                    </text>
                    <circle cx="10" cy="10" r="3" fill="#D9BF8F" />
                  </g>
                </svg>
              </figure>
              <span className="snhero__stitch" aria-hidden="true" />
            </div>
            <div className="snhero__swatch sn-glass">
              <span className="snhero__sw-dots">
                <i style={{ background: '#FBFAF7', '--k': '0' }} />
                <i style={{ background: '#DCCBB0', '--k': '1' }} />
                <i style={{ background: '#B3C2A7', '--k': '2' }} />
                <i style={{ background: '#B9CDE3', '--k': '3' }} />
                <i style={{ background: '#1F2A44', '--k': '4' }} />
              </span>
              <span>
                <b>7 calming colours</b>
                <small>T300 cotton sateen</small>
              </span>
            </div>
            <div className="snhero__seal" aria-hidden="true">
              <svg viewBox="0 0 140 140">
                <defs>
                  <path id="snhero-template--23876058939495__hero-c" d="M70 70m-54 0a54 54 0 1 1 108 0a54 54 0 1 1-108 0" />
                </defs>
                <text>
                  <textPath href="#snhero-template--23876058939495__hero-c">Woven for deep sleep · Sakooon ·</textPath>
                </text>
              </svg>
              <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.3" />
                <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="snhero__nav sn-wrap">
          <div className="snhero__moons" role="tablist" aria-label="Slides">
            <button type="button" role="tab" className="snhero__moon is-on" data-snhero-dot="0" aria-label="Slide 1">
              <svg viewBox="0 0 30 30">
                <circle className="o" cx="15" cy="15" r="13" />
                <circle className="p" cx="15" cy="15" r="13" pathLength="100" />
                <circle className="m" cx="15" cy="15" r="5" />
              </svg>
            </button>
            <button type="button" role="tab" className="snhero__moon" data-snhero-dot="1" aria-label="Slide 2">
              <svg viewBox="0 0 30 30">
                <circle className="o" cx="15" cy="15" r="13" />
                <circle className="p" cx="15" cy="15" r="13" pathLength="100" />
                <circle className="m" cx="15" cy="15" r="5" />
              </svg>
            </button>
          </div>
          <span className="snhero__count">
            <b data-snhero-cur="">01</b>
            {' / 02'}
          </span>
        </div>
        <a className="snhero__cue" href="#snhero-template--23876058939495__hero-end" aria-label="Scroll">
          <span>Scroll</span>
          <i />
        </a>
        <span id="snhero-template--23876058939495__hero-end" />
      </section>
      </Static>
    </>
  );
}

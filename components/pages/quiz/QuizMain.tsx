import type { Product } from '@/lib/shopify/types';
import QuizPick from './QuizPick';
import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './quiz.css';

export default function QuizMain({ picks }: { picks: Partial<Record<'1' | '2' | '3', Product>> }) {
  return (
    <>
      <SectionScript id="snq-template--23876058251367__quiz" name="quiz" />
      <section
        id="snq-template--23876058251367__quiz"
        className="sn-s snqz"
        style={{ '--bg': '#161B29', '--tx': '#F4EEE4', '--ac': '#E3C793', '--ac-aa': '#E3C793', '--pt': '120px', '--pb': '120px', colorScheme: 'dark' }}
        data-sn-silk-host=""
      >
        <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".7" data-amp=".9" />
        <div data-sn-feathers="24" data-color="#E3C793" style={{ position: 'absolute', inset: '0', zIndex: '-1' }} />
        <div className="sn-wrap snqz__in">
          <div className="snqz__deck" data-snqz="">
            <div className="snqz__card snqz__intro is-on" data-step="intro">
              <div className="snqz__moonrise" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="40" fill="#E3C793" />
                  <circle className="sh" cx="44" cy="54" r="42" fill="#2B2B45" />
                </svg>
              </div>
              <p className="sn-eyebrow">The bedtime quiz</p>
              <h2 className="sn-h sn-h--l">
                {'Three questions to your '}
                <em>perfect sheet</em>
              </h2>
              <p className="sn-lead">Tell us how you sleep and we&apos;ll match you with the weave you&apos;ll love.</p>
              <button type="button" className="sn-btn sn-btn--light" data-snqz-start="">
                <span>Begin</span>
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
              </button>
              <p className="sn-small">Takes 20 seconds</p>
            </div>
            <div className="snqz__card" data-step="0" hidden>
              <div className="snqz__phases" aria-hidden="true">
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
                  </svg>
                </span>
                <span className="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                  </svg>
                </span>
                <span className="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                  </svg>
                </span>
              </div>
              <p className="sn-eyebrow">Question 1 / 3</p>
              <h3 className="sn-h sn-h--m">How do you usually sleep?</h3>
              <div className="snqz__opts">
                <button type="button" className="snqz__opt" data-to="1" style={{ '--i': '1' }}>
                  <span className="snqz__oi">
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
                      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
                    </svg>
                  </span>
                  <span>I run warm at night</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="2" style={{ '--i': '2' }}>
                  <span className="snqz__oi">
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
                      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                    </svg>
                  </span>
                  <span>Somewhere in between</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="3" style={{ '--i': '3' }}>
                  <span className="snqz__oi">
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
                      <path d="M20 4C12 4 6 9 6 16v4M6 16h7M8.6 12.3H16M20 4c0 7-4 12-10 12" />
                    </svg>
                  </span>
                  <span>I love feeling cosy</span>
                  <i>
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
                  </i>
                </button>
              </div>
            </div>
            <div className="snqz__card" data-step="1" hidden>
              <div className="snqz__phases" aria-hidden="true">
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
                  </svg>
                </span>
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                  </svg>
                </span>
                <span className="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                  </svg>
                </span>
              </div>
              <p className="sn-eyebrow">Question 2 / 3</p>
              <h3 className="sn-h sn-h--m">Which feel do you love?</h3>
              <div className="snqz__opts">
                <button type="button" className="snqz__opt" data-to="1" style={{ '--i': '1' }}>
                  <span className="snqz__oi">
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
                      <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15H5Z" />
                      <path d="M5 19l8-8" />
                    </svg>
                  </span>
                  <span>Crisp, like a hotel</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="2" style={{ '--i': '2' }}>
                  <span className="snqz__oi">
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
                      <path d="M20 4C12 4 6 9 6 16v4M6 16h7M8.6 12.3H16M20 4c0 7-4 12-10 12" />
                    </svg>
                  </span>
                  <span>Soft and smooth</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="3" style={{ '--i': '3' }}>
                  <span className="snqz__oi">
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
                      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                    </svg>
                  </span>
                  <span>Silky with a sheen</span>
                  <i>
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
                  </i>
                </button>
              </div>
              <button type="button" className="snqz__back" data-snqz-back="">
                ← Back
              </button>
            </div>
            <div className="snqz__card" data-step="2" hidden>
              <div className="snqz__phases" aria-hidden="true">
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
                  </svg>
                </span>
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                  </svg>
                </span>
                <span className="is-on">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                  </svg>
                </span>
              </div>
              <p className="sn-eyebrow">Question 3 / 3</p>
              <h3 className="sn-h sn-h--m">Who is it for?</h3>
              <div className="snqz__opts">
                <button type="button" className="snqz__opt" data-to="1" style={{ '--i': '1' }}>
                  <span className="snqz__oi">
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
                      <path d="M3 11l9-8 9 8M5 10v10h14V10" />
                    </svg>
                  </span>
                  <span>Kids&apos; or guest room</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="2" style={{ '--i': '2' }}>
                  <span className="snqz__oi">
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
                      <path d="M4 6h5l-5 6h5M13 4h4l-4 5h4M14 14h6l-6 6h6" />
                    </svg>
                  </span>
                  <span>Our everyday bed</span>
                  <i>
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
                  </i>
                </button>
                <button type="button" className="snqz__opt" data-to="3" style={{ '--i': '3' }}>
                  <span className="snqz__oi">
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
                      <rect x="3" y="9" width="18" height="4" />
                      <path d="M5 13v8h14v-8M12 9v12M12 9c-2 0-4-1-4-3s3-3 4 0c1-3 4-2 4 0s-2 3-4 3Z" />
                    </svg>
                  </span>
                  <span>A gift or new home</span>
                  <i>
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
                  </i>
                </button>
              </div>
              <button type="button" className="snqz__back" data-snqz-back="">
                ← Back
              </button>
            </div>
            <div className="snqz__card snqz__res" data-step="result" hidden>
              <div className="snqz__r" data-r-id="1" hidden>
                <div className="sn-media snqz__rimg">
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
                </div>
                <div className="snqz__rc">
                  <p className="sn-eyebrow">Your perfect match</p>
                  <h3 className="sn-h sn-h--l">T200 Percale</h3>
                  <p className="snqz__line">Cool, crisp and breathable</p>
                  <p className="sn-lead">Light and airy with a fresh matte finish — made for warm Pakistani nights.</p>
                  <QuizPick product={picks['1']} />
                  <div className="snqz__ra">
                    <Link className="sn-btn sn-btn--light" href={picks['1'] ? `/products/${picks['1']!.handle}` : '/collections/bed-sheets'}>
                      <span>Shop T200</span>
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
                    <button type="button" className="sn-link" data-snqz-again="">
                      Retake the quiz
                    </button>
                  </div>
                </div>
              </div>
              <div className="snqz__r" data-r-id="2" hidden>
                <div className="sn-media snqz__rimg">
                  <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="bgbed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#EFE6D8" />
                        <stop offset="1" stopColor="#E2D6C4" />
                      </linearGradient>
                      <radialGradient id="glbed" cx="50%" cy="30%" r="60%">
                        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="750" fill="url(#bgbed)" />
                    <rect width="600" height="750" fill="url(#glbed)" />
                    <rect x="0" y="0" width="600" height="470" fill="#F3ECE1" opacity=".55" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="#2A3247" />
                    <circle cx="470" cy="150" r="22" fill="#D9BF8F" />
                    <circle cx="460" cy="146" r="22" fill="#2A3247" />
                    <circle cx="420" cy="223" r="1.2" fill="#fff" opacity="0.70" />
                    <circle cx="459" cy="201" r="1.5" fill="#fff" opacity="0.50" />
                    <circle cx="454" cy="273" r="2.1" fill="#fff" opacity="0.54" />
                    <circle cx="476" cy="280" r="0.9" fill="#fff" opacity="0.90" />
                    <circle cx="393" cy="141" r="1.2" fill="#fff" opacity="0.74" />
                    <circle cx="467" cy="202" r="1.8" fill="#fff" opacity="0.43" />
                    <circle cx="424" cy="213" r="0.7" fill="#fff" opacity="0.57" />
                    <circle cx="507" cy="130" r="1.8" fill="#fff" opacity="0.64" />
                    <circle cx="418" cy="297" r="2.1" fill="#fff" opacity="0.41" />
                    <circle cx="400" cy="203" r="1.0" fill="#fff" opacity="0.62" />
                    <circle cx="425" cy="215" r="1.5" fill="#fff" opacity="0.63" />
                    <circle cx="424" cy="223" r="1.7" fill="#fff" opacity="0.88" />
                    <circle cx="409" cy="156" r="1.9" fill="#fff" opacity="0.67" />
                    <circle cx="457" cy="144" r="1.0" fill="#fff" opacity="0.62" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="none" stroke="#A8834F" strokeWidth="5" />
                    <path d="M450 80v250M380 205h140" stroke="#A8834F" strokeWidth="3" opacity=".7" />
                    <rect x="0" y="560" width="600" height="190" fill="#D9CBB5" />
                    <rect x="0" y="556" width="600" height="6" fill="#CDBDA4" />
                    <rect x="60" y="300" width="400" height="200" rx="40" fill="#1B2130" />
                    <path d="M100 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M180 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M260 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M340 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M420 316v170" stroke="#2C3447" strokeWidth="3" />
                    <ellipse cx="265" cy="640" rx="250" ry="26" fill="#1B2130" opacity="0.22" />
                    <rect x="30" y="455" width="470" height="70" rx="14" fill="#FFFDF9" />
                    <path
                      d="M24 500 Q20 470 60 466 L470 466 Q512 470 508 500 L512 610 Q514 632 488 634 L50 634 Q22 632 22 610Z"
                      fill="#F4EEE3"
                    />
                    <path d="M40 520 Q160 540 270 512 T500 520" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M60 585 Q200 600 300 578 T495 590" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M22 560 L510 560 L512 600 L22 600Z" fill="#A8834F" opacity=".9" />
                    <path d="M22 566h488M22 594h488" stroke="#D9BF8F" strokeWidth="1.5" />
                    <path d="M80 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M100 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <path d="M240 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M260 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <rect x="170" y="430" width="150" height="70" rx="22" fill="#B3C2A7" />
                    <path d="M180 465h130" stroke="#9DAE91" strokeWidth="2" />
                    <rect x="505" y="480" width="80" height="80" rx="6" fill="#B79C7A" />
                    <path d="M515 520h60" stroke="#9E8363" strokeWidth="2" />
                    <circle cx="545" cy="410" r="70" fill="#D9BF8F" opacity=".25" />
                    <path d="M528 455h34l-6 25h-22Z" fill="#A8834F" />
                    <path d="M520 420h50l-8 -36h-34Z" fill="#FFFDF9" />
                  </svg>
                </div>
                <div className="snqz__rc">
                  <p className="sn-eyebrow">Your perfect match</p>
                  <h3 className="sn-h sn-h--l">T250 Fine Percale</h3>
                  <p className="snqz__line">The best of soft and cool</p>
                  <p className="sn-lead">Smoother than everyday percale but still breathable — our bestseller for every season.</p>
                  <QuizPick product={picks['2']} />
                  <div className="snqz__ra">
                    <Link className="sn-btn sn-btn--light" href={picks['2'] ? `/products/${picks['2']!.handle}` : '/collections/bed-sheets'}>
                      <span>Shop T250</span>
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
                    <button type="button" className="sn-link" data-snqz-again="">
                      Retake the quiz
                    </button>
                  </div>
                </div>
              </div>
              <div className="snqz__r" data-r-id="3" hidden>
                <div className="sn-media snqz__rimg">
                  <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="bgbc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#EFE6D8" />
                        <stop offset="1" stopColor="#E2D6C4" />
                      </linearGradient>
                      <radialGradient id="glbc" cx="50%" cy="30%" r="60%">
                        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="750" fill="url(#bgbc)" />
                    <rect width="600" height="750" fill="url(#glbc)" />
                    <rect x="0" y="0" width="600" height="470" fill="#F3ECE1" opacity=".55" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="#2A3247" />
                    <circle cx="470" cy="150" r="22" fill="#D9BF8F" />
                    <circle cx="460" cy="146" r="22" fill="#2A3247" />
                    <circle cx="420" cy="223" r="1.2" fill="#fff" opacity="0.70" />
                    <circle cx="459" cy="201" r="1.5" fill="#fff" opacity="0.50" />
                    <circle cx="454" cy="273" r="2.1" fill="#fff" opacity="0.54" />
                    <circle cx="476" cy="280" r="0.9" fill="#fff" opacity="0.90" />
                    <circle cx="393" cy="141" r="1.2" fill="#fff" opacity="0.74" />
                    <circle cx="467" cy="202" r="1.8" fill="#fff" opacity="0.43" />
                    <circle cx="424" cy="213" r="0.7" fill="#fff" opacity="0.57" />
                    <circle cx="507" cy="130" r="1.8" fill="#fff" opacity="0.64" />
                    <circle cx="418" cy="297" r="2.1" fill="#fff" opacity="0.41" />
                    <circle cx="400" cy="203" r="1.0" fill="#fff" opacity="0.62" />
                    <circle cx="425" cy="215" r="1.5" fill="#fff" opacity="0.63" />
                    <circle cx="424" cy="223" r="1.7" fill="#fff" opacity="0.88" />
                    <circle cx="409" cy="156" r="1.9" fill="#fff" opacity="0.67" />
                    <circle cx="457" cy="144" r="1.0" fill="#fff" opacity="0.62" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="none" stroke="#A8834F" strokeWidth="5" />
                    <path d="M450 80v250M380 205h140" stroke="#A8834F" strokeWidth="3" opacity=".7" />
                    <rect x="0" y="560" width="600" height="190" fill="#D9CBB5" />
                    <rect x="0" y="556" width="600" height="6" fill="#CDBDA4" />
                    <rect x="60" y="300" width="400" height="200" rx="40" fill="#1B2130" />
                    <path d="M100 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M180 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M260 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M340 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M420 316v170" stroke="#2C3447" strokeWidth="3" />
                    <ellipse cx="265" cy="640" rx="250" ry="26" fill="#1B2130" opacity="0.22" />
                    <rect x="30" y="455" width="470" height="70" rx="14" fill="#FFFDF9" />
                    <path
                      d="M24 500 Q20 470 60 466 L470 466 Q512 470 508 500 L512 610 Q514 632 488 634 L50 634 Q22 632 22 610Z"
                      fill="#EAD9C0"
                    />
                    <path d="M50 470 L40 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M102 470 L92 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M154 470 L144 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M206 470 L196 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M258 470 L248 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M310 470 L300 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M362 470 L352 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M414 470 L404 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M466 470 L456 630" stroke="#A8834F" strokeWidth="1.3" opacity=".45" />
                    <path d="M26 520 Q265 530 508 520" stroke="#A8834F" strokeWidth="1.3" fill="none" opacity=".45" />
                    <path d="M26 556 Q265 566 508 556" stroke="#A8834F" strokeWidth="1.3" fill="none" opacity=".45" />
                    <path d="M26 592 Q265 602 508 592" stroke="#A8834F" strokeWidth="1.3" fill="none" opacity=".45" />
                    <path d="M40 520 Q160 540 270 512 T500 520" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M60 585 Q200 600 300 578 T495 590" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M22 560 L510 560 L512 600 L22 600Z" fill="#A8834F" opacity=".9" />
                    <path d="M22 566h488M22 594h488" stroke="#D9BF8F" strokeWidth="1.5" />
                    <path d="M80 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M100 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <path d="M240 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M260 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <rect x="170" y="430" width="150" height="70" rx="22" fill="#B3C2A7" />
                    <path d="M180 465h130" stroke="#9DAE91" strokeWidth="2" />
                    <rect x="505" y="480" width="80" height="80" rx="6" fill="#B79C7A" />
                    <path d="M515 520h60" stroke="#9E8363" strokeWidth="2" />
                    <circle cx="545" cy="410" r="70" fill="#D9BF8F" opacity=".25" />
                    <path d="M528 455h34l-6 25h-22Z" fill="#A8834F" />
                    <path d="M520 420h50l-8 -36h-34Z" fill="#FFFDF9" />
                  </svg>
                </div>
                <div className="snqz__rc">
                  <p className="sn-eyebrow">Your perfect match</p>
                  <h3 className="sn-h sn-h--l">T300 Sateen</h3>
                  <p className="snqz__line">Silky, lustrous luxury</p>
                  <p className="sn-lead">A dense sateen weave with a soft sheen — five-star comfort every night.</p>
                  <QuizPick product={picks['3']} />
                  <div className="snqz__ra">
                    <Link className="sn-btn sn-btn--light" href={picks['3'] ? `/products/${picks['3']!.handle}` : '/collections/bed-sheets'}>
                      <span>Shop T300</span>
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
                    <button type="button" className="sn-link" data-snqz-again="">
                      Retake the quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

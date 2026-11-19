import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './compare.css';

export default function Compare() {
  return (
    <>
      <SectionScript id="sncp-template--23876058447975__compare" name="compare" />
      <section
        id="sncp-template--23876058447975__compare"
        className="sn-s sncp"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px', '--n': '2' }}
      >
        <div className="sn-wrap">
          <div className="sn-head sn-head--center ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                </svg>
                {' Pillow covers'}
              </p>
              <h2 className="sn-h sn-h--l" data-sn-split="">
                {'Premium '}
                <em>or Luxury?</em>
              </h2>
              <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                Two finishes, one promise: breathable cotton that fits your pillow perfectly.
              </p>
            </div>
          </div>
          <div className="sncp__grid">
            <ul className="sncp__labels" aria-hidden="true">
              <li className="sncp__lh" />
              <li>Fabric</li>
              <li>Thread count</li>
              <li>Finish</li>
              <li>Edge detail</li>
              <li>Closure</li>
              <li>Pair included</li>
            </ul>
            <article className="sncp__col sn-pillow sn-stitch" data-r="rise" style={{ '--i': '0' }}>
              <div className="sncp__top">
                <div className="sn-media sncp__img">
                  <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="bgpl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#F2EBE0" />
                        <stop offset="1" stopColor="#E4D8C6" />
                      </linearGradient>
                      <radialGradient id="glpl" cx="50%" cy="30%" r="60%">
                        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="750" fill="url(#bgpl)" />
                    <rect width="600" height="750" fill="url(#glpl)" />
                    <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
                    <ellipse cx="300" cy="600" rx="190" ry="18" fill="#1B2130" opacity="0.18" />
                    <path d="M110 300 q190 -40 380 0 q30 120 0 240 q-190 40 -380 0 q-30 -120 0 -240Z" fill="#FFFDF9" />
                    <path d="M160 330 Q300 300 440 330 M150 520 Q300 545 450 520" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M200 420 q100 20 200 0" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path
                      d="M110 300 q-14 -10 -20 -26 M490 300 q14 -10 20 -26 M110 540 q-14 10 -20 26 M490 540 q14 10 20 26"
                      stroke="#E3D9C9"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="sn-h sn-h--m">Premium</h3>
                <p className="sncp__price">Rs. 999 / pair</p>
              </div>
              <ul className="sncp__vals">
                <li>
                  <span className="sncp__ml">Fabric</span>
                  <b>100% cotton</b>
                </li>
                <li>
                  <span className="sncp__ml">Thread count</span>
                  <b>T200</b>
                </li>
                <li>
                  <span className="sncp__ml">Finish</span>
                  <b>Matte percale</b>
                </li>
                <li>
                  <span className="sncp__ml">Edge detail</span>
                  <b>Classic hem</b>
                </li>
                <li>
                  <span className="sncp__ml">Closure</span>
                  <b>Envelope</b>
                </li>
                <li>
                  <span className="sncp__ml">Pair included</span>
                  <i className="sncp__y">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                </li>
              </ul>
              <Link className="sn-btn sn-btn--ghost sn-btn--block" href="/collections/all">
                <span>Shop Premium</span>
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
            </article>
            <article className="sncp__col sn-pillow sn-stitch is-f" data-r="rise" style={{ '--i': '1' }}>
              <span className="sncp__badge">
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
                Most loved
              </span>
              <div className="sncp__top">
                <div className="sn-media sncp__img">
                  <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="bgpc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#EFE5EC" />
                        <stop offset="1" stopColor="#E0D0D8" />
                      </linearGradient>
                      <radialGradient id="glpc" cx="50%" cy="30%" r="60%">
                        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="750" fill="url(#bgpc)" />
                    <rect width="600" height="750" fill="url(#glpc)" />
                    <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
                    <ellipse cx="300" cy="600" rx="190" ry="18" fill="#1B2130" opacity="0.18" />
                    <path d="M110 300 q190 -40 380 0 q30 120 0 240 q-190 40 -380 0 q-30 -120 0 -240Z" fill="#EADBC8" />
                    <path
                      d="M110 300 q190 -40 380 0 q30 120 0 240 q-190 40 -380 0 q-30 -120 0 -240Z"
                      fill="none"
                      stroke="#A8834F"
                      strokeWidth="10"
                    />
                    <path
                      d="M150 330 q150 -25 300 0 q22 90 0 180 q-150 25 -300 0 q-22 -90 0 -180Z"
                      fill="none"
                      stroke="#FFFDF9"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                    />
                    <path
                      d="M110 300 q-14 -10 -20 -26 M490 300 q14 -10 20 -26 M110 540 q-14 10 -20 26 M490 540 q14 10 20 26"
                      stroke="#A8834F"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="sn-h sn-h--m">Luxury</h3>
                <p className="sncp__price">Rs. 1,499 / pair</p>
              </div>
              <ul className="sncp__vals">
                <li>
                  <span className="sncp__ml">Fabric</span>
                  <b>Cotton sateen</b>
                </li>
                <li>
                  <span className="sncp__ml">Thread count</span>
                  <b>T300</b>
                </li>
                <li>
                  <span className="sncp__ml">Finish</span>
                  <b>Silky sheen</b>
                </li>
                <li>
                  <span className="sncp__ml">Edge detail</span>
                  <b>Piped flange edge</b>
                </li>
                <li>
                  <span className="sncp__ml">Closure</span>
                  <b>Hidden zip</b>
                </li>
                <li>
                  <span className="sncp__ml">Pair included</span>
                  <i className="sncp__y">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </i>
                </li>
              </ul>
              <Link className="sn-btn sn-btn--gold sn-btn--block" href="/collections/all">
                <span>Shop Luxury</span>
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
            </article>
          </div>
          <p className="sncp__note sn-small" data-r="">
            Standard size 20 x 30 in. King size on request.
          </p>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import '@/app/styles/chrome/footer.css';

export default function Footer() {
  return (
    <>
      <footer
        id="snf"
        className="snf"
        style={{
          '--bg': '#161B29',
          '--tx': '#F4EEE4',
          '--ac': '#E3C793',
          '--soft': 'color-mix(in srgb, #F4EEE4 66%, transparent)',
          '--line': 'color-mix(in srgb, #F4EEE4 14%, transparent)',
          '--line2': 'color-mix(in srgb, #F4EEE4 26%, transparent)',
          '--ac-ink': '#161B29',
        }}
      >
        <div className="snf__sky" aria-hidden="true">
          <div className="snf__silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".55" data-amp=".9" />
          <div data-sn-feathers="40" data-color="#E3C793" style={{ position: 'absolute', inset: '0' }} />
          <svg className="snf__wave" viewBox="0 0 2880 80" preserveAspectRatio="none">
            <path d="M0 0V40C240 80 480 80 720 40S1200 0 1440 40 1920 80 2160 40 2640 0 2880 40V0Z" />
          </svg>
        </div>
        <div className="snf__cta sn-wrap">
          <div className="snf__moon" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <radialGradient id="snf-mg" cx="38%" cy="35%" r="70%">
                  <stop offset="0" stopColor="#fff8e6" />
                  <stop offset="1" stopColor="#E3C793" />
                </radialGradient>
                <clipPath id="snf-mc">
                  <circle cx="60" cy="60" r="44" />
                </clipPath>
              </defs>
              <circle cx="60" cy="60" r="56" fill="none" stroke="#E3C793" strokeOpacity=".3" strokeDasharray="1 6" />
              <circle cx="60" cy="60" r="44" fill="url(#snf-mg)" />
              <g clipPath="url(#snf-mc)">
                <circle className="snf__moon-sh" cx="38" cy="52" r="46" fill="#161B29" />
              </g>
            </svg>
          </div>
          <div className="snf__cta-copy">
            <p className="sn-eyebrow" data-r="">
              Goodnight from Sakooon
            </p>
            <h2 className="sn-h sn-h--xl" data-sn-split="">
              {'Sleep softer, '}
              <em>wake brighter.</em>
            </h2>
            <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
              Bedtime letters with new colours, restocks and members-only offers. Only when it&apos;s worth waking up for.
            </p>
          </div>
          <div className="snf__news" data-r="" style={{ '--i': '3' }}>
            <form method="post" action="/contact#snf-news" id="snf-news" acceptCharset="UTF-8" className="snf__form">
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="contact[tags]" value="newsletter" />
              <label className="sr" htmlFor="snf-email">
                Your email address
              </label>
              <div className="sn-pill-form">
                <input id="snf-email" type="email" name="contact[email]" placeholder="Your email address" required autoComplete="email" />
                <button className="sn-btn sn-btn--gold sn-btn--sm" type="submit">
                  <span>Subscribe</span>
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
              </div>
            </form>
            <p className="sn-small">No spam. Unsubscribe any time.</p>
          </div>
        </div>
        <div className="snf__main sn-wrap">
          <div className="snf__brand" data-r="">
            <Link href="/" className="snf__logo" aria-label="Sakooon">
              <svg className="sn-logo " viewBox="-10 -765 3779 1015" role="img" aria-label="Sakooon" xmlns="http://www.w3.org/2000/svg">
                <g className="sn-logo__type" fill="currentColor">
                  <path
                    pathLength="1"
                    d="M302 -354Q353 -322 382.5 -299.0Q412 -276 433.0 -242.5Q454 -209 454 -164Q454 -113 427.5 -73.0Q401 -33 352.5 -10.5Q304 12 242 12Q200 12 155.5 1.0Q111 -10 88 -26Q79 -32 78 -45L72 -196V-197Q72 -201 77.0 -201.5Q82 -202 83 -198Q116 -116 158.5 -63.0Q201 -10 266 -10Q310 -10 339.0 -33.5Q368 -57 368 -112Q368 -156 348.5 -189.0Q329 -222 300.5 -244.0Q272 -266 223 -298Q175 -329 148.0 -350.5Q121 -372 102.0 -403.5Q83 -435 83 -477Q83 -529 112.0 -565.0Q141 -601 187.5 -618.5Q234 -636 285 -636Q318 -636 352.0 -629.5Q386 -623 410 -613Q425 -607 425 -594L427 -459Q427 -455 422.5 -454.0Q418 -453 416 -456Q396 -517 362.5 -566.5Q329 -616 262 -616Q217 -616 190.5 -589.5Q164 -563 164 -519Q164 -482 182.5 -453.5Q201 -425 228.0 -404.5Q255 -384 302 -354Z"
                  />
                  <path
                    pathLength="1"
                    d="M875 8Q857 8 842.0 -16.5Q827 -41 827 -82V-258Q827 -320 814.5 -348.5Q802 -377 775 -377Q742 -377 727.5 -352.5Q713 -328 710 -298Q704 -247 659 -247Q637 -247 626.5 -257.0Q616 -267 616 -282Q616 -310 649.5 -336.5Q683 -363 730.5 -379.5Q778 -396 814 -396Q857 -396 882.5 -369.0Q908 -342 908 -288V-108Q908 -45 947 -45Q962 -45 983 -54H985Q989 -54 990.0 -49.5Q991 -45 987 -43L884 6Q880 8 875 8ZM613 -64Q613 -91 627.5 -108.0Q642 -125 664.0 -135.5Q686 -146 730 -162L837 -202L840 -187L767 -156Q740 -145 724.0 -132.0Q708 -119 708 -93Q708 -69 723.5 -55.0Q739 -41 760 -41Q779 -41 799 -53L853 -89L854 -74L783 -24Q759 -7 739.5 0.0Q720 7 696 7Q655 7 634.0 -12.0Q613 -31 613 -64Z"
                  />
                  <path
                    pathLength="1"
                    d="M1070 -12Q1104 -12 1115.5 -26.0Q1127 -40 1127 -81V-592Q1127 -627 1120.0 -642.5Q1113 -658 1097 -658Q1082 -658 1056 -646H1055Q1052 -646 1049.5 -651.5Q1047 -657 1050 -658L1189 -724L1194 -725Q1198 -725 1202.5 -721.0Q1207 -717 1207 -714V-81Q1207 -40 1218.5 -26.0Q1230 -12 1264 -12Q1268 -12 1268.0 -6.0Q1268 0 1264 0Q1239 0 1224 -1L1167 -2L1110 -1Q1095 0 1070 0Q1067 0 1067.0 -6.0Q1067 -12 1070 -12ZM1321 -12Q1363 -12 1363 -32Q1363 -41 1354 -53L1231 -214L1291 -260L1428 -81Q1480 -12 1539 -12Q1542 -12 1542.0 -6.0Q1542 0 1539 0Q1514 0 1499 -1L1442 -2L1367 -1Q1350 0 1321 0Q1319 0 1319.0 -6.0Q1319 -12 1321 -12ZM1172 -170 1314 -299Q1342 -323 1342 -346Q1342 -358 1330.5 -366.0Q1319 -374 1298 -374Q1295 -374 1295.0 -380.0Q1295 -386 1298 -386Q1326 -386 1342 -385L1418 -384L1489 -385Q1503 -386 1527 -386Q1530 -386 1530.0 -380.0Q1530 -374 1527 -374Q1486 -374 1434.0 -353.5Q1382 -333 1338 -294L1177 -155Z"
                  />
                  <path
                    pathLength="1"
                    d="M3546 -12Q3580 -12 3591.0 -26.0Q3602 -40 3602 -81V-231Q3602 -287 3581.5 -313.5Q3561 -340 3517 -340Q3484 -340 3450.5 -322.0Q3417 -304 3396 -274L3391 -286Q3471 -398 3567 -398Q3622 -398 3652.5 -365.0Q3683 -332 3683 -274V-81Q3683 -40 3694.5 -26.0Q3706 -12 3740 -12Q3743 -12 3743.0 -6.0Q3743 0 3740 0Q3715 0 3700 -1L3643 -2L3586 -1Q3571 0 3546 0Q3543 0 3543.0 -6.0Q3543 -12 3546 -12ZM3277 -12Q3311 -12 3322.0 -26.0Q3333 -40 3333 -81V-272Q3333 -304 3325.5 -319.0Q3318 -334 3301 -334Q3286 -334 3251 -319H3250Q3246 -319 3244.0 -324.0Q3242 -329 3245 -330L3376 -394Q3382 -396 3383 -396Q3394 -396 3404.0 -371.0Q3414 -346 3414 -306V-81Q3414 -40 3425.5 -26.0Q3437 -12 3471 -12Q3474 -12 3474.0 -6.0Q3474 0 3471 0Q3446 0 3431 -1L3374 -2L3316 -1Q3302 0 3277 0Q3274 0 3274.0 -6.0Q3274 -12 3277 -12Z"
                  />
                </g>
                <g className="sn-logo__moon sn-logo__moon--1">
                  <circle
                    cx="1841.0"
                    cy="-193.0"
                    r="168.6"
                    fill="none"
                    stroke="currentColor"
                    className="sn-logo__ring"
                    strokeWidth="45.0"
                  />
                  <path
                    pathLength="1"
                    d="M1841.0 -314.3 A121.3 121.3 0 1 0 1841.0 -71.7 A34.0 121.3 0 1 1 1841.0 -314.3Z"
                    fill="var(--sn-logo-accent, var(--color-accent, #A8834F))"
                  />
                </g>
                <g className="sn-logo__moon sn-logo__moon--2">
                  <circle
                    cx="2387.0"
                    cy="-193.0"
                    r="168.6"
                    fill="none"
                    stroke="currentColor"
                    className="sn-logo__ring"
                    strokeWidth="45.0"
                  />
                  <path
                    pathLength="1"
                    d="M2387.0 -314.3 A121.3 121.3 0 1 0 2387.0 -71.7Z"
                    fill="var(--sn-logo-accent, var(--color-accent, #A8834F))"
                  />
                </g>
                <g className="sn-logo__moon sn-logo__moon--3">
                  <circle
                    cx="2933.0"
                    cy="-193.0"
                    r="168.6"
                    fill="none"
                    stroke="currentColor"
                    className="sn-logo__ring"
                    strokeWidth="45.0"
                  />
                  <circle cx="2933.0" cy="-193.0" r="121.3" fill="var(--sn-logo-accent, var(--color-accent, #A8834F))" />
                </g>
              </svg>
            </Link>
            <p className="snf__about">Premium bed sheets, duvets, pillows — woven for deep, peaceful sleep in every Pakistani home.</p>
            <ul className="snf__contact">
              <li>
                <a href="tel:+923XXXXXXXXX">
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
                    <path d="M5 4.5h3l1.3 4.3-2 1.6a12 12 0 0 0 6.3 6.3l1.6-2 4.3 1.3v3c0 1-.8 1.5-1.7 1.4A17 17 0 0 1 4 7.2c-.1-.9.4-1.7 1-1.7Z" />
                  </svg>
                  +92 3XX XXXXXXX
                </a>
              </li>
              <li>
                <a href="https://wa.me/923000000000" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="icon" aria-hidden="true">
                    <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1.2 5 5.1-1.3A9.3 9.3 0 1 0 12 2.5Zm0 1.8a7.5 7.5 0 1 1-3.9 13.9l-.4-.2-3 .8.8-2.9-.3-.4A7.5 7.5 0 0 1 12 4.3Zm-3.6 3.9c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2s.9 2.3 1 2.4c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.6Z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:hello@sakooon.com">
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
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  hello@sakooon.com
                </a>
              </li>
              <li>
                <span>
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
                    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  First Floor , Plaza # 38 Z Block , Phase 3 , DHA Lahore , Pakistan
                </span>
              </li>
              <li>
                <span>
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
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Mon – Sat · 9 AM – 8 PM
                </span>
              </li>
            </ul>
            <div className="snf__social" />
          </div>
          <div className="snf__cols">
            <div className="snf__col" data-r="" style={{ '--i': '1' }}>
              <details className="snf__d" open>
                <summary>
                  <span>Shop</span>
                  <i />
                </summary>
                <ul>
                  <li>
                    <Link href="/collections/bed-sheets">Bed sheets</Link>
                  </li>
                  <li>
                    <Link href="/collections/duvets">Duvets</Link>
                  </li>
                  <li>
                    <Link href="/collections/duvet-covers">Duvet covers</Link>
                  </li>
                  <li>
                    <Link href="/collections/pillows">Pillows</Link>
                  </li>
                  <li>
                    <Link href="/collections/bed-covers">Bed covers</Link>
                  </li>
                </ul>
              </details>
            </div>
            <div className="snf__col" data-r="" style={{ '--i': '2' }}>
              <details className="snf__d" open>
                <summary>
                  <span>Help</span>
                  <i />
                </summary>
                <ul>
                  <li>
                    <Link href="/pages/size-guide">Size guide</Link>
                  </li>
                  <li>
                    <Link href="/pages/contact">Contact us</Link>
                  </li>
                  <li>
                    <Link href="/pages/wishlist">Wishlist</Link>
                  </li>
                </ul>
              </details>
            </div>
            <div className="snf__col" data-r="" style={{ '--i': '3' }}>
              <details className="snf__d" open>
                <summary>
                  <span>About</span>
                  <i />
                </summary>
                <ul>
                  <li>
                    <Link href="/pages/about">Our story</Link>
                  </li>
                  <li>
                    <Link href="/blogs/news">Journal</Link>
                  </li>
                  <li>
                    <Link href="/pages/faq">FAQ</Link>
                  </li>
                </ul>
              </details>
            </div>
            <div className="snf__col" data-r="" style={{ '--i': '4' }}>
              <details className="snf__d" open>
                <summary>
                  <span>Our promise</span>
                  <i />
                </summary>
                <ul>
                  <li className="snf__txt">
                    <p>Every piece is checked by hand, folded with care and exchangeable within 7 days.</p>
                  </li>
                </ul>
              </details>
            </div>
          </div>
        </div>
        <div className="snf__mark sn-wrap--wide" aria-hidden="true" data-snf-mark="">
          <svg className="sn-logo " viewBox="-10 -765 3779 1015" role="img" aria-label="Sakooon" xmlns="http://www.w3.org/2000/svg">
            <g className="sn-logo__type" fill="currentColor">
              <path
                pathLength="1"
                d="M302 -354Q353 -322 382.5 -299.0Q412 -276 433.0 -242.5Q454 -209 454 -164Q454 -113 427.5 -73.0Q401 -33 352.5 -10.5Q304 12 242 12Q200 12 155.5 1.0Q111 -10 88 -26Q79 -32 78 -45L72 -196V-197Q72 -201 77.0 -201.5Q82 -202 83 -198Q116 -116 158.5 -63.0Q201 -10 266 -10Q310 -10 339.0 -33.5Q368 -57 368 -112Q368 -156 348.5 -189.0Q329 -222 300.5 -244.0Q272 -266 223 -298Q175 -329 148.0 -350.5Q121 -372 102.0 -403.5Q83 -435 83 -477Q83 -529 112.0 -565.0Q141 -601 187.5 -618.5Q234 -636 285 -636Q318 -636 352.0 -629.5Q386 -623 410 -613Q425 -607 425 -594L427 -459Q427 -455 422.5 -454.0Q418 -453 416 -456Q396 -517 362.5 -566.5Q329 -616 262 -616Q217 -616 190.5 -589.5Q164 -563 164 -519Q164 -482 182.5 -453.5Q201 -425 228.0 -404.5Q255 -384 302 -354Z"
              />
              <path
                pathLength="1"
                d="M875 8Q857 8 842.0 -16.5Q827 -41 827 -82V-258Q827 -320 814.5 -348.5Q802 -377 775 -377Q742 -377 727.5 -352.5Q713 -328 710 -298Q704 -247 659 -247Q637 -247 626.5 -257.0Q616 -267 616 -282Q616 -310 649.5 -336.5Q683 -363 730.5 -379.5Q778 -396 814 -396Q857 -396 882.5 -369.0Q908 -342 908 -288V-108Q908 -45 947 -45Q962 -45 983 -54H985Q989 -54 990.0 -49.5Q991 -45 987 -43L884 6Q880 8 875 8ZM613 -64Q613 -91 627.5 -108.0Q642 -125 664.0 -135.5Q686 -146 730 -162L837 -202L840 -187L767 -156Q740 -145 724.0 -132.0Q708 -119 708 -93Q708 -69 723.5 -55.0Q739 -41 760 -41Q779 -41 799 -53L853 -89L854 -74L783 -24Q759 -7 739.5 0.0Q720 7 696 7Q655 7 634.0 -12.0Q613 -31 613 -64Z"
              />
              <path
                pathLength="1"
                d="M1070 -12Q1104 -12 1115.5 -26.0Q1127 -40 1127 -81V-592Q1127 -627 1120.0 -642.5Q1113 -658 1097 -658Q1082 -658 1056 -646H1055Q1052 -646 1049.5 -651.5Q1047 -657 1050 -658L1189 -724L1194 -725Q1198 -725 1202.5 -721.0Q1207 -717 1207 -714V-81Q1207 -40 1218.5 -26.0Q1230 -12 1264 -12Q1268 -12 1268.0 -6.0Q1268 0 1264 0Q1239 0 1224 -1L1167 -2L1110 -1Q1095 0 1070 0Q1067 0 1067.0 -6.0Q1067 -12 1070 -12ZM1321 -12Q1363 -12 1363 -32Q1363 -41 1354 -53L1231 -214L1291 -260L1428 -81Q1480 -12 1539 -12Q1542 -12 1542.0 -6.0Q1542 0 1539 0Q1514 0 1499 -1L1442 -2L1367 -1Q1350 0 1321 0Q1319 0 1319.0 -6.0Q1319 -12 1321 -12ZM1172 -170 1314 -299Q1342 -323 1342 -346Q1342 -358 1330.5 -366.0Q1319 -374 1298 -374Q1295 -374 1295.0 -380.0Q1295 -386 1298 -386Q1326 -386 1342 -385L1418 -384L1489 -385Q1503 -386 1527 -386Q1530 -386 1530.0 -380.0Q1530 -374 1527 -374Q1486 -374 1434.0 -353.5Q1382 -333 1338 -294L1177 -155Z"
              />
              <path
                pathLength="1"
                d="M3546 -12Q3580 -12 3591.0 -26.0Q3602 -40 3602 -81V-231Q3602 -287 3581.5 -313.5Q3561 -340 3517 -340Q3484 -340 3450.5 -322.0Q3417 -304 3396 -274L3391 -286Q3471 -398 3567 -398Q3622 -398 3652.5 -365.0Q3683 -332 3683 -274V-81Q3683 -40 3694.5 -26.0Q3706 -12 3740 -12Q3743 -12 3743.0 -6.0Q3743 0 3740 0Q3715 0 3700 -1L3643 -2L3586 -1Q3571 0 3546 0Q3543 0 3543.0 -6.0Q3543 -12 3546 -12ZM3277 -12Q3311 -12 3322.0 -26.0Q3333 -40 3333 -81V-272Q3333 -304 3325.5 -319.0Q3318 -334 3301 -334Q3286 -334 3251 -319H3250Q3246 -319 3244.0 -324.0Q3242 -329 3245 -330L3376 -394Q3382 -396 3383 -396Q3394 -396 3404.0 -371.0Q3414 -346 3414 -306V-81Q3414 -40 3425.5 -26.0Q3437 -12 3471 -12Q3474 -12 3474.0 -6.0Q3474 0 3471 0Q3446 0 3431 -1L3374 -2L3316 -1Q3302 0 3277 0Q3274 0 3274.0 -6.0Q3274 -12 3277 -12Z"
              />
            </g>
            <g className="sn-logo__moon sn-logo__moon--1">
              <circle cx="1841.0" cy="-193.0" r="168.6" fill="none" stroke="currentColor" className="sn-logo__ring" strokeWidth="45.0" />
              <path
                pathLength="1"
                d="M1841.0 -314.3 A121.3 121.3 0 1 0 1841.0 -71.7 A34.0 121.3 0 1 1 1841.0 -314.3Z"
                fill="var(--sn-logo-accent, var(--color-accent, #A8834F))"
              />
            </g>
            <g className="sn-logo__moon sn-logo__moon--2">
              <circle cx="2387.0" cy="-193.0" r="168.6" fill="none" stroke="currentColor" className="sn-logo__ring" strokeWidth="45.0" />
              <path
                pathLength="1"
                d="M2387.0 -314.3 A121.3 121.3 0 1 0 2387.0 -71.7Z"
                fill="var(--sn-logo-accent, var(--color-accent, #A8834F))"
              />
            </g>
            <g className="sn-logo__moon sn-logo__moon--3">
              <circle cx="2933.0" cy="-193.0" r="168.6" fill="none" stroke="currentColor" className="sn-logo__ring" strokeWidth="45.0" />
              <circle cx="2933.0" cy="-193.0" r="121.3" fill="var(--sn-logo-accent, var(--color-accent, #A8834F))" />
            </g>
          </svg>
        </div>
        <div className="snf__bottom sn-wrap">
          <p>© 2026 Sakooon. Woven with care in Pakistan.</p>
          <ul className="snf__pol">
            <li>
              <Link href="/policies/privacy-policy">Privacy policy</Link>
            </li>
          </ul>
          <ul className="snf__pay">
            <li className="snf__cod">Cash on delivery</li>
          </ul>
        </div>
      </footer>
    </>
  );
}

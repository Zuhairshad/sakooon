import Link from 'next/link';
import '@/app/styles/chrome/header.css';

export default function Header() {
  return (
    <>
      <header id="snh" className="snh snh--center" data-snh="" data-behavior="hide" style={{ '--h-pad': '20px', '--logo-w': '160px' }}>
        <div className="snh__bar">
          <div className="snh__in">
            <button type="button" className="snh__burger" data-sn-open="SnMenu" aria-label="Menu">
              <i />
              <i />
              <i />
            </button>
            <Link className="snh__logo" href="/" aria-label="Sakooon">
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
            <nav className="snh__nav" aria-label="Main">
              <ul className="snh__list">
                <li className="snh__li has-mega" data-snh-li="">
                  <Link className="snh__a" href="/collections/bed-sheets" aria-haspopup="true" aria-expanded="false">
                    <span>Bed Sheets</span>
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Link>
                  <div className="snh__mega" data-snh-mega="">
                    <div className="snh__mega-in sn-wrap">
                      <div className="snh__cols">
                        <div className="snh__col" style={{ '--i': '0' }}>
                          <p className="snh__colh">Shop by weave</p>
                          <ul>
                            <li>
                              <Link href="/collections/t200">T200 · Cotton percale</Link>
                            </li>
                            <li>
                              <Link href="/collections/t250">T250 · Fine percale</Link>
                            </li>
                            <li>
                              <Link href="/collections/t300">T300 · Cotton sateen</Link>
                            </li>
                            <li>
                              <Link href="/collections/fitted-sheets">Fitted sheets</Link>
                            </li>
                            <li>
                              <Link href="/collections/flat-sheets">Flat sheet sets</Link>
                            </li>
                            <li>
                              <Link href="/collections/kids-bed-sheets">Kids&apos; sheets</Link>
                            </li>
                          </ul>
                        </div>
                        <Link className="sn-link snh__all" href="/collections/bed-sheets">
                          Shop all Bed Sheets
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
                      </div>
                      <div className="snh__feats" style={{ '--n': '2' }}>
                        <Link className="snh__feat" href="/collections/t300" style={{ '--i': '0' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
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
                                <text
                                  x="48"
                                  y="37"
                                  fontFamily="Georgia,serif"
                                  fontSize="24"
                                  fontStyle="italic"
                                  fill="#D9BF8F"
                                  textAnchor="middle"
                                >
                                  T300
                                </text>
                                <circle cx="10" cy="10" r="3" fill="#D9BF8F" />
                              </g>
                            </svg>
                          </div>
                          <span className="snh__feat-t">
                            <small>Bestseller</small>
                            <b>T300 Sateen</b>
                            <em>Shop now →</em>
                          </span>
                        </Link>
                        <Link className="snh__feat" href="/pages/size-guide" style={{ '--i': '1' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
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
                          <span className="snh__feat-t">
                            <small>Guide</small>
                            <b>Find your thread count</b>
                            <em>Discover →</em>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="snh__li has-mega" data-snh-li="">
                  <Link className="snh__a" href="/collections/duvets" aria-haspopup="true" aria-expanded="false">
                    <span>Duvets</span>
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Link>
                  <div className="snh__mega" data-snh-mega="">
                    <div className="snh__mega-in sn-wrap">
                      <div className="snh__cols">
                        <div className="snh__col" style={{ '--i': '0' }}>
                          <p className="snh__colh">Duvets & covers</p>
                          <ul>
                            <li>
                              <Link href="/collections/winter-duvets">Winter duvets</Link>
                            </li>
                            <li>
                              <Link href="/collections/summer-duvets">Summer duvets</Link>
                            </li>
                            <li>
                              <Link href="/collections/duvet-covers">Duvet covers</Link>
                            </li>
                            <li>
                              <Link href="/collections/bed-covers">Bed covers</Link>
                            </li>
                          </ul>
                        </div>
                        <Link className="sn-link snh__all" href="/collections/duvets">
                          Shop all Duvets
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
                      </div>
                      <div className="snh__feats" style={{ '--n': '2' }}>
                        <Link className="snh__feat" href="/collections/duvets" style={{ '--i': '0' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <defs>
                                <linearGradient id="bgdv" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0" stopColor="#F0EBE2" />
                                  <stop offset="1" stopColor="#E2D8C8" />
                                </linearGradient>
                                <radialGradient id="gldv" cx="50%" cy="30%" r="60%">
                                  <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                                </radialGradient>
                              </defs>
                              <rect width="600" height="750" fill="url(#bgdv)" />
                              <rect width="600" height="750" fill="url(#gldv)" />
                              <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
                              <ellipse cx="300" cy="620" rx="210" ry="20" fill="#1B2130" opacity="0.2" />
                              <rect x="120" y="500" width="360" height="100" rx="46" fill="#FFFDF9" />
                              <circle cx="170" cy="550" r="3" fill="#E3D9C9" />
                              <circle cx="257" cy="550" r="3" fill="#E3D9C9" />
                              <circle cx="343" cy="550" r="3" fill="#E3D9C9" />
                              <circle cx="430" cy="550" r="3" fill="#E3D9C9" />
                              <path d="M150 550.0 H450" stroke="#E3D9C9" strokeWidth="2" strokeDasharray="2 10" />
                              <rect x="126" y="410" width="348" height="100" rx="46" fill="#F6F1E8" />
                              <circle cx="176" cy="460" r="3" fill="#E3D9C9" />
                              <circle cx="259" cy="460" r="3" fill="#E3D9C9" />
                              <circle cx="341" cy="460" r="3" fill="#E3D9C9" />
                              <circle cx="424" cy="460" r="3" fill="#E3D9C9" />
                              <path d="M156 460.0 H444" stroke="#E3D9C9" strokeWidth="2" strokeDasharray="2 10" />
                              <rect x="132" y="320" width="336" height="100" rx="46" fill="#FFFDF9" />
                              <circle cx="182" cy="370" r="3" fill="#E3D9C9" />
                              <circle cx="261" cy="370" r="3" fill="#E3D9C9" />
                              <circle cx="339" cy="370" r="3" fill="#E3D9C9" />
                              <circle cx="418" cy="370" r="3" fill="#E3D9C9" />
                              <path d="M162 370.0 H438" stroke="#E3D9C9" strokeWidth="2" strokeDasharray="2 10" />
                              <path d="M140 390 q160 -40 320 0" stroke="#A8834F" strokeWidth="6" fill="none" />
                            </svg>
                          </div>
                          <span className="snh__feat-t">
                            <small>Winter</small>
                            <b>Cloud Duvet</b>
                            <em>Shop now →</em>
                          </span>
                        </Link>
                        <Link className="snh__feat" href="/collections/duvet-covers" style={{ '--i': '1' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <defs>
                                <linearGradient id="bgdc" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0" stopColor="#E9EDF0" />
                                  <stop offset="1" stopColor="#D6DDE3" />
                                </linearGradient>
                                <radialGradient id="gldc" cx="50%" cy="30%" r="60%">
                                  <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                                </radialGradient>
                              </defs>
                              <rect width="600" height="750" fill="url(#bgdc)" />
                              <rect width="600" height="750" fill="url(#gldc)" />
                              <circle cx="300" cy="300" r="210" fill="#FFFDF9" opacity=".55" />
                              <ellipse cx="300" cy="620" rx="210" ry="20" fill="#1B2130" opacity="0.2" />
                              <rect x="110" y="250" width="380" height="350" rx="20" fill="#DCE3EA" />
                              <rect x="110" y="250" width="380" height="80" rx="20" fill="#C9D3DE" />
                              <circle cx="170" cy="560" r="7" fill="#FFFDF9" stroke="#A8834F" strokeWidth="2" />
                              <circle cx="235" cy="560" r="7" fill="#FFFDF9" stroke="#A8834F" strokeWidth="2" />
                              <circle cx="300" cy="560" r="7" fill="#FFFDF9" stroke="#A8834F" strokeWidth="2" />
                              <circle cx="365" cy="560" r="7" fill="#FFFDF9" stroke="#A8834F" strokeWidth="2" />
                              <circle cx="430" cy="560" r="7" fill="#FFFDF9" stroke="#A8834F" strokeWidth="2" />
                              <path d="M130 530 H470" stroke="#B8C4D1" strokeWidth="2" />
                              <path d="M150 380 q150 30 300 0 M150 450 q150 30 300 0" stroke="#C3CDD8" strokeWidth="3" fill="none" />
                            </svg>
                          </div>
                          <span className="snh__feat-t">
                            <small>New</small>
                            <b>Stonewashed covers</b>
                            <em>Discover →</em>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="snh__li has-mega" data-snh-li="">
                  <Link className="snh__a" href="/collections/pillows" aria-haspopup="true" aria-expanded="false">
                    <span>Pillows</span>
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </Link>
                  <div className="snh__mega" data-snh-mega="">
                    <div className="snh__mega-in sn-wrap">
                      <div className="snh__cols">
                        <div className="snh__col" style={{ '--i': '0' }}>
                          <p className="snh__colh">Pillows & covers</p>
                          <ul>
                            <li>
                              <Link href="/collections/pillow-covers-premium">Pillow covers · Premium</Link>
                            </li>
                            <li>
                              <Link href="/collections/pillow-covers-luxury">Pillow covers · Luxury</Link>
                            </li>
                            <li>
                              <Link href="/collections/cushion-covers">Cushion covers</Link>
                            </li>
                          </ul>
                        </div>
                        <Link className="sn-link snh__all" href="/collections/pillows">
                          Shop all Pillows
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
                      </div>
                      <div className="snh__feats" style={{ '--n': '2' }}>
                        <Link className="snh__feat" href="/collections/pillow-covers-luxury" style={{ '--i': '0' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
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
                          <span className="snh__feat-t">
                            <small>Most loved</small>
                            <b>Luxury Covers</b>
                            <em>Shop now →</em>
                          </span>
                        </Link>
                        <Link className="snh__feat" href="/collections/pillows" style={{ '--i': '1' }}>
                          <div className="sn-media ">
                            <svg
                              className="sn-art "
                              viewBox="0 0 600 750"
                              preserveAspectRatio="xMidYMid slice"
                              aria-hidden="true"
                              focusable="false"
                            >
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
                          <span className="snh__feat-t">
                            <small>Soft</small>
                            <b>Hollow-fibre pillows</b>
                            <em>Discover →</em>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="snh__li">
                  <Link className="snh__pill" href="/pages/size-guide">
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
                      <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
                      <path d="M6 8v3M9.5 8v4.5M13 8v3M16.5 8v4.5" />
                    </svg>
                    <span>Size guide</span>
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="snh__acts">
              <button type="button" className="snh__ic" data-sn-open="SnSearch" aria-label="Search">
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
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
              <Link
                className="snh__ic snh__hide-m"
                href="/account"
                aria-label="Account"
              >
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
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </Link>
              <Link className="snh__ic snh__hide-m" href="/pages/wishlist" aria-label="Wishlist">
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
                  <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" />
                </svg>
                <b className="snh__n is-empty" data-sn-wish-count="">
                  0
                </b>
              </Link>
              <Link className="snh__ic snh__cart" data-sn-cart-icon="" href="/cart" data-sn-open="SnCart" aria-label="Cart">
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
                  <path d="M5 8h14l-1 12H6L5 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                <b className="snh__n is-empty" data-sn-cart-count="">
                  0
                </b>
              </Link>
              <a
                className="snh__cta sn-btn sn-btn--sm"
                href="https://wa.me/923000000000?text=Hi+Sakooon%2C+I+need+help+choosing+bedding."
                target="_blank"
                rel="noopener"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon" aria-hidden="true">
                  <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1.2 5 5.1-1.3A9.3 9.3 0 1 0 12 2.5Zm0 1.8a7.5 7.5 0 1 1-3.9 13.9l-.4-.2-3 .8.8-2.9-.3-.4A7.5 7.5 0 0 1 12 4.3Zm-3.6 3.9c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2s.9 2.3 1 2.4c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.6Z" />
                </svg>
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
          <span className="snh__thread" aria-hidden="true" />
        </div>
        <div className="snh__dim" data-snh-dim="" />
      </header>
      <div className="sn-ov sns" id="SnSearch" hidden aria-label="Search">
        <div className="sns__panel" data-sn-psearch="">
          <div className="sns__silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".7" data-amp=".9" />
          <div className="sns__in sn-wrap">
            <div className="sns__top">
              <p className="sn-eyebrow">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                </svg>
                {' What are you dreaming of?'}
              </p>
              <button type="button" className="sn-ibtn" data-sn-close="" aria-label="Close">
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
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <form action="/search" method="get" role="search" className="sns__form">
              <input type="search" name="q" placeholder="Search sheets, duvets, towels…" autoComplete="off" aria-label="Search" autoFocus />
              <input type="hidden" name="options[prefix]" value="last" />
              <button type="submit" aria-label="Search">
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
            </form>
            <div className="sns__pop">
              <span>Popular</span>
              <Link className="sn-chip" href="/search?q=T300+sateen" style={{ '--i': '0' }}>
                T300 sateen
              </Link>
              <Link className="sn-chip" href="/search?q=King+size" style={{ '--i': '1' }}>
                King size
              </Link>
              <Link className="sn-chip" href="/search?q=Duvet" style={{ '--i': '2' }}>
                Duvet
              </Link>
              <Link className="sn-chip" href="/search?q=Pillow+covers" style={{ '--i': '3' }}>
                Pillow covers
              </Link>
            </div>
            <div className="sns__res" data-sn-presults="" />
          </div>
        </div>
      </div>
      <div className="sn-ov snm" id="SnMenu" hidden aria-label="Menu">
        <div className="sn-ov__bg" data-sn-close="" />
        <aside className="snm__panel" role="dialog" aria-modal="true">
          <div className="snm__head">
            <Link href="/" className="snm__logo" aria-label="Sakooon">
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
            <button type="button" className="sn-ibtn sn-ibtn--sm" data-sn-close="" aria-label="Close">
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
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <nav className="snm__nav">
            <details className="snm__d" style={{ '--i': '0' }}>
              <summary>
                <span>Bed Sheets</span>
                <i />
              </summary>
              <ul>
                <li>
                  <Link href="/collections/t200">T200 · Cotton percale</Link>
                </li>
                <li>
                  <Link href="/collections/t250">T250 · Fine percale</Link>
                </li>
                <li>
                  <Link href="/collections/t300">T300 · Cotton sateen</Link>
                </li>
                <li>
                  <Link href="/collections/fitted-sheets">Fitted sheets</Link>
                </li>
                <li>
                  <Link href="/collections/flat-sheets">Flat sheet sets</Link>
                </li>
                <li>
                  <Link href="/collections/kids-bed-sheets">Kids&apos; sheets</Link>
                </li>
                <li>
                  <Link className="snm__all" href="/collections/bed-sheets">
                    Shop all Bed Sheets →
                  </Link>
                </li>
              </ul>
            </details>
            <details className="snm__d" style={{ '--i': '1' }}>
              <summary>
                <span>Duvets</span>
                <i />
              </summary>
              <ul>
                <li>
                  <Link href="/collections/winter-duvets">Winter duvets</Link>
                </li>
                <li>
                  <Link href="/collections/summer-duvets">Summer duvets</Link>
                </li>
                <li>
                  <Link href="/collections/duvet-covers">Duvet covers</Link>
                </li>
                <li>
                  <Link href="/collections/bed-covers">Bed covers</Link>
                </li>
                <li>
                  <Link className="snm__all" href="/collections/duvets">
                    Shop all Duvets →
                  </Link>
                </li>
              </ul>
            </details>
            <details className="snm__d" style={{ '--i': '2' }}>
              <summary>
                <span>Pillows</span>
                <i />
              </summary>
              <ul>
                <li>
                  <Link href="/collections/pillow-covers-premium">Pillow covers · Premium</Link>
                </li>
                <li>
                  <Link href="/collections/pillow-covers-luxury">Pillow covers · Luxury</Link>
                </li>
                <li>
                  <Link href="/collections/cushion-covers">Cushion covers</Link>
                </li>
                <li>
                  <Link className="snm__all" href="/collections/pillows">
                    Shop all Pillows →
                  </Link>
                </li>
              </ul>
            </details>
            <Link className="snm__a snm__a--pill" href="/pages/size-guide">
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
                <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
                <path d="M6 8v3M9.5 8v4.5M13 8v3M16.5 8v4.5" />
              </svg>
              Size guide
            </Link>
          </nav>
          <div className="snm__foot">
            <div className="snm__quick">
              <Link href="/account">
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
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Sign in
              </Link>
              <Link href="/pages/wishlist">
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
                  <path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" />
                </svg>
                Wishlist
              </Link>
              <a href="https://wa.me/923000000000" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor" className="icon" aria-hidden="true">
                  <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1.2 5 5.1-1.3A9.3 9.3 0 1 0 12 2.5Zm0 1.8a7.5 7.5 0 1 1-3.9 13.9l-.4-.2-3 .8.8-2.9-.3-.4A7.5 7.5 0 0 1 12 4.3Zm-3.6 3.9c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2s.9 2.3 1 2.4c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.6Z" />
                </svg>
                WhatsApp
              </a>
            </div>
            <p className="snm__note">Quick replies on WhatsApp, 7 days a week.</p>
            <div
              className="snm__silk"
              data-sn-silk=""
              data-c1="#161B29"
              data-c2="#2B2B45"
              data-c3="#E3C793"
              data-speed=".8"
              data-mouse="false"
              data-quality="low"
            />
          </div>
        </aside>
      </div>
    </>
  );
}

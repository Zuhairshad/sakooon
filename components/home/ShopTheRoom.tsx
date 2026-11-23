import Link from 'next/link';
import './room.css';
import Static from '@/components/theme/Static';

export default function ShopTheRoom() {
  return (
    <>
      <Static>
      <section
        id="snr-template--23876058939495__room"
        className="sn-s snr"
        style={{ '--bg': '#E8DECF', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px' }}
      >
        <div className="sn-wrap">
          <div className="sn-head sn-head--center ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                </svg>
                {' Shop the room'}
              </p>
              <h2 className="sn-h sn-h--l" data-sn-split="">
                {'Every piece in this '}
                <em>calm bedroom</em>
              </h2>
              <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                Hover the stitches to see each piece — or bring the whole look home in one click.
              </p>
            </div>
          </div>
        </div>
        <div className="snr__stage sn-wrap" data-r="unfold">
          <div className="snr__img sn-media" style={{ aspectRatio: '16 / 9' }}>
            <img
              src="/_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-blue-floral_af507a3b-7166-4428-8f2d-442fa0bca9b6.webp&w=1920&q=75"
              srcSet="/_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-blue-floral_af507a3b-7166-4428-8f2d-442fa0bca9b6.webp&w=1080&q=75 1000w, /_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-blue-floral_af507a3b-7166-4428-8f2d-442fa0bca9b6.webp&w=1600&q=75 1600w, /_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-blue-floral_af507a3b-7166-4428-8f2d-442fa0bca9b6.webp&w=1920&q=75 2200w"
              sizes="100vw"
              alt="Blue floral yarn-dyed cotton satin bed sheet set, king size, with 2 pillow covers – Sakooon"
              width="1448"
              height="1086"
              loading="lazy"
            />
          </div>
          <div className="snr__spot" style={{ '--x': '32%', '--y': '60%', '--i': '0' }} data-snr-spot="">
            <button type="button" className="snr__dot" aria-label="White pillows (pair)" aria-expanded="false">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle className="a" cx="22" cy="22" r="20" />
                <circle className="b" cx="22" cy="22" r="7" />
                <path className="c" d="M22 16v12M16 22h12" />
              </svg>
            </button>
            <div className="snr__pop snr__pop--r sn-glass">
              <span className="snr__pimg sn-media">
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
              </span>
              <div className="snr__pinfo">
                <span className="snr__pt">
                  White pillows (pair)
                </span>
                <span className="snr__pp">Rs. 3,999</span>
                <Link className="sn-link" href="/collections/all">
                  View
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
            </div>
          </div>
          <div className="snr__spot" style={{ '--x': '48%', '--y': '66%', '--i': '1' }} data-snr-spot="">
            <button type="button" className="snr__dot" aria-label="Sage cushion cover" aria-expanded="false">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle className="a" cx="22" cy="22" r="20" />
                <circle className="b" cx="22" cy="22" r="7" />
                <path className="c" d="M22 16v12M16 22h12" />
              </svg>
            </button>
            <div className="snr__pop snr__pop--r sn-glass">
              <span className="snr__pimg sn-media">
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
              </span>
              <div className="snr__pinfo">
                <span className="snr__pt">
                  Sage cushion cover
                </span>
                <span className="snr__pp">Rs. 1,499</span>
                <Link className="sn-link" href="/collections/all">
                  View
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
            </div>
          </div>
          <div className="snr__spot" style={{ '--x': '30%', '--y': '79%', '--i': '2' }} data-snr-spot="">
            <button type="button" className="snr__dot" aria-label="Cloud duvet" aria-expanded="false">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle className="a" cx="22" cy="22" r="20" />
                <circle className="b" cx="22" cy="22" r="7" />
                <path className="c" d="M22 16v12M16 22h12" />
              </svg>
            </button>
            <div className="snr__pop snr__pop--r sn-glass">
              <span className="snr__pimg sn-media">
                <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
              </span>
              <div className="snr__pinfo">
                <span className="snr__pt">
                  Cloud duvet
                </span>
                <span className="snr__pp">Rs. 12,999</span>
                <Link className="sn-link" href="/collections/all">
                  View
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
            </div>
          </div>
          <div className="snr__spot" style={{ '--x': '68%', '--y': '82%', '--i': '3' }} data-snr-spot="">
            <button type="button" className="snr__dot" aria-label="Quilted bed cover" aria-expanded="false">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle className="a" cx="22" cy="22" r="20" />
                <circle className="b" cx="22" cy="22" r="7" />
                <path className="c" d="M22 16v12M16 22h12" />
              </svg>
            </button>
            <div className="snr__pop snr__pop--l sn-glass">
              <span className="snr__pimg sn-media">
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
              </span>
              <div className="snr__pinfo">
                <span className="snr__pt">
                  Quilted bed cover
                </span>
                <span className="snr__pp">Rs. 11,999</span>
                <Link className="sn-link" href="/collections/all">
                  View
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
            </div>
          </div>
          <div className="snr__bar sn-glass" data-r="" style={{ '--i': '3' }}>
            <div className="snr__thumbs">
              <span className="sn-media">
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
              </span>
              <span className="sn-media">
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
              </span>
              <span className="sn-media">
                <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
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
              </span>
              <span className="sn-media">
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
              </span>
            </div>
            <div className="snr__sum">
              <small>The look · 4 pieces</small>
              <b>Pick products in the editor</b>
            </div>
            <Link className="sn-btn sn-btn--gold sn-btn--sm" href="/collections/all">
              <span>Shop the collection</span>
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
        </div>
      </section>
      </Static>
    </>
  );
}

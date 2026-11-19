import '@/app/styles/chrome/popup.css';

export default function Popup() {
  return (
    <>
      <div
        id="snpu-sections--23876059070567__popup"
        className="snpu snpu--center"
        data-delay="8"
        data-days="7"
        data-exit="true"
        data-key="sakooon:pop:welcome"
        hidden
      >
        <div className="snpu__bg" data-snpu-close="" />
        <div
          className="snpu__card"
          role="dialog"
          aria-modal="true"
          aria-label="Sleep better,"
          style={{ '--bg': '#FBF8F2', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '0px', '--pb': '0px' }}
          data-sn-silk-host=""
        >
          <button type="button" className="snpu__x" data-snpu-close="" aria-label="Close">
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
          <div className="snpu__vis">
            <div className="sn-media snpu__img">
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
            <span className="snpu__moon">
              <i />
            </span>
          </div>
          <div className="snpu__body">
            <p className="sn-eyebrow">
              <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.3" />
                <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
              </svg>
              {' Welcome to Sakooon'}
            </p>
            <p className="sn-h sn-h--m">
              {'Sleep better, '}
              <em>save 10%</em>
            </p>
            <p className="snpu__text">Join our bedtime letter and get 10% off your first order.</p>
            <form
              method="post"
              action="/contact#SnPop-sections--23876059070567__popup"
              id="SnPop-sections--23876059070567__popup"
              acceptCharset="UTF-8"
              className="snpu__form"
            >
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="contact[tags]" value="newsletter,popup" />
              <div className="sn-pill-form">
                <input type="email" name="contact[email]" required placeholder="Your email" aria-label="Your email" autoComplete="email" />
                <button className="sn-btn sn-btn--gold sn-btn--sm" type="submit">
                  <span>Get my code</span>
                </button>
              </div>
            </form>
            <button type="button" className="snpu__no" data-snpu-close="">
              No thanks, I sleep fine
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

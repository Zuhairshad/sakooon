import '@/app/styles/chrome/popup.css';
import { img, srcset } from '@/lib/utils';

const PHOTO = '/images/sakooon-duvet-comfort-pillow-pack-of-2.webp';

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
              <img
                src={img(PHOTO, 600)}
                srcSet={srcset(PHOTO, [400, 600, 900])}
                sizes="(min-width: 700px) 300px, 100vw"
                alt="Two white Sakooon cotton pillows with microfibre filling"
                width={1264}
                height={1568}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: '50% 40%' }}
              />
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

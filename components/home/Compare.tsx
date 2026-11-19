import Link from 'next/link';
import './compare.css';
import Static from '@/components/theme/Static';

export default function Compare() {
  return (
    <>
      <Static>
      <section
        id="sncp-template--23876058939495__compare"
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
                  <img
                    src="/_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-pillow-pack-of-2.webp&w=750&q=75"
                    srcSet="/_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-pillow-pack-of-2.webp&w=600&q=75 600w, /_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-pillow-pack-of-2.webp&w=1080&q=75 1000w, /_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-pillow-pack-of-2.webp&w=750&q=75 700w"
                    sizes="30vw"
                    alt="Sakooon Duvet Comfort Pillow, pack of 2 white cotton pillows with microfibre filling"
                    width="1264"
                    height="1568"
                    loading="lazy"
                    style={{ objectPosition: '50.0% 50.0%' }}
                  />
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
              <Link className="sn-btn sn-btn--ghost sn-btn--block" href="/collections">
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
                  <img
                    src="/_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-filling-220-gsm.webp&w=750&q=75"
                    srcSet="/_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-filling-220-gsm.webp&w=600&q=75 600w, /_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-filling-220-gsm.webp&w=1080&q=75 1000w, /_next/image?url=%2Fimages%2Fsakooon-duvet-comfort-filling-220-gsm.webp&w=750&q=75 700w"
                    sizes="30vw"
                    alt="Sakooon Duvet Comfort Filling, rolled white 220 GSM winter duvet insert on a bed"
                    width="900"
                    height="1317"
                    loading="lazy"
                    style={{ objectPosition: '50.0% 50.0%' }}
                  />
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
              <Link className="sn-btn sn-btn--gold sn-btn--block" href="/collections">
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
      </Static>
    </>
  );
}

import Link from 'next/link';
import './editorial.css';
import Static from '@/components/theme/Static';

export default function Editorial() {
  return (
    <>
      <Static>
      <section
        id="sned-template--23876058939495__editorial"
        className="sn-s sned sned--letter"
        style={{ '--bg': '#FBF8F2', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '128px', '--pb': '120px' }}
        data-sned=""
      >
        <div className="sn-wrap sned__in">
          <div className="sned__img sned__img--a" data-sned-par="-0.12">
            <div className="sn-media sned__m sn-ripple" data-r="unfold">
              <img
                src="/_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-pink-chevron_d4750f1f-7dff-41af-bff3-becb3630bc51.webp&w=1080&q=75"
                srcSet="/_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-pink-chevron_d4750f1f-7dff-41af-bff3-becb3630bc51.webp&w=600&q=75 600w, /_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-pink-chevron_d4750f1f-7dff-41af-bff3-becb3630bc51.webp&w=1080&q=75 1000w, /_next/image?url=%2Fimages%2Fsakooon-yarn-dyed-bed-sheet-set-pink-chevron_d4750f1f-7dff-41af-bff3-becb3630bc51.webp&w=1080&q=75 1000w"
                sizes="(min-width: 990px) 28vw, 70vw"
                alt="Pink chevron yarn-dyed cotton satin bed sheet set, king size, with 2 pillow covers – Sakooon"
                width="1024"
                height="1536"
                loading="lazy"
                style={{ objectPosition: '50.0% 50.0%' }}
              />
            </div>
          </div>
          <div className="sned__img sned__img--b" data-sned-par="0.16">
            <div className="sn-media sned__m2" data-r="zoom">
              <img
                src="/_next/image?url=%2Fimages%2Fsakooon-quilted-bed-sheet-set-sage-green.webp&w=750&q=75"
                srcSet="/_next/image?url=%2Fimages%2Fsakooon-quilted-bed-sheet-set-sage-green.webp&w=600&q=75 600w, /_next/image?url=%2Fimages%2Fsakooon-quilted-bed-sheet-set-sage-green.webp&w=1080&q=75 1000w, /_next/image?url=%2Fimages%2Fsakooon-quilted-bed-sheet-set-sage-green.webp&w=750&q=75 700w"
                sizes="22vw"
                alt="Sage green quilted cotton bed sheet set, king size, with 2 pillow covers – Sakooon"
                width="1024"
                height="1536"
                loading="lazy"
                style={{ objectPosition: '50.0% 50.0%' }}
              />
            </div>
          </div>
          <div className="sned__copy">
            <p className="sn-eyebrow" data-r="">
              <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.3" />
                <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
              </svg>
              {' A letter from Sakooon'}
            </p>
            <h2 className="sn-h sn-h--l" data-sn-split="">
              {'Sukoon means '}
              <em>peace of mind</em>
            </h2>
            <div className="sned__text sn-rte has-drop" data-r="" style={{ '--i': '2' }}>
              <p>
                We started Sakooon with one simple belief: everyone deserves to sleep like they&apos;re in a five-star hotel. So we went straight
                to the mills, chose long-staple cotton we would sleep on ourselves, and priced it fairly.
              </p>
              <p>Every sheet is checked by hand, folded with care and sent to you with a little note. Sleep well.</p>
            </div>
            <div className="sned__sign" data-r="" style={{ '--i': '3' }}>
              <svg viewBox="0 0 320 70" aria-hidden="true">
                <text x="4" y="52" className="sned__sig" data-sned-sig="">
                  The Sakooon family
                </text>
              </svg>
              <span>Lahore · Est. 2026</span>
            </div>
            <Link className="sn-btn" data-r="" style={{ '--i': '4' }} href="/pages/about">
              <span>Read our story</span>
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
        <div className="sn-wrap">
          <ul className="sned__stats" data-r="">
            <li>
              <b>
                <span data-sned-count="10000">10,000</span>
                <i>+</i>
              </b>
              <small>Restful nights</small>
            </li>
            <li>
              <b>
                <span data-sned-count="300">300</span>
                <i>TC</i>
              </b>
              <small>Finest weave</small>
            </li>
            <li>
              <b>
                <span data-sned-count="4.9">4.9</span>
                <i>★</i>
              </b>
              <small>Average rating</small>
            </li>
            <li>
              <b>
                <span data-sned-count="7">7</span>
                <i>days</i>
              </b>
              <small>Easy exchange</small>
            </li>
          </ul>
        </div>
      </section>
      </Static>
    </>
  );
}

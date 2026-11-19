import './reviews.css';
import Static from '@/components/theme/Static';

export default function Reviews() {
  return (
    <>
      <Static>
      <section
        id="snrv-template--23876058939495__reviews"
        className="sn-s snrv snrv--sky"
        style={{ '--bg': '#161B29', '--tx': '#F4EEE4', '--ac': '#E3C793', '--pt': '120px', '--pb': '120px', colorScheme: 'dark' }}
        data-sn-silk-host=""
      >
        <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".5" data-amp=".7" />
        <div className="sn-wrap">
          <div className="snrv__head">
            <div className="sn-head ">
              <div className="sn-head__main">
                <p className="sn-eyebrow" data-r="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                  </svg>
                  {' Kind words'}
                </p>
                <h2 className="sn-h sn-h--l" data-sn-split="">
                  {'A sky full of '}
                  <em>good nights</em>
                </h2>
              </div>
            </div>
            <div className="snrv__score sn-glass" data-r="">
              <b>4.9</b>
              <span>
                <span className="sn-stars" style={{ '--p': '98.0%' }} />
                <small>from 1,200+ happy sleepers</small>
              </span>
            </div>
          </div>
          <div className="snrv__sky" data-snrv="">
            <svg className="snrv__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <line x1="8" y1="34" x2="24" y2="8" style={{ '--i': '1' }} />
              <line x1="24" y1="8" x2="50" y2="2" style={{ '--i': '2' }} />
              <line x1="50" y1="2" x2="76" y2="10" style={{ '--i': '3' }} />
              <line x1="76" y1="10" x2="92" y2="34" style={{ '--i': '4' }} />
            </svg>
            <button
              type="button"
              className="snrv__star is-on"
              style={{ '--x': '8%', '--y': '34%', '--i': '0' }}
              data-snrv-star="0"
              aria-label="Ayesha K."
            >
              <span>A</span>
            </button>
            <button
              type="button"
              className="snrv__star"
              style={{ '--x': '24%', '--y': '8%', '--i': '1' }}
              data-snrv-star="1"
              aria-label="Hamza R."
            >
              <span>H</span>
            </button>
            <button
              type="button"
              className="snrv__star"
              style={{ '--x': '50%', '--y': '2%', '--i': '2' }}
              data-snrv-star="2"
              aria-label="Usman T."
            >
              <span>U</span>
            </button>
            <button
              type="button"
              className="snrv__star"
              style={{ '--x': '76%', '--y': '10%', '--i': '3' }}
              data-snrv-star="3"
              aria-label="Sana M."
            >
              <span>S</span>
            </button>
            <button
              type="button"
              className="snrv__star"
              style={{ '--x': '92%', '--y': '34%', '--i': '4' }}
              data-snrv-star="4"
              aria-label="Bilal & Hira"
            >
              <span>B</span>
            </button>
            <div className="snrv__quotes">
              <figure className="snrv__q is-on" data-snrv-q="">
                <span className="sn-stars" style={{ '--p': '100%' }} />
                <blockquote className="sn-h sn-h--m">
                  “The T300 sheets feel like a five-star hotel. Soft from the very first night.”
                </blockquote>
                <figcaption>
                  <b>Ayesha K.</b>
                  {' · Lahore'}
                  <em>T300 sateen set</em>
                </figcaption>
              </figure>
              <figure className="snrv__q" data-snrv-q="">
                <span className="sn-stars" style={{ '--p': '100%' }} />
                <blockquote className="sn-h sn-h--m">
                  “Finally a duvet that is warm without being heavy. It arrived wrapped like a gift.”
                </blockquote>
                <figcaption>
                  <b>Hamza R.</b>
                  {' · Karachi'}
                  <em>Cloud duvet</em>
                </figcaption>
              </figure>
              <figure className="snrv__q" data-snrv-q="">
                <span className="sn-stars" style={{ '--p': '100%' }} />
                <blockquote className="sn-h sn-h--m">
                  “Used the size guide, ordered King — fits our mattress perfectly, even with a topper.”
                </blockquote>
                <figcaption>
                  <b>Usman T.</b>
                  {' · Faisalabad'}
                  <em>T250 sheet set</em>
                </figcaption>
              </figure>
              <figure className="snrv__q" data-snrv-q="">
                <span className="sn-stars" style={{ '--p': '100%' }} />
                <blockquote className="sn-h sn-h--m">“The piped luxury pillow covers make my bedroom look styled. Love them.”</blockquote>
                <figcaption>
                  <b>Sana M.</b>
                  {' · Multan'}
                  <em>Luxury covers</em>
                </figcaption>
              </figure>
              <figure className="snrv__q" data-snrv-q="">
                <span className="sn-stars" style={{ '--p': '100%' }} />
                <blockquote className="sn-h sn-h--m">
                  “We gifted a complete set at a wedding and everyone asked where it was from!”
                </blockquote>
                <figcaption>
                  <b>Bilal & Hira</b>
                  {' · Rawalpindi'}
                  <em>Complete bed set</em>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
      </Static>
    </>
  );
}

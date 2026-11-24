import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './threads.css';

export default function Threads() {
  return (
    <>
      <SectionScript id="sntg-template--23876058447975__threads" name="threads" />
      <section
        id="sntg-template--23876058447975__threads"
        className="sn-s sntg"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px' }}
        data-sntg=""
        data-start="2"
      >
        <div className="sn-wrap">
          <div className="sn-head sn-head--center ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                </svg>
                {' The loom'}
              </p>
              <h2 className="sn-h sn-h--l" data-sn-split="">
                {'Watch your sheet being '}
                <em>woven</em>
              </h2>
              <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                Thread count is how many threads are woven into one square inch. Choose a weave and watch the loom work — denser weaves feel
                smoother and silkier.
              </p>
            </div>
          </div>
          <div className="sntg__grid">
            <div className="sntg__loom sn-pillow sn-stitch" data-r="unfold">
              <canvas data-sntg-cv="" width="720" height="820" aria-hidden="true" />
              <div className="sntg__badge">
                <b data-sntg-num="">300</b>
                <span>Threads per sq. inch</span>
              </div>
              <p className="sntg__weave" data-sntg-weave="">
                Cotton sateen
              </p>
            </div>
            <div className="sntg__side">
              <div className="sntg__spools" role="tablist" data-r="">
                <button
                  type="button"
                  role="tab"
                  className="sntg__spool"
                  data-sntg-tab="0"
                  data-n="200"
                  data-w="Cotton percale"
                  data-tone="#DCE6EE"
                  aria-selected="false"
                >
                  <span className="sntg__reel" style={{ '--tone': '#DCE6EE' }}>
                    <i />
                  </span>
                  <span className="sntg__lab">
                    <b>T200</b>
                    <small>Everyday</small>
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  className="sntg__spool"
                  data-sntg-tab="1"
                  data-n="250"
                  data-w="Fine percale"
                  data-tone="#D5DEC9"
                  aria-selected="false"
                >
                  <span className="sntg__reel" style={{ '--tone': '#D5DEC9' }}>
                    <i />
                  </span>
                  <span className="sntg__lab">
                    <b>T250</b>
                    <small>Bestseller</small>
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  className="sntg__spool is-on"
                  data-sntg-tab="2"
                  data-n="300"
                  data-w="Cotton sateen"
                  data-tone="#F2ECE0"
                  aria-selected="true"
                >
                  <span className="sntg__reel" style={{ '--tone': '#F2ECE0' }}>
                    <i />
                  </span>
                  <span className="sntg__lab">
                    <b>T300</b>
                    <small>Luxury</small>
                  </span>
                </button>
              </div>
              <article className="sntg__panel" data-sntg-panel="" hidden>
                <p className="sn-eyebrow">T200 · Long-staple cotton</p>
                <h3 className="sn-h sn-h--m">Light, crisp and breathable</h3>
                <div className="sn-rte">
                  <p>
                    A simple one-over, one-under weave with a fresh matte finish — perfect for warm nights. It softens beautifully with
                    every wash.
                  </p>
                </div>
                <ul className="sntg__meters">
                  <li style={{ '--v': '60%', '--i': '0' }}>
                    <span>Softness</span>
                    <i>
                      <b />
                    </i>
                    <em>6</em>
                  </li>
                  <li style={{ '--v': '60%', '--i': '1' }}>
                    <span>Smoothness</span>
                    <i>
                      <b />
                    </i>
                    <em>6</em>
                  </li>
                  <li style={{ '--v': '100%', '--i': '2' }}>
                    <span>Breathability</span>
                    <i>
                      <b />
                    </i>
                    <em>10</em>
                  </li>
                  <li style={{ '--v': '70%', '--i': '3' }}>
                    <span>Durability</span>
                    <i>
                      <b />
                    </i>
                    <em>7</em>
                  </li>
                </ul>
                <div className="sntg__best">
                  <span className="sn-chip">Kids&apos; rooms</span>
                  <span className="sn-chip">Guest rooms</span>
                  <span className="sn-chip">Hot summers</span>
                </div>
                <div className="sntg__foot">
                  <p className="sntg__price">
                    <small>Sets from</small>Rs. 5,499
                  </p>
                  <Link className="sn-btn" href="/collections/all">
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
                </div>
              </article>
              <article className="sntg__panel" data-sntg-panel="" hidden>
                <p className="sn-eyebrow">T250 · Long-staple cotton</p>
                <h3 className="sn-h sn-h--m">The perfect balance of soft and cool</h3>
                <div className="sn-rte">
                  <p>Finer yarns woven tighter for a smoother hand-feel that still breathes through Pakistani summers.</p>
                </div>
                <ul className="sntg__meters">
                  <li style={{ '--v': '80%', '--i': '0' }}>
                    <span>Softness</span>
                    <i>
                      <b />
                    </i>
                    <em>8</em>
                  </li>
                  <li style={{ '--v': '80%', '--i': '1' }}>
                    <span>Smoothness</span>
                    <i>
                      <b />
                    </i>
                    <em>8</em>
                  </li>
                  <li style={{ '--v': '90%', '--i': '2' }}>
                    <span>Breathability</span>
                    <i>
                      <b />
                    </i>
                    <em>9</em>
                  </li>
                  <li style={{ '--v': '80%', '--i': '3' }}>
                    <span>Durability</span>
                    <i>
                      <b />
                    </i>
                    <em>8</em>
                  </li>
                </ul>
                <div className="sntg__best">
                  <span className="sn-chip">Couples</span>
                  <span className="sn-chip">All seasons</span>
                  <span className="sn-chip">Daily use</span>
                </div>
                <div className="sntg__foot">
                  <p className="sntg__price">
                    <small>Sets from</small>Rs. 7,499
                  </p>
                  <Link className="sn-btn" href="/collections/all">
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
                </div>
              </article>
              <article className="sntg__panel is-on" data-sntg-panel="">
                <p className="sn-eyebrow">T300 · Long-staple cotton</p>
                <h3 className="sn-h sn-h--m">Silky, lustrous and made to impress</h3>
                <div className="sn-rte">
                  <p>Our densest weave. Four threads float over one, giving sateen its soft sheen and a cool, buttery drape.</p>
                </div>
                <ul className="sntg__meters">
                  <li style={{ '--v': '90%', '--i': '0' }}>
                    <span>Softness</span>
                    <i>
                      <b />
                    </i>
                    <em>9</em>
                  </li>
                  <li style={{ '--v': '100%', '--i': '1' }}>
                    <span>Smoothness</span>
                    <i>
                      <b />
                    </i>
                    <em>10</em>
                  </li>
                  <li style={{ '--v': '70%', '--i': '2' }}>
                    <span>Breathability</span>
                    <i>
                      <b />
                    </i>
                    <em>7</em>
                  </li>
                  <li style={{ '--v': '90%', '--i': '3' }}>
                    <span>Durability</span>
                    <i>
                      <b />
                    </i>
                    <em>9</em>
                  </li>
                </ul>
                <div className="sntg__best">
                  <span className="sn-chip">Master bedroom</span>
                  <span className="sn-chip">Gifting</span>
                  <span className="sn-chip">Hotel feel</span>
                </div>
                <div className="sntg__foot">
                  <p className="sntg__price">
                    <small>Sets from</small>Rs. 8,999
                  </p>
                  <Link className="sn-btn" href="/collections/all">
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
                </div>
              </article>
            </div>
          </div>
          <div className="sntg__table sn-pillow" data-r="">
            <table>
              <thead>
                <tr>
                  <th scope="col">Compare</th>
                  <th scope="col">
                    T200<small>Everyday</small>
                  </th>
                  <th scope="col">
                    T250<small>Bestseller</small>
                  </th>
                  <th scope="col" className="is-f">
                    T300<small>Luxury</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Softness</th>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="6 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="8 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td className="is-f">
                    <span className="sntg__moons" role="img" aria-label="9 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Smoothness</th>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="6 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="8 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td className="is-f">
                    <span className="sntg__moons" role="img" aria-label="10 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Breathability</th>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="10 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                    </span>
                  </td>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="9 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                      </svg>
                    </span>
                  </td>
                  <td className="is-f">
                    <span className="sntg__moons" role="img" aria-label="7 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Durability</th>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="7 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td>
                    <span className="sntg__moons" role="img" aria-label="8 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                      </svg>
                    </span>
                  </td>
                  <td className="is-f">
                    <span className="sntg__moons" role="img" aria-label="9 / 10">
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <circle cx="8" cy="8" r="5.6" style={{ fill: 'currentColor', stroke: 'none' }} />
                      </svg>
                      <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                      </svg>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Best for</th>
                  <td>Kids&apos; rooms</td>
                  <td>Couples</td>
                  <td className="is-f">Master bedroom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

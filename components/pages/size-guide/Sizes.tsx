import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './sizes.css';

export default function Sizes() {
  return (
    <>
      <SectionScript id="snsg-template--23876058447975__sizes" name="sizes" />
      <section
        id="snsg-template--23876058447975__sizes"
        className="sn-s snsg"
        style={{ '--bg': '#FBF8F2', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px' }}
        data-snsg=""
        data-start="3"
        data-maxw="78"
        data-maxl="84"
      >
        <div className="sn-wrap">
          <div className="snsg__top">
            <div className="sn-head ">
              <div className="sn-head__main">
                <p className="sn-eyebrow" data-r="">
                  <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.3" />
                    <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                  </svg>
                  {' Size guide'}
                </p>
                <h2 className="sn-h sn-h--l" data-sn-split="">
                  {'The perfect fit for '}
                  <em>your bed</em>
                </h2>
                <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                  Slide along the ruler to your mattress size — the bed, sheets and duvet resize to show exactly what fits.
                </p>
              </div>
            </div>
            <div className="snsg__unit" role="group" aria-label="Units" data-r="">
              <button type="button" className="is-on" data-snsg-u="in">
                Inches
              </button>
              <button type="button" data-snsg-u="cm">
                cm
              </button>
              <span />
            </div>
          </div>
          <div className="snsg__ruler" role="tablist" data-r="">
            <span className="snsg__ticks" aria-hidden="true" />
            <span className="snsg__mark" data-snsg-mark="" aria-hidden="true" />
            <button type="button" role="tab" className="snsg__size" data-snsg-tab="0" data-w="36" data-l="78" data-p="1">
              <b>Single</b>
              <small data-snsg-dim="">36 × 78 in</small>
            </button>
            <button type="button" role="tab" className="snsg__size" data-snsg-tab="1" data-w="54" data-l="75" data-p="2">
              <b>Double</b>
              <small data-snsg-dim="">54 × 75 in</small>
            </button>
            <button type="button" role="tab" className="snsg__size" data-snsg-tab="2" data-w="60" data-l="78" data-p="2">
              <b>Queen</b>
              <small data-snsg-dim="">60 × 78 in</small>
            </button>
            <button type="button" role="tab" className="snsg__size is-on" data-snsg-tab="3" data-w="72" data-l="78" data-p="2">
              <b>King</b>
              <small data-snsg-dim="">72 × 78 in</small>
              <em>Most popular</em>
            </button>
            <button type="button" role="tab" className="snsg__size" data-snsg-tab="4" data-w="78" data-l="84" data-p="3">
              <b>Super King</b>
              <small data-snsg-dim="">78 × 84 in</small>
            </button>
          </div>
          <div className="snsg__main">
            <div className="snsg__scene" data-r="zoom">
              <div className="snsg__floor" aria-hidden="true" />
              <div className="snsg__bed" data-snsg-bed="" aria-hidden="true">
                <div className="snsg__mat">
                  <span className="snsg__duvet" />
                  <span className="snsg__fold" />
                  <span className="snsg__pills" data-snsg-pills="" />
                </div>
                <div className="snsg__head" />
                <span className="snsg__dw">
                  <b data-snsg-w="" />
                </span>
                <span className="snsg__dl">
                  <b data-snsg-l="" />
                </span>
              </div>
              <p className="snsg__note">Your mattress, seen from the corner</p>
            </div>
            <div className="snsg__cards">
              <div className="snsg__card sn-pillow sn-stitch" data-snsg-card="" hidden>
                <p className="sn-eyebrow">What fits</p>
                <h3 className="sn-h sn-h--m">Single</h3>
                <dl>
                  <div>
                    <dt>
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
                        <path d="M3 5v15M3 13h18v7M3 17h18" />
                        <rect x="5.5" y="9" width="6" height="4" rx="1.6" />
                      </svg>
                      Fitted sheet
                    </dt>
                    <dd data-snsg-conv="">36 x 78 x 14 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 13 9 5 9-5" />
                      </svg>
                      Flat sheet
                    </dt>
                    <dd data-snsg-conv="">66 x 100 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M3 12c3 2 6-2 9 0s6 2 9 0M9 5v14M15 5v14" />
                      </svg>
                      Duvet / cover
                    </dt>
                    <dd data-snsg-conv="">68 x 88 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M5 6c3 1 11 1 14 0 1.6 2.2 1.6 9.8 0 12-3-1-11-1-14 0-1.6-2.2-1.6-9.8 0-12Z" />
                        <path d="M9 12h6" />
                      </svg>
                      Pillow covers
                    </dt>
                    <dd>
                      <span data-snsg-conv="">20 x 30 in</span>
                      {' × 1'}
                    </dd>
                  </div>
                </dl>
                <Link className="sn-btn sn-btn--block" href="/collections/all">
                  <span>Shop Single</span>
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
              <div className="snsg__card sn-pillow sn-stitch" data-snsg-card="" hidden>
                <p className="sn-eyebrow">What fits</p>
                <h3 className="sn-h sn-h--m">Double</h3>
                <dl>
                  <div>
                    <dt>
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
                        <path d="M3 5v15M3 13h18v7M3 17h18" />
                        <rect x="5.5" y="9" width="6" height="4" rx="1.6" />
                      </svg>
                      Fitted sheet
                    </dt>
                    <dd data-snsg-conv="">54 x 75 x 14 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 13 9 5 9-5" />
                      </svg>
                      Flat sheet
                    </dt>
                    <dd data-snsg-conv="">81 x 96 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M3 12c3 2 6-2 9 0s6 2 9 0M9 5v14M15 5v14" />
                      </svg>
                      Duvet / cover
                    </dt>
                    <dd data-snsg-conv="">80 x 88 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M5 6c3 1 11 1 14 0 1.6 2.2 1.6 9.8 0 12-3-1-11-1-14 0-1.6-2.2-1.6-9.8 0-12Z" />
                        <path d="M9 12h6" />
                      </svg>
                      Pillow covers
                    </dt>
                    <dd>
                      <span data-snsg-conv="">20 x 30 in</span>
                      {' × 2'}
                    </dd>
                  </div>
                </dl>
                <Link className="sn-btn sn-btn--block" href="/collections/all">
                  <span>Shop Double</span>
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
              <div className="snsg__card sn-pillow sn-stitch" data-snsg-card="" hidden>
                <p className="sn-eyebrow">What fits</p>
                <h3 className="sn-h sn-h--m">Queen</h3>
                <dl>
                  <div>
                    <dt>
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
                        <path d="M3 5v15M3 13h18v7M3 17h18" />
                        <rect x="5.5" y="9" width="6" height="4" rx="1.6" />
                      </svg>
                      Fitted sheet
                    </dt>
                    <dd data-snsg-conv="">60 x 78 x 14 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 13 9 5 9-5" />
                      </svg>
                      Flat sheet
                    </dt>
                    <dd data-snsg-conv="">96 x 104 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M3 12c3 2 6-2 9 0s6 2 9 0M9 5v14M15 5v14" />
                      </svg>
                      Duvet / cover
                    </dt>
                    <dd data-snsg-conv="">90 x 94 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M5 6c3 1 11 1 14 0 1.6 2.2 1.6 9.8 0 12-3-1-11-1-14 0-1.6-2.2-1.6-9.8 0-12Z" />
                        <path d="M9 12h6" />
                      </svg>
                      Pillow covers
                    </dt>
                    <dd>
                      <span data-snsg-conv="">20 x 30 in</span>
                      {' × 2'}
                    </dd>
                  </div>
                </dl>
                <Link className="sn-btn sn-btn--block" href="/collections/all">
                  <span>Shop Queen</span>
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
              <div className="snsg__card sn-pillow sn-stitch is-on" data-snsg-card="">
                <p className="sn-eyebrow">What fits</p>
                <h3 className="sn-h sn-h--m">King</h3>
                <dl>
                  <div>
                    <dt>
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
                        <path d="M3 5v15M3 13h18v7M3 17h18" />
                        <rect x="5.5" y="9" width="6" height="4" rx="1.6" />
                      </svg>
                      Fitted sheet
                    </dt>
                    <dd data-snsg-conv="">72 x 78 x 14 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 13 9 5 9-5" />
                      </svg>
                      Flat sheet
                    </dt>
                    <dd data-snsg-conv="">108 x 108 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M3 12c3 2 6-2 9 0s6 2 9 0M9 5v14M15 5v14" />
                      </svg>
                      Duvet / cover
                    </dt>
                    <dd data-snsg-conv="">104 x 90 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M5 6c3 1 11 1 14 0 1.6 2.2 1.6 9.8 0 12-3-1-11-1-14 0-1.6-2.2-1.6-9.8 0-12Z" />
                        <path d="M9 12h6" />
                      </svg>
                      Pillow covers
                    </dt>
                    <dd>
                      <span data-snsg-conv="">20 x 30 in</span>
                      {' × 2'}
                    </dd>
                  </div>
                </dl>
                <p className="sn-small">The usual double bed in most Pakistani homes.</p>
                <Link className="sn-btn sn-btn--block" href="/collections/all">
                  <span>Shop King size</span>
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
              <div className="snsg__card sn-pillow sn-stitch" data-snsg-card="" hidden>
                <p className="sn-eyebrow">What fits</p>
                <h3 className="sn-h sn-h--m">Super King</h3>
                <dl>
                  <div>
                    <dt>
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
                        <path d="M3 5v15M3 13h18v7M3 17h18" />
                        <rect x="5.5" y="9" width="6" height="4" rx="1.6" />
                      </svg>
                      Fitted sheet
                    </dt>
                    <dd data-snsg-conv="">78 x 84 x 14 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                        <path d="m3 13 9 5 9-5" />
                      </svg>
                      Flat sheet
                    </dt>
                    <dd data-snsg-conv="">112 x 112 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M3 12c3 2 6-2 9 0s6 2 9 0M9 5v14M15 5v14" />
                      </svg>
                      Duvet / cover
                    </dt>
                    <dd data-snsg-conv="">110 x 98 in</dd>
                  </div>
                  <div>
                    <dt>
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
                        <path d="M5 6c3 1 11 1 14 0 1.6 2.2 1.6 9.8 0 12-3-1-11-1-14 0-1.6-2.2-1.6-9.8 0-12Z" />
                        <path d="M9 12h6" />
                      </svg>
                      Pillow covers
                    </dt>
                    <dd>
                      <span data-snsg-conv="">20 x 36 in</span>
                      {' × 3'}
                    </dd>
                  </div>
                </dl>
                <Link className="sn-btn sn-btn--block" href="/collections/all">
                  <span>Shop Super King</span>
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
          <p className="snsg__tip" data-r="">
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
            Tip: our fitted sheets hug mattresses up to 14 inches deep — even with a topper.
          </p>
        </div>
      </section>
    </>
  );
}

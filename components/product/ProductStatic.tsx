import Link from "next/link";

/** Static blocks of the product template (identical on every product in the theme). */
export function StaticAccordions() {
  return (
    <>
      <details className="sn-acc snmp__acc">
        <summary>
          <span className="snmp__acct">
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
              <path d="M3 6l2 13h14l2-13" />
              <path d="M4.2 9.5c1.9 1.4 3.8 1.4 5.3 0s3.5-1.4 5.1 0 3.4 1.4 5.2 0" />
            </svg>
            Fabric & care
          </span>
          <i aria-hidden="true" />
        </summary>
        <div className="sn-acc__body sn-rte">
          <ul className="sk-care" aria-label="Care instructions">
            <li>
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path
                  d="M5 12l3 20h24l3-20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 16c3 2 5 2 7 0s4-2 7 0 5 2 7 0 4-2 6 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <text
                  x="20"
                  y="28.5"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="sans-serif"
                  fill="currentColor"
                >
                  40°
                </text>
              </svg>
              <span>Machine wash 30–40°C</span>
            </li>
            <li>
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path
                  d="M20 8 34 32H6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9l22 24M31 9 9 33"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              <span>Do not bleach</span>
            </li>
            <li>
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect
                  x="7"
                  y="7"
                  width="26"
                  height="26"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="20" cy="20" r="1.6" fill="currentColor" />
              </svg>
              <span>Tumble dry low</span>
            </li>
            <li>
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path
                  d="M6 29h28v-5a9 9 0 0 0-9-9H13M6 29l3-10h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="24" r="1.4" fill="currentColor" />
                <circle cx="23" cy="24" r="1.4" fill="currentColor" />
              </svg>
              <span>Iron medium heat</span>
            </li>
            <li>
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <circle
                  cx="20"
                  cy="20"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M10 10l20 20M30 10 10 30"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              <span>Do not dry clean</span>
            </li>
          </ul>

          <p>
            Machine wash cool, tumble dry low, iron warm. Wash darks separately
            for the first time.
          </p>
        </div>
      </details>
      <details className="sn-acc snmp__acc">
        <summary>
          <span className="snmp__acct">
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
              <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
              <circle cx="7.5" cy="17.5" r="1.8" />
              <circle cx="17.5" cy="17.5" r="1.8" />
            </svg>
            Delivery & exchange
          </span>
          <i aria-hidden="true" />
        </summary>
        <div className="sn-acc__body sn-rte">
          <p>
            Delivered in 2–5 working days across Pakistan. Cash on delivery
            available. Exchange within 7 days in original packing.
          </p>
        </div>
      </details>
    </>
  );
}

export function LightboxControls() {
  return (
    <>
      <button
        type="button"
        className="sn-ibtn snmp__lbn snmp__lbn--prev"
        data-snmp-lbn="-1"
        aria-label="Previous image"
      >
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
          <path d="M20 12H4M10 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        className="sn-ibtn snmp__lbn snmp__lbn--next"
        data-snmp-lbn="1"
        aria-label="Next image"
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
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <button
        type="button"
        className="sn-ibtn snmp__lbx"
        data-snmp-lbx=""
        aria-label="Close"
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
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <p className="snmp__lbhint">Tap to zoom · swipe for more</p>
    </>
  );
}

export function SizeGuideDrawer({ id }: { id: string }) {
  return (
    <div className="sn-ov" id={id} hidden>
      <div className="sn-ov__bg" data-sn-close="" />
      <div
        className="sn-drawer snmp__sg"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
      >
        <div className="sn-drawer__head">
          <p className="sn-drawer__title">Size guide</p>
          <button
            type="button"
            className="sn-ibtn sn-ibtn--sm"
            data-sn-close=""
            aria-label="Close"
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
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="sn-drawer__body sn-rte">
          <p>
            <strong>Fitted sheet (inches)</strong>
          </p>
          <p>
            Single 36 x 78 · Double 54 x 75 · Queen 60 x 78 · King 72 x 78 ·
            Super King 78 x 80
          </p>
          <p>
            <strong>Duvet cover</strong>
          </p>
          <p>Single 54 x 86 · Double 78 x 86 · King 90 x 96</p>
          <p>Pockets fit mattresses up to 12 in deep.</p>
          <p>
            <Link href="/pages/size-guide">Open the full size guide</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

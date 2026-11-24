import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './faq.css';

export default function Faq({ showContactCta = true }: { showContactCta?: boolean } = {}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\": \"https://schema.org\", \"@type\": \"FAQPage\", \"mainEntity\": [{\"@type\": \"Question\", \"name\": \"Which sheet size fits my mattress?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Measure your mattress width, length and depth. Our fitted sheets suit mattresses up to 12 inches deep. See the size guide for exact measurements.\"}}, {\"@type\": \"Question\", \"name\": \"What does T200, T250 and T300 mean?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"It is the thread count: threads woven into one square inch. Higher counts feel smoother and silkier; T200 is crisp and breathable, T300 is our softest sateen.\"}}, {\"@type\": \"Question\", \"name\": \"How should I wash my sheets?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Wash cool (30–40°C) with mild detergent, tumble dry low and iron warm. Avoid bleach to keep colours rich.\"}}, {\"@type\": \"Question\", \"name\": \"How long does delivery take?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"2–3 working days in Lahore, Karachi and Islamabad, 3–5 days elsewhere. Cash on delivery is available nationwide.\"}}, {\"@type\": \"Question\", \"name\": \"Can I exchange a product?\", \"acceptedAnswer\": {\"@type\": \"Answer\", \"text\": \"Yes, unused products in original packing can be exchanged within 7 days.\"}}]}" }} />
      <SectionScript id="snfq-template--23876058382439__faq" name="faq" />
      <section
        id="snfq-template--23876058382439__faq"
        className="sn-s snfq snfq--stack"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '112px', '--pb': '112px' }}
      >
        <div className="sn-wrap">
          <div className="snfq__grid">
            <aside className="snfq__side">
              <div className="sn-head sn-head--center ">
                <div className="sn-head__main">
                  <p className="sn-eyebrow" data-r="">
                    <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                      <circle cx="8" cy="8" r="6.3" />
                      <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                    </svg>
                    {' Good to know'}
                  </p>
                  <h2 className="sn-h sn-h--l" data-sn-split="">
                    {'Questions, '}
                    <em>softly answered</em>
                  </h2>
                  <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                    Sizes, care, delivery and exchanges, all in one place.
                  </p>
                </div>
              </div>
              <label className="sn-pill-form snfq__search" data-r="" style={{ '--i': '3' }}>
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
                <input type="search" placeholder="Search a question…" data-snfq-q="" aria-label="Search a question…" />
              </label>
              <div className="snfq__card sn-pillow sn-stitch" data-r="rise" style={{ '--i': '4' }}>
                <span className="sn-icon-circle">
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
                    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
                    <rect x="3" y="14" width="4" height="6" rx="1.5" />
                    <rect x="17" y="14" width="4" height="6" rx="1.5" />
                    <path d="M19 20c0 1.5-2 2-5 2" />
                  </svg>
                </span>
                <div>
                  <p className="sn-h sn-h--xs">Still wondering?</p>
                  <p className="sn-small">Our sleep team replies within minutes.</p>
                </div>
                <div className="snfq__cbtns">
                  <a className="sn-btn sn-btn--sm sn-btn--gold" href="https://wa.me/923000000000" target="_blank" rel="noopener">
                    <span>WhatsApp</span>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="icon" aria-hidden="true">
                      <path d="M12 2.5a9.3 9.3 0 0 0-8 14l-1.2 5 5.1-1.3A9.3 9.3 0 1 0 12 2.5Zm0 1.8a7.5 7.5 0 1 1-3.9 13.9l-.4-.2-3 .8.8-2.9-.3-.4A7.5 7.5 0 0 1 12 4.3Zm-3.6 3.9c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2s.9 2.3 1 2.4c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3l-1.9-.9c-.3-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.7-1.5-1.9-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.4-.6-.4h-.6Z" />
                    </svg>
                  </a>
                  {showContactCta ? (
                    <Link className="sn-btn sn-btn--sm sn-btn--ghost" href="/pages/contact">
                      <span>Contact us</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </aside>
            <div className="snfq__main" data-sn-tabhost="">
              <div className="sn-tabs snfq__tabs" role="tablist" data-r="">
                <span className="sn-tabs__pill" />
                <button type="button" role="tab" aria-selected="true" className="is-on" data-snfq-cat="*">
                  All
                </button>
                <button type="button" role="tab" aria-selected="false" data-snfq-cat="sizing">
                  Sizing
                </button>
                <button type="button" role="tab" aria-selected="false" data-snfq-cat="care">
                  Care
                </button>
                <button type="button" role="tab" aria-selected="false" data-snfq-cat="delivery">
                  Delivery
                </button>
              </div>
              <div className="snfq__list">
                <details className="sn-acc snfq__q" data-cat="sizing" open data-r="" style={{ '--i': '0' }}>
                  <summary>
                    <span className="snfq__n">01</span>
                    <span className="snfq__t">Which sheet size fits my mattress?</span>
                    <i aria-hidden="true" />
                  </summary>
                  <div className="sn-acc__body sn-rte">
                    <p>
                      Measure your mattress width, length and depth. Our fitted sheets suit mattresses up to 12 inches deep. See the size
                      guide for exact measurements.
                    </p>
                  </div>
                </details>
                <details className="sn-acc snfq__q" data-cat="sizing" data-r="" style={{ '--i': '1' }}>
                  <summary>
                    <span className="snfq__n">02</span>
                    <span className="snfq__t">What does T200, T250 and T300 mean?</span>
                    <i aria-hidden="true" />
                  </summary>
                  <div className="sn-acc__body sn-rte">
                    <p>
                      It is the thread count: threads woven into one square inch. Higher counts feel smoother and silkier; T200 is crisp and
                      breathable, T300 is our softest sateen.
                    </p>
                  </div>
                </details>
                <details className="sn-acc snfq__q" data-cat="care" data-r="" style={{ '--i': '2' }}>
                  <summary>
                    <span className="snfq__n">03</span>
                    <span className="snfq__t">How should I wash my sheets?</span>
                    <i aria-hidden="true" />
                  </summary>
                  <div className="sn-acc__body sn-rte">
                    <p>Wash cool (30–40°C) with mild detergent, tumble dry low and iron warm. Avoid bleach to keep colours rich.</p>
                  </div>
                </details>
                <details className="sn-acc snfq__q" data-cat="delivery" data-r="" style={{ '--i': '3' }}>
                  <summary>
                    <span className="snfq__n">04</span>
                    <span className="snfq__t">How long does delivery take?</span>
                    <i aria-hidden="true" />
                  </summary>
                  <div className="sn-acc__body sn-rte">
                    <p>2–3 working days in Lahore, Karachi and Islamabad, 3–5 days elsewhere. Cash on delivery is available nationwide.</p>
                  </div>
                </details>
                <details className="sn-acc snfq__q" data-cat="delivery" data-r="" style={{ '--i': '4' }}>
                  <summary>
                    <span className="snfq__n">05</span>
                    <span className="snfq__t">Can I exchange a product?</span>
                    <i aria-hidden="true" />
                  </summary>
                  <div className="sn-acc__body sn-rte">
                    <p>Yes, unused products in original packing can be exchanged within 7 days.</p>
                  </div>
                </details>
                <p className="snfq__none sn-small" hidden data-snfq-none="">
                  No question matches that. Message us on WhatsApp and we will help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

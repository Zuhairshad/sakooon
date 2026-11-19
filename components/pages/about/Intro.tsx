import Link from 'next/link';
import './intro.css';

export default function Intro() {
  return (
    <>
      <section
        id="snrt-template--23876058808423__intro"
        className="sn-s snrt snrt--center"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '100px', '--pb': '100px', '--mw': '900px' }}
      >
        <div className="sn-wrap">
          <div className="snrt__in">
            <p className="sn-eyebrow" data-r="">
              <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="6.3" />
                <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
              </svg>
              {' Our philosophy'}
            </p>
            <h2 className="sn-h sn-h--l" data-sn-split="">
              {'Rest is not a luxury, '}
              <em>it is a ritual</em>
            </h2>
            <div className="sn-rte snrt__text snrt__text--l" data-r="" style={{ '--i': '2' }}>
              <p>
                We weave every Sakooon sheet from long-staple cotton and finish it by hand, so the first night feels like the hundredth.
              </p>
            </div>
            <div className="snrt__btns" data-r="" style={{ '--i': '3' }}>
              <Link className="sn-btn" href="/collections/all">
                <span>Explore the collection</span>
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
              <Link className="sn-link" href="/collections/all">
                Our story
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
      </section>
    </>
  );
}

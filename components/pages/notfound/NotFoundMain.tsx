import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './main.css';

export default function NotFoundMain() {
  return (
    <>
      <SectionScript id="sn404-template--23876058742887__main" name="notFound" />
      <section
        id="sn404-template--23876058742887__main"
        className="sn-s sn404"
        style={{ '--bg': '#161B29', '--tx': '#F4EEE4', '--ac': '#E3C793', '--pt': '0px', '--pb': '0px', colorScheme: 'dark' }}
        data-sn-silk-host=""
      >
        <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".5" data-amp="1" />
        <div data-sn-feathers="40" data-color="#E3C793" style={{ position: 'absolute', inset: '0', zIndex: '0' }} />
        <div className="sn404__in">
          <div className="sn404__num" aria-hidden="true" data-sn404="">
            <span>4</span>
            <span className="sn404__moon">
              <i className="sn404__glow" />
              <i className="sn404__body">
                <i className="sn404__disc" />
                <i className="sn404__sh" />
              </i>
            </span>
            <span>4</span>
          </div>
          <p className="sn-eyebrow" data-r="">
            <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="8" cy="8" r="6.3" />
              <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 2 5.8 0 0 0 8 2.2Z" />
            </svg>
            {' Page not found'}
          </p>
          <h1 className="sn-h sn-h--l" data-sn-split="">
            {'This page drifted off '}
            <em>into a dream</em>
          </h1>
          <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
            The link may be broken or the page has moved. Let&apos;s tuck you back in.
          </p>
          <form action="/search" method="get" className="sn404__form" role="search" data-r="" style={{ '--i': '3' }}>
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
            <input type="search" name="q" placeholder="Search sheets, duvets, towels…" aria-label="Search sheets, duvets, towels…" />
            <button className="sn-btn sn-btn--sm sn-btn--light" type="submit">
              <span>Search</span>
            </button>
          </form>
          <div className="sn404__links" data-r="" style={{ '--i': '4' }}>
            <Link className="sn-btn sn-btn--gold" href="/">
              <span>Back to home</span>
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
                <path d="M3 11l9-8 9 8M5 10v10h14V10" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

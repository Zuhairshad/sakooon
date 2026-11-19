import Link from 'next/link';
import '@/app/styles/chrome/announcement.css';

export default function Announcement() {
  return (
    <>
      <div
        id="sna-sections--23876059037799__announcement"
        className="sna sna--rotate"
        style={{ '--a-bg': '#161B29', '--a-tx': '#F4EEE4', '--a-ac': '#E3C793' }}
        data-sna=""
        data-speed="5"
      >
        <div
          className="sna__silk"
          data-sn-silk=""
          data-c1="#161B29"
          data-c2="#2B2B45"
          data-c3="#E3C793"
          data-speed=".5"
          data-amp=".6"
          data-scale=".7"
          data-mouse="false"
          data-quality="low"
        />
        <div className="sna__in">
          <p className="sna__side">
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
              <path d="M5 4.5h3l1.3 4.3-2 1.6a12 12 0 0 0 6.3 6.3l1.6-2 4.3 1.3v3c0 1-.8 1.5-1.7 1.4A17 17 0 0 1 4 7.2c-.1-.9.4-1.7 1-1.7Z" />
            </svg>
            <span>+92 3XX XXXXXXX</span>
          </p>
          <div className="sna__rot" aria-live="polite">
            <p className="sna__m is-on" data-sna-m="">
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
              <span>Free delivery across Pakistan over Rs. 5,000</span>
            </p>
            <p className="sna__m" data-sna-m="">
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
              <span>New: T300 cotton sateen in 7 calming colours</span>
              <Link className="sna__cta" href="/collections/bed-sheets">
                Shop now
              </Link>
            </p>
            <p className="sna__m" data-sna-m="">
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
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
              </svg>
              <span>Cash on delivery · easy 7-day exchange</span>
            </p>
          </div>
          <a className="sna__side sna__side--r" href="#">
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
              <path d="M3 7l9-4 9 4v10l-9 4-9-4V7ZM3 7l9 4 9-4M12 11v10" />
            </svg>
            <span>Track your order</span>
          </a>
        </div>
      </div>
    </>
  );
}

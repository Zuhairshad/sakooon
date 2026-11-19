import { Icon } from '@/components/ui/Icon';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function SkipAndFilters() {
  return (
    <>
      <a className="sn-skip" href="#MainContent">
        Skip to content
      </a>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="sn-ripple" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves={2} seed={7} result="n">
            <animate attributeName="baseFrequency" dur="7s" values="0.006 0.018;0.009 0.026;0.006 0.018" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale={16} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </>
  );
}

export function BodyExtras() {
  return (
    <>
      <div className="sn-ov" id="SnQuick" hidden aria-label="Quick view">
        <div className="sn-ov__bg" data-sn-close="" />
        <div className="sn-drawer snq" role="dialog" aria-modal="true">
          <div className="sn-drawer__head">
            <p className="sn-drawer__title">Quick view</p>
            <button type="button" className="sn-ibtn sn-ibtn--sm" data-sn-close="" aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
          <div className="sn-drawer__body" data-sn-quick-body="" />
        </div>
      </div>
      <button type="button" className="sn-moon-top" data-sn-moon="" aria-label="Back to top">
        <svg className="sn-moon-top__ring" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="18" pathLength={100} />
        </svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="sn-moon-top__disc">
          <defs>
            <clipPath id="sn-moon-clip">
              <circle cx="12" cy="12" r="7" />
            </clipPath>
          </defs>
          <circle cx="12" cy="12" r="7" fill="currentColor" />
          <g clipPath="url(#sn-moon-clip)">
            <circle data-sn-moon-shadow="" cx="12" cy="12" r="7.4" fill="var(--c-dark)" />
          </g>
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth=".8" opacity=".6" />
        </svg>
        <svg viewBox="0 0 24 24" className="sn-moon-top__arrow" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
      <div
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 2147481000, pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'multiply', backgroundImage: GRAIN }}
      />
    </>
  );
}

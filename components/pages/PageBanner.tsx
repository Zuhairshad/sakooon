import Link from 'next/link';
import SectionScript from '@/components/pages/SectionScript';
import './favorites/banner.css';

/**
 * The theme's page banner (`snph`) for any page title. Above the fold, so the
 * heading is rendered visible (no JS split/reveal) to keep LCP on first paint.
 */
export default function PageBanner({ title, id = 'snph-template--23876059005031__banner', crumbs = [{ href: '/', label: 'Home' }] }: { title: string; id?: string; crumbs?: { href: string; label: string }[] }) {
  return (
    <>
      <SectionScript id={id} name="banner" />
      <section
        id={id}
        className="sn-s snph snph--silk snph--center is-dark"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '48px', '--mh': '340px' }}
        data-sn-silk-host=""
      >
        <div className="sn-silk" data-sn-silk="" />
        <div data-sn-feathers="24" data-color="#E3C793" style={{ position: 'absolute', inset: '0', zIndex: '0' }} />
        <svg className="snph__arc" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 290 Q 500 -60 1020 290" pathLength={1} />
        </svg>
        <span className="snph__moon" data-snph-moon="" aria-hidden="true">
          <i />
        </span>
        <div className="sn-wrap snph__in">
          <nav className="sn-crumbs snph__crumbs" aria-label="Breadcrumb">
            {crumbs.map((c) => (
              <span key={c.href} style={{ display: 'contents' }}>
                <Link href={c.href}>{c.label}</Link>
                <i />
              </span>
            ))}
            <span aria-current="page">{title}</span>
          </nav>
          <h1 className="sn-h sn-h--xl">{title}</h1>
        </div>
      </section>
    </>
  );
}

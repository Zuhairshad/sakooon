import SectionScript from '@/components/pages/SectionScript';
import Link from 'next/link';
import './banner.css';

export default function Banner() {
  return (
    <>
      <SectionScript id="snph-template--23876058808423__banner" name="banner" />
      <section
        id="snph-template--23876058808423__banner"
        className="sn-s snph snph--silk snph--center is-dark"
        style={{ '--bg': '#F4EEE4', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '140px', '--pb': '80px', '--mh': '560px' }}
        data-sn-silk-host=""
      >
        <div className="sn-silk" data-sn-silk="" data-c1="#161B29" data-c2="#2B2B45" data-c3="#E3C793" data-speed=".5" data-amp=".9" />
        <div data-sn-feathers="24" data-color="#E3C793" style={{ position: 'absolute', inset: '0', zIndex: '0' }} />
        <svg className="snph__arc" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 290 Q 500 -60 1020 290" pathLength="1" />
        </svg>
        <span className="snph__moon" data-snph-moon="" aria-hidden="true">
          <i />
        </span>
        <div className="sn-wrap snph__in">
          <nav className="sn-crumbs snph__crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <i />
            <span aria-current="page">Our story</span>
          </nav>
          <h1 className="sn-h sn-h--xl">
            {'Our story '}
            <em>begins at night</em>
          </h1>
          <p className="sn-lead" style={{ '--i': '2' }}>
            A small Lahore studio with one obsession: helping Pakistan sleep a little deeper.
          </p>
        </div>
        <span className="snph__hint" aria-hidden="true">
          <i />
        </span>
      </section>
    </>
  );
}

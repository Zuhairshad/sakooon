import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';
import './cats.css';
import { getCollections } from '@/lib/shopify';
import CategoriesBehavior from './CategoriesBehavior';
import { img } from '@/lib/utils';
import Static from '@/components/theme/Static';

const F = '/images/';
/** Curated rows (theme section blocks): collection handle + block image. */
const ROWS = [
  { handle: 'bed-sheets', img: F + 'sakooon-yarn-dyed-bed-sheet-set-red-gingham_f91e9fbf-281e-4802-a65d-3382cb3cc532.webp' },
  { handle: 'duvets', img: F + 'sakooon-duvet-comfort-pillow-pack-of-2.webp' },
  { handle: 'duvet-covers', img: F + 'sakooon-two-tone-duvet-cover-set-forest-green-lime-green.webp' },
  { handle: 'bed-covers', img: F + 'sakooon-yarn-dyed-bed-sheet-set-blue-polka-dot.webp' },
];
const ID = 'sncat-template--23876058939495__cats';

export default async function Categories() {
  'use cache';
  cacheLife('hours');
  cacheTag('products', 'collections');
  const all = await getCollections().catch(() => []);
  const rows = ROWS.map((r) => ({ ...r, c: all.find((c) => c.handle === r.handle) })).filter((r) => r.c);
  return (
    <>
      <CategoriesBehavior id={ID} />
      <Static>
      <section
        id="sncat-template--23876058939495__cats"
        className="sn-s sncat sncat--index"
        style={{ '--bg': '#FBF8F2', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px', '--cols': '4' }}
        data-sncat=""
      >
        <div className="sn-wrap">
          <div className="sn-head sn-head--split ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8Z" />
                </svg>
                {' Shop by category'}
              </p>
              <h2 className="sn-h sn-h--l" data-sn-split="">
                {'Everything for a '}
                <em>softer night</em>
              </h2>
              <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                Seven ways to sleep better — from crisp percale sheets to cloud-soft duvets.
              </p>
            </div>
            <div data-r="" style={{ '--i': '3' }}>
              <Link className="sn-link" href="/collections">
                All collections
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
          <ol className="sncat__list">
            {rows.map((r, i) => (
              <li key={r.handle} className="sncat__row" data-r="" style={{ '--i': i }}>
                <Link href={`/collections/${r.handle}`} className="sncat__a" data-sncat-a="">
                  <span className="sncat__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sncat__thumb sn-media">
                    <img src={img(r.img, 300)} alt="" loading="lazy" width="150" height="190" />
                  </span>
                  <span className="sncat__name">{r.c!.title}</span>
                  <span className="sncat__meta">{r.c!.productCount} pieces</span>
                  <span className="sncat__go">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </Link>
                {/* hover media (was <template data-sncat-media>); the behaviour clones it into the float */}
                <div data-sncat-media="" data-src={img(r.img, 800)} hidden />
              </li>
            ))}
          </ol>
          <div className="sncat__float" data-sncat-float="" aria-hidden="true">
            <div className="sncat__float-in" data-sncat-fin="" />
            <span className="sncat__float-stitch" />
          </div>
        </div>
      </section>
      </Static>
    </>
  );
}

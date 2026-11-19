import { cacheLife, cacheTag } from 'next/cache';
import './builder.css';
import { getCollection } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';
import { img, money } from '@/lib/utils';
import BuilderBehavior from './BuilderBehavior';
import Static from '@/components/theme/Static';

const ID = 'snsb-template--23876058939495__builder';
const STEPS = [
  { handle: 'bed-sheets', title: 'Choose your bed sheet', req: true },
  { handle: 'pillows', title: 'Add pillow', req: false },
  { handle: 'duvet-covers', title: 'Add a duvet cover', req: false },
  { handle: 'duvets', title: 'Finish with a duvet', req: false },
];

const Chev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="icon" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Tick = () => (
  <i className="snsb__tick">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="icon" aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  </i>
);

function Option({ p, name }: { p: Product; name: string }) {
  const v = p.variants.find((x) => x.available) || p.variants[0];
  const image = p.featuredImage?.url;
  const cmp = (x: typeof v) => x.compareAtPrice ?? x.price;
  return (
    <label className={`snsb__opt${p.available ? '' : ' is-out'}`}>
      <input
        type="radio"
        name={name}
        value={v.numericId}
        data-price={v.price}
        data-cmp={cmp(v)}
        data-title={p.title}
        data-img={image ? img(image, 500) : ''}
        disabled={!p.available}
      />
      <span className="snsb__oimg sn-media">{image ? <img src={img(image, 200)} alt="" loading="lazy" width={100} height={125} /> : null}</span>
      <span className="snsb__ot">
        <b>{p.title}</b>
        <small>{money(v.price)}</small>
      </span>
      {p.variants.length > 1 ? (
        <select className="snsb__vs" aria-label={`Options for ${p.title}`} data-snsb-vs="" defaultValue={v.numericId}>
          {p.variants.map((x) => (
            <option key={x.id} value={x.numericId} data-price={x.price} data-cmp={cmp(x)} disabled={!x.available}>
              {x.title}
            </option>
          ))}
        </select>
      ) : null}
      <Tick />
    </label>
  );
}

export default async function SetBuilder() {
  'use cache';
  cacheLife('hours');
  cacheTag('products', 'collections');
  const lists = await Promise.all(STEPS.map((s) => getCollection(s.handle).then((c) => c?.products || []).catch(() => [] as Product[])));
  return (
    <>
      <BuilderBehavior id={ID} />
      <Static>
      <section
        id="snsb-template--23876058939495__builder"
        className="sn-s snsb"
        style={{ '--bg': '#E8DECF', '--tx': '#1B2130', '--ac': '#A8834F', '--pt': '120px', '--pb': '120px' }}
        data-snsb=""
        data-discount="0"
      >
        <div className="sn-wrap">
          <div className="sn-head ">
            <div className="sn-head__main">
              <p className="sn-eyebrow" data-r="">
                <svg className="sn-ph" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.3" />
                  <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                </svg>
                {' Make your bed'}
              </p>
              <h2 className="sn-h sn-h--l" data-sn-split="">
                {'Build your '}
                <em>dream set</em>
              </h2>
              <p className="sn-lead" data-r="" style={{ '--i': '2' }}>
                Pick one piece per step and watch your set come together. Everything goes to your bag in one tap.
              </p>
            </div>
          </div>
          <div className="snsb__grid">
            <div className="snsb__stack-wrap" data-r="zoom">
              <div className="snsb__stack" data-snsb-stack="">
                <div className="snsb__empty" data-snsb-empty="">
                  <svg className="sn-art " viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="bgbed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#EFE6D8" />
                        <stop offset="1" stopColor="#E2D6C4" />
                      </linearGradient>
                      <radialGradient id="glbed" cx="50%" cy="30%" r="60%">
                        <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="600" height="750" fill="url(#bgbed)" />
                    <rect width="600" height="750" fill="url(#glbed)" />
                    <rect x="0" y="0" width="600" height="470" fill="#F3ECE1" opacity=".55" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="#2A3247" />
                    <circle cx="470" cy="150" r="22" fill="#D9BF8F" />
                    <circle cx="460" cy="146" r="22" fill="#2A3247" />
                    <circle cx="420" cy="223" r="1.2" fill="#fff" opacity="0.70" />
                    <circle cx="459" cy="201" r="1.5" fill="#fff" opacity="0.50" />
                    <circle cx="454" cy="273" r="2.1" fill="#fff" opacity="0.54" />
                    <circle cx="476" cy="280" r="0.9" fill="#fff" opacity="0.90" />
                    <circle cx="393" cy="141" r="1.2" fill="#fff" opacity="0.74" />
                    <circle cx="467" cy="202" r="1.8" fill="#fff" opacity="0.43" />
                    <circle cx="424" cy="213" r="0.7" fill="#fff" opacity="0.57" />
                    <circle cx="507" cy="130" r="1.8" fill="#fff" opacity="0.64" />
                    <circle cx="418" cy="297" r="2.1" fill="#fff" opacity="0.41" />
                    <circle cx="400" cy="203" r="1.0" fill="#fff" opacity="0.62" />
                    <circle cx="425" cy="215" r="1.5" fill="#fff" opacity="0.63" />
                    <circle cx="424" cy="223" r="1.7" fill="#fff" opacity="0.88" />
                    <circle cx="409" cy="156" r="1.9" fill="#fff" opacity="0.67" />
                    <circle cx="457" cy="144" r="1.0" fill="#fff" opacity="0.62" />
                    <rect x="380" y="80" width="140" height="250" rx="14" fill="none" stroke="#A8834F" strokeWidth="5" />
                    <path d="M450 80v250M380 205h140" stroke="#A8834F" strokeWidth="3" opacity=".7" />
                    <rect x="0" y="560" width="600" height="190" fill="#D9CBB5" />
                    <rect x="0" y="556" width="600" height="6" fill="#CDBDA4" />
                    <rect x="60" y="300" width="400" height="200" rx="40" fill="#1B2130" />
                    <path d="M100 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M180 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M260 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M340 316v170" stroke="#2C3447" strokeWidth="3" />
                    <path d="M420 316v170" stroke="#2C3447" strokeWidth="3" />
                    <ellipse cx="265" cy="640" rx="250" ry="26" fill="#1B2130" opacity="0.22" />
                    <rect x="30" y="455" width="470" height="70" rx="14" fill="#FFFDF9" />
                    <path
                      d="M24 500 Q20 470 60 466 L470 466 Q512 470 508 500 L512 610 Q514 632 488 634 L50 634 Q22 632 22 610Z"
                      fill="#F4EEE3"
                    />
                    <path d="M40 520 Q160 540 270 512 T500 520" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M60 585 Q200 600 300 578 T495 590" stroke="#E3D9C9" strokeWidth="3" fill="none" />
                    <path d="M22 560 L510 560 L512 600 L22 600Z" fill="#A8834F" opacity=".9" />
                    <path d="M22 566h488M22 594h488" stroke="#D9BF8F" strokeWidth="1.5" />
                    <path d="M80 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M100 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <path d="M240 410 q90 -16 180 0 q10 30 0 60 q-90 14 -180 0 q-10 -30 0 -60Z" fill="#FFFDF9" />
                    <path d="M260 440h140" stroke="#E3D9C9" strokeWidth="2" />
                    <rect x="170" y="430" width="150" height="70" rx="22" fill="#B3C2A7" />
                    <path d="M180 465h130" stroke="#9DAE91" strokeWidth="2" />
                    <rect x="505" y="480" width="80" height="80" rx="6" fill="#B79C7A" />
                    <path d="M515 520h60" stroke="#9E8363" strokeWidth="2" />
                    <circle cx="545" cy="410" r="70" fill="#D9BF8F" opacity=".25" />
                    <path d="M528 455h34l-6 25h-22Z" fill="#A8834F" />
                    <path d="M520 420h50l-8 -36h-34Z" fill="#FFFDF9" />
                  </svg>
                  <p>Your set appears here</p>
                </div>
              </div>
              <div className="snsb__sum sn-pillow sn-stitch">
                <div className="snsb__row">
                  <span>Pieces</span>
                  <b data-snsb-n="">0</b>
                </div>
                <div className="snsb__row">
                  <span>Set total</span>
                  <b className="snsb__tot">
                    <s data-snsb-was="" hidden />
                    <span data-snsb-total="">Rs.0.00</span>
                  </b>
                </div>
                <button type="button" className="sn-btn sn-btn--gold sn-btn--block" data-snsb-add="" disabled>
                  <span>Add set to bag</span>
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
                    <path d="M5 8h14l-1 12H6L5 8Z" />
                    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                </button>
                <p className="sn-small">Delivery calculated at checkout.</p>
              </div>
            </div>
            <ol className="snsb__steps">
              {STEPS.map((s, i) => {
                const name = `${ID}-${i + 1}`;
                return (
                  <li key={s.handle} className={`snsb__step${i === 0 ? ' is-open' : ''}`} data-snsb-step="" data-req={String(s.req)} data-r="" style={{ '--i': i }}>
                    <button type="button" className="snsb__sh" data-snsb-toggle="">
                      <span className="snsb__num">{i + 1}</span>
                      <span className="snsb__st">
                        <b>{s.title}</b>
                        <small data-snsb-picked="">{s.req ? 'Choose one' : 'Optional'}</small>
                      </span>
                      <i className="snsb__chev">
                        <Chev />
                      </i>
                    </button>
                    <div className="snsb__body">
                      <div className="snsb__opts">
                        {lists[i].map((p) => (
                          <Option key={p.id} p={p} name={name} />
                        ))}
                        {s.req ? null : (
                          <label className="snsb__opt snsb__opt--skip">
                            <input type="radio" name={name} value="" defaultChecked />
                            <span className="snsb__ot">
                              <b>No thanks</b>
                            </span>
                            <Tick />
                          </label>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
      </Static>
    </>
  );
}

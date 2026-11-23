import Link from "next/link";
import { Fragment } from "react";
import "./product-main.css";
import type { Product } from "@/lib/shopify/types";
import { discountPct, img, money, srcset } from "@/lib/utils";
import { Icon, WishIcons } from "@/components/ui/Icon";
import { PRODUCT_SPECS, WHATSAPP_NUMBER } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";
import {
  LightboxControls,
  SizeGuideDrawer,
  StaticAccordions,
} from "./ProductStatic";
import ProductBehavior from "./ProductBehavior";
import Static from "@/components/theme/Static";

const SEC = "template--23876058906727__main";
export const PDP_ROOT = `snmp-${SEC}`;
const FORM_ID = `mp${SEC}`;
const SIZE_ID = `SnSize-${SEC}`;

const slideId = (i: number) => `m${i}`;

/** Shopify `product.js`-shaped JSON read by the ported sn-product.js controller. */
function themeJson(p: Product) {
  const mediaIndex = (url?: string | null) =>
    url ? p.images.findIndex((i) => i.url === url) : -1;
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    vendor: p.vendor,
    type: p.productType,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    available: p.available,
    price_varies: p.priceVaries,
    options: p.options.map((o) => o.name),
    variants: p.variants.map((v) => {
      const mi = mediaIndex(v.image?.url);
      return {
        id: v.numericId,
        title: v.title,
        options: v.selectedOptions.map((s) => s.value),
        available: v.available,
        price: v.price,
        compare_at_price: v.compareAtPrice,
        featured_image: v.image ? { src: v.image.url } : null,
        featured_media: mi >= 0 ? { id: slideId(mi) } : null,
      };
    }),
  };
}

const json = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

function Price({
  cur,
  was,
  badge,
}: {
  cur: number;
  was: number | null;
  badge?: boolean;
}) {
  const pct = discountPct(cur, was);
  return (
    <>
      <span className={`sn-price__now${pct ? " is-sale" : ""}`}>
        {money(cur)}
      </span>
      {pct ? <s className="sn-price__was">{money(was)}</s> : null}
      {pct && badge ? (
        <span className="sn-badge sn-badge--sale">−{pct}%</span>
      ) : null}
    </>
  );
}

export default function ProductMain({
  product: p,
  crumb,
}: {
  product: Product;
  crumb: { handle: string; title: string } | null;
}) {
  const specs = PRODUCT_SPECS[p.handle] || [];
  const url = `${SITE_URL}/products/${p.handle}`;
  const images = p.images.length
    ? p.images
    : p.featuredImage
      ? [p.featuredImage]
      : [];
  const n = images.length || 1;
  // Default to the first available variant whose photo matches the opening
  // gallery image, so the gallery and the selected variant agree on load.
  // Falls back to the previous "first available variant" rule when none
  // of the variant photos match the featured image.
  const firstImage = images[0];
  const v =
    (firstImage &&
      p.variants.find((x) => x.available && x.image?.url === firstImage.url)) ||
    p.variants.find((x) => x.available) ||
    p.variants[0];
  const sel = v?.selectedOptions.map((s) => s.value) || [];
  const startSlide = Math.max(
    0,
    v?.image ? images.findIndex((i) => i.url === v.image!.url) : 0,
  );
  const waText = `Hi Sakooon, I would like to order: ${p.title} – ${url}`;
  const optionsVisible = !(
    p.options.length === 1 &&
    p.variants.length === 1 &&
    p.variants[0].title === "Default Title"
  );

  return (
    <>
      <Static>
        <section
          id={PDP_ROOT}
          className="sn-s snmp snmp--slider"
          style={{
            "--bg": "#F4EEE4",
            "--tx": "#1B2130",
            "--ac": "#A8834F",
            "--pt": "28px",
            "--pb": "80px",
          }}
        >
          <div className="sn-wrap">
            <nav className="sn-crumbs snmp__crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <i />
              {crumb ? (
                <>
                  <Link href={`/collections/${crumb.handle}`}>
                    {crumb.title}
                  </Link>
                  <i />
                </>
              ) : null}
              <span aria-current="page">{p.title}</span>
            </nav>
            <div
              className="snmp__grid"
              data-sn-product=""
              data-history=""
              id={FORM_ID}
            >
              <script
                type="application/json"
                data-sn-pjson=""
                dangerouslySetInnerHTML={{ __html: json(themeJson(p)) }}
              />
              <script
                type="application/json"
                data-sn-pinv=""
                dangerouslySetInnerHTML={{ __html: "{}" }}
              />
              <div className="snmp__gal" data-sn-gallery="">
                <div className="snmp__stage">
                  <div className="snmp__track" data-sn-track="">
                    {images.map((im, i) => (
                      <div
                        key={im.url}
                        className={`snmp__slide${i === startSlide ? " is-on" : ""} snmp__slide--image`}
                        data-sn-slide={slideId(i)}
                        style={{ "--i": String(Math.min(i, 5)) }}
                      >
                        <button
                          type="button"
                          className="sn-media snmp__m"
                          data-snmp-zoom={i}
                          aria-label="Open zoom"
                        >
                          <img
                            src={img(im.url, 1400)}
                            srcSet={srcset(im.url, [700, 1100, 1600])}
                            sizes="(min-width: 990px) 55vw, 100vw"
                            alt={im.altText || p.title}
                            width={im.width || 1024}
                            height={im.height || 1536}
                            loading={i === 0 ? "eager" : "lazy"}
                            fetchPriority={i === 0 ? "high" : undefined}
                          />
                          <span className="snmp__zi">
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
                              <circle cx="11" cy="11" r="7" />
                              <path d="m20 20-4-4M11 8v6M8 11h6" />
                            </svg>
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="snmp__arrows">
                    <button
                      type="button"
                      className="sn-ibtn sn-ibtn--sm"
                      data-sn-gnav="-1"
                      aria-label="Previous"
                    >
                      <Icon name="arrow-left" strokeWidth={1.6} />
                    </button>
                    <button
                      type="button"
                      className="sn-ibtn sn-ibtn--sm"
                      data-sn-gnav="1"
                      aria-label="Next"
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                  <div className="snmp__gbar">
                    <i data-sn-gprog="" style={{ width: `${100 / n}%` }} />
                  </div>
                  <button
                    type="button"
                    className="snmp__wish sn-card__wish"
                    data-sn-wish={p.handle}
                    aria-label="Wishlist"
                  >
                    <WishIcons />
                  </button>
                </div>
                <div className="snmp__thumbs">
                  {images.map((im, i) => (
                    <button
                      key={im.url}
                      type="button"
                      className={`snmp__th${i === startSlide ? " is-on" : ""}`}
                      data-sn-thumb={slideId(i)}
                      aria-label={`Media ${i + 1}`}
                    >
                      <img
                        src={img(im.url, 180)}
                        alt=""
                        width={90}
                        height={112}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="snmp__info">
                <div className="snmp__inner">
                  <form
                    method="post"
                    action="/cart"
                    id={`SnPF-${SEC}`}
                    acceptCharset="UTF-8"
                    className="snmp__form"
                    data-sn-pform=""
                    noValidate
                  >
                    <input
                      type="hidden"
                      name="id"
                      defaultValue={v?.numericId}
                      data-sn-pvid=""
                    />
                    <p className="sn-eyebrow snmp__eb">
                      <svg
                        className="sn-ph"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <circle cx="8" cy="8" r="6.3" />
                        <path d="M8 2.2A5.8 5.8 0 0 1 8 13.8 3.2 5.8 0 0 1 8 2.2Z" />
                      </svg>
                      {` ${p.vendor || "Sakooon"}`}
                    </p>
                    <h1 className="sn-h sn-h--l snmp__title" data-sn-split="">
                      {p.title}
                    </h1>
                    <div className="snmp__pricebox">
                      <div className="sn-pprice" data-sn-pprice="">
                        <Price
                          cur={v?.price ?? p.price}
                          was={v?.compareAtPrice ?? p.compareAtPrice}
                          badge
                        />
                      </div>
                      <p className="sn-small">
                        Inclusive of all taxes · Cash on delivery available
                      </p>
                    </div>
                    {specs.length ? (
                      <ul className="snmp__specs">
                        {specs.map((s) => (
                          <li key={s.b}>
                            <b>{s.b}</b>
                            <span>{s.s}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {optionsVisible ? (
                      <div className="snmp__picker">
                        <div className="sn-pick">
                          {p.options.map((o, oi) => {
                            const isCol = o.values.some((x) => x.color);
                            const guide = /size/i.test(o.name);
                            return (
                              <fieldset
                                key={o.name}
                                className={`sn-pick__opt${isCol ? " is-col" : ""}`}
                              >
                                <legend className="sn-pick__lg">
                                  <span>{o.name}:</span>{" "}
                                  <b data-sn-optv={oi}>{sel[oi]}</b>
                                  {guide ? (
                                    <button
                                      type="button"
                                      className="sn-pick__guide"
                                      data-sn-open={SIZE_ID}
                                    >
                                      <Icon name="ruler" />
                                      Size guide
                                    </button>
                                  ) : null}
                                </legend>
                                <div className="sn-pick__vals">
                                  {o.values.map((val, vi) => {
                                    const id = `${FORM_ID}-${oi}-${vi}`;
                                    return (
                                      <Fragment key={vi}>
                                        <input
                                          className="sr"
                                          type="radio"
                                          id={id}
                                          name={`${FORM_ID}-o${oi}`}
                                          value={val.name}
                                          data-sn-opt-i={oi}
                                          defaultChecked={sel[oi] === val.name}
                                        />
                                        {isCol ? (
                                          <label
                                            htmlFor={id}
                                            className="sn-pick__sw"
                                            title={val.name}
                                            style={{
                                              "--sw": val.color || "#ccc",
                                            }}
                                          >
                                            <i />
                                            <span className="sr">
                                              {val.name}
                                            </span>
                                          </label>
                                        ) : (
                                          <label
                                            htmlFor={id}
                                            className="sn-pick__pill"
                                          >
                                            {val.name}
                                          </label>
                                        )}
                                      </Fragment>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                    <div
                      className="sn-stock"
                      data-sn-pstock=""
                      data-low="5"
                      data-in="In stock · ready to ship"
                      data-out="Sold out in this option"
                      data-lowtxt="Only [n] left in this size"
                    >
                      <span className="sn-stock__t" data-sn-pstock-t="">
                        {v?.available
                          ? "In stock · ready to ship"
                          : "Sold out in this option"}
                      </span>
                      <span className="sn-stock__bar">
                        <i
                          data-sn-pstock-b=""
                          style={{ width: v?.available ? "100%" : "0%" }}
                        />
                      </span>
                    </div>
                    <div className="snmp__props">
                      <label className="sn-check snmp__gift">
                        <input
                          type="checkbox"
                          name="properties[Gift wrap]"
                          value="Yes"
                        />
                        <span>
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
                            <rect x="3" y="9" width="18" height="4" />
                            <path d="M5 13v8h14v-8M12 9v12M12 9c-2 0-4-1-4-3s3-3 4 0c1-3 4-2 4 0s-2 3-4 3Z" />
                          </svg>
                          Gift wrap with a handwritten note
                        </span>
                      </label>
                    </div>
                    <div className="snmp__buy" data-snmp-buy="">
                      <div className="sn-buy">
                        <div className="sn-qty">
                          <button
                            type="button"
                            data-sn-q="-1"
                            aria-label="Decrease"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="icon"
                              aria-hidden="true"
                            >
                              <path
                                d="M5 12h14"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            name="quantity"
                            defaultValue="1"
                            min="1"
                            data-sn-pqty=""
                            aria-label="Quantity"
                          />
                          <button
                            type="button"
                            data-sn-q="1"
                            aria-label="Increase"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="icon"
                              aria-hidden="true"
                            >
                              <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="sn-btn sn-btn--gold sn-buy__atc"
                          data-sn-patc=""
                          data-label="Add to cart"
                          data-sold="Sold out"
                          disabled={!v?.available}
                        >
                          <span>
                            {v?.available ? "Add to cart" : "Sold out"}
                          </span>
                          <Icon name="bag" />
                        </button>
                        <button
                          type="button"
                          className="sn-ibtn snmp__wishb"
                          data-sn-wish={p.handle}
                          aria-label="Wishlist"
                        >
                          <Icon name="heart" />
                        </button>
                        <div
                          className="sn-buy__now"
                          data-sn-buynow=""
                          hidden={!v?.available}
                        >
                          <div className="shopify-payment-button">
                            <button
                              type="button"
                              className="shopify-payment-button__button shopify-payment-button__button--unbranded"
                              data-snmp-buynow=""
                            >
                              Buy it now
                            </button>
                          </div>
                        </div>
                      </div>
                      <a
                        className="snmp__wa"
                        href={`https://wa.me/${WHATSAPP_NUMBER}?${new URLSearchParams({ text: waText })}`}
                        target="_blank"
                        rel="noopener"
                        data-snmp-wa=""
                        data-base="Hi Sakooon, I would like to order:"
                        data-title={p.title}
                        data-handle={p.handle}
                      >
                        <Icon name="whatsapp" />
                        <span>Order on WhatsApp</span>
                      </a>
                    </div>
                    <div
                      className="snmp__del sn-pillow"
                      data-snmp-del=""
                      data-min="2"
                      data-max="5"
                      data-cut="16"
                      data-sun="true"
                    >
                      <span className="snmp__truck">
                        <Icon name="truck" />
                        <i />
                      </span>
                      <div>
                        <p>
                          {"Arrives "}
                          <b data-snmp-dates="">—</b>
                        </p>
                        <p
                          className="sn-small"
                          data-snmp-cut=""
                          data-tpl="Order within [time] for same-day dispatch"
                        />
                      </div>
                    </div>
                    <ul className="snmp__trust">
                      <li>
                        <Icon name="truck" />
                        <span>Free delivery over Rs. 5,000</span>
                      </li>
                      <li>
                        <Icon name="exchange" />
                        <span>7-day easy exchange</span>
                      </li>
                      <li>
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
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="M3 10h18M7 15h3" />
                        </svg>
                        <span>Cash on delivery</span>
                      </li>
                      <li>
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
                          <circle cx="12" cy="7.5" r="2.8" />
                          <circle cx="7.8" cy="11" r="2.8" />
                          <circle cx="16.2" cy="11" r="2.8" />
                          <circle cx="12" cy="13.5" r="2.8" />
                          <path d="M12 16.5V22M9 20.5l3-1.5 3 1.5" />
                        </svg>
                        <span>100% pure cotton</span>
                      </li>
                    </ul>
                    <details className="sn-acc snmp__acc" open>
                      <summary>
                        <span className="snmp__acct">
                          <Icon name="info" />
                          Details
                        </span>
                        <i aria-hidden="true" />
                      </summary>
                      <div
                        className="sn-acc__body sn-rte"
                        dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
                      />
                    </details>
                    <StaticAccordions />
                    <div className="snmp__share">
                      <span>Share</span>
                      <a
                        className="sn-ibtn sn-ibtn--sm"
                        target="_blank"
                        rel="noopener"
                        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                        aria-label="WhatsApp"
                      >
                        <Icon name="whatsapp" />
                      </a>
                      <a
                        className="sn-ibtn sn-ibtn--sm"
                        target="_blank"
                        rel="noopener"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                        aria-label="Facebook"
                      >
                        <Icon name="facebook" />
                      </a>
                      <button
                        type="button"
                        className="sn-ibtn sn-ibtn--sm"
                        data-snmp-copy={`/products/${p.handle}`}
                        aria-label="Copy link"
                      >
                        <Icon name="share" strokeWidth={1.6} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div
                className="snmp__sticky"
                data-snmp-sticky=""
                aria-hidden="true"
              >
                <div className="snmp__sin">
                  <span className="snmp__simg">
                    {(v?.image || p.featuredImage) && (
                      <img
                        src={img((v?.image || p.featuredImage)!.url, 120)}
                        alt=""
                        width={48}
                        height={60}
                      />
                    )}
                  </span>
                  <span className="snmp__st">
                    <b>{p.title}</b>
                    {optionsVisible ? (
                      <span className="sn-small">
                        {sel.map((s, i) => (
                          <span key={i}>
                            {i ? " · " : ""}
                            <span data-sn-optv={i}>{s}</span>
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                  <div className="sn-pprice snmp__sp" data-sn-pprice="">
                    <span className="sn-price">
                      <Price
                        cur={v?.price ?? p.price}
                        was={v?.compareAtPrice ?? p.compareAtPrice}
                      />
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sn-btn sn-btn--gold sn-btn--sm"
                    data-sn-patc=""
                    data-snmp-sadd=""
                    data-label="Add to cart"
                    data-sold="Sold out"
                    tabIndex={-1}
                  >
                    <span>Add to cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="snmp__lb"
            id={`${PDP_ROOT}-lb`}
            data-snmp-lb=""
            hidden
            role="dialog"
            aria-modal="true"
            aria-label={p.title}
          >
            <div className="snmp__lbtrack" data-snmp-lbt="">
              {images.map((im) => (
                <figure key={im.url} className="snmp__lbf">
                  <img
                    data-src={img(im.url, 2400)}
                    alt={im.altText || p.title}
                    width={im.width || 1024}
                    height={im.height || 1536}
                  />
                </figure>
              ))}
            </div>
            <LightboxControls />
          </div>
          <SizeGuideDrawer id={SIZE_ID} />
        </section>
      </Static>
      <ProductBehavior rootId={PDP_ROOT} />
    </>
  );
}

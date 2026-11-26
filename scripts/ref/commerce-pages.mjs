// Full-page captures + per-viewport measurements for Parachute collection, product and search results.
// Usage: node scripts/ref/commerce-pages.mjs <collection|product|search> [viewport,...]
import fs from 'node:fs';
import { OUT, open, scrollThrough, shot, measure, saveJSON, saveLog, note, VIEWPORTS, BASE } from './commerce-lib.mjs';

const PAGES = {
  collection: {
    url: `${BASE}/collections/sheet-sets`,
    spec: {
      header: '.cv-collection-header', headerMedia: '.cv-collection-header__media', headerContent: '.cv-collection-header__content',
      title: '.cv-collection-header__title', count: '.cv-collection-header__count', description: '.cv-collection-header__description',
      parentLink: '.cv-collection-header__link-anchor',
      filterBar: '.cv-collection-filters', filterButton: '.cv-collection-filters .cv-drawer__button',
      grid: '#product-grid', card: 'li.cv-product-grid-card', cardMedia: '.cv-product-card__media', cardImage: '.cv-product-card__image',
      cardHoverImage: '.cv-product-card__image--hover', cardInfo: '.cv-product-card__info', cardTitle: '.cv-product-card__title a',
      cardPrice: '.cv-product-card__current', cardCompare: '.cv-product-card__compare', cardTag: '.cv-product-card__tag .cv-tag',
      swatchRow: '.cv-product-card__swatches .cv-product-swatches__row', swatchItem: '.cv-product-card__swatches .cv-product-swatches__item',
      swatchLink: '.cv-product-card__swatches .cv-product-swatch__link', swatchChip: '.cv-product-card__swatches .cv-color-chip',
      swatchMore: '.cv-product-swatches__more', pagination: '[class*=pagination], .cv-collection-product-grid nav, .cv-collection-product-grid button',
      editorialTile: '#product-grid > li:not(.cv-product-grid-card)',
    },
  },
  product: {
    url: `${BASE}/products/percale-sheet-set-evergreen-f-q`,
    spec: {
      siteHeader: '.cv-header', layout: '.product.product--large', galleryCol: '.product__media-wrapper', gallery: 'cv-media-gallery',
      slide: '.cv-media-gallery__slide', slideMedia: '.cv-media-gallery__slide__media img, .cv-media-gallery__slide__media',
      galleryControls: '.cv-carousel__controls', galleryArrow: '.cv-carousel__arrow', slideCount: '.cv-carousel__slide-count',
      packshot: '.cv-media-gallery__packshot', progress: '[class*=progress]',
      infoCol: '.product__info-wrapper', infoContainer: '.product__info-container', buyBox: '.cv-buy-box',
      saleTag: '.cv-buy-box .cv-tag', title: '.cv-product-title__heading', rating: '.cv-star-rating',
      swatchRow: '.cv-product-swatches--product-page .cv-product-swatches__row', swatchItem: '.cv-product-swatches--product-page .cv-product-swatches__item',
      swatchLink: '.cv-product-swatches--product-page .cv-product-swatch__link', swatchChip: '.cv-product-swatches--product-page .cv-color-chip',
      swatchLabel: '.cv-product-swatches__label', swatchValue: '.cv-product-swatches__value',
      optionControl: '.cv-variant-picker__control', optionSelect: '.cv-variant-picker__control select', optionLabel: '.cv-variant-picker__control label',
      atc: 'cv-buy-buttons button', atcPrices: '.cv-buy-buttons__prices', lowStock: '.cv-low-stock-note .cv-note',
      bundleContents: '.cv-product-bundle-contents', bundleItem: '.cv-product-bundle-contents__item',
      detailsList: '.cv-product-details', detailRow: '.cv-product-details .cv-drawer__button', detailTitle: '.cv-product-details__text',
      pairing: '.cv-pairing-card', pairingCard: '.cv-pairing-card__card', pairingImage: '.cv-pairing-card__image',
      description: '.cv-product-description', descLarge: '.cv-product-description__large-media', descBody: '.cv-product-description__body',
      recs: 'cv-rebuy-recommendations', recsHeading: 'cv-rebuy-recommendations h2', recsCard: 'cv-rebuy-recommendations .cv-product-card',
    },
  },
  search: {
    url: `${BASE}/search?q=sheet`,
    spec: {
      main: 'main', heading: 'main h1, main h2', input: 'main input[type=search], main input[type=text]',
      grid: 'main ul[class*=grid], main [class*=grid]', card: 'main [class*=product-card], main li[class*=grid]',
      cardTitle: 'main [class*=title] a, main [class*=title]', cardPrice: 'main [class*=price]', pagination: 'main [class*=pagination]',
    },
  },
};

const which = process.argv[2];
const vps = process.argv[3] ? process.argv[3].split(',').map(Number) : VIEWPORTS;
const def = PAGES[which];
if (!def) { console.error('page?'); process.exit(1); }

for (const w of vps) {
  if (fs.existsSync(`${OUT}/${which}/metrics-${w}.json`)) { note(`${which} @${w} already captured, skipping`); continue; }
  const { browser, page } = await open(w, def.url);
  try {
    await scrollThrough(page);
    await shot(page, which, `${w}-full.png`, { full: true });
    await shot(page, which, `${w}-viewport.png`);
    const m = await measure(page, def.spec);
    m._viewport = { w, docHeight: await page.evaluate(() => document.body.scrollHeight) };
    saveJSON(which, `metrics-${w}.json`, m);
    note(`${which} @${w} done`);
  } catch (e) { note(`${which} @${w} ERROR ${e.message.split('\n')[0]}`); }
  await browser.close();
}
saveLog(`${which}`);

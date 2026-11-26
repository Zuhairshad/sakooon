/** Interaction states for the theme homepage, used by scripts/capture-theme.mjs --states scripts/states/theme-home.mjs */
export default [
  { name: 'mega-menu', only: ['1920', '1440', '1280', '1024'], async run(page) { const t = page.locator('.header__menu [aria-haspopup], .header__menu details > summary, .header__menu [data-mega-menu]').first(); if (await t.count()) { await t.hover(); await t.focus(); } }, reset: async (page) => page.keyboard.press('Escape') },
  { name: 'mobile-nav', only: ['768', '390', '375'], async run(page) { const b = page.locator('[data-drawer-open="mobile-nav"]').first(); if (await b.count()) await b.click(); }, reset: async (page) => page.keyboard.press('Escape') },
  { name: 'sticky-header', async run(page) { await page.evaluate(() => window.scrollTo(0, 1400)); }, reset: async (page) => page.evaluate(() => window.scrollTo(0, 0)) },
  { name: 'search-open', async run(page) { const b = page.locator('[data-drawer-open="search-drawer"]').first(); if (await b.count()) { await b.click(); const i = page.locator('#search-drawer input').first(); if (await i.count()) await i.fill('sheet'); } }, settle: 1200, reset: async (page) => page.keyboard.press('Escape') },
  { name: 'cart-open', async run(page) { const b = page.locator('[data-drawer-open="cart-drawer"]').first(); if (await b.count()) await b.click(); }, reset: async (page) => page.keyboard.press('Escape') },
];

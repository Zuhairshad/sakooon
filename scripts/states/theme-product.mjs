/** Interaction states for the theme product page. */
export default [
  { name: 'variant-selected', async run(page) { const o = page.locator('.variant-picker input[type="radio"]:not(:checked)').first(); if (await o.count()) await o.check({ force: true }); }, settle: 900 },
  { name: 'accordion-open', async run(page) { const t = page.locator('theme-disclosure .disclosure__trigger').first(); if (await t.count()) await t.click(); } },
  { name: 'size-guide', async run(page) { const b = page.locator('[data-drawer-open$="size-guide"], [data-drawer-open="size-guide-dialog"]').first(); if (await b.count()) await b.click(); }, reset: async (page) => page.keyboard.press('Escape') },
  { name: 'sticky-bar', async run(page) { await page.evaluate(() => window.scrollTo(0, 1600)); }, reset: async (page) => page.evaluate(() => window.scrollTo(0, 0)) },
  { name: 'added-to-cart', async run(page) { const b = page.locator('form[action*="/cart/add"] button[type="submit"]').first(); if (await b.count() && !(await b.isDisabled())) await b.click(); }, settle: 1500, reset: async (page) => page.keyboard.press('Escape') },
];

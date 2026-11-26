/** Interaction states for the theme collection page. */
export default [
  { name: 'filter-drawer', async run(page) { const b = page.locator('[data-drawer-open="facets-drawer"]').first(); if (await b.count()) await b.click(); }, reset: async (page) => page.keyboard.press('Escape') },
  { name: 'sort-open', only: ['1920', '1440', '1280', '1024'], async run(page) { const s = page.locator('[data-sort-toggle], select[name="sort_by"]').first(); if (await s.count()) await s.focus(); } },
  { name: 'card-hover', only: ['1920', '1440', '1280', '1024'], async run(page) { const c = page.locator('.product-card').first(); if (await c.count()) await c.hover(); }, settle: 500 },
];

# Sakooon Shopify theme

Native Shopify Online Store 2.0 theme for Sakooon (premium bedding). Theme files live at the repo root; `docs/`, `scripts/`, `tools/` are development-only and excluded from uploads by `.shopifyignore`.

- Coordination and contracts: `docs/` (start with `docs/project-specification.md`, `docs/file-ownership.md`, `docs/component-contracts.md`, `docs/design-system.md`).
- Local preview without a store: `npm install --ignore-scripts && PORT=9292 npm run preview` (http://localhost:9292, LiquidJS approximation; see `tools/preview/README.md`).
- Real preview: `npm run dev` (`shopify theme dev`, requires CLI login to the store).
- Checks: `npm run check` (Theme Check), `npm run test:responsive -- --base http://localhost:9292`, `npm run test:interactions -- --base ...`.
- Visual QA: `npm run capture:refs -- --url <reference>`, `npm run capture:theme -- --base ... --all`, `npm run compare -- --ref parachute/home --theme home`. Output in `/Users/shad/sakooon-qa`.

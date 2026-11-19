import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
import './styles/theme.css';
import './styles/overrides.css';
import './styles/idle-gate.css';
import Announcement from '@/components/chrome/Announcement';
import Header from '@/components/chrome/Header';
import Footer from '@/components/chrome/Footer';
import Popup from '@/components/chrome/Popup';
import { BodyExtras, SkipAndFilters } from '@/components/chrome/BodyExtras';
import CartProvider from '@/components/cart/CartProvider';
import CartDrawer from '@/components/cart/LazyCartDrawer';
import ThemeRuntime from '@/components/theme/ThemeRuntime';
import Static from '@/components/theme/Static';
import ChromeBehaviors from '@/components/chrome/ChromeBehaviors';
import { getProducts } from '@/lib/shopify';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Sakooon', template: '%s – Sakooon' },
  description: 'Premium bed sheets, duvets, pillows — woven for deep, peaceful sleep in every Pakistani home.',
  openGraph: { siteName: 'Sakooon', type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/theme/sn-favicon.svg' },
};

/**
 * no-js → sn-js, and `sn-idle` once the page has loaded and the main thread is
 * idle. Looping decorative animations (idle-gate.css) and canvas effects wait
 * for it so they never compete with first paint.
 */
const SN_JS =
  "var d=document,h=d.documentElement;h.className=h.className.replace('no-js','sn-js');" +
  "addEventListener('load',function(){var f=function(){h.classList.add('sn-idle');d.dispatchEvent(new Event('sn:idle'))};" +
  "'requestIdleCallback' in window?requestIdleCallback(f,{timeout:2500}):setTimeout(f,300)})";

export const viewport: Viewport = { themeColor: '#161B29', width: 'device-width', initialScale: 1 };

async function Drawer() {
  const products = await getProducts({ first: 8 }).catch(() => []);
  const upsell = products.map((p) => {
    const v = p.variants.find((x) => x.available) || p.variants[0];
    return { handle: p.handle, title: p.title, image: p.featuredImage?.url ?? null, price: v?.price ?? p.price, variantId: v?.numericId ?? 0, available: p.available };
  });
  return <CartDrawer upsell={upsell} />;
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        <Script id="sn-js" strategy="beforeInteractive">{SN_JS}</Script>
        <link rel="preload" as="font" type="font/woff2" href="/theme/sn-fraunces-300.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/theme/sn-figtree-400.woff2" crossOrigin="" />
      </head>
      <body data-motion="on" data-silk="on" data-feathers="on" data-ripple="on" data-stitch="on" data-btn="wave" data-cart="drawer" data-vt="on">
        <CartProvider>
          <SkipAndFilters />
          <Static>
            <Announcement />
            <Header />
          </Static>
          <main id="MainContent" className="sn-main" role="main" tabIndex={-1}>
            {children}
          </main>
          <Static>
            <Footer />
            <Popup />
          </Static>
          <Suspense fallback={null}>
            <Drawer />
          </Suspense>
          <BodyExtras />
        </CartProvider>
        <ThemeRuntime />
        <ChromeBehaviors />
      </body>
    </html>
  );
}

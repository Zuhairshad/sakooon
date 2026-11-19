import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/shopify';
import { getPages } from '@/lib/shopify/content';
import Boot from '@/components/theme/Boot';
import AboutPage from '@/components/pages/about';
import ContactPage from '@/components/pages/contact';
import SizeGuidePage from '@/components/pages/size-guide';
import QuizPage from '@/components/pages/quiz';
import PageBanner from '@/components/pages/PageBanner';
import PageBody from '@/components/pages/PageBody';
import Wishlist from '@/components/pages/favorites/Wishlist';
import ContactFaq from '@/components/pages/contact/Faq';
import SizeFaq from '@/components/pages/size-guide/Faq';

/** Pages with a dedicated template (ported from the theme's page.*.json templates). */
const TEMPLATES: Record<string, () => React.ReactNode> = {
  about: () => <AboutPage />,
  contact: () => <ContactPage />,
  'size-guide': () => <SizeGuidePage />,
  quiz: () => <QuizPage />,
  favorites: () => <WishlistPage />,
  wishlist: () => <WishlistPage />,
  faq: () => <FaqPage />,
};
const FALLBACK_TITLES: Record<string, string> = { about: 'About', contact: 'Contact', 'size-guide': 'Size Guide', quiz: 'Quiz', favorites: 'Wishlist', wishlist: 'Wishlist', faq: 'FAQ' };

/** FAQ: the theme's FAQ sections from the contact and size-guide templates. */
function FaqPage() {
  return (
    <>
      <PageBanner title="FAQ" />
      <ContactFaq />
      <SizeFaq />
    </>
  );
}

function WishlistPage() {
  return (
    <>
      <PageBanner title="Wishlist" />
      <Wishlist />
    </>
  );
}

export async function generateStaticParams() {
  const pages = await getPages().catch(() => []);
  const handles = new Set([...Object.keys(TEMPLATES), ...pages.map((p) => p.handle)]);
  return [...handles].map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: PageProps<'/pages/[handle]'>): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle).catch(() => null);
  const title = page?.seo.title || page?.title || FALLBACK_TITLES[handle];
  if (!title) return {};
  return {
    title,
    description: page?.seo.description || page?.bodySummary || undefined,
    alternates: { canonical: `/pages/${handle}` },
    openGraph: { title, url: `/pages/${handle}` },
  };
}

/** Known handles are prerendered via generateStaticParams. Unknown ones render on demand and must
 * block (not stream behind Suspense) so notFound() returns a real 404 status. */
export const instant = false;

export default async function PageContent({ params }: PageProps<'/pages/[handle]'>) {
  const { handle } = await params;
  const template = TEMPLATES[handle];
  if (template) {
    return (
      <>
        {template()}
        <Boot />
      </>
    );
  }
  const page = await getPage(handle).catch(() => null);
  if (!page) notFound();
  return (
    <>
      <PageBanner title={page.title} />
      <PageBody html={page.body} />
      <Boot />
    </>
  );
}

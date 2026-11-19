import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle, getBlogs } from '@/lib/shopify/content';
import PageBanner from '@/components/pages/PageBanner';
import PageBody from '@/components/pages/PageBody';
import Boot from '@/components/theme/Boot';
import { SITE_URL } from '@/lib/site';

export async function generateStaticParams() {
  const blogs = await getBlogs().catch(() => []);
  const params = blogs.flatMap((b) => b.articles.map((a) => ({ blog: b.handle, article: a.handle })));
  // Cache Components needs at least one sample; unknown handles 404 at runtime
  return params.length ? params : [{ blog: 'news', article: '__placeholder__' }];
}

export async function generateMetadata({ params }: PageProps<'/blogs/[blog]/[article]'>): Promise<Metadata> {
  const { blog, article } = await params;
  const a = await getArticle(blog, article).catch(() => null);
  if (!a) return {};
  const title = a.seo.title || a.title;
  return {
    title,
    description: a.seo.description || a.excerpt || undefined,
    alternates: { canonical: `/blogs/${blog}/${article}` },
    openGraph: { type: 'article', title, images: a.image ? [a.image.url] : undefined, publishedTime: a.publishedAt },
  };
}

/** Known handles are prerendered via generateStaticParams. Unknown ones render on demand and must
 * block (not stream behind Suspense) so notFound() returns a real 404 status. */
export const instant = false;

export default async function ArticleContent({ params }: PageProps<'/blogs/[blog]/[article]'>) {
  const { blog, article } = await params;
  const a = await getArticle(blog, article).catch(() => null);
  if (!a) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    datePublished: a.publishedAt,
    image: a.image?.url,
    author: a.author ? { '@type': 'Person', name: a.author } : undefined,
    mainEntityOfPage: `${SITE_URL}/blogs/${blog}/${article}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageBanner title={a.title} crumbs={[{ href: '/', label: 'Home' }, { href: `/blogs/${blog}`, label: a.blog.title }]} />
      <PageBody html={a.contentHtml} />
      <Boot />
    </>
  );
}

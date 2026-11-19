import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlog, getBlogs } from '@/lib/shopify/content';
import BlogMain from '@/components/pages/blog/BlogMain';
import Boot from '@/components/theme/Boot';

export async function generateStaticParams() {
  const blogs = await getBlogs().catch(() => []);
  return blogs.length ? blogs.map((b) => ({ blog: b.handle })) : [{ blog: 'news' }];
}

export async function generateMetadata({ params }: PageProps<'/blogs/[blog]'>): Promise<Metadata> {
  const { blog: handle } = await params;
  const blog = await getBlog(handle).catch(() => null);
  if (!blog) return {};
  return { title: blog.seo.title || blog.title, description: blog.seo.description || undefined, alternates: { canonical: `/blogs/${handle}` } };
}

/** Known handles are prerendered via generateStaticParams. Unknown ones render on demand and must
 * block (not stream behind Suspense) so notFound() returns a real 404 status. */
export const instant = false;

export default async function BlogContent({ params }: PageProps<'/blogs/[blog]'>) {
  const { blog: handle } = await params;
  const blog = await getBlog(handle).catch(() => null);
  if (!blog) notFound();
  return (
    <>
      <BlogMain blog={blog} />
      <Boot />
    </>
  );
}

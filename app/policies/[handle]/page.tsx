import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPolicies, getPolicy } from '@/lib/data/local';
import PageBanner from '@/components/pages/PageBanner';
import PageBody from '@/components/pages/PageBody';
import Boot from '@/components/theme/Boot';

/** Store policies (local sample data until Shopify serves /policies/* — see next.config.ts). */
export function generateStaticParams() {
  return getPolicies().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<'/policies/[handle]'>): Promise<Metadata> {
  const p = getPolicy((await params).handle);
  return p ? { title: p.title, alternates: { canonical: `/policies/${p.handle}` } } : {};
}

export default async function PolicyPage({ params }: PageProps<'/policies/[handle]'>) {
  const p = getPolicy((await params).handle);
  if (!p) notFound();
  return (
    <>
      <PageBanner title={p.title} />
      <PageBody html={p.body} />
      <Boot />
    </>
  );
}

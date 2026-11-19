import type { Metadata } from 'next';
import NotFoundMain from '@/components/pages/notfound/NotFoundMain';
import Boot from '@/components/theme/Boot';

export const metadata: Metadata = { title: '404 Not Found', robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <NotFoundMain />
      <Boot />
    </>
  );
}

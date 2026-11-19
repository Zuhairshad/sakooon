import { getProductsByHandles } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';
import QuizMain from './QuizMain';
import Features from './Features';
import Best from './Best';

/**
 * Quiz result → product. Result 1 = crisp & cool, 2 = soft & cool,
 * 3 = silky sateen. Edit these handles to change the recommendations.
 */
export const QUIZ_PICKS = {
  '1': 'quilted-bed-sheet-set-king',
  '2': 'yarn-dyed-cotton-satin-bed-sheet-set-king',
  '3': 'two-tone-duvet-cover-set-king',
} as const;

export default async function QuizPage() {
  const list = await getProductsByHandles(Object.values(QUIZ_PICKS)).catch(() => [] as Product[]);
  const picks: Partial<Record<'1' | '2' | '3', Product>> = {};
  (Object.keys(QUIZ_PICKS) as (keyof typeof QUIZ_PICKS)[]).forEach((k) => {
    const p = list.find((x) => x.handle === QUIZ_PICKS[k]);
    if (p) picks[k] = p;
  });
  return (
    <>
      <QuizMain picks={picks} />
      <Features />
      <Best />
    </>
  );
}

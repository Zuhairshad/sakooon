'use server';

import { getProductsByHandles } from './index';
import type { Product } from './types';

/** Used by client-rendered rails (recently viewed). */
export async function productsByHandles(handles: string[]): Promise<Product[]> {
  const list = (Array.isArray(handles) ? handles : []).filter((h) => typeof h === 'string' && /^[a-z0-9-]{1,120}$/.test(h)).slice(0, 24);
  return getProductsByHandles(list);
}

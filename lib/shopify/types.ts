export type Image = { url: string; altText: string | null; width: number | null; height: number | null };

export type Variant = {
  id: string; // gid
  numericId: number;
  title: string;
  available: boolean;
  price: number; // cents
  compareAtPrice: number | null; // cents
  selectedOptions: { name: string; value: string }[];
  image: Image | null;
};

export type OptionValue = { name: string; color: string | null; swatchImage: string | null };
export type ProductOption = { name: string; values: OptionValue[] };

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  description: string;
  descriptionHtml: string;
  createdAt: string;
  /** "New" badge flag, computed inside the cached data layer (Date.now() is not allowed while prerendering). */
  isNew: boolean;
  available: boolean;
  options: ProductOption[];
  images: Image[];
  featuredImage: Image | null;
  variants: Variant[];
  price: number; // min variant price, cents
  compareAtPrice: number | null; // compare-at of the cheapest variant, cents
  priceVaries: boolean;
  seo: { title: string | null; description: string | null };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  productCount: number;
  seo: { title: string | null; description: string | null };
};

export type Page = { id: string; handle: string; title: string; body: string; bodySummary: string; seo: { title: string | null; description: string | null } };

export type CartLine = {
  id: string;
  quantity: number;
  cost: number; // cents, line total
  variant: {
    id: string;
    title: string;
    price: number;
    compareAtPrice: number | null;
    image: Image | null;
    selectedOptions: { name: string; value: string }[];
    product: { handle: string; title: string; featuredImage: Image | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number; // cents
  total: number; // cents
  lines: CartLine[];
  note: string | null;
};

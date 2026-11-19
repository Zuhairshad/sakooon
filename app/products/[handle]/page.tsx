import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollections, getProduct } from "@/lib/shopify";
import {
  getProductCollections,
  getProductHandles,
  getRelated,
} from "@/lib/shopify/product";
import { PRODUCT_CRUMB } from "@/lib/content/products";
import { SITE_URL } from "@/lib/site";
import { img } from "@/lib/utils";
import ProductMain from "@/components/product/ProductMain";
import RecsRail from "@/components/product/RecsRail";
import RecentRail from "@/components/product/RecentRail";
import ProductReviews from "@/components/product/ProductReviews";
import Boot from "@/components/theme/Boot";
import "@/components/product/product-recs.css";
import Static from "@/components/theme/Static";

export async function generateStaticParams() {
  const handles = await getProductHandles().catch(() => []);
  return handles.length
    ? handles.map((handle) => ({ handle }))
    : [{ handle: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) return { title: "404 Not Found" };
  const image = p.featuredImage?.url;
  return {
    title: p.seo.title ? { absolute: p.seo.title } : p.title,
    description: p.seo.description || p.description.slice(0, 160),
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: {
      type: "website",
      title: p.seo.title || p.title,
      description: p.seo.description || undefined,
      url: `/products/${p.handle}`,
      images: image ? [{ url: img(image, 1200) }] : undefined,
    },
  };
}

async function crumbFor(handle: string) {
  const cols = await getProductCollections(handle).catch(() => []);
  const pref = PRODUCT_CRUMB[handle];
  const hit = (pref && cols.find((c) => c.handle === pref)) || cols[0];
  if (hit) return hit;
  if (pref) {
    const all = await getCollections().catch(() => []);
    const c = all.find((x) => x.handle === pref);
    if (c) return { handle: c.handle, title: c.title };
  }
  return null;
}

/** All products are prerendered (generateStaticParams). Unknown handles are answered with a
 * 404 by proxy.ts; new ones render on demand and block instead of streaming a fallback. */
export const instant = false;

export default function ProductPage({
  params,
}: PageProps<"/products/[handle]">) {
  return <ProductContent params={params} />;
}

async function ProductContent({
  params,
}: {
  params: PageProps<"/products/[handle]">["params"];
}) {
  const { handle } = await params;
  const p = await getProduct(handle);
  if (!p) notFound();
  const [crumb, related] = await Promise.all([
    crumbFor(p.handle),
    getRelated(p),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    url: `${SITE_URL}/products/${p.handle}`,
    image: p.images.slice(0, 6).map((i) => img(i.url, 1600)),
    description: p.description.slice(0, 500),
    brand: { "@type": "Brand", name: p.vendor || "Sakooon" },
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      availability: v.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      price: (v.price / 100).toFixed(2),
      priceCurrency: "PKR",
      url: `${SITE_URL}/products/${p.handle}?variant=${v.numericId}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ProductMain product={p} crumb={crumb} />
      <Static>
        <RecsRail id="snrc-template--23876058906727__recs" products={related} />
      </Static>
      <ProductReviews />
      <RecentRail
        id="snrc-template--23876058906727__recent"
        current={p.handle}
      />
      <Boot />
    </>
  );
}

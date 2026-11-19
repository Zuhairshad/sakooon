import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { SHOPIFY_ENABLED, shopifyFetch } from './client';
import * as local from '../data/local';

export type PageSummary = { handle: string; title: string; updatedAt: string };
export type ArticleSummary = {
  handle: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  image: { url: string; altText: string | null; width: number | null; height: number | null } | null;
  author: string | null;
};
export type Blog = { handle: string; title: string; seo: { title: string | null; description: string | null }; articles: ArticleSummary[] };
export type Article = ArticleSummary & { contentHtml: string; tags: string[]; seo: { title: string | null; description: string | null }; blog: { handle: string; title: string } };

const ARTICLE = `handle title excerpt publishedAt authorV2 { name } image { url altText width height }`;

export async function getPages(): Promise<PageSummary[]> {
  'use cache';
  cacheLife('days');
  cacheTag('pages');
  if (!SHOPIFY_ENABLED) return local.getPages();
  const d = await shopifyFetch<{ pages: { nodes: PageSummary[] } }>(`query { pages(first: 100) { nodes { handle title updatedAt } } }`);
  return d.pages.nodes;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const toSummary = (a: any): ArticleSummary => ({
  handle: a.handle,
  title: a.title,
  excerpt: a.excerpt || '',
  publishedAt: a.publishedAt,
  image: a.image,
  author: a.authorV2?.name ?? null,
});

export async function getBlogs(): Promise<{ handle: string; title: string; articles: { handle: string; publishedAt: string }[] }[]> {
  'use cache';
  cacheLife('days');
  cacheTag('pages', 'blogs');
  if (!SHOPIFY_ENABLED) return local.getBlogs();
  const d = await shopifyFetch<{ blogs: { nodes: any[] } }>(
    `query { blogs(first: 20) { nodes { handle title articles(first: 250) { nodes { handle publishedAt } } } } }`,
  );
  return d.blogs.nodes.map((b) => ({ handle: b.handle, title: b.title, articles: b.articles.nodes }));
}

export async function getBlog(handle: string): Promise<Blog | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('blogs', `blog:${handle}`);
  if (!SHOPIFY_ENABLED) return local.getBlog(handle);
  const d = await shopifyFetch<{ blog: any }>(
    `query($h: String!) { blog(handle: $h) { handle title seo { title description } articles(first: 50, sortKey: PUBLISHED_AT, reverse: true) { nodes { ${ARTICLE} } } } }`,
    { h: handle },
  );
  if (!d.blog) return null;
  return { handle: d.blog.handle, title: d.blog.title, seo: d.blog.seo || { title: null, description: null }, articles: d.blog.articles.nodes.map(toSummary) };
}

export async function getArticle(blog: string, handle: string): Promise<Article | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('blogs', `article:${blog}/${handle}`);
  if (!SHOPIFY_ENABLED) return local.getArticle(blog, handle);
  const d = await shopifyFetch<{ blog: any }>(
    `query($b: String!, $h: String!) { blog(handle: $b) { handle title articleByHandle(handle: $h) { ${ARTICLE} contentHtml tags seo { title description } } } }`,
    { b: blog, h: handle },
  );
  const a = d.blog?.articleByHandle;
  if (!a) return null;
  return { ...toSummary(a), contentHtml: a.contentHtml, tags: a.tags, seo: a.seo || { title: null, description: null }, blog: { handle: d.blog.handle, title: d.blog.title } };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

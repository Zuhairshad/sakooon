import { NextResponse } from 'next/server';

/**
 * Newsletter signup. Replaces the Liquid theme's `/contact` customer form.
 * With SHOPIFY_ADMIN_TOKEN (scope: write_customers) the email is created /
 * subscribed as a Shopify customer with the given tags, exactly like the
 * theme form did. NEXT_PUBLIC_WELCOME_CODE is shown in the popup on success.
 */
export async function POST(req: Request) {
  const { email, tags = 'newsletter' } = (await req.json().catch(() => ({}))) as { email?: string; tags?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });

  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const domain = process.env.SHOPIFY_ADMIN_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  if (token && domain) {
    const res = await fetch(`https://${domain}/admin/api/2026-10/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `mutation($input: CustomerInput!) { customerCreate(input: $input) { customer { id } userErrors { field message } } }`,
        variables: {
          input: {
            email,
            tags: tags.split(',').map((t) => t.trim()),
            emailMarketingConsent: { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' },
          },
        },
      }),
    });
    const d = await res.json().catch(() => null);
    const errs = d?.data?.customerCreate?.userErrors || [];
    // an existing customer is fine — they are already on the list
    if (!res.ok || (errs.length && !errs.some((e: { message: string }) => /taken/i.test(e.message)))) {
      return NextResponse.json({ error: 'Could not subscribe' }, { status: 502 });
    }
  } else {
    console.warn('[newsletter] SHOPIFY_ADMIN_TOKEN not set — signup not stored:', email);
  }
  return NextResponse.json({ ok: true, code: process.env.NEXT_PUBLIC_WELCOME_CODE || null });
}

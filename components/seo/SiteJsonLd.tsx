import { SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Organization + WebSite (with sitelinks search) structured data.
 * Mount once on the home page: <SiteJsonLd /> inside app/page.tsx.
 * Contact details are the ones shown in the theme footer.
 */
export default function SiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/theme/sn-favicon.svg`,
        email: 'hello@sakooon.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'First Floor, Plaza # 38 Z Block, Phase 3, DHA',
          addressLocality: 'Lahore',
          addressCountry: 'PK',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

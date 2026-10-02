// Single source of truth for the site's entity data (SEO / AEO / GEO).
// Every JSON-LD block references these @ids so search engines and AI answer
// engines resolve ONE consistent publisher + author instead of several
// near-duplicates ("GoshBuzz LLC" / "GoshBuzz Pakistan" / "GoshBuzz Apps").

import { networkModules } from './networkData';

export const SITE_URL = 'https://goshbuzz.com';
export const SITE_NAME = 'GoshBuzz';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/goshbuzz_logo.jpg`;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const AUTHOR_ID = `${SITE_URL}/about#founder`;

// Confirm this spelling: the About page and the payment-account title use
// "Saulat Nadeem"; articles previously said "Solat Nadeem".
export const AUTHOR_NAME = 'Saulat Nadeem';
export const AUTHOR_JOB_TITLE = 'Computer Scientist';

// Bump when article content is materially updated (also drives sitemap lastmod).
export const ARTICLE_DATE_PUBLISHED = '2026-03-25T08:00:00+05:00';
export const ARTICLE_DATE_MODIFIED = '2026-07-23T08:00:00+05:00';

export const logoNode = {
  '@type': 'ImageObject',
  '@id': `${SITE_URL}/#logo`,
  url: DEFAULT_OG_IMAGE,
  contentUrl: DEFAULT_OG_IMAGE,
};

export const organizationNode = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: ['GoshBuzz Pakistan'],
  url: SITE_URL,
  logo: logoNode,
  image: DEFAULT_OG_IMAGE,
  description:
    "GoshBuzz is a Pakistan-based digital knowledge hub publishing free step-by-step online earning guides and privacy-first Android utilities.",
  areaServed: { '@type': 'Country', name: 'Pakistan' },
  founder: { '@id': AUTHOR_ID },
  sameAs: networkModules.map((m) => m.url),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${SITE_URL}/contact`,
    availableLanguage: ['en', 'ur'],
  },
};

export const founderNode = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: AUTHOR_NAME,
  jobTitle: AUTHOR_JOB_TITLE,
  url: `${SITE_URL}/about`,
  worksFor: { '@id': ORG_ID },
};

export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: 'en',
  publisher: { '@id': ORG_ID },
  description:
    'Free online earning guides, freelancing blueprints and privacy-first Android apps for Pakistan.',
};

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.path === '/' ? SITE_URL : `${SITE_URL}${t.path}`,
    })),
  };
}

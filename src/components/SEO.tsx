import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { findProductByIdentifier } from '../data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

export const BASE_URL = 'https://goshbuzz.com';

export function getCanonicalUrl(pathName: string): string {
  if (!pathName) return BASE_URL;

  // Strip query params and hash
  let cleanPath = pathName.split('?')[0].split('#')[0];

  // Strip index.html
  if (cleanPath.endsWith('/index.html')) {
    cleanPath = cleanPath.replace(/\/index\.html$/, '');
  }

  // Strip trailing slash (except for root '/')
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Map legacy route aliases to their canonical versions
  if (cleanPath === '/blogs' || cleanPath.startsWith('/blogs/news/tagged') || cleanPath.startsWith('/blogs/tagged') || cleanPath.startsWith('/blogs/tag')) {
    cleanPath = '/blogs/news';
  } else if (cleanPath.startsWith('/blogs/news/')) {
    const slug = cleanPath.replace(/^\/blogs\/news\//, '');
    const product = findProductByIdentifier(slug);
    cleanPath = product ? `/blogs/news/${product.slug}` : '/blogs/news';
  } else if (cleanPath.startsWith('/products/')) {
    const slug = cleanPath.replace(/^\/products\//, '');
    const product = findProductByIdentifier(slug);
    cleanPath = product ? `/blogs/news/${product.slug}` : '/blogs/news';
  } else if (cleanPath.startsWith('/product/')) {
    const slug = cleanPath.replace(/^\/product\//, '');
    const product = findProductByIdentifier(slug);
    cleanPath = product ? `/blogs/news/${product.slug}` : '/blogs/news';
  } else if (cleanPath.startsWith('/collections/')) {
    const type = cleanPath.replace(/^\/collections\//, '');
    cleanPath = type ? `/collection/${type}` : '/';
  } else if (cleanPath === '/products' || cleanPath === '/product' || cleanPath === '/collections') {
    cleanPath = '/';
  } else if (cleanPath === '/collection/frontpage') {
    cleanPath = '/';
  } else if (cleanPath === '/cart') {
    cleanPath = '/checkout';
  } else if (cleanPath === '/privacy') {
    cleanPath = '/privacy-policy';
  } else if (cleanPath === '/refund') {
    cleanPath = '/refund-policy';
  } else if (cleanPath === '/delivery' || cleanPath === '/shipping') {
    cleanPath = '/delivery-policy';
  } else if (cleanPath === '/about-us') {
    cleanPath = '/about';
  } else if (cleanPath === '/contact-us') {
    cleanPath = '/contact';
  } else if (cleanPath === '/terms-and-conditions' || cleanPath === '/terms-of-service' || cleanPath === '/tos') {
    cleanPath = '/terms';
  } else if (cleanPath === '/disclaimers') {
    cleanPath = '/disclaimer';
  }

  return cleanPath === '/' || !cleanPath ? BASE_URL : `${BASE_URL}${cleanPath}`;
}

export default function SEO({
  title,
  description,
  keywords,
  image = 'https://goshbuzz.com/goshbuzz_logo.jpg',
  type = 'website',
  canonicalUrl,
  noindex = false,
  children,
}: SEOProps) {
  const location = useLocation();
  const canonical = canonicalUrl || getCanonicalUrl(location.pathname);

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="GoshBuzz Pakistan" />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {children}
    </Helmet>
  );
}

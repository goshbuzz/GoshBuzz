import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageHero, thumbnailMosaic } from '../components/PageHero';

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Your data, protected"
        eyebrowIcon={Shield}
        icon={Shield}
        accent="amber"
        title="Privacy"
        highlight="Policy"
        subtitle="How we collect, handle, and protect your information — including cookies and advertising partners."
        mosaic={thumbnailMosaic(47, 24)}
      />
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy — GoshBuzz Pakistan</title>
        <meta name="description" content="Read the Privacy Policy of GoshBuzz Pakistan to learn how we protect and handle your personal information." />
        <meta property="og:title" content="Privacy Policy — GoshBuzz Pakistan" />
        <meta property="og:description" content="Read the Privacy Policy of GoshBuzz Pakistan to learn how we protect and handle your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/privacy-policy" />
        <link rel="canonical" href="https://goshbuzz.com/privacy-policy" />
      </Helmet>
      <div className="prose dark:prose-invert prose-amber max-w-none text-gray-600 dark:text-gray-400 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          When you purchase from GoshBuzz, we collect your name, email address, and WhatsApp number to fulfill your order. 
          Your payment is processed securely via local mobile wallets (JazzCash/EasyPaisa), and we do not store any sensitive financial data on our servers.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your email address solely to send you the digital products you have purchased and, occasionally, updates or offers related to GoshBuzz. 
          You can opt out of promotional emails at any time.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">3. Data Sharing</h2>
        <p className="mb-4">
          We do not sell, rent, or trade your personal information to third parties. 
          Information is only shared with trusted service providers necessary to operate our business (e.g., payment gateways, email delivery services).
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">4. Google AdSense & Advertising Cookies</h2>
        <p className="mb-4">
          GoshBuzz uses Google AdSense and third-party advertising partners to display advertisements on our site. Google uses cookies (including advertising cookies and device identifiers) to serve ads based on your visit to GoshBuzz and other websites across the Internet:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-bold hover:underline">Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-amber-600 font-bold hover:underline">aboutads.info</a>.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Digital Downloads Policy</h2>
        <p className="mb-4">
          Because our products are digital downloads, all sales are considered final once the download link is provided. 
          We ensure that your access to purchased files is secure and private.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">6. Mobile Applications and Software Tools</h2>
        <p className="mb-4">
          If you download or use our mobile applications (available on platforms like the Google Play Store, such as EMF Sentinel) or access our web-based software tools, we may collect device-specific information (such as hardware model, operating system version, and unique device identifiers). Usage data, crash reports, and analytics may also be collected to improve app stability and performance. Third-party services integrated into our apps (such as Google Play Services, Firebase, or analytics providers) may collect information as governed by their own respective privacy policies.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact us via our Contact page.
        </p>
      </div>
    </div>
    </>
  );
}

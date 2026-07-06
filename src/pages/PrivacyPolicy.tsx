import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy — GoshBuzz Pakistan</title>
        <meta name="description" content="Read the Privacy Policy of GoshBuzz Pakistan to learn how we protect and handle your personal information." />
        <meta property="og:title" content="Privacy Policy — GoshBuzz Pakistan" />
        <meta property="og:description" content="Read the Privacy Policy of GoshBuzz Pakistan to learn how we protect and handle your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/privacy" />
      </Helmet>
      <div className="text-center mb-12">
        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">How we handle and protect your information.</p>
      </div>
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

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">4. Digital Downloads Policy</h2>
        <p className="mb-4">
          Because our products are digital downloads, all sales are considered final once the download link is provided. 
          We ensure that your access to purchased files is secure and private.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Mobile Applications and Software</h2>
        <p className="mb-4">
          If you download or use our mobile applications (available on platforms like the Google Play Store) or access our web-based software tools, we may collect device-specific information (such as hardware model, operating system version, and unique device identifiers). Usage data, crash reports, and analytics may also be collected to improve app stability and performance. Third-party services integrated into our apps (such as Google Play Services, Firebase, or analytics providers) may collect information as governed by their own respective privacy policies.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy, please contact us via our Contact page.
        </p>
      </div>
    </div>
  );
}

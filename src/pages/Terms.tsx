import { FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <Helmet>
        <title>Terms & Conditions — GoshBuzz Pakistan</title>
        <meta name="description" content="Read the Terms and Conditions for using GoshBuzz Pakistan's website and purchasing our digital guides." />
        <meta property="og:title" content="Terms & Conditions — GoshBuzz Pakistan" />
        <meta property="og:description" content="Read the Terms and Conditions for using GoshBuzz Pakistan's website and purchasing our digital guides." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/terms" />
        <link rel="canonical" href="https://goshbuzz.com/terms" />
      </Helmet>
      <div className="text-center mb-12">
        <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Terms and Conditions</h1>
      </div>
      <div className="prose dark:prose-invert prose-amber max-w-none text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing the GoshBuzz website and purchasing our digital guides, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Intellectual Property</h2>
        <p className="mb-6">
          All PDF guides, text, logos, and materials provided by GoshBuzz are protected by copyright and intellectual property laws. When you purchase a guide, you are granted a single, non-transferable, personal-use license. You may not resell, redistribute, copy, or share our digital products with others.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. User Obligations</h2>
        <p className="mb-6">
          You agree to provide accurate information when making a purchase and interacting with our support channels. You are responsible for ensuring that the payment screenshots provided via WhatsApp are legitimate and belong to you.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. Delivery and Refunds</h2>
        <p className="mb-6">
          As stated in our Delivery Policy and No Return Policy, delivery is conducted digitally via WhatsApp. All sales are final and non-refundable due to the digital nature of the products.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Software and Mobile Applications</h2>
        <p className="mb-6">
          In addition to digital guides, GoshBuzz provides mobile applications and web-based software (available via the Google Play Store and other platforms). By downloading, installing, or using our apps, you agree to comply with all applicable platform rules and guidelines. Our applications are provided under a personal, non-exclusive, non-transferable license. You may not reverse engineer, decompile, or attempt to extract the source code of our software applications.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Modifications</h2>
        <p>
          We reserve the right to update or change these Terms and Conditions at any time without prior notice. Continued use of our site and services after any such changes shall constitute your consent to such changes.
        </p>
      </div>
    </div>
  );
}

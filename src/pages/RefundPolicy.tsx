import { Ban } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageHero, thumbnailMosaic } from '../components/PageHero';

export default function RefundPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Digital goods • All sales final"
        eyebrowIcon={Ban}
        icon={Ban}
        accent="rose"
        title="No Return &"
        highlight="Refund Policy"
        subtitle="Please read before purchasing — why digital products are non-refundable and how we support you before you buy."
        mosaic={thumbnailMosaic(29, 24)}
      />
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <Helmet>
        <title>No Return Policy — GoshBuzz Pakistan</title>
        <meta name="description" content="Read our digital goods no-return and refund policy." />
        <meta property="og:title" content="No Return Policy — GoshBuzz Pakistan" />
        <meta property="og:description" content="Read our digital goods no-return and refund policy." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/refund-policy" />
        <link rel="canonical" href="https://goshbuzz.com/refund-policy" />
      </Helmet>
      <div className="prose dark:prose-invert prose-amber max-w-none text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Digital Goods are Non-Refundable</h2>
        <p className="mb-6">
          Because all products offered by GoshBuzz are digital, including downloadable PDF guides, web applications, and mobile apps (e.g., via the Google Play Store), all direct sales are considered final and non-refundable. We do not accept returns or exchanges.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why No Returns?</h2>
        <p className="mb-6">
          Once a digital product has been sent to your WhatsApp/email, or access to our software has been granted, it is permanently in your possession and cannot be "returned" in the way a physical item can. Therefore, we do not offer refunds, exchanges, or cancellations once the delivery is complete.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">In-App Purchases & Marketplace Refunds</h2>
        <p className="mb-6">
          For applications downloaded through third-party marketplaces like the Google Play Store, any refund requests for app purchases or in-app subscriptions must be directed to the respective marketplace's customer support. Such purchases are entirely subject to Google Play's own refund policies and procedures.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Pre-Purchase Support</h2>
        <p>
          We encourage you to read the product descriptions carefully and contact our support via WhatsApp (<strong>+92 312 699 9078</strong>) if you have any questions before making a purchase. We want to ensure our guides are the right fit for your goals!
        </p>
      </div>
    </div>
    </>
  );
}

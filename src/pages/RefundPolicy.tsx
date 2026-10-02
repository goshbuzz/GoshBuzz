import { Ban } from 'lucide-react';
import SEO from '../components/SEO';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <SEO
        title="No Return & Refund Policy — GoshBuzz"
        description="GoshBuzz digital guides are non-returnable once delivered. Read when exceptions apply and how to contact support on WhatsApp."
      />
      <div className="text-center mb-12">
        <Ban className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">No Return & Refund Policy</h1>
      </div>
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
  );
}

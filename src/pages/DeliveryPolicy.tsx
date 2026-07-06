import { Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function DeliveryPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <Helmet>
        <title>Delivery Policy — GoshBuzz Pakistan</title>
        <meta name="description" content="Learn about our digital delivery process via WhatsApp and Email." />
        <meta property="og:title" content="Delivery Policy — GoshBuzz Pakistan" />
        <meta property="og:description" content="Learn about our digital delivery process via WhatsApp and Email." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/delivery" />
      </Helmet>
      <div className="text-center mb-12">
        <Send className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Delivery Policy</h1>
      </div>
      <div className="prose dark:prose-invert prose-amber max-w-none text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Digital Delivery via WhatsApp</h2>
        <p className="mb-6">
          For our PDF guides, we do not ship any physical products. Once you complete your payment via JazzCash or EasyPaisa, simply send a screenshot of the successful transaction to our official WhatsApp number (<strong>+92 312 699 9078</strong>).
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">App and Software Access</h2>
        <p className="mb-6">
          In addition to PDF guides, our mobile applications and web tools are delivered via direct access on our website or through official app marketplaces (such as the Google Play Store). Access to web applications is granted immediately upon account creation or successful payment, and mobile apps can be downloaded instantly following marketplace guidelines.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Delivery Time</h2>
        <p className="mb-6">
          Your PDF guides will be delivered directly to your WhatsApp inbox immediately upon payment verification. Our typical response time is instant. Please allow up to 24 hours in rare cases of extremely high volume or off-hours.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Lost Files</h2>
        <p>
          If you lose access to your PDF or accidentally delete the chat, you can always message us again on WhatsApp from the same number you used to purchase, and we will resend the files at no extra cost.
        </p>
      </div>
    </div>
  );
}

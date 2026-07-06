import { Smartphone, CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function HowToPay() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('03069625437');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>How to Pay via JazzCash / EasyPaisa — GoshBuzz Pakistan</title>
        <meta name="description" content="Step-by-step guide on how to pay for your digital guides using JazzCash or EasyPaisa." />
        <meta property="og:title" content="How to Pay via JazzCash / EasyPaisa — GoshBuzz Pakistan" />
        <meta property="og:description" content="Step-by-step guide on how to pay for your digital guides using JazzCash or EasyPaisa." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/how-to-pay" />
      </Helmet>
      <div className="text-center mb-16">
        <Smartphone className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">How to Pay</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Fast, local, and instant access via mobile wallets.</p>
      </div>

      <div className="space-y-12">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Smartphone className="w-48 h-48" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 relative z-10">Step-by-Step Payment Guide</h2>
          
          <ul className="space-y-8 relative z-10 text-lg">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold">1</div>
              <div>
                <strong className="block text-gray-900 dark:text-gray-100">Select Your Guides</strong>
                <span className="text-gray-600 dark:text-gray-400 text-base">Note the price of your desired guides (Rs.500 for Ideas, Rs.200 for Skills).</span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold">2</div>
              <div>
                <strong className="block text-gray-900 dark:text-gray-100">Send Payment via JazzCash or EasyPaisa</strong>
                <span className="text-gray-600 dark:text-gray-400 text-base mb-3 block">Transfer the exact amount to the following account:</span>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 inline-block">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account Title: <span className="font-bold text-gray-900 dark:text-gray-100">Saulat Nadeem</span></div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold font-mono tracking-wider text-gray-900 dark:text-gray-100">0306 962 5437</span>
                    <button onClick={handleCopy} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors" title="Copy Number">
                      {copied ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold">3</div>
              <div>
                <strong className="block text-gray-900 dark:text-gray-100">Share Screenshot on WhatsApp</strong>
                <span className="text-gray-600 dark:text-gray-400 text-base">Send a screenshot of your successful transaction to our WhatsApp number: <a href="https://wa.me/923126999078" className="text-green-600 font-bold hover:underline">+92 312 699 9078</a></span>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center font-bold">4</div>
              <div>
                <strong className="block text-gray-900 dark:text-gray-100">Instant Access</strong>
                <span className="text-gray-600 dark:text-gray-400 text-base">We will verify the payment and send your PDF guides directly to your WhatsApp immediately!</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <CheckCircle2 className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">JazzCash Accepted</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Send directly from your JazzCash app.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">EasyPaisa Accepted</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Send directly from your EasyPaisa app.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <CheckCircle2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100">WhatsApp Delivery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">No email waiting. Instant chat delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

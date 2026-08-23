import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How will I receive my purchased guides?",
    answer: "All our guides are delivered digitally in PDF format. Once your payment via JazzCash or EasyPaisa is verified, we will send the guides directly to your WhatsApp inbox instantly."
  },
  {
    question: "Do I need any prior experience to start these earning methods?",
    answer: "No, most of our guides are designed specifically for beginners. They include step-by-step instructions from setting up accounts to withdrawing your first earnings."
  },
  {
    question: "Are these methods specifically for Pakistan?",
    answer: "Yes, our guides focus on what works in Pakistan, including how to handle international client payments, local e-commerce, and overcoming regional constraints."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We currently accept payments through JazzCash, EasyPaisa, and direct Bank Transfers to make it easy and accessible for everyone in Pakistan."
  },
  {
    question: "Do you offer refunds?",
    answer: "Since our products are digital information products (PDFs, templates, etc.) that you download and keep, we do not offer refunds once the delivery is complete. Please read the product description carefully before purchasing."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about our earning blueprints and survival manuals.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-amber-400/50 dark:hover:border-amber-500/30"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-gray-400 dark:text-gray-500 transition-transform shrink-0 ${
                    openIndex === index ? 'rotate-180 text-amber-500 dark:text-amber-400' : ''
                  }`}
                  size={20}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed text-sm border-t border-gray-100 dark:border-gray-800/80 pt-4 bg-gray-50/40 dark:bg-gray-900/40">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

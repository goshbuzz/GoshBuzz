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
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Everything you need to know about our guides and skills.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 pr-8">{faq.question}</span>
                <ChevronDown
                  className={`text-gray-500 transition-transform shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
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
                    <div className="px-6 pb-5 text-gray-600 bg-white">
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

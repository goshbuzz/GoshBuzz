import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: "What makes GoshBuzz guides and articles high-value and unique?",
    answer: "Every article and blueprint published on GoshBuzz is written from real-world execution data, localized for the Pakistani economy, and structured into step-by-step actionable roadmaps. We strictly adhere to Google Webmaster Quality Guidelines, providing zero-fluff, original editorial analysis on e-commerce, digital freelancing, content publishing, and software engineering."
  },
  {
    question: "How do I access and read the complete step-by-step guides?",
    answer: "All 60 earning blueprints and survival skill manuals are freely accessible on our website under the /blogs/news section. You can also request instant downloadable PDF editions delivered directly to your WhatsApp inbox for offline reading."
  },
  {
    question: "Are GoshBuzz Android mobile applications safe and privacy-first?",
    answer: "Yes! Applications published by GoshBuzz (such as EMF Sentinel) function 100% offline without background tracking, account requirements, or data collection. All sensor telemetry (such as hardware magnetometer readings) is processed directly on your physical smartphone."
  },
  {
    question: "How can freelancers in Pakistan withdraw international earnings safely?",
    answer: "Our guides provide complete walk-throughs for connecting Payoneer, SadaPay, NayaPay, and direct commercial bank wires. For example, Payoneer is officially integrated with JazzCash, enabling direct, instant local currency withdrawals in PKR."
  },
  {
    question: "What payment methods do you accept for custom guide requests?",
    answer: "We accept JazzCash, EasyPaisa, and direct local bank transfers across all major Pakistani banking institutions to ensure seamless accessibility for everyone."
  },
  {
    question: "Does GoshBuzz comply with Google AdSense & Publisher Policies?",
    answer: "Absolutely. GoshBuzz is committed to delivering high-quality, original content, transparent navigation, clear legal disclosures, and authorized seller verification (via /app-ads.txt and /ads.txt) across all web properties."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-20 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3 border border-amber-300/50 dark:border-amber-700/50">
            <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Knowledge Base & Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about GoshBuzz educational blueprints, mobile app utilities, and local digital economy solutions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-xs transition-all hover:border-amber-400/60 dark:hover:border-amber-500/40"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100 pr-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
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
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm border-t border-gray-100 dark:border-gray-800/80 pt-4 bg-gray-50/40 dark:bg-gray-900/40">
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


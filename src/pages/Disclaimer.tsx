import { AlertTriangle } from 'lucide-react';
import SEO from '../components/SEO';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <SEO
        title="Earnings Disclaimer — GoshBuzz"
        description="GoshBuzz guides are educational, not financial advice. Read our earnings, results and liability disclaimer before you start any method."
      />
      <div className="text-center mb-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Disclaimer</h1>
      </div>
      <div className="prose dark:prose-invert prose-amber max-w-none text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center md:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Earnings & Income Disclaimer</h2>
        <p className="mb-6">
          The earning ideas, survival skills, and blueprints provided by GoshBuzz are for educational and informational purposes only. We make every effort to accurately represent these products and their potential for income. However, we do not guarantee any specific financial results, income, or success.
        </p>
        <p className="mb-6">
          Your earning potential is entirely dependent on your own effort, skills, dedication, market conditions, and execution of the strategies provided. Any examples of income or success shown are exceptional results, which do not apply to the average purchaser, and are not intended to represent or guarantee that anyone will achieve the same or similar results.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Not Professional or Financial Advice</h2>
        <p className="mb-6">
          The content in our guides does not constitute financial, legal, or professional advice. Always do your own research (DYOR) and consult with a certified professional (such as a financial advisor or accountant) before making any financial or business decisions.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Assumption of Risk</h2>
        <p className="mb-6">
          By purchasing our guides, you agree that you are solely responsible for your own actions and decisions. GoshBuzz and its owners are not liable for any success or failure of your business or financial endeavors that is directly or indirectly related to the purchase and use of our information.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Software & Mobile App Disclaimer</h2>
        <p>
          Any software, web applications, or mobile apps provided by GoshBuzz (including those distributed on the Google Play Store) are provided on an "as is" and "as available" basis. We make no warranties regarding the uninterrupted availability, security, or error-free operation of our software. GoshBuzz is not liable for any data loss, device issues, or damages resulting from the use or inability to use our applications.
        </p>
      </div>
    </div>
  );
}

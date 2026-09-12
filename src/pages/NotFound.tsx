import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div data-gb-404="true" className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
      <SEO
        title="404 — Page Not Found | GoshBuzz Pakistan"
        description="The page you are looking for does not exist on GoshBuzz Pakistan."
        noindex={true}
      />
      <div className="inline-flex p-4 bg-amber-50 dark:bg-amber-950/30 rounded-full text-amber-600 dark:text-amber-400">
        <AlertCircle size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        404 — Page Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        The page or guide you requested could not be found. It may have been moved or renamed.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors shadow-md"
        >
          <ArrowLeft size={18} /> Back to Library
        </Link>
      </div>
    </div>
  );
}

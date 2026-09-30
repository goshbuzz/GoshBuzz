import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Search } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, thumbnailMosaic } from '../components/PageHero';

export default function NotFound() {
  return (
    <div data-gb-404="true">
      <SEO
        title="404 — Page Not Found | GoshBuzz Pakistan"
        description="The page you are looking for does not exist on GoshBuzz Pakistan."
        noindex={true}
      />
      <PageHero
        eyebrow="Error 404"
        eyebrowIcon={AlertCircle}
        icon={Search}
        title="Page"
        highlight="Not Found"
        subtitle="The page or guide you requested could not be found. It may have been moved or renamed."
        mosaic={thumbnailMosaic(2, 24)}
        scrollCue={false}
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold rounded-xl transition-colors shadow-md"
          >
            <ArrowLeft size={18} /> Back to Library
          </Link>
          <Link
            to="/blogs/news"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold rounded-xl transition-colors"
          >
            Browse all guides
          </Link>
        </div>
      </PageHero>
    </div>
  );
}

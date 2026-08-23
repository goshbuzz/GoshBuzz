import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Download, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ChevronRight, 
  Info, 
  Sparkles,
  Share2,
  Copy,
  Check,
  FileCode,
  Layers,
  ArrowRight
} from 'lucide-react';
import { goshbuzzApps } from '../data/appsData';
import goshbuzzLogo from '../assets/images/goshbuzz_logo_1783631495534.jpg';

export default function Apps() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Tools & Utilities', 'Sensors & Diagnostics'];

  const filteredApps = selectedCategory === 'All'
    ? goshbuzzApps
    : goshbuzzApps.filter(app => app.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleShare = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyAdsTxt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0");
      setCopiedAdsTxt(true);
      setTimeout(() => setCopiedAdsTxt(false), 2500);
    }
  };

  // Structured Data Schema for SEO, AEO, and GEO
  const directorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://goshbuzz.com/apps#collection",
        "name": "GoshBuzz Android Apps Directory & Hub",
        "description": "Explore and download official Android mobile applications by GoshBuzz. High-precision sensors, radiation meters, and offline utility tools.",
        "url": "https://goshbuzz.com/apps",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": goshbuzzApps.map((app, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": app.name,
            "url": `https://goshbuzz.com/apps/${app.slug}`
          }))
        }
      },
      {
        "@type": "Organization",
        "@id": "https://goshbuzz.com/#organization",
        "name": "GoshBuzz Apps",
        "url": "https://goshbuzz.com",
        "logo": "https://goshbuzz.com/goshbuzz_logo.jpg",
        "publishingPrinciples": "https://goshbuzz.com/app-ads.txt"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goshbuzz.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "GoshBuzz Apps",
            "item": "https://goshbuzz.com/apps"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors pb-20">
      <Helmet>
        <title>GoshBuzz Android Apps — Official Mobile Applications & Tools</title>
        <meta name="description" content="Browse and download official Android apps by GoshBuzz. Discover EMF Sentinel: EMF Scan & Metal Detector for precision radiation measurement and metal detection." />
        <meta name="keywords" content="goshbuzz apps, android apps, emf sentinel, metal detector app, admob publisher pub-4067724379997931, app-ads.txt" />
        <link rel="canonical" href="https://goshbuzz.com/apps" />
        
        {/* Open Graph */}
        <meta property="og:title" content="GoshBuzz Android Apps Directory & Hub" />
        <meta property="og:description" content="Explore high-utility, privacy-first mobile tools engineered for instant physical-world diagnostics, sensor telemetry, and offline productivity." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/apps" />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GoshBuzz Official Android Apps" />
        <meta name="twitter:description" content="High-precision sensor utilities and tools for Android." />

        {/* AdMob & Publisher Metadata Verification tags */}
        <meta name="google-adsense-platform-account" content="pub-4067724379997931" />
        <meta name="app-ads.txt" content="https://goshbuzz.com/app-ads.txt" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(directorySchema)}
        </script>
      </Helmet>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden pt-12 pb-10 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent dark:from-amber-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Smartphone className="w-4 h-4" />
            Official Mobile Applications Directory
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5">
            GoshBuzz <span className="text-amber-500">Android Apps</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-normal mb-2">
            High-utility, privacy-first mobile tools engineered for instant physical-world diagnostics, sensor telemetry, and offline productivity.
          </p>
        </div>
      </section>

      {/* Applications Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="featured-app">
        <div className="bg-white dark:bg-gray-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
                <Layers className="w-4 h-4" />
                App Catalog
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                Available & Upcoming Applications
              </h2>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-gray-950 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* App Cards List */}
          <div className="grid grid-cols-1 gap-8">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 sm:p-8 hover:border-amber-500/60 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* App Icon + Rating */}
                  <div className="lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <Link to={`/apps/${app.slug}`} className="group block relative">
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    </Link>

                    <div className="flex items-center gap-1.5 text-amber-500 mt-3 text-xs font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{app.rating}</span>
                      <span className="text-gray-400 font-normal">({app.reviewsCount} reviews)</span>
                    </div>

                    <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-1">
                      {app.packageId}
                    </span>
                  </div>

                  {/* App Details & Description */}
                  <div className="lg:col-span-6 space-y-2.5 text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                      {app.category}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      <Link to={`/apps/${app.slug}`} className="hover:text-amber-500 transition-colors">
                        {app.name}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
                      {app.tagline}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {app.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-2">
                      {app.badges.slice(0, 4).map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
                    <Link
                      to={`/apps/${app.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm shadow-md transition-all text-center"
                    >
                      <span>View App Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={app.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 dark:bg-gray-950 hover:bg-gray-800 text-white font-semibold text-xs transition-colors border border-gray-800 text-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Get on Google Play</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>

                    <div className="text-center pt-1 text-[11px] text-gray-400">
                      <span>{app.downloads} • {app.size} • {app.price}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Developer Publishing & Ecosystem Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Privacy-First & Offline Tools
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Every GoshBuzz Android application is built to function 100% offline, processing sensor data entirely on-device without telemetry or cloud tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              AdMob & IAB app-ads.txt Compliant
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Fully compliant with IAB Tech Lab Authorized Digital Sellers specification for mobile apps, verified via root developer app-ads.txt configuration.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Continuous App Pipeline
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              More high-precision tools, sensor utilities, and productivity apps are currently in active development. Stay tuned for new releases.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

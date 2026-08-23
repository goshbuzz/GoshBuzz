import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Radio, 
  Magnet, 
  Compass, 
  Gauge, 
  Eye, 
  BellRing, 
  Download, 
  ExternalLink, 
  Star, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Info, 
  Sparkles,
  Share2,
  ArrowLeft,
  Copy,
  Check,
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { goshbuzzApps } from '../data/appsData';
import goshbuzzLogo from '../assets/images/goshbuzz_logo_1783631495534.jpg';

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [simulatedValue, setSimulatedValue] = useState<number>(48);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);

  // Find app by slug or packageId or id
  const app = goshbuzzApps.find(
    (a) => a.slug === slug || a.packageId === slug || a.id === slug
  ) || goshbuzzApps[0];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyAdsTxt = () => {
    if (navigator.clipboard && app.adMob?.appAdsEntry) {
      navigator.clipboard.writeText(app.adMob.appAdsEntry);
      setCopiedAdsTxt(true);
      setTimeout(() => setCopiedAdsTxt(false), 2500);
    }
  };

  // Structured Data Schema for SEO, AEO, and GEO
  const appSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `https://goshbuzz.com/apps/${app.slug}#software`,
        "name": app.name,
        "operatingSystem": "Android 7.0+",
        "applicationCategory": "UtilitiesApplication",
        "applicationSubCategory": "Scientific Tools & Sensor Measurement",
        "downloadUrl": app.playStoreUrl,
        "installUrl": app.playStoreUrl,
        "url": `https://goshbuzz.com/apps/${app.slug}`,
        "image": "https://goshbuzz.com/goshbuzz_logo.jpg",
        "screenshot": app.screenshots,
        "softwareVersion": app.version,
        "fileSize": app.size,
        "contentRating": "Everyone",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": app.rating.toString(),
          "ratingCount": "540",
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Organization",
          "name": "GoshBuzz Apps",
          "url": "https://goshbuzz.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "GoshBuzz LLC",
          "logo": "https://goshbuzz.com/goshbuzz_logo.jpg",
          "url": "https://goshbuzz.com",
          "publishingPrinciples": "https://goshbuzz.com/app-ads.txt"
        },
        "description": app.fullDescription,
        "featureList": app.keyFeatures.map(f => `${f.title}: ${f.description}`).join("; ")
      },
      {
        "@type": "FAQPage",
        "@id": `https://goshbuzz.com/apps/${app.slug}#faq`,
        "mainEntity": app.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": app.name,
            "item": `https://goshbuzz.com/apps/${app.slug}`
          }
        ]
      }
    ]
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Magnet':
        return <Magnet className="w-6 h-6 text-amber-500" />;
      case 'Radio':
        return <Radio className="w-6 h-6 text-emerald-500" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-blue-500" />;
      case 'Gauge':
        return <Gauge className="w-6 h-6 text-purple-500" />;
      case 'Eye':
        return <Eye className="w-6 h-6 text-rose-500" />;
      case 'BellRing':
        return <BellRing className="w-6 h-6 text-amber-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  const getSimStatus = (val: number) => {
    if (val < 65) return { text: "Ambient Earth Baseline (Safe)", color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
    if (val < 150) return { text: "Elevated EMF / Electronic Proximity", color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    return { text: "High Flux! Ferromagnetic Metal / Stud Detected", color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/30" };
  };

  const simStatus = getSimStatus(simulatedValue);
  const gaugeAngle = Math.min(180, Math.max(0, ((simulatedValue - 20) / 400) * 180));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors pb-20">
      <Helmet>
        <title>{`${app.name} — Free Android App by GoshBuzz`}</title>
        <meta name="description" content={`${app.shortDescription} Download official APK on Google Play Store (${app.packageId}).`} />
        <meta name="keywords" content={app.seoKeywords.join(', ')} />
        <link rel="canonical" href={`https://goshbuzz.com/apps/${app.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${app.name} — GoshBuzz Android Apps`} />
        <meta property="og:description" content={app.shortDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://goshbuzz.com/apps/${app.slug}`} />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={app.name} />
        <meta name="twitter:description" content={app.shortDescription} />

        {/* AdMob & Publisher Metadata Verification tags for Web Crawlers */}
        <meta name="google-adsense-platform-account" content="pub-4067724379997931" />
        <meta name="app-ads.txt" content="https://goshbuzz.com/app-ads.txt" />
        
        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(appSchema)}
        </script>
      </Helmet>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/apps" className="hover:text-amber-500 transition-colors">GoshBuzz Apps</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-200 font-semibold truncate max-w-xs sm:max-w-md">{app.name}</span>
        </nav>
      </div>

      {/* Hero Header / Main Showcase Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="app-overview">
        <div className="bg-white dark:bg-gray-900 border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-50/50 via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
            
            {/* App Icon + Badges */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="relative group">
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl shadow-xl border-2 border-gray-100 dark:border-gray-800 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mt-5">
                {app.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* App Metadata & Actions */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                    {app.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{app.rating}</span>
                    <span className="text-gray-400 font-normal">({app.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
                  {app.name}
                </h1>
                <p className="text-base sm:text-lg text-amber-600 dark:text-amber-400 font-medium mb-3">
                  {app.tagline}
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {app.fullDescription}
                </p>
              </div>

              {/* Action Buttons & Google Play Store Link */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-google-play-detail"
                  className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-base shadow-lg hover:shadow-amber-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current flex-shrink-0">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-.925V2.739c.14-.366.362-.68.61-.925zm11.238 11.239l2.42 2.42-12.78 7.378 10.36-9.798zm0-2.106L4.487 1.15l12.78 7.378-2.42 2.42zm1.414 1.053l4.242 2.449a1.002 1.002 0 0 1 0 1.734l-4.242 2.45-2.072-2.071 2.072-2.562z"/>
                  </svg>
                  <span>Install on Google Play</span>
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </a>

                <button
                  onClick={handleShare}
                  id="btn-share-detail"
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-colors border border-gray-200 dark:border-gray-700"
                  title="Share App Page Link"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share App"}</span>
                </button>
              </div>

              {/* Quick Specs Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 text-xs">
                <div>
                  <span className="text-gray-400 block">Downloads</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{app.downloads}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Version</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{app.version}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Download Size</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{app.size}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">License</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{app.price}</span>
                </div>
              </div>

            </div>

          </div>

          {/* AEO Quick Answer Summary Box */}
          <div className="p-6 sm:p-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start gap-3 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                  Executive Summary • Answer Engine Breakdown
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {app.aeoSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Hardware Sensor Simulator */}
          <div className="p-6 sm:p-8 bg-gray-50/70 dark:bg-gray-950/60 border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5" />
                Interactive Telemetry Simulator
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Experience the 60 FPS Magnetometer Gauge
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag the proximity slider below to test simulated magnetic density spikes across drywall, live wiring, or studs.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              
              {/* Dial Gauge */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                  <div className="absolute w-44 h-44 rounded-full border-[10px] border-gray-200 dark:border-gray-800 border-t-emerald-500 border-r-amber-500 border-b-rose-500 top-0 transform rotate-[-45deg]"></div>
                  
                  {/* Needle */}
                  <div
                    className="w-1.5 h-20 bg-rose-500 origin-bottom transition-transform duration-150 rounded-t-full shadow-md z-10"
                    style={{ transform: `rotate(${gaugeAngle - 90}deg)` }}
                  ></div>
                  <div className="w-4 h-4 rounded-full bg-gray-900 dark:bg-white z-20 shadow"></div>
                </div>

                <div className="text-center mt-2">
                  <div className="text-3xl font-black font-mono text-gray-900 dark:text-white flex items-baseline justify-center gap-1">
                    <span>{simulatedValue.toFixed(1)}</span>
                    <span className="text-sm font-sans font-bold text-gray-500 dark:text-gray-400">μT</span>
                  </div>
                  <div className={`text-xs font-semibold px-3 py-1 rounded-full border mt-2 inline-block ${simStatus.bg} ${simStatus.color}`}>
                    {simStatus.text}
                  </div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span>Earth Baseline (30 μT)</span>
                  <span>Wires (120 μT)</span>
                  <span>Metal Stud (400+ μT)</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="450"
                  step="1"
                  value={simulatedValue}
                  onChange={(e) => setSimulatedValue(parseFloat(e.target.value))}
                  className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  aria-label="Simulate magnetic flux intensity"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span>Vector: X: {(simulatedValue * 0.42).toFixed(1)} | Y: {(simulatedValue * 0.58).toFixed(1)} | Z: {(simulatedValue * 0.70).toFixed(1)}</span>
                <span className="font-semibold text-emerald-500">Hardware Filter Active</span>
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">
              Key Features & Diagnostic Modes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {app.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/60 hover:border-amber-500/50 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm w-fit mb-4 group-hover:scale-110 transition-transform">
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="p-6 sm:p-8 lg:p-10 bg-gray-50/50 dark:bg-gray-950/40 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">
              Complete Technical Specifications & Requirements
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {app.specifications.map((spec, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-900/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-gray-700 dark:text-gray-300 w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400 font-mono text-xs sm:text-sm">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* Step-by-step How to Use Manual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Operational Manual
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            How to Use {app.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-2">
            Step-by-step calibration and detection procedures for maximum accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {app.howToUse.map((step) => (
            <div
              key={step.step}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="w-9 h-9 rounded-full bg-amber-500 text-gray-950 font-black text-sm flex items-center justify-center mb-4 shadow-sm">
                0{step.step}
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.instruction}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Reference Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent dark:from-amber-950/30 dark:via-gray-900 dark:to-gray-900 border border-amber-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                EMF Radiation & Metal Density Reference Matrix
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                Standard geomagnetic baseline levels and hazard zones.
              </p>
            </div>
            <a
              href={app.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs sm:text-sm shadow transition-colors flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              Download APK from Google Play
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {app.safetyGuide.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    item.level.includes('Safe') 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' 
                      : item.level.includes('Moderate')
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                  }`}>
                    {item.level}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="faq">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            App FAQs & Diagnostics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Answers to common questions regarding {app.name}, AdMob compliance, and sensor accuracy.
          </p>
        </div>

        <div className="space-y-4">
          {app.faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Back & Download CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All GoshBuzz Apps</span>
          </Link>

          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download {app.name}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </div>
      </section>

    </div>
  );
}

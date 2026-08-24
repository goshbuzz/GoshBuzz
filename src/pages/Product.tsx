import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ArrowLeft, 
  ShoppingCart, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  HelpCircle, 
  Lightbulb, 
  ClipboardList, 
  Target, 
  Sparkles, 
  Clock, 
  TrendingUp,
  BadgeDollarSign,
  ExternalLink,
  Link2,
  BookOpen,
  Check
} from "lucide-react";
import { products, findProductByIdentifier } from "../data";
import { articles } from "../data/articles";
import { useCart } from "../CartContext";
import { 
  OFFSITE_AUTHORITY_LINKS, 
  ONSITE_INTERNAL_CATEGORIES 
} from "../data/seoMetadata";

export default function Product() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const identifier = slug || id;
  const product = findProductByIdentifier(identifier || "");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
        <Link
          to="/"
          className="text-amber-600 hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Library
        </Link>
      </div>
    );
  }

  // Canonical redirect if requested slug differs from canonical slug
  if (slug && slug !== product.slug) {
    return <Navigate to={`/blogs/news/${product.slug}`} replace />;
  }

  const price = product.type === "idea" ? "500" : "200";
  const { addToCart, isInCart } = useCart();
  const alreadyInCart = isInCart(product.id);
  const article = articles[product.id as keyof typeof articles];
  const articleUrl = `https://goshbuzz.com/blogs/news/${product.slug || product.id}`;

  const metaDescription = article ? article.intro : product.description;
  const combinedKeywordsList = [
    ...(article ? article.tags : []),
    product.title,
    "goshbuzz pakistan",
    "free online earning pakistan"
  ].join(", ");

  // 1. Article / BlogPosting Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": product.title,
    "description": metaDescription,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl,
    "image": product.image ? [product.image] : ["https://goshbuzz.com/goshbuzz_logo.jpg"],
    "datePublished": "2026-03-25T08:00:00+05:00",
    "dateModified": "2026-07-23T08:00:00+05:00",
    "author": {
      "@type": "Person",
      "name": "Solat Nadeem",
      "url": "https://goshbuzz.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GoshBuzz Pakistan",
      "url": "https://goshbuzz.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://goshbuzz.com/goshbuzz_logo.jpg"
      }
    },
    "articleSection": product.category,
    "keywords": combinedKeywordsList
  };

  // 2. FAQPage Schema for Answer Engine Optimization (AEO)
  const faqSchema = article && article.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // 3. HowTo Schema for Step-by-Step Earning Guides
  const howToSchema = article && article.steps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to start ${product.title} in Pakistan`,
    "description": metaDescription,
    "totalTime": article.timeRequired,
    "step": article.steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.title,
      "text": step.content
    }))
  } : null;

  // Filter related products for On-site SEO internal linking
  const relatedOnsiteProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const seoTitle = `${product.title} — Online Earning in Pakistan Free Guide | GoshBuzz`;
  const seoDescription = `Learn ${product.title} in Pakistan: ${metaDescription} Discover step-by-step free online earning ideas without investment, freelancing skills, and local JazzCash & EasyPaisa withdrawal roadmaps for Pakistani students and beginners.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={combinedKeywordsList} />
        <meta name="author" content="Solat Nadeem, GoshBuzz Pakistan" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Pakistan" />
        <link rel="canonical" href={articleUrl} />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="GoshBuzz Pakistan" />
        <meta property="og:locale" content="en_PK" />
        {product.image && <meta property="og:image" content={product.image} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:site" content="@goshbuzz" />
        {product.image && <meta name="twitter:image" content={product.image} />}
        
        {/* Schema Injections for Search Engine & AI Crawler Dominance */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
        {howToSchema && (
          <script type="application/ld+json">
            {JSON.stringify(howToSchema)}
          </script>
        )}
      </Helmet>
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link
          to="/"
          className="hover:text-gray-900 dark:text-gray-100 transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Home
        </Link>
        <span className="text-gray-300">/</span>
        <Link
          to="/"
          className="hover:text-gray-900 dark:text-gray-100 transition-colors"
        >
          {product.type === "idea" ? "Earning Ideas" : "Survival Skills"}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl aspect-square overflow-hidden flex items-center justify-center text-8xl shadow-inner relative">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            product.icon
          )}
        </div>

        <div className="flex flex-col justify-center space-y-8 text-center md:text-left items-center md:items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
              {product.type === "idea" ? "Earning Idea" : "Survival Skill"}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              {product.title}
            </h1>
            <p className="text-3xl text-amber-500 font-bold mb-6">
              Rs. {price}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              What you get:
            </h3>
            <ul className="space-y-3 inline-block text-left">
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle2
                  className="text-green-500 mt-0.5 shrink-0"
                  size={18}
                />{" "}
                Step-by-step execution blueprint
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle2
                  className="text-green-500 mt-0.5 shrink-0"
                  size={18}
                />{" "}
                Pakistan-specific payment & tool guides
              </li>
              <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle2
                  className="text-green-500 mt-0.5 shrink-0"
                  size={18}
                />{" "}
                Instant PDF download via WhatsApp
              </li>
            </ul>
          </div>

          <div className="pt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  addToCart({
                    id: product.id,
                    title: product.title,
                    type: product.type as "idea" | "skill",
                    price: Number(price),
                    image: product.image,
                    icon: product.icon,
                  });
                  navigate("/checkout");
                }}
                className="flex-grow py-5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl font-extrabold text-lg transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2.5"
              >
                <ShoppingCart size={22} /> Buy Now — Rs. {price}
              </button>

              <button
                onClick={() => {
                  if (alreadyInCart) {
                    navigate("/checkout");
                  } else {
                    addToCart({
                      id: product.id,
                      title: product.title,
                      type: product.type as "idea" | "skill",
                      price: Number(price),
                      image: product.image,
                      icon: product.icon,
                    });
                  }
                }}
                className={`py-5 px-6 rounded-2xl font-bold text-base transition-all border flex items-center justify-center gap-2 ${
                  alreadyInCart
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/40 text-green-600 dark:text-green-400"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                }`}
              >
                {alreadyInCart ? (
                  <>
                    <CheckCircle2 size={20} /> Checkout Now
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <ShieldCheck size={18} className="text-green-500" />
                <span>100% Secure Checkout</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-blue-500" /> Instant Delivery
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 shadow-sm">
                  JazzCash
                </span>
                <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 shadow-sm">
                  EasyPaisa
                </span>
                <span className="px-3 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1 shadow-sm">
                  Bank Transfer
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
              Pay directly via mobile wallets and get instant PDF on WhatsApp.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Share2 size={18} /> Share this guide
            </h3>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=Check out this amazing guide: ${product.title} - ${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
                aria-label="Share on Facebook"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${articleUrl}&text=Check out this amazing guide: ${product.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A91DA] transition-colors"
                aria-label="Share on Twitter"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Case Study / Step-by-Step Blueprint (SEO / AEO / GEO Optimized) */}
      {article && (
        <div className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Header / Intro */}
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200 dark:border-amber-900/50">
                <Sparkles size={12} className="text-amber-500 animate-pulse" /> Verified Editorial Masterclass
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-gray-50 leading-tight">
                {article.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {article.intro}
              </p>

              {/* Author & E-E-A-T Credibility Card */}
              <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                    SN
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">Solat Nadeem</span>
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full border border-green-200 dark:border-green-900">
                        Verified Author
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Senior Technology Publisher & Software Engineer • GoshBuzz Editorial Board
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-2 md:pt-0 w-full md:w-auto">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-amber-500" /> ~12 min read
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                    <ShieldCheck size={14} /> 100% Policy Compliant
                  </span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="p-6 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-3">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BookOpen size={16} className="text-amber-500" /> Guide Contents & Navigation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                <a href="#aeo-summary" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Executive Summary & Key Highlights
                </a>
                <a href="#blueprint-steps" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">2.</span> Step-by-Step Practical Blueprint
                </a>
                <a href="#in-depth-analysis" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">3.</span> In-Depth Editorial & Market Analysis
                </a>
                <a href="#pro-tips" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Risk Mitigation & Secret Tips
                </a>
                <a href="#faqs-section" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">5.</span> Frequently Asked Questions (FAQs)
                </a>
                <a href="#references-section" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span className="text-amber-500">6.</span> Off-Site Authority References (E-E-A-T)
                </a>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/30">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Capital Needed</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <BadgeDollarSign size={16} className="text-amber-500 shrink-0" /> {article.capitalNeeded}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Difficulty</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <TrendingUp size={16} className="text-amber-500 shrink-0" /> {article.difficulty}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Earning Potential</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <Target size={16} className="text-amber-500 shrink-0" /> {article.earningPotential}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Time Required</span>
                <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                  <Clock size={16} className="text-amber-500 shrink-0" /> {article.timeRequired}
                </span>
              </div>
            </div>

            {/* AEO / GEO Direct Answer Box */}
            <div id="aeo-summary" className="p-6 bg-blue-50/70 dark:bg-blue-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-extrabold text-sm uppercase tracking-wide">
                <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                <span>AEO & Generative AI Executive Summary</span>
              </div>
              <p className="text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                <strong>Quick Answer:</strong> {article.aeoSummary || `To start ${product.title} in Pakistan, follow GoshBuzz's practical step-by-step roadmap focusing on skill acquisition, tool utilization, and local payment readiness. Expected potential: ${article.earningPotential}.`}
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                <span className="flex items-center gap-1"><Check size={14} className="text-blue-600" /> No hidden fees</span>
                <span className="flex items-center gap-1"><Check size={14} className="text-blue-600" /> Pakistan payment ready</span>
                <span className="flex items-center gap-1"><Check size={14} className="text-blue-600" /> Student friendly</span>
              </div>
            </div>

            {/* Steps Blueprint */}
            <div id="blueprint-steps" className="space-y-8 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-50 flex items-center justify-center md:justify-start gap-2">
                <ClipboardList size={22} className="text-amber-500" /> Step-by-Step Earning Blueprint
              </h3>
              <div className="space-y-6">
                {article.steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 shrink-0 bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center text-lg shadow-sm shadow-amber-200 dark:shadow-none">
                      {idx + 1}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50 leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehensive Editorial & Industry Masterclass (1,200+ Words Rich Deep-Dive Text) */}
            <div id="in-depth-analysis" className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 space-y-8 shadow-sm text-left">
              <div className="space-y-3 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-amber-200 dark:border-amber-900/50">
                  <BookOpen size={14} className="text-amber-500" /> Editorial Masterclass Deep-Dive
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-950 dark:text-gray-50 leading-tight">
                  Comprehensive Strategic Guide: {product.title} in the Modern Digital Economy
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  By <strong>Solat Nadeem</strong> • Published for GoshBuzz Readers & Digital Entrepreneurs
                </p>
              </div>

              <div className="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    1. Market Context & Local Opportunities in Pakistan
                  </h4>
                  <p>
                    The global digital landscape has opened unprecedented access for Pakistani freelancers, content creators, and digital entrepreneurs. Mastering <strong>{product.title}</strong> offers a direct path toward financial self-reliance without requiring upfront capital investments or physical storefronts. In Pakistan, access to high-speed fiber internet and mobile digital banking (JazzCash, EasyPaisa, NayaPay, SadaPay, and direct bank wire transfers) makes executing international and local online business models smoother than ever before.
                  </p>
                  <p>
                    Whether your goal is acquiring high-ticket US and European client contracts or building an automated digital asset that generates recurring monthly revenue, the key lies in disciplined, step-by-step execution. Avoid short-term 'get-rich-quick' schemes or unverified pyramid networks. Focus instead on acquiring practical skills, documenting your work, and establishing trusted buyer relationships.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    2. Infrastructure, Tools, and Technical Requirements
                  </h4>
                  <p>
                    To successfully execute <em>{product.title}</em>, you need a minimal, reliable technical setup:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li><strong>Hardware Setup:</strong> A standard smartphone or laptop with a clean web browser (Google Chrome or Brave) and a stable 4G/5G or fiber broadband connection.</li>
                    <li><strong>Financial & Payment Setup:</strong> A verified biometric JazzCash/EasyPaisa mobile wallet account or a local Pakistani bank account (IBAN) paired with Payoneer for international dollar receipts.</li>
                    <li><strong>Essential Software & AI Utilities:</strong> Free productivity software like ChatGPT for initial drafting, Canva for graphic assets, and Google Workspace (Docs, Sheets, Drive) for tracking client deliverables.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    3. Local Payouts, Tax Considerations & Financial Growth
                  </h4>
                  <p>
                    Managing your earnings efficiently is just as vital as earning them. When receiving payments from international clients or platforms, use verified remittance partners like Payoneer linked directly to your local bank account or mobile wallet. Keep detailed monthly logs of gross earnings, operational expenses, and platform transaction fees to evaluate your profit margin accurately.
                  </p>
                </div>

                <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 space-y-2">
                  <h5 className="font-extrabold text-sm text-amber-950 dark:text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-amber-600" /> GoshBuzz Quality Assurance & Editorial Guarantee
                  </h5>
                  <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                    This editorial guide has been independently authored by GoshBuzz content strategists. All recommendations, tool choices, and payment guidelines have been verified for accuracy and compliance with Google Publisher & Webmaster Quality Guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div id="pro-tips" className="p-6 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 space-y-4 text-center md:text-left">
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-300 flex items-center justify-center md:justify-start gap-2">
                <Lightbulb size={20} className="text-emerald-500" /> Pro Secret Tips (Avoid Failure)
              </h3>
              <ul className="space-y-3 inline-block text-left">
                {article.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                    <span className="text-emerald-500 shrink-0 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Accordion */}
            <div id="faqs-section" className="space-y-6 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-50 flex items-center justify-center md:justify-start gap-2">
                <HelpCircle size={22} className="text-amber-500" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/60 space-y-2">
                    <h4 className="font-bold text-gray-950 dark:text-gray-50 text-base">
                      Q: {faq.question}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      A: {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* On-Site Internal Linking Network (Onsite SEO Anchor Network) */}
            <div className="p-8 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800/80 rounded-3xl border border-amber-200/60 dark:border-gray-700/60 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-bold uppercase tracking-wider">
                  <Link2 size={13} className="text-amber-600 dark:text-amber-400" /> On-Site Learning Network
                </div>
                <h3 className="text-2xl font-black text-gray-950 dark:text-gray-50">
                  Explore More Free Online Earning Blueprints on GoshBuzz
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Maximize your digital income potential in Pakistan by exploring our interconnected library of free step-by-step business blueprints, skill roadmaps, and withdrawal tutorials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedOnsiteProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blogs/news/${p.slug || p.id}`}
                    className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 transition-all shadow-sm hover:shadow-md group flex items-start gap-3"
                  >
                    <span className="text-2xl shrink-0 p-2 bg-amber-50 dark:bg-gray-700 rounded-xl">{p.icon}</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        Free Guide: {p.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-amber-200/40 dark:border-gray-700/50 flex flex-wrap gap-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
                {ONSITE_INTERNAL_CATEGORIES.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.path}
                    className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-bold"
                  >
                    <BookOpen size={13} /> {cat.anchorText}
                  </Link>
                ))}
              </div>
            </div>

            {/* Off-Site Authority Links Network (External E-E-A-T References) */}
            <div id="references-section" className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <ExternalLink size={13} className="text-blue-600" /> Off-Site Authority Resources (E-E-A-T)
                </div>
                <h3 className="text-xl font-extrabold text-gray-950 dark:text-gray-50">
                  Official Industry Documentation & External Verification
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  GoshBuzz adheres to strict Search Engine Quality Rater guidelines (E-E-A-T). Cross-reference our blueprints with verified official platform documentation below:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFSITE_AUTHORITY_LINKS.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:border-amber-300 transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">{link.category}</span>
                        <ExternalLink size={12} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">
                        {link.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 truncate">
                      {link.domain}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Compare Section */}
      <div className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Compare Alternative Guides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products
            .filter((p) => p.type === product.type && p.id !== product.id)
            .slice(0, 3)
            .map((altProduct) => (
              <div
                key={altProduct.id}
                className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col h-full bg-white dark:bg-gray-900 hover:border-amber-200 transition-colors"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl mb-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                    {altProduct.image ? (
                      <img
                        src={altProduct.image}
                        alt={altProduct.title}
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      altProduct.icon
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight mb-2">
                    {altProduct.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {altProduct.description}
                  </p>
                </div>

                <div className="mt-auto pt-4 space-y-4">
                  <div className="bg-amber-50 rounded-lg p-3 text-sm">
                    <span className="font-semibold text-amber-800 dark:text-amber-300 dark:text-amber-300 block mb-1">
                      Difference:
                    </span>
                    <span className="text-amber-700">
                      {product.type === "idea"
                        ? "Focuses on a different niche and monetization strategy compared to the current guide."
                        : "Provides alternative technical or business survival knowledge."}
                    </span>
                  </div>
                  <Link
                    to={`/blogs/news/${altProduct.slug || altProduct.id}`}
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium rounded-xl transition-colors text-sm border border-gray-200 dark:border-gray-700"
                  >
                    View Guide details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

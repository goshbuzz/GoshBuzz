import { useParams, Link, useNavigate } from "react-router-dom";
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
  BadgeDollarSign
} from "lucide-react";
import { products } from "../data";
import { articles } from "../data/articles";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

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

  const price = product.type === "idea" ? "500" : "200";
  const article = articles[product.id as keyof typeof articles];

  // Dynamic meta tags optimized for SEO, AEO (Answer Engine Optimization) and GEO (Geographic Search Optimization)
  const metaDescription = article ? article.intro : product.description;
  const metaKeywords = article 
    ? `${article.tags.join(", ")}, ${product.title}, goshbuzz pakistan, learn ${product.title} in pakistan, work from home pakistan` 
    : `${product.title}, online earning guide, goshbuzz, make money online pakistan`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{product.title} — GoshBuzz Pakistan</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta
          property="og:title"
          content={`${product.title} — GoshBuzz Pakistan`}
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content={`https://goshbuzz.com/product/${product.id}`}
        />
        {product.image && <meta property="og:image" content={product.image} />}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "${product.title}",
              "description": "${metaDescription.replace(/"/g, '\\"')}",
              "offers": {
                "@type": "Offer",
                "priceCurrency": "PKR",
                "price": "${price}",
                "availability": "https://schema.org/InStock",
                "url": "https://goshbuzz.com/product/${product.id}"
              }
            }
          `}
        </script>
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

        <div className="flex flex-col justify-center space-y-8">
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

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              What you get:
            </h3>
            <ul className="space-y-3">
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

          <div className="pt-8">
            <button
              onClick={() => navigate("/how-to-pay")}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={22} /> Buy Now via EasyPaisa/JazzCash — Rs.{" "}
              {price}
            </button>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <ShieldCheck size={18} className="text-green-500" />
                <span>100% Secure Checkout</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={16} className="text-blue-500" /> Instant
                  Delivery
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
                href={`https://wa.me/?text=Check out this amazing guide: ${product.title} - https://goshbuzz.com/product/${product.id}`}
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
                href={`https://www.facebook.com/sharer/sharer.php?u=https://goshbuzz.com/product/${product.id}`}
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
                href={`https://twitter.com/intent/tweet?url=https://goshbuzz.com/product/${product.id}&text=Check out this amazing guide: ${product.title}`}
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
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200 dark:border-amber-900/50">
                <Sparkles size={12} className="text-amber-500 animate-pulse" /> Free Lesson & Case Study
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-gray-50 leading-tight">
                {article.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {article.intro}
              </p>
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

            {/* Steps Blueprint */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-50 flex items-center gap-2">
                <ClipboardList size={22} className="text-amber-500" /> Step-by-Step Earning Blueprint
              </h3>
              <div className="space-y-6">
                {article.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
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

            {/* Pro Tips */}
            <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30 space-y-4">
              <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
                <Lightbulb size={20} className="text-emerald-500" /> Pro Secret Tips (Avoid Failure)
              </h3>
              <ul className="space-y-3">
                {article.proTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
                    <span className="text-emerald-500 shrink-0 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-50 flex items-center gap-2">
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

            {/* Longtail Target Keywords (AEO & SEO Grounding) */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Target Keywords (SEO/AEO Context)</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    #{tag}
                  </span>
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
                    to={`/product/${altProduct.id}`}
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

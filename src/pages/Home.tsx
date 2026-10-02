import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { organizationNode, founderNode, websiteNode, DEFAULT_OG_IMAGE, SITE_URL } from "../data/siteEntity";
import { defaultFaqs } from "../components/FAQ";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Smartphone,
  Download,
  Award,
  Flame,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { products } from "../data";
import { goshbuzzApps } from "../data/appsData";
import { FAQ } from "../components/FAQ";
import { HeroSlideshow } from "../components/HeroSlideshow";
import { useCart } from "../CartContext";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredIdeas = products.filter(
    (p) =>
      p.type === "idea" &&
      (selectedCategory === "all" || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredSkills = products.filter(
    (p) =>
      p.type === "skill" &&
      (selectedCategory === "all" || p.category === selectedCategory) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const isFiltering = searchQuery.trim() !== "" || selectedCategory !== "all";
  const displayedIdeas = isFiltering ? filteredIdeas : filteredIdeas.slice(0, 8);
  const displayedSkills = isFiltering ? filteredSkills : filteredSkills.slice(0, 8);

  const categories = [
    { id: "all", name: "All Topics", icon: "✨" },
    { id: "E-commerce", name: "E-Commerce", icon: "🛒" },
    { id: "Freelancing", name: "Freelancing", icon: "💼" },
    { id: "Content Creation", name: "Content Creation", icon: "📝" },
    { id: "Investment", name: "Investment", icon: "📈" },
    { id: "Tech & AI", name: "Tech & AI", icon: "🤖" },
    { id: "Marketing", name: "Marketing", icon: "🚀" },
  ];

  const popularSearches = [
    "AdSense Blueprint",
    "Amazon KDP",
    "Dropshipping",
    "Binance Trading",
    "Upwork Freelancing",
    "Canva Pro",
    "YouTube Automation",
  ];

  // Featured High-Value Articles for Google AdSense & Publisher Compliance
  const featuredArticles = [
    {
      id: "blogging-adsense-blueprint",
      title: "Blogging & Google AdSense Monetization Blueprint",
      category: "Content Creation",
      readTime: "12 min read",
      date: "August 2026",
      excerpt: "Step-by-step masterclass on building a high-RPM niche publication, writing original high-value content, optimizing site architecture, and passing Google AdSense publisher reviews with zero policy violations.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600",
      takeaways: ["High-RPM Niche Selection", "SEO Content Architecture", "Publisher Policy Compliance"],
      slug: "blogging-adsense-blueprint",
    },
    {
      id: "ebay-dropshipping-guide",
      title: "Local E-Commerce Dropshipping & Supplier Sourcing",
      category: "E-commerce",
      readTime: "15 min read",
      date: "August 2026",
      excerpt: "Comprehensive guide to establishing a profitable e-commerce dropshipping store in South Asia. Covers local fulfillment networks, product research, TikTok ad creative testing, and cash-on-delivery management.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600",
      takeaways: ["Zero Inventory Setup", "Local Fulfillment", "TikTok Viral Ads"],
      slug: "ebay-dropshipping-guide",
    },
    {
      id: "faceless-youtube-automation",
      title: "Faceless YouTube Automation & AI Media Production",
      category: "Tech & AI",
      readTime: "10 min read",
      date: "August 2026",
      excerpt: "Learn how to build scalable video media channels using AI text generators, natural neural voice synthesis, and automated video workflows for global audience engagement and ad revenue.",
      image: "https://images.unsplash.com/photo-1533727937480-da3a97967e95?auto=format&fit=crop&q=80&w=600",
      takeaways: ["AI Script Generation", "Neural Voiceovers", "Automated Editing"],
      slug: "faceless-youtube-automation",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-amber-500 selection:text-white">
      <Helmet>
        <title>GoshBuzz — Earning Guides & Android Apps for Pakistan</title>
        <meta
          name="description"
          content="60+ free step-by-step guides on online earning, freelancing and e-commerce in Pakistan, plus privacy-first Android apps by GoshBuzz."
        />
        <meta
          name="keywords"
          content="goshbuzz, online earning guides pakistan, freelancing pakistan, e-commerce dropshipping, android utilities, emf sentinel"
        />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content="GoshBuzz — Earning Guides & Android Apps for Pakistan" />
        <meta
          property="og:description"
          content="60+ free step-by-step guides on online earning, freelancing and e-commerce in Pakistan, plus privacy-first Android apps by GoshBuzz."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content="GoshBuzz" />
        <meta property="og:locale" content="en_PK" />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GoshBuzz — Earning Guides & Android Apps for Pakistan" />
        <meta name="twitter:description" content="Free step-by-step online earning guides for Pakistan and privacy-first Android apps." />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              websiteNode,
              organizationNode,
              founderNode,
              {
                "@type": "WebPage",
                "@id": `${SITE_URL}/#webpage`,
                url: SITE_URL,
                name: "GoshBuzz — Earning Guides & Android Apps for Pakistan",
                isPartOf: { "@id": websiteNode["@id"] },
                about: { "@id": organizationNode["@id"] },
                inLanguage: "en",
              },
              {
                "@type": "FAQPage",
                "@id": `${SITE_URL}/#faq`,
                mainEntity: defaultFaqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              },
            ],
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pt-12 pb-16 md:pt-16 md:pb-20 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Copy on the left, live slideshow on the right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 xl:col-span-7 text-center lg:text-left space-y-6">

              {/* Header Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/90 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Verified Digital Knowledge Hub & Mobile Software Publisher</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.12]">
                Actionable Digital Knowledge &{" "}
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                  High-Precision Mobile Utilities
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Empowering digital entrepreneurs, freelancers, and mobile users with <strong>60+ in-depth masterclass guides</strong> and <strong>privacy-first Android mobile applications</strong>. Zero-fluff, original content engineered for long-term value.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3.5 pt-1">
                <a
                  href="#featured-articles"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
                >
                  <BookOpen size={18} />
                  <span>Explore Featured Articles</span>
                  <ArrowRight size={18} />
                </a>
                <Link
                  to="/apps"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl transition-all border border-gray-300 dark:border-gray-700 shadow-xs flex items-center justify-center gap-2 text-base"
                >
                  <Smartphone size={18} className="text-amber-500" />
                  <span>Browse Android Apps</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Quick Metrics & Authority Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
                <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">60+</div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Published Guides</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500">10,000+</div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">App Downloads</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-500">100%</div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Open Knowledge</div>
                </div>
                <div className="bg-white/80 dark:bg-gray-900/80 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">4.9 ★</div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">User Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Featured Slideshow */}
            <div className="lg:col-span-6 xl:col-span-5">
              <HeroSlideshow />
            </div>
          </div>

          <div className="text-center">
            {/* Interactive Search Box */}
            <div className="mt-14 max-w-3xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search articles & guides (e.g., AdSense Blueprint, Dropshipping, Binance, Canva)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm text-sm sm:text-base transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Popular Search Tags */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[10px]">
                  Popular:
                </span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-all ${
                      searchQuery.toLowerCase() === term.toLowerCase()
                        ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400"
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Category Pills */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat.id
                        ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                        : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Editor's Highlights — High Value Articles Section (AdSense Compliance) */}
      <section id="featured-articles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3 border border-amber-300/50 dark:border-amber-700/50">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Editor's Picks — Comprehensive Articles</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            High-Value Editorial Guides & Blueprints
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            In-depth technical and business analyses written to satisfy Google Webmaster Quality Guidelines with original research, zero fluff, and actionable takeaways.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-gray-950 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                    {article.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-xs text-gray-200 px-3 py-1 rounded-full text-[11px] font-semibold border border-gray-700">
                    {article.readTime}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">
                    Published: {article.date} • Editorial Board
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-3 hover:text-amber-500 transition-colors">
                    <Link to={`/blogs/news/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Key Takeaways Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                    {article.takeaways.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      addToCart({
                        id: article.id,
                        title: article.title,
                        type: "idea",
                        price: 500,
                        image: article.image,
                        slug: article.slug,
                      });
                      navigate("/checkout");
                    }}
                    className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart size={14} />
                    <span>Buy Now (Rs. 500)</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: article.id,
                        title: article.title,
                        type: "idea",
                        price: 500,
                        image: article.image,
                        slug: article.slug,
                      });
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      isInCart(article.id)
                        ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {isInCart(article.id) ? (
                      <>
                        <CheckCircle2 size={14} /> Added
                      </>
                    ) : (
                      <>+ Cart</>
                    )}
                  </button>
                </div>
                <Link
                  to={`/blogs/news/${article.slug}`}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/60 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-gray-200/80 dark:border-gray-700"
                >
                  <span>Read Guide & Case Study</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GoshBuzz Android Utility Ecosystem Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left max-w-2xl">
              <img
                src={goshbuzzApps[0].icon}
                alt="EMF Sentinel App Icon"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-amber-500/40 shadow-lg object-cover flex-shrink-0"
              />
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                  <Smartphone className="w-3.5 h-3.5" />
                  Featured Android Software Utility
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  EMF Sentinel: EMF Scan & Metal Detector
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Turn your Android smartphone into a high-precision electromagnetic field radiation scanner and metal detector using hardware magnetometer sensors. 100% offline, privacy-first software engineering.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200">
                    ★ 4.9 Rating
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200">
                    10,000+ Downloads
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Free on Google Play
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 flex-shrink-0 w-full sm:w-auto">
              <a
                href="https://play.google.com/store/apps/details?id=com.goshbuzz.emfsentinel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition-all shadow-md text-sm text-center"
              >
                <Download className="w-4 h-4" />
                <span>Get on Google Play</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>
              <Link
                to="/apps/emf-sentinel"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-colors border border-gray-700 text-sm text-center"
              >
                <span>View App Specs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 30 Earning Ideas Section */}
      <section id="ideas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3">
            <span>💡 High-Income Systems</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            30 Earning Blueprints — Complete Masterclass Guides
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Full digital business blueprints. Each guide contains a complete system with local payment setups, revenue roadmaps, and step-by-step execution instructions.
          </p>
        </div>

        {/* Ideas Grid */}
        {displayedIdeas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedIdeas.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:border-amber-500/40 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden relative shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl bg-amber-50 dark:bg-amber-950/20 text-amber-500">
                      {product.icon || "💡"}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gray-900/90 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-gray-700">
                    Full Guide
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="inline-block px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold rounded-md">
                        {(product as any).category || "Earning Blueprint"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">8 min read</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 h-12 flex items-center group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">Rs. 500</span>
                      <Link
                        to={`/blogs/news/${product.slug || product.id}`}
                        className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:text-amber-500 inline-flex items-center gap-0.5"
                      >
                        Read Free <ArrowRight size={11} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: product.title,
                            type: "idea",
                            price: 500,
                            image: product.image,
                            icon: product.icon,
                            slug: product.slug,
                          });
                          navigate("/checkout");
                        }}
                        className="col-span-3 py-2 px-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingCart size={13} /> Buy Now
                      </button>
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: product.title,
                            type: "idea",
                            price: 500,
                            image: product.image,
                            icon: product.icon,
                            slug: product.slug,
                          });
                        }}
                        className={`col-span-2 py-2 px-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                          isInCart(product.id)
                            ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        title="Add to cart"
                      >
                        {isInCart(product.id) ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span className="text-[11px]">Added</span>
                          </>
                        ) : (
                          <>+ Cart</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 max-w-md mx-auto">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">No Matching Earning Guides</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try choosing another topic filter or clearing your search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!isFiltering && (
          <div className="mt-12 text-center">
            <Link
              to="/collection/ideas"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
            >
              <span>Explore All 30 Earning Blueprints</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* Featured Dropshipping Winning Products Showcase */}
      <section className="bg-gray-900 text-white py-16 md:py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Winning Product Showcases</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            High-Demand E-Commerce Dropshipping Niches
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
            Detailed case studies and supplier sourcing blueprints for high-converting physical products sold locally in South Asia.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-gray-800/80 rounded-2xl p-3 border border-gray-700/60 flex flex-col items-center hover:border-amber-500/50 transition-colors">
              <img
                src="/dropship_humidifier.png"
                alt="Humidifier Dropshipping Blueprint"
                className="rounded-xl w-full aspect-square object-cover mb-3"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <h4 className="font-bold text-xs sm:text-sm text-gray-100">Flame Humidifiers</h4>
              <p className="text-[11px] text-amber-400 mt-0.5">High Viral TikTok Demand</p>
            </div>

            <div className="bg-gray-800/80 rounded-2xl p-3 border border-gray-700/60 flex flex-col items-center hover:border-amber-500/50 transition-colors">
              <img
                src="/dropship_magsafe.png"
                alt="MagSafe Accessories Blueprint"
                className="rounded-xl w-full aspect-square object-cover mb-3"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <h4 className="font-bold text-xs sm:text-sm text-gray-100">MagSafe Power Banks</h4>
              <p className="text-[11px] text-amber-400 mt-0.5">Premium Smartphone Niche</p>
            </div>

            <div className="bg-gray-800/80 rounded-2xl p-3 border border-gray-700/60 flex flex-col items-center hover:border-amber-500/50 transition-colors">
              <img
                src="/dropship_projector.png"
                alt="Mini Projector Blueprint"
                className="rounded-xl w-full aspect-square object-cover mb-3"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <h4 className="font-bold text-xs sm:text-sm text-gray-100">Smart Mini Projectors</h4>
              <p className="text-[11px] text-amber-400 mt-0.5">High-Ticket Margins</p>
            </div>

            <div className="bg-gray-800/80 rounded-2xl p-3 border border-gray-700/60 flex flex-col items-center hover:border-amber-500/50 transition-colors">
              <img
                src="/dropship_vacuum.png"
                alt="Portable Vacuum Blueprint"
                className="rounded-xl w-full aspect-square object-cover mb-3"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <h4 className="font-bold text-xs sm:text-sm text-gray-100">Handheld Car Vacuums</h4>
              <p className="text-[11px] text-amber-400 mt-0.5">Evergreen Household Niche</p>
            </div>
          </div>
        </div>
      </section>

      {/* 30 Survival Skills Section */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-bold mb-3">
            <span>🛡️ Future-Proof Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            30 Survival Skills — Technical & Financial Manuals
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Master core technical, financial, and digital safety capabilities necessary to operate securely and withdraw freelance revenue seamlessly.
          </p>
        </div>

        {/* Skills Grid */}
        {displayedSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedSkills.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:border-indigo-500/40 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden relative shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                      {product.icon || "🛡️"}
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-gray-900/90 text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-gray-700">
                    Skill Manual
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <span className="inline-block px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold rounded-md">
                        {(product as any).category || "Survival Skill"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">6 min read</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 h-12 flex items-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">Rs. 200</span>
                      <Link
                        to={`/blogs/news/${product.slug || product.id}`}
                        className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-500 inline-flex items-center gap-0.5"
                      >
                        Read Manual <ArrowRight size={11} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: product.title,
                            type: "skill",
                            price: 200,
                            image: product.image,
                            icon: product.icon,
                            slug: product.slug,
                          });
                          navigate("/checkout");
                        }}
                        className="col-span-3 py-2 px-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ShoppingCart size={13} /> Buy Now
                      </button>
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            title: product.title,
                            type: "skill",
                            price: 200,
                            image: product.image,
                            icon: product.icon,
                            slug: product.slug,
                          });
                        }}
                        className={`col-span-2 py-2 px-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                          isInCart(product.id)
                            ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                        title="Add to cart"
                      >
                        {isInCart(product.id) ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span className="text-[11px]">Added</span>
                          </>
                        ) : (
                          <>+ Cart</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 max-w-md mx-auto">
            <span className="text-4xl mb-3 block">🛡️</span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">No Matching Survival Skills</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try choosing another topic filter or clearing your search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {!isFiltering && (
          <div className="text-center mt-10">
            <Link
              to="/collection/skills"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <BookOpen size={18} />
              <span>View All 30 Survival Skill Manuals</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* Webmaster Quality & Editorial Transparency Disclosures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                GoshBuzz Editorial & Webmaster Quality Standards
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Transparent publishing policies for readers, web crawlers, and publisher verification.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Original Research & Content</h4>
              <p>
                All published guides are written by experienced digital creators, thoroughly researched, and updated continuously to prevent thin or repetitive material.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Privacy-Safe Software</h4>
              <p>
                GoshBuzz mobile applications execute 100% locally on Android devices without background telemetry, tracking cookies, or unauthorized data harvesting.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Publisher Compliance</h4>
              <p>
                Fully compliant with Google Webmaster Quality Guidelines, IAB Authorized Digital Sellers (<code className="text-amber-600 dark:text-amber-400 font-mono font-bold">/app-ads.txt</code>), and transparent user accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Component */}
      <FAQ />

      {/* Authority Editorial & Knowledge Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Contextual Editorial Content */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight">
              Ultimate Online Earning Blueprint for Pakistanis: Empowering Digital Citizens in Lahore, Karachi & Islamabad
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              As the digital economy matures, Pakistan has secured its position as one of the world's fastest-growing freelancing hubs. Thousands of students, stay-at-home parents, and young professionals in metropolitan centers like <strong>Karachi, Lahore, Faisalabad, Rawalpindi, Peshawar, Multan, and Islamabad</strong> are actively looking for reliable methods to <span className="text-amber-600 dark:text-amber-400 font-semibold">earn money online in Pakistan without fake promises</span>. Navigating this transition successfully requires structured, highly specific step-by-step guidance.
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Modern digital careers span multiple low-capital and high-yield activities. This includes creating passive royalty streams through self-publishing on <a href="https://kdp.amazon.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5">Amazon KDP <ExternalLink size={12} /></a>, offering visual assets built via Canva Pro, and orchestrating targeted e-commerce dropshipping stores utilizing local suppliers. With direct integrations supporting instant payouts, you can work safely and withdraw your hard-earned income through Payoneer, SadaPay, NayaPay, or JazzCash.
            </p>
            
            <div className="pt-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">
                High-RPM Earning Platforms & Resources:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: "Upwork Freelancing", url: "https://www.upwork.com" },
                  { name: "Fiverr Gigs", url: "https://www.fiverr.com" },
                  { name: "Payoneer Pakistan", url: "https://www.payoneer.com" },
                  { name: "State Bank of Pakistan", url: "https://www.sbp.org.pk" },
                  { name: "Amazon Publishing", url: "https://kdp.amazon.com" },
                  { name: "Shopify Ecommerce", url: "https://www.shopify.com" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors shadow-2xs flex items-center justify-center gap-1"
                  >
                    <span>{item.name}</span>
                    <ExternalLink size={11} className="shrink-0 opacity-70" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* AEO / GEO Search Assistant Quick Answers */}
          <div className="bg-amber-50/60 dark:bg-gray-900 p-6 rounded-2xl border border-amber-200/70 dark:border-gray-800 space-y-5 text-left shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Answer Engine Hub (AEO)</span>
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 dark:text-gray-200">
                  Q: What are the best online earning websites in Pakistan for students?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                  A: The top legitimate platforms are Upwork, Fiverr, and Amazon KDP. For no-investment visual services, designing Canva templates and publishing low-content books on Kindle are excellent methods to secure steady PKR earnings.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-amber-200/50 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-gray-200">
                  Q: Can I withdraw freelance income via EasyPaisa and JazzCash?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                  A: Yes. International freelance platforms transfer funds to your Payoneer account. Payoneer is officially integrated with JazzCash, enabling direct, instant local withdrawals onto your smartphone.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-amber-200/50 dark:border-gray-800">
                <h4 className="font-bold text-gray-900 dark:text-gray-200">
                  Q: Is dropshipping viable inside Pakistan?
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
                  A: Absolutely. Running e-commerce dropshipping with winning items (like mini humidifiers and handheld vacuums) sourced via local directories allows entrepreneurs to scale profitable online stores in major cities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Smartphone,
  Download,
} from "lucide-react";
import { products } from "../data";
import { goshbuzzApps } from "../data/appsData";
import { FAQ } from "../components/FAQ";

export default function Home() {
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
    "Amazon KDP",
    "Canva Pro",
    "Dropshipping",
    "AdSense",
    "Binance",
    "Upwork",
    "YouTube",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-amber-500 selection:text-white">
      <Helmet>
        <title>GoshBuzz — Pakistan's #1 Online Earning Guides & Courses</title>
        <meta
          name="description"
          content="Discover 60 step-by-step earning guides built for Pakistanis. 30 Earning Ideas and 30 Survival Skills. Instant PDF downloads to escape the matrix and start earning online."
        />
        <meta
          name="keywords"
          content="online earning in pakistan, make money online, freelance guides, e-commerce training pakistan, goshbuzz, earn online, passive income pakistan"
        />
        <meta
          property="og:title"
          content="GoshBuzz — Pakistan's #1 Online Earning Guides & Courses"
        />
        <meta
          property="og:description"
          content="Discover 60 step-by-step earning guides built for Pakistanis. 30 Earning Ideas and 30 Survival Skills. Instant PDF downloads to escape the matrix and start earning online."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com" />
        <link rel="canonical" href="https://goshbuzz.com" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GoshBuzz",
              "url": "https://goshbuzz.com",
              "description": "Pakistan's #1 Online Earning Library — Selling Guides to Work directly from zero, Not Courses. 60 step-by-step earning guides built for Pakistanis."
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pt-16 pb-20 md:pt-24 md:pb-28 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/50 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Pakistan's #1 Earning Library — Direct Step-by-Step Guides, Not Generic Courses
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.1]">
              Escape the Matrix. <br />
              <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                Start Earning in Pakistan.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              60 actionable earning guides designed for Pakistanis — <strong>30 Earning Ideas</strong> at Rs.500 and <strong>30 Survival Skills</strong> at Rs.200. Instant PDF delivery via WhatsApp. Pay securely with JazzCash or EasyPaisa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <a
                href="#ideas"
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
              >
                <span>Browse Earning Ideas</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="#skills"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl transition-all border border-indigo-200 dark:border-indigo-800/80 shadow-xs flex items-center justify-center gap-2 text-base"
              >
                <span>Browse Survival Skills</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 pt-6 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-200/60 dark:border-gray-800">
                <CheckCircle2 className="text-green-500 w-4 h-4 shrink-0" />
                <span>Zero-Theory Execution</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-200/60 dark:border-gray-800">
                <ShieldCheck className="text-blue-500 w-4 h-4 shrink-0" />
                <span>JazzCash & EasyPaisa</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-200/60 dark:border-gray-800">
                <Zap className="text-amber-500 w-4 h-4 shrink-0" />
                <span>Instant WhatsApp Delivery</span>
              </div>
            </div>

            {/* Search & Category Filter Box */}
            <div className="mt-8 pt-6 max-w-3xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search 60 guides (e.g., Dropshipping, Amazon KDP, Canva, Crypto, Upwork)..."
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

              {/* Popular Tags */}
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

      {/* Earning Ideas Section */}
      <section id="ideas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3">
            <span>💡 High-Income Systems</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            30 Earning Ideas — Rs.500 Each
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Full digital business blueprints. Each guide contains a complete system with Pakistani payment setups, PKR earning roadmaps, and step-by-step execution.
          </p>
        </div>

        {/* Ideas Responsive Grid */}
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
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold text-gray-900 dark:text-amber-400 shadow-sm border border-gray-100 dark:border-gray-800">
                    Rs. 500
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="mb-2.5">
                      <span className="inline-block px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold rounded-md">
                        {(product as any).category || "Earning Blueprint"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 h-12 flex items-center group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <Link
                    to={`/blogs/news/${product.slug || product.id}`}
                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-amber-500 text-white text-center rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 mt-auto"
                  >
                    <span>Read Blueprint</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 max-w-md mx-auto">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">No Matching Earning Ideas</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try choosing another topic filter or clearing your search term.
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

        {/* View All Ideas Link */}
        {!isFiltering && (
          <div className="mt-12 text-center">
            <Link
              to="/collection/ideas"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm"
            >
              <span>Explore All 30 Earning Ideas</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Earning Ideas SEO/Authority Block */}
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-3 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Profitable Online Business Ideas in Pakistan: Scaling Beyond Traditional Gigs
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              For ambitious individuals in Pakistan aiming to launch an internet venture, finding the right <strong>online business ideas in Pakistan with low investment</strong> is the first step towards financial autonomy. Digital businesses allow you to tap into foreign purchasing power directly from Karachi, Lahore, or Islamabad. GoshBuzz blueprints cover 30 lucrative systems designed for immediate execution—including high-ticket micro-consulting, local dropshipping, and automated print-on-demand setups.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Learn authoritative insights on marketing frameworks via <a href="https://neilpatel.com/blog/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5">Neil Patel's Growth Blog <ExternalLink size={12} /></a>.
            </p>
          </div>

          <div className="space-y-3 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              E-Commerce Dropshipping & Digital Asset Sales
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              E-commerce has exploded across South Asia, making <strong>local e-commerce dropshipping inside Pakistan</strong> a premier business model. By partnering with local fulfillment networks, aspiring store owners can distribute winning items without upfront inventory risk. Explore the fundamentals via the official <a href="https://www.shopify.com/blog/what-is-dropshipping" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-0.5">Shopify Dropshipping Blueprint <ExternalLink size={12} /></a>.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Publishing low-content digital products or eBooks on global platforms is also an outstanding avenue for passive royalty income that hedges against local inflation.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Dropshipping Winning Products Showcase */}
      <section className="bg-gray-900 text-white py-16 md:py-20 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
            <span>🔥 Winning Product Showcases</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            High-Demand E-Commerce Dropshipping Niches
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-10">
            Detailed case studies and supplier sourcing blueprints for high-converting physical products sold locally in Pakistan.
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

      {/* Survival Skills Section */}
      <section id="skills" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-bold mb-3">
            <span>🛡️ Future-Proof Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            30 Survival Skills — Rs.200 Each
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Master the core technical, financial, and digital safety skills necessary to operate securely and withdraw freelance earnings in Pakistan.
          </p>
        </div>

        {/* Skills Responsive Grid */}
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
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold text-indigo-700 dark:text-indigo-300 shadow-sm border border-gray-100 dark:border-gray-800">
                    Rs. 200
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="mb-2.5">
                      <span className="inline-block px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold rounded-md">
                        {(product as any).category || "Survival Skill"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 h-12 flex items-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <Link
                    to={`/blogs/news/${product.slug || product.id}`}
                    className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-center rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 mt-auto"
                  >
                    <span>Read Skill Guide</span>
                    <ArrowRight size={14} />
                  </Link>
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
              <span>View All 30 Survival Skills</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Survival Skills SEO/Authority Block */}
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="space-y-3 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              High-Paying Digital Skills in Pakistan: Building Career Resilience
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              In an era dominated by rapid artificial intelligence shifts, discovering the most lucrative <strong>digital skills to learn in Pakistan</strong> is essential for remote career survival. Relying solely on entry-level generic services is no longer sustainable. Specialists in cities like Multan, Faisalabad, and Rawalpindi must specialize in technical niches—including advanced content monetization, modern search engine optimization (SEO), local cybersecurity shielding, and responsive page building.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Explore global training on <a href="https://academy.hubspot.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-0.5">HubSpot Academy <ExternalLink size={12} /></a> or <a href="https://grow.google/intl/en_pk/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-0.5">Google Career Certificates Pakistan <ExternalLink size={12} /></a>.
            </p>
          </div>

          <div className="space-y-3 bg-white dark:bg-gray-900/60 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Local Compliance, Secure Payouts & Online Safety
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Equipping yourself with technical skills must go hand-in-hand with administrative mastery. Modern Pakistani freelancers need to understand <strong>secure online withdrawal portals</strong>. Utilizing local payment methods such as SadaPay, NayaPay, and direct commercial wire transfers ensures that your freelance revenue is safely brought home at optimal conversion rates.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Our 30 survival skills guides are written directly for regional professionals, offering action-oriented guidance on digital safety and contract drafting.
            </p>
          </div>
        </div>
      </section>

      {/* GoshBuzz Android Apps Spotlight Section */}
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
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" />
                  Featured Mobile App
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  EMF Sentinel: EMF Scan & Metal Detector
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Turn your Android smartphone into a high-precision electromagnetic field radiation scanner and metal detector using hardware magnetometer sensors. 100% offline & privacy-safe.
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
                <span>View App Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
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

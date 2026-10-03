import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BookOpen, Search, Sparkles, Clock, Star, ShoppingCart, CheckCircle2 } from "lucide-react";
import { products } from "../data";
import { articles } from "../data/articles";
import { useCart } from "../CartContext";

export default function Blogs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, isInCart } = useCart();
  // Legacy pagination URLs (?page=N) serve identical content to page 1:
  // keep the page-1 canonical but keep them out of the index entirely.
  const isPaged = new URLSearchParams(location.search).has("page");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Get all products that have articles
  const blogPosts = products
    .filter((p) => articles[p.id as keyof typeof articles])
    .map((p) => {
      const art = articles[p.id as keyof typeof articles];
      return {
        id: p.id,
        slug: p.slug,
        title: art.title || p.title,
        intro: art.intro || p.description,
        category: p.category,
        type: p.type,
        icon: p.icon,
        image: p.image,
        difficulty: art.difficulty,
        earningPotential: art.earningPotential,
      };
    });

  const categories = ["All", "💡 Earning Ideas", "🛡️ Survival Skills", ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.intro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory === "💡 Earning Ideas") {
      matchesCategory = post.type === "idea";
    } else if (activeCategory === "🛡️ Survival Skills") {
      matchesCategory = post.type === "skill";
    } else if (activeCategory !== "All") {
      matchesCategory = post.category === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const blogsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blogs & Earning Case Studies — GoshBuzz Pakistan",
    "description": "Read detailed blueprints, guides, and real-world case studies about online earning in Pakistan.",
    "url": "https://goshbuzz.com/blogs/news",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": blogPosts.map((post, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": post.title,
        "url": `https://goshbuzz.com/blogs/news/${post.slug || post.id}`,
        "description": post.intro
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Online Earning Guides & Case Studies | GoshBuzz</title>
        <meta
          name="description"
          content="Browse 60+ free step-by-step guides on online earning, freelancing and e-commerce in Pakistan, with FAQs and withdrawal tips."
        />
        <link rel="canonical" href="https://goshbuzz.com/blogs/news" />
        {isPaged ? (
          <meta name="robots" content="noindex, follow" />
        ) : (
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
        )}
        <meta property="og:title" content="Online Earning Guides & Case Studies | GoshBuzz" />
        <meta property="og:description" content="Browse 60+ free step-by-step guides on online earning, freelancing and e-commerce in Pakistan, with FAQs and withdrawal tips." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/blogs/news" />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <meta property="og:site_name" content="GoshBuzz" />
        <meta property="og:locale" content="en_PK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(blogsSchema)}
        </script>
      </Helmet>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /> GoshBuzz Knowledge Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-950 dark:text-gray-50 tracking-tight">
          Earning Blueprints & Articles
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
          Practical, step-by-step masterclasses and case studies designed to help you start your freelance, digital, or local business in Pakistan.
        </p>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 pb-6 border-b border-gray-150 dark:border-gray-800">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search articles, guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-amber-500 text-sm font-medium shadow-sm"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-950"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <BookOpen className="mx-auto text-gray-300 dark:text-gray-700 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No Articles Found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Try searching for something else or changing categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-950">
                {post.image ? (
                  <img
                  width={800}
                  height={450}
                  decoding="async"
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {post.icon}
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-gray-100/20">
                  {post.category}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Step-by-Step
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                    <Star size={12} fill="currentColor" /> {post.difficulty}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-gray-950 dark:text-gray-50 text-lg leading-snug group-hover:text-amber-500 transition-colors">
                    <Link to={`/blogs/news/${post.slug || post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {post.intro}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Earning Potential</span>
                      <span className="text-xs font-black text-gray-900 dark:text-gray-150">{post.earningPotential}</span>
                    </div>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                      Rs. {post.type === "idea" ? "500" : "200"}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    <button
                      onClick={() => {
                        addToCart({
                          id: post.id,
                          title: post.title,
                          type: post.type as "idea" | "skill",
                          price: post.type === "idea" ? 500 : 200,
                          image: post.image,
                          icon: post.icon,
                          slug: post.slug,
                        });
                        navigate("/checkout");
                      }}
                      className="col-span-3 py-2.5 px-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShoppingCart size={13} /> Buy Now
                    </button>
                    <button
                      onClick={() => {
                        addToCart({
                          id: post.id,
                          title: post.title,
                          type: post.type as "idea" | "skill",
                          price: post.type === "idea" ? 500 : 200,
                          image: post.image,
                          icon: post.icon,
                          slug: post.slug,
                        });
                      }}
                      className={`col-span-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                        isInCart(post.id)
                          ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      title="Add to cart"
                    >
                      {isInCart(post.id) ? (
                        <>
                          <CheckCircle2 size={13} /> Added
                        </>
                      ) : (
                        <>+ Cart</>
                      )}
                    </button>
                  </div>

                  <Link
                    to={`/blogs/news/${post.slug || post.id}`}
                    className="block w-full py-1.5 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    Read Full Case Study & Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* External Authority Resources */}
      <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 flex items-center justify-between">
              <span>Google AdSense Portal</span>
              <span className="text-xs text-amber-500 font-mono">adsense.google.com</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Official publisher policies, site verification guidelines, and traffic metrics dashboard for website owners.
            </p>
            <a href="https://adsense.google.com/start/" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-bold text-amber-600 hover:underline pt-2">
              Visit AdSense Portal &rarr;
            </a>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 flex items-center justify-between">
              <span>Binance Academy</span>
              <span className="text-xs text-amber-500 font-mono">academy.binance.com</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Free crypto spot trading education, risk management, and security protocols verified for beginners.
            </p>
            <a href="https://academy.binance.com/en" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-bold text-amber-600 hover:underline pt-2">
              Visit Binance Academy &rarr;
            </a>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 flex items-center justify-between">
              <span>Upwork Talent Hub</span>
              <span className="text-xs text-amber-500 font-mono">upwork.com</span>
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Top freelancer tips for bidding, job success score, client communication, and verified badge achievements.
            </p>
            <a href="https://www.upwork.com/resources" target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-bold text-amber-600 hover:underline pt-2">
              Visit Upwork Hub &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

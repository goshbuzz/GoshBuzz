import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import NotFound from "./NotFound";
import { Helmet } from "react-helmet-async";
import { products } from "../data";
import { Search, ShoppingCart, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "../CartContext";

export default function Collection() {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { type } = useParams<{ type: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  // /collection/frontpage is a legacy duplicate of the homepage
  if (type === "frontpage") {
    return <Navigate to="/" replace />;
  }
  // Unknown collection types must 404 (SSR marker) instead of rendering
  // an empty list under a bogus canonical URL
  if (type !== "ideas" && type !== "skills") {
    return <NotFound />;
  }

  const collectionType = type === "ideas" ? "idea" : "skill";
  const title =
    collectionType === "idea" ? "30 Earning Ideas" : "30 Survival Skills";
  const description =
    collectionType === "idea"
      ? "Complete business blueprints — each guide is a full earning system with Pakistan-specific tools, PKR income estimates, and a step-by-step strategy."
      : "Essential skills to future-proof your career, protect your digital assets, and thrive in the modern economy over the next 4 years.";

  const filteredProducts = products.filter(
    (p) =>
      p.type === collectionType &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p as any).category?.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${title} — GoshBuzz Pakistan`,
    "description": description,
    "url": `https://goshbuzz.com/collection/${type}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products
        .filter((p) => p.type === collectionType)
        .map((p, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": p.title,
          "url": `https://goshbuzz.com/blogs/news/${p.slug || p.id}`,
          "description": p.description
        }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{`${title} — GoshBuzz Pakistan`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://goshbuzz.com/collection/${type}`} />
        <meta property="og:title" content={`${title} — GoshBuzz Pakistan`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://goshbuzz.com/collection/${type}`} />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <meta property="og:site_name" content="GoshBuzz" />
        <meta property="og:locale" content="en_PK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {collectionType === "idea" ? "💡" : "🛡️"} {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {description}
        </p>

        <div className="mt-12 max-w-2xl mx-auto relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
          >
            <div className="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              {product.image ? (
                <img
                  width={800}
                  height={450}
                  decoding="async"
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center text-4xl ${collectionType === "idea" ? "bg-amber-50 text-amber-200" : "bg-indigo-50 text-indigo-200"}`}
                >
                  {product.icon}
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-gray-100 shadow-sm">
                Rs. {collectionType === "idea" ? "500" : "200"}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-3">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${collectionType === "idea" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300" : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300"}`}
                >
                  {(product as any).category || "Essential"}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                {product.description}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2.5">
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        title: product.title,
                        type: collectionType,
                        price: collectionType === "idea" ? 500 : 200,
                        image: product.image,
                        icon: product.icon,
                        slug: product.slug,
                      });
                      navigate("/checkout");
                    }}
                    className={`col-span-3 py-2.5 px-2 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                      collectionType === "idea"
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    <ShoppingCart size={14} /> Buy Now
                  </button>
                  <button
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        title: product.title,
                        type: collectionType,
                        price: collectionType === "idea" ? 500 : 200,
                        image: product.image,
                        icon: product.icon,
                        slug: product.slug,
                      });
                    }}
                    className={`col-span-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                      isInCart(product.id)
                        ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    title="Add to cart"
                  >
                    {isInCart(product.id) ? (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>+ Cart</>
                    )}
                  </button>
                </div>
                <Link
                  to={`/blogs/news/${product.slug || product.id}`}
                  className="block w-full py-2 bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white text-center rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  View Details & Guide
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic SEO, AEO, and GEO Section tailored to the collection */}
      <div className="mt-24 pt-16 border-t border-gray-100 dark:border-gray-800 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6 text-center lg:text-left">
            {collectionType === "idea" ? (
              <>
                <h2 className="text-2xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight leading-tight">
                  High-Yield Online Earning Ideas & Digital Business Models for Pakistan
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Building a sustainable remote business from Pakistan is no longer an elusive goal. With localized digital guides focusing on <strong>30 actionable online earning ideas in Pakistan</strong>, our blueprints explain how you can start immediately with low to zero capital. From setting up passive income streams via <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Canva templates</a> and digital download products on Etsy to executing high-converting dropshipping stores in Karachi or Lahore, you will discover optimized pathways to monetize your digital presence.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  By matching international market demand on portals like <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Fiverr</a> and <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Upwork</a> with local payment infrastructure (JazzCash, EasyPaisa, SadaPay, HBL), you can escape traditional local wage structures. We supply the practical blueprints, specific templates, and step-by-step frameworks needed to successfully grow your digital services business.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight leading-tight">
                  Future-Proof Digital Skills & Remote Career Frameworks for Pakistan
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Technical self-reliance is the absolute cornerstone of career security in the modern remote workforce. Our catalog of <strong>30 essential survival digital skills</strong> features complete, bite-sized roadmaps designed to help you master high-demand remote disciplines. Whether you want to study local search engine optimization, master mobile-friendly WordPress design, learn video editing with CapCut, or secure online assets from digital threats, these manuals are built specifically for the Pakistani context.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Equipping yourself with modular, service-based skills allows you to directly target high-ticket clients worldwide. Learn how to present yourself as a certified professional on professional directories and high-authority sites like <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">LinkedIn</a>, establish your own retainer agency contracts, and receive secure bank wire payouts in Islamabad, Lahore, Multan, or Faisalabad.
                </p>
              </>
            )}
          </div>
          <div className="bg-amber-50/30 dark:bg-amber-950/5 p-6 rounded-2xl border border-amber-100/40 dark:border-amber-900/15 space-y-4 text-center lg:text-left">
            <h3 className="font-bold text-gray-950 dark:text-gray-50 text-base">
              🎯 Geographic Earning Insights
            </h3>
            <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <li>
                <strong>State-Supported Growth:</strong> The Ministry of IT and Telecom, alongside the State Bank of Pakistan, has designed special frameworks supporting remote software and freelancing exports, ensuring 0% income tax on certified digital services. Learn more via the official <a href="https://www.sbp.org.pk" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">State Bank of Pakistan ↗</a> directory.
              </li>
              <li>
                <strong>Direct Local Payouts:</strong> Direct bank integration means you can seamlessly link your dollar earnings to Pakistani bank accounts (HBL, Meezan, Bank Alfalah, Allied Bank) with minimized transaction overheads.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No results found for "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
}

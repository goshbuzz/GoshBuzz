import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { products } from "../data";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Collection() {
  const { type } = useParams<{ type: string }>();
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Helmet>
        <title>{title} — GoshBuzz Pakistan</title>
        <meta name="description" content={description} />
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
        {filteredProducts.map((product, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (idx % 10) * 0.1 }}
            key={product.id}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
          >
            <div className="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              {product.image ? (
                <img
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
              <Link
                to={`/product/${product.id}`}
                className="block w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center rounded-xl font-semibold border hover:bg-gray-100 dark:bg-gray-700 transition-colors"
              >
                View Guide
              </Link>
            </div>
          </motion.div>
        ))}
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

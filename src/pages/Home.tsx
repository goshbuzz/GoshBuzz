import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  DownloadCloud,
  Search,
} from "lucide-react";
import { products } from "../data";

import { FAQ } from "../components/FAQ";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIdeas = products.filter(
    (p) =>
      p.type === "idea" &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );
  const filteredSkills = products.filter(
    (p) =>
      p.type === "skill" &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="space-y-24 pb-24">
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
        <meta property="og:url" content="https://goshbuzz.com/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "GoshBuzz",
              "url": "https://goshbuzz.com/",
              "description": "Pakistan's #1 Online Earning Library — Selling Guides to Work directly from zero, Not Courses. 60 step-by-step earning guides built for Pakistanis."
            }
          `}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-20 pb-32 border-b border-gray-100 dark:border-gray-800">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000"
            alt="Make money online in Pakistan - GoshBuzz online earning blueprints and survival skills for remote workers in Karachi, Lahore, and Islamabad"
            title="Online Earning in Pakistan — Freelancing and Digital Skills"
            className="w-full h-full object-cover opacity-100 dark:opacity-35 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/50 to-white/75 dark:from-transparent dark:via-gray-950/30 dark:to-gray-950"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full md:rounded-full rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-sm font-semibold mb-4 max-w-full">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <span>
                Pakistan's #1 Online Earning Library — Selling Guides to Work
                directly from zero, Not Courses
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Escape the Matrix.
              <br />
              <span className="text-amber-500">Start Earning.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              60 step-by-step earning guides built for Pakistanis — 30 Earning
              Ideas at Rs.500 and 30 Survival Skills at Rs.200. Instant PDF
              download. Pay by JazzCash or EasyPaisa.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#ideas"
                className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Browse Earning Ideas <ArrowRight size={20} />
              </a>
              <a
                href="#skills"
                className="px-8 py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-lg hover:bg-indigo-100 dark:bg-indigo-900/40 transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800"
              >
                Browse Survival Skills <ArrowRight size={20} />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} /> Proven
                Step-by-Step Blueprints
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={18} /> Secure
                EasyPaisa & JazzCash
              </div>
              <div className="flex items-center gap-2">
                <DownloadCloud className="text-indigo-500" size={18} /> Instant
                WhatsApp Delivery
              </div>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for an earning idea or survival skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ideas Section */}
      <section id="ideas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            💡 30 Earning Ideas — Rs.500 Each
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete business blueprints — each guide is a full earning system
            with Pakistan-specific tools, PKR income estimates, and a
            step-by-step strategy.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
          {filteredIdeas.slice(0, 8).map((product, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group flex flex-col w-[85vw] sm:w-[350px] flex-shrink-0 snap-center"
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
                  <div className="absolute inset-0 flex items-center justify-center text-4xl bg-amber-50 text-amber-200">
                    {product.icon}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-gray-100 shadow-sm">
                  Rs. 500
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full">
                    {(product as any).category || "Essential"}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {product.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                  {product.description}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center rounded-xl font-semibold border hover:bg-gray-100 dark:bg-gray-800 transition-colors"
                >
                  View Guide
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/collection/ideas"
            className="inline-block px-8 py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-lg"
          >
            View All 30 Earning Ideas
          </Link>
        </div>
      </section>

      {/* Dropship Mockups (Using actual assets) */}
      <section className="bg-gray-900 text-white py-24 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="/dropship_humidifier.png"
              alt="Humidifier Dropshipping Guide"
              className="rounded-lg shadow-lg w-full object-cover aspect-square hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <img
              src="/dropship_magsafe.png"
              alt="MagSafe Dropshipping Guide"
              className="rounded-lg shadow-lg w-full object-cover aspect-square hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <img
              src="/dropship_projector.png"
              alt="Projector Dropshipping Guide"
              className="rounded-lg shadow-lg w-full object-cover aspect-square hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <img
              src="/dropship_vacuum.png"
              alt="Vacuum Dropshipping Guide"
              className="rounded-lg shadow-lg w-full object-cover aspect-square hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="mt-8 text-gray-400">
            Discover winning products and set up your automated dropshipping
            store today.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🛡️ 30 Survival Skills — Rs.200 Each
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Essential skills to future-proof your career, protect your digital
            assets, and thrive in the modern economy over the next 4 years.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
          {filteredSkills.slice(0, 8).map((product, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group flex flex-col w-[85vw] sm:w-[350px] flex-shrink-0 snap-center"
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
                  <div className="absolute inset-0 flex items-center justify-center text-4xl bg-indigo-50 text-indigo-200">
                    {product.icon}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-gray-100 shadow-sm">
                  Rs. 200
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 text-xs font-semibold rounded-full">
                    {(product as any).category || "Essential"}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {product.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                  {product.description}
                </p>
                <Link
                  to={`/product/${product.id}`}
                  className="block w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center rounded-xl font-semibold border hover:bg-gray-100 dark:bg-gray-800 transition-colors"
                >
                  View Guide
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/collection/skills"
            className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            View All 30 Survival Skills
          </Link>
        </div>
      </section>

      <FAQ />

      {/* SEO, AEO, and GEO Authority Section for Pakistan Online Earning */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-gray-100 dark:border-gray-800 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Contextual Editorial Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight leading-tight">
              Ultimate Online Earning Blueprint for Pakistanis: Empowering Digital Citizens in Lahore, Karachi & Islamabad
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              As the digital economy matures, Pakistan has secured its position as one of the world's fastest-growing freelancing hubs. Thousands of students, stay-at-home parents, and young professionals in metropolitan centers like <strong>Karachi, Lahore, Faisalabad, Rawalpindi, Peshawar, Multan, and Islamabad</strong> are actively looking for reliable methods to <span className="text-blue-600 dark:text-blue-400 font-semibold">earn money online in Pakistan without investment</span>. Navigating this transition successfully requires structured, highly specific step-by-step guidance rather than generic theoretical courses. At GoshBuzz, we supply exactly that—practical, local-friendly blueprints built from ground-up execution.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Modern digital careers span multiple low-capital and high-yield activities. This includes creating passive royalty streams through self-publishing on <a href="https://kdp.amazon.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Amazon KDP</a>, offering visual assets built via <a href="https://www.canva.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Canva Pro</a>, and orchestrating highly targeted e-commerce dropshipping stores utilizing local suppliers. With direct integrations supporting instant payouts, you can work safely as a digital entrepreneur and withdraw your hard-earned USD or PKR income through <a href="https://www.payoneer.com" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-semibold">Payoneer</a>, SadaPay, NayaPay, or directly to local accounts with major banks. We focus on bridging the gap between global digital markets and regional payment ecosystems in Pakistan.
            </p>
            
            <div className="pt-4">
              <h3 className="text-lg font-bold text-gray-950 dark:text-gray-50 mb-3">High-RPM Earning Platforms & Resources:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  Upwork Freelancing ↗
                </a>
                <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  Fiverr Gigs ↗
                </a>
                <a href="https://www.payoneer.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  Payoneer Pakistan ↗
                </a>
                <a href="https://www.sbp.org.pk" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  State Bank of Pakistan ↗
                </a>
                <a href="https://kdp.amazon.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  Amazon Publishing ↗
                </a>
                <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 text-center hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                  Shopify Ecommerce ↗
                </a>
              </div>
            </div>
          </div>

          {/* AEO / GEO Search Assistant Quick Answers */}
          <div className="bg-amber-50/40 dark:bg-amber-950/5 p-6 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 space-y-6">
            <h3 className="text-xl font-bold text-gray-950 dark:text-gray-50 flex items-center gap-2">
              💡 Answer Engine Hub (AEO)
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-gray-950 dark:text-gray-200">
                  Q: What are the best online earning websites in Pakistan for students?
                </h4>
                <p className="text-gray-650 dark:text-gray-400 leading-relaxed">
                  A: The top legitimate platforms are Upwork, Fiverr, and Amazon KDP. For no-investment visual services, designing Canva templates and publishing low-content books on Kindle are excellent methods to secure steady PKR earnings.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-amber-100/30 dark:border-amber-900/10">
                <h4 className="font-bold text-gray-950 dark:text-gray-200">
                  Q: Can I withdraw freelance income via EasyPaisa and JazzCash?
                </h4>
                <p className="text-gray-650 dark:text-gray-400 leading-relaxed">
                  A: Yes. International freelance platforms transfer funds to your Payoneer account. Payoneer is officially integrated with JazzCash, enabling direct, instant local withdrawals onto your smartphone.
                </p>
              </div>

              <div className="space-y-1 pt-3 border-t border-amber-100/30 dark:border-amber-900/10">
                <h4 className="font-bold text-gray-950 dark:text-gray-200">
                  Q: Is dropshipping viable inside Pakistan?
                </h4>
                <p className="text-gray-650 dark:text-gray-400 leading-relaxed">
                  A: Absolutely. Running e-commerce dropshipping with winning items (like mini humidifiers and vacuums) sourced via local directories allows entrepreneurs to scale profitable online stores in major cities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

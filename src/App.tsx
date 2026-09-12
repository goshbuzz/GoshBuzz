import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from "react-router-dom";
import { HashLink } from "./components/HashLink";
import { HelmetProvider } from "react-helmet-async";
import { Globe, Moon, Sun, Menu, X } from "lucide-react";
import Home from "./pages/Home";
import goshbuzzLogo from "./assets/images/goshbuzz_logo_1783631495534.jpg";
import Product from "./pages/Product";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import About from "./pages/About";
import HowToPay from "./pages/HowToPay";
import DeliveryPolicy from "./pages/DeliveryPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Disclaimer from "./pages/Disclaimer";
import Terms from "./pages/Terms";
import Collection from "./pages/Collection";
import Checkout from "./pages/Checkout";
import Blogs from "./pages/Blogs";
import Apps from "./pages/Apps";
import AppDetail from "./pages/AppDetail";
import NotFound from "./pages/NotFound";
import { CartProvider, useCart } from "./CartContext";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { findProductByIdentifier } from "./data";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

function ProductRedirect() {
  const { id } = useParams<{ id: string }>();
  const product = findProductByIdentifier(id || "");
  const targetSlug = product ? (product.slug || product.id) : (id || "");
  return <Navigate to={`/blogs/news/${targetSlug}`} replace />;
}

function CollectionRedirect() {
  const { type } = useParams<{ type: string }>();
  return <Navigate to={`/collection/${type || "ideas"}`} replace />;
}

function Header({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const { language, setLanguage, t } = useLanguage();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl md:text-2xl font-extrabold tracking-tight text-amber-500 flex items-center gap-3"
        >
          <img
            src={goshbuzzLogo}
            alt="GoshBuzz"
            className="h-12 w-12 md:h-16 md:w-16 rounded-full shadow-md flex-shrink-0 transition-transform hover:scale-105 duration-300"
          />
          GoshBuzz
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("home")}
          </Link>
          <HashLink
            smooth
            to="/#ideas"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("earningIdeas")}
          </HashLink>
          <HashLink
            smooth
            to="/#skills"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("survivalSkills")}
          </HashLink>
          <Link
            to="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("aboutUs")}
          </Link>
          <Link
            to="/how-to-pay"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("howToPay")}
          </Link>
          <Link
            to="/apps"
            className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 font-medium flex items-center gap-1.5"
          >
            <span>{t("apps")}</span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/20">NEW</span>
          </Link>
          <Link
            to="/blogs/news"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("blogs")}
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            {t("contact")}
          </Link>
          <Link
            to="/checkout"
            className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 font-semibold flex items-center gap-1.5 relative"
          >
            <ShoppingCart size={18} />
            <span>{t("cart")}</span>
            {cart.length > 0 && (
              <span className="absolute -top-2.5 -right-3 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {cart.length}
              </span>
            )}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-4">
            <Globe size={18} className="text-gray-500 dark:text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "ur")}
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="ur">اردو</option>
            </select>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-2 pb-4 space-y-1 shadow-md">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("home")}
          </Link>
          <HashLink
            smooth
            to="/#ideas"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("earningIdeas")}
          </HashLink>
          <HashLink
            smooth
            to="/#skills"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("survivalSkills")}
          </HashLink>
          <Link
            to="/about"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("aboutUs")}
          </Link>
          <Link
            to="/how-to-pay"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("howToPay")}
          </Link>
          <Link
            to="/apps"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            <span>{t("apps")}</span>
            <span className="bg-amber-500 text-gray-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">NEW</span>
          </Link>
          <Link
            to="/blogs/news"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("blogs")}
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            {t("contact")}
          </Link>
          <Link
            to="/checkout"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart size={18} />
              {t("cart")}
            </span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}

export function AppLayout() {
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("goshbuzz_theme");
      if (savedTheme === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleSetDarkMode = (val: boolean) => {
    setDarkMode(val);
    try {
      localStorage.setItem("goshbuzz_theme", val ? "dark" : "light");
    } catch {}
  };

  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, mounted]);

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}
    >
      <Header darkMode={darkMode} setDarkMode={handleSetDarkMode} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/news/:slug" element={<Product />} />
          <Route path="/blogs/news" element={<Blogs />} />
          <Route path="/blogs" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/news/tagged/:tag" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/news/tagged/*" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/tagged/:tag" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/tagged/*" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/tag/:tag" element={<Navigate to="/blogs/news" replace />} />
          <Route path="/blogs/tag/*" element={<Navigate to="/blogs/news" replace />} />

          <Route path="/products/:id" element={<ProductRedirect />} />
          <Route path="/product/:id" element={<ProductRedirect />} />
          <Route path="/products" element={<Navigate to="/" replace />} />
          <Route path="/product" element={<Navigate to="/" replace />} />

          <Route path="/collections/:type" element={<CollectionRedirect />} />
          <Route path="/collections" element={<Navigate to="/" replace />} />
          <Route path="/collection/:type" element={<Collection />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/refund" element={<Navigate to="/refund-policy" replace />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/delivery" element={<Navigate to="/delivery-policy" replace />} />
          <Route path="/shipping" element={<Navigate to="/delivery-policy" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:slug" element={<AppDetail />} />
          <Route path="/app" element={<Navigate to="/apps" replace />} />
          <Route path="/app/:slug" element={<Navigate to="/apps/:slug" replace />} />
          <Route path="/goshbuzz-apps" element={<Navigate to="/apps" replace />} />
          <Route path="/mobile-apps" element={<Navigate to="/apps" replace />} />
          <Route path="/emf-sentinel" element={<Navigate to="/apps/emf-sentinel" replace />} />
          <Route path="/com.goshbuzz.emfsentinel" element={<Navigate to="/apps/emf-sentinel" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
          <Route path="/how-to-pay" element={<HowToPay />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/disclaimers" element={<Navigate to="/disclaimer" replace />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
          <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
          <Route path="/tos" element={<Navigate to="/terms" replace />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start text-center lg:text-left gap-10 mb-10">
            <div className="mb-4 lg:mb-0 max-w-sm flex flex-col items-center lg:items-start">
              <Link
                to="/"
                className="text-amber-500 text-lg font-extrabold flex items-center gap-2 mb-3"
              >
                <img
                  src={goshbuzzLogo}
                  alt="GoshBuzz"
                  className="h-10 w-10 rounded-full opacity-90 shadow-sm flex-shrink-0"
                />
                GoshBuzz Pakistan
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed">
                Pakistan's #1 Earning Library — Selling Guides to Work directly
                from zero, Not Courses.
              </p>

              <div className="flex gap-3.5 mt-6 justify-center lg:justify-start items-center">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/goshbuzzllc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:shadow-lg transition-all duration-200 rounded-full inline-block"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="32"
                    height="32"
                    className="rounded-full shadow-xs"
                  >
                    <circle cx="18" cy="18" r="18" fill="#1877F2" />
                    <path
                      d="M22.5 18.8l.6-3.9h-3.7v-2.5c0-1.1.5-2.1 2.2-2.1h1.7V7c-.9-.1-1.9-.2-2.8-.2-2.9 0-4.8 1.8-4.8 5v2.9h-3.4v3.9H15v9.4c.7.1 1.5.2 2.2.2s1.5-.1 2.2-.2v-9.4h3.1z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@goshbuzz?_r=1&_t=ZN-97oFA8Mk5bS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:shadow-lg transition-all duration-200 rounded-full inline-block"
                  aria-label="TikTok"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="32"
                    height="32"
                    className="rounded-full shadow-xs"
                  >
                    <circle cx="18" cy="18" r="18" fill="#000000" />
                    <path
                      d="M22.2 13.8a5.5 5.5 0 0 1-2.8-.9v7.2a4.9 4.9 0 1 1-4.2-4.9v2.8a2.2 2.2 0 1 0 1.5 2.1V9.5h2.8a5.5 5.5 0 0 0 5.5 5.5v-2.8a2.9 2.9 0 0 1-2.8 1.6z"
                      fill="#25F4EE"
                    />
                    <path
                      d="M23 14.5a5.5 5.5 0 0 1-2.8-.9v7.2a4.9 4.9 0 1 1-4.2-4.9v2.8a2.2 2.2 0 1 0 1.5 2.1V10.2h2.8a5.5 5.5 0 0 0 5.5 5.5v-2.8a2.9 2.9 0 0 1-2.8 1.6z"
                      fill="#FE2C55"
                      opacity="0.9"
                    />
                    <path
                      d="M22.6 14.1a5.5 5.5 0 0 1-2.8-.9v7.2a4.9 4.9 0 1 1-4.2-4.9v2.8a2.2 2.2 0 1 0 1.5 2.1V9.8h2.8a5.5 5.5 0 0 0 5.5 5.5v-2.8a2.9 2.9 0 0 1-2.8 1.6z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/goshbuzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:shadow-lg transition-all duration-200 rounded-xl inline-block"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="32"
                    height="32"
                    className="rounded-xl shadow-xs"
                  >
                    <defs>
                      <radialGradient id="footerIgGrad" r="150%" cx="30%" cy="107%">
                        <stop stopColor="#fdf497" offset="0%" />
                        <stop stopColor="#fdf497" offset="5%" />
                        <stop stopColor="#fd5949" offset="45%" />
                        <stop stopColor="#d6249f" offset="60%" />
                        <stop stopColor="#285AEB" offset="90%" />
                      </radialGradient>
                    </defs>
                    <rect width="36" height="36" rx="9" fill="url(#footerIgGrad)" />
                    <circle cx="18" cy="18" r="4.3" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
                    <rect
                      x="8.5"
                      y="8.5"
                      width="19"
                      height="19"
                      rx="5.5"
                      stroke="#FFFFFF"
                      strokeWidth="2.2"
                      fill="none"
                    />
                    <circle cx="23.5" cy="12.5" r="1.3" fill="#FFFFFF" />
                  </svg>
                </a>

                {/* Reddit */}
                <a
                  href="https://www.reddit.com/u/SteakEquivalent8571/s/mODX6W7gTo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:shadow-lg transition-all duration-200 rounded-full inline-block"
                  aria-label="Reddit"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="32"
                    height="32"
                    className="rounded-full shadow-xs"
                  >
                    <circle cx="18" cy="18" r="18" fill="#FF4500" />
                    <path
                      d="M26.5 17.5a2.1 2.1 0 0 0-2.1-2c-.6 0-1.1.2-1.5.6-1.4-1-3.3-1.6-5.3-1.7l.9-4.3 2.9.6a1.5 1.5 0 1 0 1.5-1.5 1.5 1.5 0 0 0-1.4 1l-3.3-.7a.4.4 0 0 0-.4.3l-1.1 5.2c-2.1.1-4 .7-5.4 1.7a2.1 2.1 0 0 0-1.5-.6 2.1 2.1 0 0 0-2.1 2c0 .8.4 1.4 1 1.8a5.5 5.5 0 0 0-.2 1.4c0 3.6 3.9 6.4 8.8 6.4s8.8-2.8 8.8-6.4c0-.5-.1-1-.2-1.4.6-.4 1-1 1-1.8zm-13.4 1a1.5 1.5 0 1 1 1.5 1.5 1.5 1.5 0 0 1-1.5-1.5zm8.7 4.3c-.9.9-2.5 1.2-4.3 1.2s-3.4-.3-4.3-1.2a.4.4 0 0 1 .5-.5c.6.6 2 1 3.8 1s3.2-.4 3.8-1a.4.4 0 0 1 .5.5zm-1.1-2.8a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>

                {/* Quora */}
                <a
                  href="https://www.quora.com/profile/Gosh-Buzz?ch=3&oid=3192845446&share=44e94410&srid=5DG11Y&target_type=user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:shadow-lg transition-all duration-200 rounded-full inline-block"
                  aria-label="Quora"
                >
                  <svg
                    viewBox="0 0 36 36"
                    width="32"
                    height="32"
                    className="rounded-full shadow-xs"
                  >
                    <circle cx="18" cy="18" r="18" fill="#B92B27" />
                    <path
                      d="M24.8 17.5c0-4.1-3.3-7.5-7.3-7.5s-7.3 3.4-7.3 7.5 3.3 7.5 7.3 7.5c.5 0 .9 0 1.4-.1l3.3 3.3a.4.4 0 0 0 .7-.3l-.1-2.9c1.3-1.4 2-3.4 2-5.5zm-7.3 5.1c-2.6 0-4.8-2.3-4.8-5.1s2.2-5.1 4.8-5.1 4.8 2.3 4.8 5.1c0 1.3-.4 2.4-1.1 3.3-.1.1-.1.3-.3.3-.5-.8-1.3-1.4-2.2-1.6a2.8 2.8 0 0 0 .5-1.6c0-1.5-1.2-2.8-2.8-2.8s-2.8 1.3-2.8 2.8 1.2 2.8 2.8 2.8c.4 0 .8-.1 1.1-.3.1 1 .8 1.8 1.6 2.3-.9.6-1.9 1-3 1z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12">
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="text-white font-bold mb-4">{t("quickLinks")}</h3>
                <ul className="space-y-2 flex flex-col items-center lg:items-start">
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-white transition-colors"
                    >
                      {t("aboutUs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-to-pay"
                      className="hover:text-white transition-colors"
                    >
                      {t("howToPay")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/apps"
                      className="hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>{t("apps")}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">Android</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blogs/news"
                      className="hover:text-white transition-colors"
                    >
                      {t("blogs")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-white transition-colors"
                    >
                      {t("contact")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/checkout"
                      className="hover:text-white transition-colors"
                    >
                      {t("cart")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="text-white font-bold mb-4">{t("legal")}</h3>
                <ul className="space-y-2 flex flex-col items-center lg:items-start">
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="hover:text-white transition-colors"
                    >
                      {t("privacyPolicy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-white transition-colors"
                    >
                      {t("terms")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/delivery-policy"
                      className="hover:text-white transition-colors"
                    >
                      {t("deliveryPolicy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/refund-policy"
                      className="hover:text-white transition-colors"
                    >
                      {t("noReturnPolicy")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/disclaimer"
                      className="hover:text-white transition-colors"
                    >
                      {t("disclaimer")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="max-w-xs flex flex-col items-center lg:items-start">
                <h3 className="text-white font-bold mb-4">{t("newsletter")}</h3>
                <p className="text-sm mb-4 text-gray-400">
                  {t("subscribeText")}
                </p>
                <form
                  className="flex flex-col gap-2 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as HTMLFormElement;
                    target.reset();
                    alert(t("subscribedSuccessfully"));
                  }}
                >
                  <input
                    type="email"
                    placeholder={t("enterEmail")}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500 w-full text-center lg:text-left"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full"
                  >
                    {t("subscribe")}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-sm flex flex-col items-center justify-center text-center">
            <div>
              &copy; {new Date().getFullYear()} GoshBuzz. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923126999078"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all z-50 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

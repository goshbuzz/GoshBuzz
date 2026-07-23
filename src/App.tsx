import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { HelmetProvider } from "react-helmet-async";
import { Globe, Moon, Sun, MessageCircle, Menu, X } from "lucide-react";
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
import { CartProvider, useCart } from "./CartContext";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

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
            to="/blogs"
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
            to="/blogs"
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
    const isDark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

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
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/news/:slug" element={<Product />} />
          <Route path="/blogs/news" element={<Blogs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/collection/:type" element={<Collection />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-pay" element={<HowToPay />} />
          <Route path="/delivery-policy" element={<DeliveryPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/checkout" element={<Checkout />} />
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

              <div className="flex gap-4 mt-6 justify-center lg:justify-start">
                <a
                  href="https://www.facebook.com/goshbuzzllc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
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
                  href="https://www.tiktok.com/@goshbuzz?_r=1&_t=ZN-97oFA8Mk5bS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/goshbuzz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="css-i6dzq1"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="https://www.reddit.com/u/SteakEquivalent8571/s/mODX6W7gTo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Reddit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8c2.8 0 5.4.9 6.8 2.6c1.1 1.4 1.2 3.1.2 4.4c-1 1.3-2.9 2-5 2H10c-2.1 0-4-.7-5-2c-1-1.3-.9-3 .2-4.4C6.6 8.9 9.2 8 12 8z" />
                    <path d="M12 8V4m0 0l-2 2m2-2l2 2" />
                    <circle cx="8" cy="12" r="1" />
                    <circle cx="16" cy="12" r="1" />
                    <path d="M10 15c.5.5 1.5.5 2 0" />
                  </svg>
                </a>
                <a
                  href="https://www.quora.com/profile/Gosh-Buzz?ch=3&oid=3192845446&share=44e94410&srid=5DG11Y&target_type=user"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Quora"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M22.476 11.584c0-4.331-3.64-7.844-8.13-7.844s-8.13 3.513-8.13 7.844c0 4.33 3.64 7.843 8.13 7.843.51 0 1.01-.046 1.493-.133l3.58 3.58a.465.465 0 0 0 .795-.33l-.04-3.136c1.428-1.572 2.302-3.666 2.302-5.964zm-8.13 5.4c-2.923 0-5.302-2.422-5.302-5.4s2.379-5.4 5.302-5.4c2.924 0 5.302 2.422 5.302 5.4 0 1.272-.435 2.443-1.168 3.376-.088.088-.172.18-.242.285-.506-.855-1.312-1.488-2.316-1.704a2.91 2.91 0 0 0 .524-1.68c0-1.602-1.304-2.91-2.91-2.91a2.91 2.91 0 0 0-2.91 2.91c0 1.603 1.304 2.91 2.91 2.91.433 0 .84-.096 1.206-.265.176 1.004.81 1.81 1.665 2.316-.905.733-2.076 1.168-3.35 1.168z" />
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
                      to="/blogs"
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

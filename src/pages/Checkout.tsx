import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Trash2, 
  Plus, 
  ShoppingCart, 
  Copy, 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Send, 
  MessageSquare, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { useCart, CartItem } from "../CartContext";
import { useLanguage } from "../LanguageContext";
import { products } from "../data";

export default function Checkout() {
  const { cart, removeFromCart, addToCart, cartTotal, clearCart } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<"easypaisa" | "jazzcash" | null>(null);

  const handleCopy = (text: string, type: "easypaisa" | "jazzcash") => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedText(null);
      setCopiedType(null);
    }, 2000);
  };

  // Find products NOT in the cart to suggest
  const suggestions = products
    .filter((p) => !cart.some((item) => item.id === p.id))
    .slice(0, 4);

  // Generate WhatsApp message
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    const itemLines = cart
      .map((item, index) => `${index + 1}. *${item.title}* (${item.type === "idea" ? "Earning Idea" : "Survival Skill"}) - Rs. ${item.price}`)
      .join("\n");

    const message = `Assalamu Alaikum GoshBuzz! 🇵🇰 I want to buy the following guide(s) from your Earning Library:

📦 *ORDER SUMMARY:*
----------------------------------
${itemLines}

💵 *TOTAL AMOUNT:* Rs. ${cartTotal}
📅 *DATE:* ${new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}

📸 I am attaching the payment screenshot below. Please verify and send me the PDF guide(s) on this WhatsApp number. JazakAllah!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923126999078?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Secure Checkout — GoshBuzz Pakistan</title>
        <meta name="description" content="Securely complete your GoshBuzz order via EasyPaisa or JazzCash." />
        <link rel="canonical" href="https://goshbuzz.com/checkout" />
        <meta property="og:title" content="Secure Checkout — GoshBuzz Pakistan" />
        <meta property="og:description" content="Securely complete your GoshBuzz order via EasyPaisa or JazzCash." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/checkout" />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-amber-500 transition-colors inline-flex items-center gap-1">
          <ArrowLeft size={14} /> {t("home")}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">Checkout</span>
      </nav>

      <div className="text-center md:text-left mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight flex items-center justify-center md:justify-start gap-3">
          <ShoppingCart className="text-amber-500 animate-pulse" size={32} /> Secure Checkout
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          Pakistan's direct library checkout. No accounts or credit cards required. Pay via EasyPaisa / JazzCash and get PDF delivery on WhatsApp.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Select one or more earning guides to start building your online income stream today!
          </p>
          <Link
            to="/"
            className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-500/15"
          >
            Browse Earning Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Cart Items & Add More Suggestions */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Cart Items List */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Your Selected Guides ({cart.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 bg-gray-50 dark:bg-gray-950/40 rounded-xl border border-gray-100 dark:border-gray-800/80 gap-4"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-2xl flex items-center justify-center shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          item.icon
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-150 text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5 uppercase tracking-wider">
                          {item.type === "idea" ? "Earning Idea" : "Survival Skill"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-gray-900 dark:text-gray-100 text-lg">
                        Rs. {item.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                        title="Remove product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order total banner */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                <span className="text-2xl font-black text-amber-500">
                  Rs. {cartTotal}
                </span>
              </div>
            </div>

            {/* Quick Add Suggestions (Allows adding multiple items to checkout) */}
            {suggestions.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Complete Your Library
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                  Expand your skills. Add multiple products directly to your cart in one tap:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestions.map((p) => {
                    const priceVal = p.type === "idea" ? 500 : 200;
                    return (
                      <div
                        key={p.id}
                        className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-xl border border-gray-100 dark:border-gray-800/80 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl shrink-0">{p.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-250 truncate">
                              {p.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                              Rs. {priceVal}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addToCart({
                            id: p.id,
                            title: p.title,
                            type: p.type as "idea" | "skill",
                            price: priceVal,
                            image: p.image,
                            icon: p.icon
                          })}
                          className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                          title="Add to order"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: How to Pay & Checkout Button */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* How to Pay - EasyPaisa & JazzCash Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-800 p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
                <CreditCard className="text-amber-500" size={20} /> How to Pay (ادائیگی کا طریقہ)
              </h2>

              <div className="space-y-4">
                
                {/* EasyPaisa Account Card */}
                <div className="p-4 rounded-xl border border-green-100 dark:border-green-950/40 bg-green-50/20 dark:bg-green-950/5 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      EasyPaisa (ایزی پیسہ)
                    </span>
                    <button
                      onClick={() => handleCopy("03069625437", "easypaisa")}
                      className="text-gray-400 hover:text-green-600 p-1 rounded-md hover:bg-green-100/30 transition-all"
                      title="Copy Account Number"
                    >
                      {copiedType === "easypaisa" ? <Check size={16} className="text-green-600 animate-scale" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Account Number</p>
                    <p className="text-lg font-black text-gray-900 dark:text-gray-50 tracking-wider">0306 962 5437</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Name: <span className="font-bold text-gray-800 dark:text-gray-200">Saulat Nadeem</span></p>
                  </div>
                </div>

                {/* JazzCash Account Card */}
                <div className="p-4 rounded-xl border border-red-100 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/5 relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      JazzCash (جاز کیش)
                    </span>
                    <button
                      onClick={() => handleCopy("03069625437", "jazzcash")}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-100/30 transition-all"
                      title="Copy Account Number"
                    >
                      {copiedType === "jazzcash" ? <Check size={16} className="text-red-600 animate-scale" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">Account Number</p>
                    <p className="text-lg font-black text-gray-900 dark:text-gray-50 tracking-wider">0306 962 5437</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Name: <span className="font-bold text-gray-800 dark:text-gray-200">Saulat Nadeem</span></p>
                  </div>
                </div>

              </div>

              {/* Instructions */}
              <div className="bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-xl border border-amber-100/40 dark:border-amber-900/10 text-left space-y-3">
                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                  ⚠️ Step-by-Step Checkout Instructions:
                </h4>
                <ul className="space-y-2 text-xs text-amber-800 dark:text-amber-400 leading-relaxed list-decimal pl-4 font-medium">
                  <li>Transfer total <strong>Rs. {cartTotal}</strong> to either EasyPaisa or JazzCash account listed above.</li>
                  <li><strong>Take a clear screenshot</strong> of the successful transaction confirmation receipt.</li>
                  <li>Click the WhatsApp button below. It will automatically populate the message with your selected guides.</li>
                  <li><strong>Attach the screenshot</strong> in the WhatsApp chat and send.</li>
                  <li>Get your PDF download files immediately!</li>
                </ul>
              </div>
            </div>

            {/* Receipt Mockup to Screenshot */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white font-extrabold text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Digital Receipt
              </div>
              <div className="space-y-4">
                <div className="text-center pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-black text-gray-900 dark:text-gray-50 tracking-wide">GOSHBUZZ PAKISTAN</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Order ID: {Math.random().toString(36).substring(3, 9).toUpperCase()}</p>
                </div>
                
                <div className="space-y-2 text-xs">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span className="truncate max-w-[200px]">{item.title}</span>
                      <span className="font-bold shrink-0">Rs. {item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-3 text-sm font-black text-gray-900 dark:text-gray-50">
                    <span>TOTAL AMOUNT</span>
                    <span>Rs. {cartTotal}</span>
                  </div>
                </div>

                <div className="pt-2 text-center text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/20 py-2 rounded-lg font-semibold border border-amber-100 dark:border-amber-950/40">
                  🔒 STATUS: PENDING PAYMENT CONFIRMATION
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-4">
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-4.5 bg-[#25D366] text-white hover:bg-[#128C7E] active:scale-95 transition-all rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-500/15"
              >
                <MessageSquare size={22} className="fill-current" />
                <span>Send Screenshot on WhatsApp</span>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Z-Plus Verified Offline Encryption</span>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

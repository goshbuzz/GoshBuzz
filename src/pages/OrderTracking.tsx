import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Package, MapPin, Truck, CheckCircle2 } from "lucide-react";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "found" | "not-found"
  >("idle");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) return;

    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      if (orderId.length > 5) {
        setStatus("found");
      } else {
        setStatus("not-found");
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Track Your Order — GoshBuzz Pakistan</title>
        <meta
          name="description"
          content="Track your GoshBuzz order status. Enter your order ID and email to see the latest updates on your digital delivery."
        />
        <meta
          property="og:title"
          content="Track Your Order — GoshBuzz Pakistan"
        />
        <meta
          property="og:description"
          content="Track your GoshBuzz order status. Enter your order ID and email to see the latest updates on your digital delivery."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/track-order" />
      </Helmet>

      <div className="text-center mb-12">
        <Package className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-4">
          Track Your Order
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Enter your Order ID and the email address used during checkout to view
          your order status.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 mb-8">
        <form
          onSubmit={handleTrack}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. GB-12345"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
              required
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full md:w-auto px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {status === "loading" ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Search size={20} /> Track
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {status === "not-found" && (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl border border-red-100 text-center">
          <p className="font-semibold">Order not found</p>
          <p className="text-sm mt-1">
            Please check your Order ID and Email address and try again.
          </p>
        </div>
      )}

      {status === "found" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Order Number
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {orderId}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 font-semibold rounded-full text-sm">
                Delivered
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Progress Bar Line */}
            <div className="absolute left-[21px] md:left-auto md:top-[21px] top-0 bottom-0 md:bottom-auto md:w-full w-0.5 md:h-0.5 bg-green-500 z-0"></div>

            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                <div className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle2 size={24} />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    Order Placed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 24, 10:00 AM
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                <div className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                  <Package size={20} />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    Processing
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 24, 10:15 AM
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                <div className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                  <Truck size={20} />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    Sent via Email
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 24, 10:30 AM
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                <div className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md">
                  <MapPin size={20} />
                </div>
                <div className="md:text-center">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    Delivered
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Oct 24, 10:30 AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center">
            <p className="text-gray-700 dark:text-gray-300">
              Your digital guide has been delivered to <strong>{email}</strong>.
              Please check your inbox and spam/junk folder.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Having trouble finding it?{" "}
              <a
                href="/contact"
                className="text-amber-600 font-semibold hover:underline"
              >
                Contact Support
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

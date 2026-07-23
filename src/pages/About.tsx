import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>About Us — GoshBuzz Pakistan</title>
        <meta
          name="description"
          content="Learn more about GoshBuzz Pakistan and our mission to provide the best earning guides."
        />
        <meta property="og:title" content="About Us — GoshBuzz Pakistan" />
        <meta
          property="og:description"
          content="Learn more about GoshBuzz Pakistan and our mission to provide the best earning guides."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/about" />
      </Helmet>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          About GoshBuzz
        </h1>
        <p className="mt-4 text-xl text-amber-600 font-medium">
          Pakistan's #1 Online Earning Library — Selling Guides to Work directly
          from zero, Not Courses
        </p>
      </div>

      <div className="space-y-12 text-lg text-gray-600 dark:text-gray-400 text-center md:text-left">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Mission
          </h2>
          <p className="mb-4">
            GoshBuzz was founded with a single mission: to provide actionable,
            step-by-step guidance for Pakistanis looking to navigate the digital
            economy. We believe that financial independence should not be
            blocked by a lack of knowledge or access to the right strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Why We Started
            </h3>
            <p>
              We saw countless people struggling to find legitimate ways to earn
              online in Pakistan. Between complex international payment gateways
              and scattered information, it was too hard for beginners. We
              compiled the exact blueprints that work locally.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              What We Offer
            </h3>
            <p>
              We offer highly focused digital guides — our 30 Earning Ideas and
              30 Survival Skills. Each guide is designed to cut out the fluff
              and give you exactly the steps you need to take action today.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Start Your Digital Journey Today
          </h2>
          <p className="mb-6 text-gray-300">
            Our readers are already building their freelance careers,
            dropshipping stores, and digital businesses. Are you ready to escape
            the matrix?
          </p>
        </div>
      </div>
    </div>
  );
}

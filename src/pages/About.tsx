import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { networkModules, HUB_MODULE } from '../data/networkData';
import { organizationNode, founderNode, breadcrumbNode } from '../data/siteEntity';

export default function About() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://goshbuzz.com/about#webpage",
        "name": "About GoshBuzz",
        "description": "GoshBuzz is a Pakistan-based digital knowledge hub publishing free online earning guides and privacy-first Android apps.",
        "url": "https://goshbuzz.com/about",
        "inLanguage": "en",
        "mainEntity": { "@id": organizationNode["@id"] }
      },
      organizationNode,
      founderNode,
      breadcrumbNode([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>About GoshBuzz — Pakistan Earning Guides & Apps</title>
        <meta
          name="description"
          content="Who runs GoshBuzz, what we publish and how our free online earning guides and Android apps are researched. Founded by Saulat Nadeem."
        />
        <meta property="og:title" content="About GoshBuzz — Pakistan Earning Guides & Apps" />
        <meta
          property="og:description"
          content="Who runs GoshBuzz, what we publish and how our free online earning guides and Android apps are researched. Founded by Saulat Nadeem."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/about" />
        <link rel="canonical" href="https://goshbuzz.com/about" />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <meta property="og:site_name" content="GoshBuzz" />
        <meta property="og:locale" content="en_PK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(aboutSchema)}
        </script>
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

        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The GoshBuzz Network
          </h2>
          <p className="mb-4">
            GoshBuzz operates a family of modules, not just one website.{" "}
            {networkModules.map((module, i) => (
              <span key={module.id}>
                <a
                  href={module.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                >
                  {module.name}
                </a>{" "}
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  ({module.host})
                </span>
                {i < networkModules.length - 1 ? ", " : "."}{" "}
              </span>
            ))}
            FreeConvertio is a product of {HUB_MODULE.host} on its own domain.
            All modules, with logos, are listed on the network page.
          </p>
          <Link
            to="/network"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm shadow-md transition-all"
          >
            Explore the GoshBuzz Network
          </Link>
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

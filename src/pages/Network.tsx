import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHero, thumbnailMosaic } from "../components/PageHero";
import { Link } from 'react-router-dom';
import {
  Globe,
  Layers,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Smartphone,
} from 'lucide-react';
import { FAQ } from '../components/FAQ';
import {
  networkModules,
  networkFaqs,
  HUB_MODULE,
  type NetworkModule,
} from '../data/networkData';

/**
 * Logo with live sync: renders the module's own favicon (hot-linked from the
 * module's domain) so branding stays in sync with each property, with a
 * local `logoFile` override and a styled monogram fallback if the image
 * fails to load.
 */
function ModuleLogo({ module }: { module: NetworkModule }) {
  const [errored, setErrored] = useState(false);
  const initials = module.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (errored) {
    return (
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: module.accent }}
        aria-label={`${module.name} logo`}
      >
        <span className="text-3xl sm:text-4xl font-extrabold text-white">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={module.logoFile || module.faviconUrl}
      alt={`${module.name} logo`}
      title={module.name}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 object-contain bg-white dark:bg-gray-800 p-2"
    />
  );
}

export default function Network() {
  const subdomainCount = networkModules.filter(
    (m) => m.onGoshBuzzDomain,
  ).length;

  // SEO / AEO / GEO structured data. The FAQPage mainEntity is the exact same
  // array rendered by the on-page <FAQ items={networkFaqs} />, so the
  // machine-readable answer always matches the visible answer.
  const networkSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://goshbuzz.com/network#collection",
        "name": "The GoshBuzz Network — Modules & Products of goshbuzz.com",
        "description":
          "The GoshBuzz Network is the family of modules and products operated by GoshBuzz (goshbuzz.com): Little Learn, Proveli, Pakistan Tests Hub, FreeConvertio, Young Scholars PK and Yellow Pages Pakistan, plus the core goshbuzz.com knowledge hub and its Android apps.",
        "url": "https://goshbuzz.com/network",
        "mainEntity": {
          "@type": "ItemList",
          "name": "GoshBuzz Network Modules",
          "itemListElement": networkModules.map((module, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": module.name,
            "url": module.url,
            "description": module.description,
          })),
        },
      },
      {
        "@type": "Organization",
        "@id": "https://goshbuzz.com/#organization",
        "name": "GoshBuzz",
        "url": "https://goshbuzz.com",
        "logo": "https://goshbuzz.com/goshbuzz_logo.jpg",
        "description":
          "GoshBuzz (goshbuzz.com) is a Pakistani digital publisher operating the GoshBuzz Network: a family of product modules including Little Learn, Proveli, Pakistan Tests Hub, FreeConvertio, Young Scholars PK, Yellow Pages Pakistan, the goshbuzz.com knowledge hub, and GoshBuzz Android apps.",
        "sameAs": [
          "https://goshbuzz.com",
          ...networkModules.map((module) => module.url),
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": networkFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://goshbuzz.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "GoshBuzz Network",
            "item": "https://goshbuzz.com/network",
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors pb-4">
      <Helmet>
        <title>
          The GoshBuzz Network — Modules & Products of goshbuzz.com
        </title>
        <meta
          name="description"
          content="The GoshBuzz Network: Little Learn, Proveli, Pakistan Tests Hub, FreeConvertio, Young Scholars PK and Yellow Pages Pakistan — the modules and products of goshbuzz.com, with logos, descriptions and direct links."
        />
        <meta
          name="keywords"
          content="goshbuzz network, goshbuzz modules, goshbuzz products, littlelearn.goshbuzz.com, proveli.goshbuzz.com, pakistantestshub.goshbuzz.com, freeconvertio.com, youngscholarspk.goshbuzz.com, yellowpagespakistan.goshbuzz.com"
        />
        <link rel="canonical" href="https://goshbuzz.com/network" />

        {/* Open Graph */}
        <meta property="og:title" content="The GoshBuzz Network — Modules & Products of goshbuzz.com" />
        <meta property="og:description" content="One publisher, many modules: Little Learn, Proveli, Pakistan Tests Hub, FreeConvertio, Young Scholars PK, Yellow Pages Pakistan and the goshbuzz.com knowledge hub." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goshbuzz.com/network" />
        <meta property="og:image" content="https://goshbuzz.com/goshbuzz_logo.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The GoshBuzz Network" />
        <meta name="twitter:description" content="The modules and products of goshbuzz.com — Little Learn, Proveli, Pakistan Tests Hub, FreeConvertio, Young Scholars PK, Yellow Pages Pakistan." />

        {/* Schema.org JSON-LD (SEO + AEO + GEO) */}
        <script type="application/ld+json">
          {JSON.stringify(networkSchema)}
        </script>
      </Helmet>

      {/* Full-screen Hero Banner */}
      <PageHero
        eyebrow="The GoshBuzz Network"
        eyebrowIcon={Layers}
        icon={Layers}
        title="One GoshBuzz."
        highlight="Many Modules."
        mosaic={thumbnailMosaic(13, 24)}
        subtitle={
          <>
            GoshBuzz is not just a website — it is a network of products. Each module is a standalone site with its own logo and focus, built and operated by the GoshBuzz team under{" "}
            <span className="font-semibold text-white">goshbuzz.com</span>.
          </>
        }
      >
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              {networkModules.length} modules
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              {subdomainCount} goshbuzz.com subdomains
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              1 product domain: freeconvertio.com
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              + Android apps at goshbuzz.com/apps
            </span>
          </div>
      </PageHero>

      {/* Module Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="modules">
        <div className="bg-white dark:bg-gray-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
              <Layers className="w-4 h-4" />
              Network Modules
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              The Modules of GoshBuzz
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
              Logos are synced live from each module's own domain, so this page
              always shows each product's current branding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkModules.map((module) => (
              <a
                key={module.id}
                href={module.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-2xl p-6 hover:border-amber-500/60 transition-all duration-300 shadow-sm hover:shadow-md block"
              >
                {/* accent bar */}
                <span
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: module.accent }}
                  aria-hidden="true"
                />

                <div className="flex items-start gap-4">
                  <ModuleLogo module={module} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: module.accent }}
                      >
                        {module.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        Live
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">
                      {module.host}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {module.tagline}
                </p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {module.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  Visit module
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How the network works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              One Publisher, Many Modules
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Every module on this page is developed, operated and maintained
              by the GoshBuzz team. Each module is a component that does one
              job well — kids' learning, professional services, exam prep,
              free tools, student material, or business directory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Pakistan-First, Everywhere
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether it is a subdomain of goshbuzz.com or a standalone product
              domain like freeconvertio.com, every module is built for
              Pakistani users: local context, local payments, local language
              where it matters.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
              Same Standards, Same Team
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              All network modules follow GoshBuzz standards: privacy-conscious
              design, clean and reliable delivery, transparent policies, and
              the same publisher behind every page. Android apps are listed
              separately at{" "}
              <Link to="/apps" className="text-amber-600 dark:text-amber-400 font-semibold">
                goshbuzz.com/apps
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FreeConvertio — product of goshbuzz.com */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-violet-500/10 via-transparent to-transparent border border-violet-500/40 dark:border-violet-500/30 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src="https://www.freeconvertio.com/favicon.ico"
              alt="FreeConvertio logo"
              loading="lazy"
              className="w-20 h-20 rounded-2xl shadow-md border-2 border-gray-200 dark:border-gray-700 object-contain bg-white dark:bg-gray-800 p-2"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Standalone Product Domain
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                FreeConvertio — a product of goshbuzz.com
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                FreeConvertio runs on its own domain,{" "}
                <span className="font-mono font-semibold">freeconvertio.com</span>,
                instead of a goshbuzz.com subdomain, because it is a
                standalone product. It is one of the modules in the GoshBuzz
                Network — developed and operated by the GoshBuzz team, offering
                free online conversion tools.
              </p>
            </div>
            <a
              href="https://www.freeconvertio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm shadow-md transition-all"
            >
              Open FreeConvertio
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Where to find each module (structured, quotable for AEO/GEO) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="directory">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
              <Globe className="w-4 h-4" />
              Directory
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Where to Find Each GoshBuzz Module
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 pr-4 font-bold">Module</th>
                  <th className="py-3 pr-4 font-bold">Address</th>
                  <th className="py-3 pr-4 font-bold">Hosting</th>
                  <th className="py-3 font-bold">What it does</th>
                </tr>
              </thead>
              <tbody>
                {networkModules.map((module) => (
                  <tr
                    key={module.id}
                    className="border-b border-gray-100 dark:border-gray-800/60"
                  >
                    <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {module.name}
                    </td>
                    <td className="py-3 pr-4">
                      <a
                        href={module.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-amber-600 dark:text-amber-400 hover:underline break-all"
                      >
                        {module.url.replace("https://", "")}
                      </a>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {module.onGoshBuzzDomain
                        ? "goshbuzz.com subdomain"
                        : "own domain (product of goshbuzz.com)"}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">
                      {module.category} — {module.tagline}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    {HUB_MODULE.name}
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      to="/"
                      className="font-mono text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      goshbuzz.com
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    apex domain (the hub)
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    Earning guides, survival skills, blog and Android apps
                    (e.g. EMF Sentinel)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Smartphone className="w-4 h-4 shrink-0" />
            Also part of the network: GoshBuzz Android apps —{" "}
            <Link to="/apps" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
              browse the apps at goshbuzz.com/apps
            </Link>
          </p>
        </div>
      </section>

      {/* Network FAQ (SEO + AEO + GEO) */}
      <FAQ
        items={networkFaqs}
        heading="GoshBuzz Network — FAQs"
        subheading="Straight answers about the GoshBuzz Network: what each module is, how it is hosted, and how it relates to goshbuzz.com."
      />
    </div>
  );
}

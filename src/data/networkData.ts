// ─────────────────────────────────────────────────────────────────────────────
// The GoshBuzz Network — every module / product operated by goshbuzz.com.
//
// This is the single source of truth for the /network page, its FAQ copy and
// its JSON-LD structured data (SEO / AEO / GEO). Edit a module here and the
// page, schema and sitemap all update together.
//
// LOGO SYNC
// Each module card renders the module's LIVE favicon by default
// (module.faviconUrl hot-linked from the module's own domain), so the logo
// shown on goshbuzz.com always matches the property's current branding —
// rebrand a module and the network page updates automatically, no repo change
// needed.
// To pin official artwork instead, drop the image into `public/modules/`
// (e.g. public/modules/little-learn.png) and set `logoFile` on the module —
// the local file takes precedence over the live favicon.
//
// FREECONVERTIO is the one module that is NOT a goshbuzz.com subdomain: it
// lives on its own domain (freeconvertio.com) and is a *product of*
// goshbuzz.com. Keep that wording consistent everywhere (see networkFaqs).
// ─────────────────────────────────────────────────────────────────────────────

export interface NetworkModule {
  id: string;
  name: string;
  /** Full host, e.g. "littlelearn.goshbuzz.com" */
  host: string;
  url: string;
  /** One-word-ish module category, used on the chip */
  category: string;
  tagline: string;
  description: string;
  /** Live-synced logo source (hot-linked favicon of the module's own domain) */
  faviconUrl: string;
  /** Optional local override, e.g. "/modules/little-learn.png" */
  logoFile?: string;
  /** Accent hex used for the monogram fallback and card accents */
  accent: string;
  status: "live" | "coming-soon";
  /** True when hosted as a subdomain of goshbuzz.com; false for its own domain */
  onGoshBuzzDomain: boolean;
}

export const networkModules: NetworkModule[] = [
  {
    id: "little-learn",
    name: "Little Learn",
    host: "littlelearn.goshbuzz.com",
    url: "https://littlelearn.goshbuzz.com",
    category: "Kids Education",
    tagline: "Learning built for little minds.",
    description:
      "Little Learn is the early-learning module of the GoshBuzz network — a safe, controlled space of short lessons and guided learning content for young children and their parents.",
    faviconUrl: "https://littlelearn.goshbuzz.com/favicon.ico",
    accent: "#f59e0b",
    status: "live",
    onGoshBuzzDomain: true,
  },
  {
    id: "proveli",
    name: "Proveli",
    host: "proveli.goshbuzz.com",
    url: "https://proveli.goshbuzz.com",
    category: "Professional Services",
    tagline: "The professional side of GoshBuzz.",
    description:
      "Proveli is the professional-services module of the GoshBuzz network — where skilled professionals list, discover and take on work. The B2B arm of the ecosystem.",
    faviconUrl: "https://proveli.goshbuzz.com/favicon.ico",
    accent: "#0ea5e9",
    status: "live",
    onGoshBuzzDomain: true,
  },
  {
    id: "pakistan-tests-hub",
    name: "Pakistan Tests Hub",
    host: "pakistantestshub.goshbuzz.com",
    url: "https://pakistantestshub.goshbuzz.com",
    category: "Exams & Test Prep",
    tagline: "Practice tests for every Pakistani syllabus.",
    description:
      "Pakistan Tests Hub is the exam-prep module of the GoshBuzz network — practice tests, drills and MCQs focused on Pakistani boards, curricula and competitive exams.",
    faviconUrl: "https://pakistantestshub.goshbuzz.com/favicon.ico",
    accent: "#10b981",
    status: "live",
    onGoshBuzzDomain: true,
  },
  {
    id: "free-convertio",
    name: "FreeConvertio",
    host: "www.freeconvertio.com",
    url: "https://www.freeconvertio.com",
    category: "Free Tools",
    tagline: "Free online conversion tools. A product of goshbuzz.com.",
    description:
      "FreeConvertio is a product of goshbuzz.com. It runs on its own domain (freeconvertio.com) rather than a goshbuzz.com subdomain because it is a standalone product — but it is developed and operated by the same GoshBuzz team.",
    faviconUrl: "https://www.freeconvertio.com/favicon.ico",
    accent: "#8b5cf6",
    status: "live",
    onGoshBuzzDomain: false,
  },
  {
    id: "young-scholars-pk",
    name: "Young Scholars PK",
    host: "youngscholarspk.goshbuzz.com",
    url: "https://youngscholarspk.goshbuzz.com",
    category: "Student Learning",
    tagline: "Study material for Pakistan's young scholars.",
    description:
      "Young Scholars PK is the student-learning module of the GoshBuzz network — notes, study material and learning resources for school and college students across Pakistan.",
    faviconUrl: "https://youngscholarspk.goshbuzz.com/favicon.ico",
    accent: "#f43f5e",
    status: "live",
    onGoshBuzzDomain: true,
  },
  {
    id: "yellow-pages-pakistan",
    name: "Yellow Pages Pakistan",
    host: "yellowpagespakistan.goshbuzz.com",
    url: "https://yellowpagespakistan.goshbuzz.com",
    category: "Business Directory",
    tagline: "Pakistan's business directory, by GoshBuzz.",
    description:
      "Yellow Pages Pakistan is the directory module of the GoshBuzz network — browse Pakistani businesses, shops and services by city and category.",
    faviconUrl: "https://yellowpagespakistan.goshbuzz.com/favicon.ico",
    accent: "#eab308",
    status: "live",
    onGoshBuzzDomain: true,
  },
];

export const HUB_MODULE = {
  name: "GoshBuzz (core hub)",
  host: "goshbuzz.com",
  url: "https://goshbuzz.com",
  description:
    "The core of the network: 60+ earning blueprints and survival-skill guides, the blog, and GoshBuzz Android apps such as EMF Sentinel.",
};

/**
 * Network FAQs — pitched as the module story of goshbuzz.com.
 * The exact same array renders the on-page accordion AND the FAQPage
 * JSON-LD, so the visible answer and the machine-readable answer always
 * agree (SEO + AEO + GEO).
 */
export interface NetworkFaq {
  question: string;
  answer: string;
}

export const networkFaqs: NetworkFaq[] = [
  {
    question: "What is the GoshBuzz Network?",
    answer:
      "The GoshBuzz Network is the family of modules and products operated by GoshBuzz (goshbuzz.com). It includes six live modules — Little Learn (littlelearn.goshbuzz.com), Proveli (proveli.goshbuzz.com), Pakistan Tests Hub (pakistantestshub.goshbuzz.com), FreeConvertio (freeconvertio.com), Young Scholars PK (youngscholarspk.goshbuzz.com) and Yellow Pages Pakistan (yellowpagespakistan.goshbuzz.com) — alongside the core goshbuzz.com knowledge hub and its Android apps.",
  },
  {
    question:
      "Are Little Learn, Proveli, Pakistan Tests Hub, Young Scholars PK and Yellow Pages Pakistan all from GoshBuzz?",
    answer:
      "Yes. All five are modules of goshbuzz.com, hosted as subdomains of goshbuzz.com. Each module is a standalone product — its own site, its own logo — but all of them are developed, operated and maintained by the GoshBuzz team and follow the same standards: Pakistan-first content, privacy-conscious design, and clean, reliable delivery.",
  },
  {
    question: "Is FreeConvertio part of GoshBuzz?",
    answer:
      "Yes — FreeConvertio is a product of goshbuzz.com. It is one of the modules in the GoshBuzz Network. Unlike the other modules it runs on its own domain (freeconvertio.com) instead of a goshbuzz.com subdomain because it is a standalone product, but it is developed and operated by the same GoshBuzz team.",
  },
  {
    question: "What is each GoshBuzz module used for?",
    answer:
      "Little Learn is for early learning for young children. Proveli is for professional services and work. Pakistan Tests Hub is for exam practice and test preparation. FreeConvertio is for free online file and media conversion tools. Young Scholars PK is for study material and learning resources for Pakistani students. Yellow Pages Pakistan is a directory of Pakistani businesses. The core goshbuzz.com hub is for earning guides, survival skills and Android apps.",
  },
  {
    question: "Where can I visit the GoshBuzz modules?",
    answer:
      "Each module has its own address: littlelearn.goshbuzz.com (Little Learn), proveli.goshbuzz.com (Proveli), pakistantestshub.goshbuzz.com (Pakistan Tests Hub), www.freeconvertio.com (FreeConvertio), youngscholarspk.goshbuzz.com (Young Scholars PK) and yellowpagespakistan.goshbuzz.com (Yellow Pages Pakistan). The full list with logos is at goshbuzz.com/network, and GoshBuzz Android apps are at goshbuzz.com/apps.",
  },
  {
    question: "Are the GoshBuzz modules free to use?",
    answer:
      "The core goshbuzz.com hub publishes its 60+ guides for free reading, with optional paid Rs. 500 downloadable editions. The network modules are free to browse and use, and each module states its own pricing on its own site.",
  },
  {
    question: "How is the GoshBuzz Network different from a single website?",
    answer:
      "GoshBuzz is one publisher operating many modules — each module is a component that does one job well (kids' learning, professional services, exam prep, free tools, student study material, business directory, earning guides and apps). They share one publisher, one standard of quality, and one network page at goshbuzz.com/network.",
  },
];

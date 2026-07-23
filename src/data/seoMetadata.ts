export interface OffsiteLink {
  title: string;
  url: string;
  domain: string;
  description: string;
  category: string;
}

export interface InternalSeoLink {
  title: string;
  path: string;
  anchorText: string;
  category: string;
}

export const SHORT_TAIL_KEYWORDS = [
  "free online earning",
  "online earning ideas",
  "earn money online Pakistan",
  "make money online without investment",
  "work from home Pakistan",
  "freelancing in Pakistan",
  "AdSense approval guide",
  "crypto trading Pakistan",
  "passive income 2026",
  "student online earning",
  "JazzCash EasyPaisa withdrawal",
  "digital marketing guide",
  "AI freelancing skills",
  "side hustle Pakistan"
];

export const CATEGORY_LONG_TAIL_KEYWORDS: Record<string, string[]> = {
  "Content Creation": [
    "how to earn money online in Pakistan for students without investment",
    "step by step guide to get Google AdSense approval on WordPress blog",
    "how to build faceless YouTube automation channel using ChatGPT and AI voice",
    "best blogging niches for high CPC AdSense revenue in Pakistan 2026",
    "how to earn from YouTube Shorts and TikTok Creator Rewards program in Pakistan"
  ],
  "Investment": [
    "how to start crypto spot trading on Binance in Pakistan safely",
    "how to buy USDT via Binance P2P using JazzCash EasyPaisa without scam",
    "how to invest in Pakistan Stock Exchange PSX with 5000 PKR initial capital",
    "crypto spot trading vs futures trading risk management guide",
    "best halal stock market investing strategies for beginners in Pakistan"
  ],
  "E-commerce": [
    "how to start eBay dropshipping and Shopify e-commerce business from Pakistan",
    "how to sell digital products on Etsy and Redbubble using Canva templates",
    "Markaz app local dropshipping complete tutorial for beginners in Pakistan",
    "how to run high converting TikTok and Facebook ads for e-commerce products"
  ],
  "Freelancing": [
    "how to get first order on Upwork and Fiverr from Pakistan as a beginner",
    "top high paying freelancing skills to learn in Pakistan 2026",
    "how to offer Amazon virtual assistant services to US and UK clients",
    "how to create Canva templates and sell them on Etsy for passive income",
    "how to file freelance tax return in Pakistan and claim 0.25% IT export rebate"
  ],
  "Tech & AI": [
    "how to make money building AI chatbots and automation workflows for businesses",
    "no-code SaaS development guide for non-technical founders in Pakistan",
    "how to earn money using AI prompt engineering and ChatGPT content creation",
    "Zapier and Make.com automation agency client acquisition strategy"
  ],
  "Marketing": [
    "how to start ad management agency for international clients in US UK",
    "SEO services client pitch template and monthly retainer breakdown",
    "email marketing cold outreach strategy for high ticket client acquisition",
    "social media management pricing packages for local and foreign brands"
  ],
  "Design & Media": [
    "how to earn money doing freelance video editing on Premiere Pro and CapCut",
    "YouTube thumbnail design guide for high CTR and viral clickthrough",
    "podcast audio editing and noise cleanup freelancing service setup",
    "graphic design client portfolio creation using free Canva and Figma tools"
  ],
  "General & Administrative": [
    "how to transfer online earning from Upwork PayPal to JazzCash EasyPaisa",
    "work from home virtual assistant jobs for beginners with no experience",
    "how to avoid online earning scams and fake payment proof websites in Pakistan",
    "remote async work tools Slack Loom Notion productivity guide"
  ]
};

export const OFFSITE_AUTHORITY_LINKS: OffsiteLink[] = [
  {
    title: "Google AdSense Official Portal & Approval Guidelines",
    url: "https://adsense.google.com/start/",
    domain: "adsense.google.com",
    description: "Official Google publisher portal for blog monetization, eligibility criteria, and ad placement rules.",
    category: "Content Creation"
  },
  {
    title: "Google Search Console Developer & SEO Documentation",
    url: "https://developers.google.com/search/docs",
    domain: "developers.google.com",
    description: "Official Google search engine guidelines for webmasters, indexing, structured data, and AEO optimization.",
    category: "Content Creation"
  },
  {
    title: "Upwork Official Resource Hub & Freelacer Academy",
    url: "https://www.upwork.com/resources",
    domain: "upwork.com",
    description: "Official platform guides on profile optimization, proposal writing, and top-rated seller badges.",
    category: "Freelancing"
  },
  {
    title: "Binance Academy Official Crypto Spot Trading Guide",
    url: "https://academy.binance.com/en/articles/what-is-spot-trading",
    domain: "academy.binance.com",
    description: "Authoritative educational resource on cryptocurrency spot trading, risk management, and security protocols.",
    category: "Investment"
  },
  {
    title: "Shopify Official E-Commerce & Dropshipping Academy",
    url: "https://www.shopify.com/blog",
    domain: "shopify.com",
    description: "Official step-by-step guides on online store creation, inventory sourcing, and digital marketing strategies.",
    category: "E-commerce"
  },
  {
    title: "YouTube Official Creator Hub & Monetization Policies",
    url: "https://www.youtube.com/creators",
    domain: "youtube.com",
    description: "Official YouTube policies on channel monetization, Partner Program eligibility, Shorts fund, and copyright rules.",
    category: "Content Creation"
  },
  {
    title: "Canva Design School & Digital Asset Creator Hub",
    url: "https://www.canva.com/designschool/",
    domain: "canva.com",
    description: "Free official design courses on social media graphics, ebook templates, and digital product creation.",
    category: "Design & Media"
  },
  {
    title: "Amazon KDP Official Self-Publishing Portal",
    url: "https://kdp.amazon.com",
    domain: "kdp.amazon.com",
    description: "Official Amazon Kindle Direct Publishing help documentation for ebook and paperback author earnings.",
    category: "Freelancing"
  },
  {
    title: "State Bank of Pakistan (SBP) Freelancer Remittance Guidelines",
    url: "https://www.sbp.org.pk",
    domain: "sbp.org.pk",
    description: "Official regulatory updates regarding foreign remittance, IT export income, and freelancer banking accounts.",
    category: "General & Administrative"
  }
];

export const ONSITE_INTERNAL_CATEGORIES: InternalSeoLink[] = [
  {
    title: "All Free Online Earning Ideas (30 Blueprints)",
    path: "/blogs/news",
    anchorText: "Explore 30 Free Step-by-Step Earning Ideas in Pakistan",
    category: "General"
  },
  {
    title: "Essential Freelance & Digital Survival Skills",
    path: "/",
    anchorText: "Master Top 30 High-Income Digital Skills",
    category: "General"
  },
  {
    title: "Pakistan Payment & Withdrawal Guide (JazzCash/EasyPaisa/Bank)",
    path: "/how-to-pay",
    anchorText: "How to Pay & Withdraw Earning via Local Mobile Wallets",
    category: "General"
  },
  {
    title: "About GoshBuzz Earning Library & Authors",
    path: "/about",
    anchorText: "About GoshBuzz Pakistan Free Online Earning Platform",
    category: "General"
  },
  {
    title: "Contact Support & Custom Guidance",
    path: "/contact",
    anchorText: "Get 1-on-1 Assistance via WhatsApp Support",
    category: "General"
  }
];

import emfIcon from '../assets/images/emf_sentinel_icon.jpg';
import emfBanner from '../assets/images/emf_sentinel_banner.jpg';
import globalBiteIcon from '../assets/images/global_bite_icon.png';
import globalBiteBanner from '../assets/images/global_bite_banner.jpg';

export interface AppFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface AppSpec {
  label: string;
  value: string;
}

export interface AppStep {
  step: number;
  title: string;
  instruction: string;
}

export interface AppHighlight {
  title: string;
  description: string;
  level: string;
}

export interface AppFaq {
  question: string;
  answer: string;
}

export interface AppDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  playStoreUrl: string;
  packageId: string;
  developer: string;
  category: string;
  rating: number;
  reviewsCount: string;
  downloads: string;
  version: string;
  size: string;
  requiresAndroid: string;
  contentRating: string;
  price: string;
  icon: string;
  banner: string;
  screenshots: string[];
  badges: string[];
  interactiveType: 'sensor' | 'recipe';
  keyFeatures: AppFeature[];
  specifications: AppSpec[];
  howToUse: AppStep[];
  safetyGuide: AppHighlight[];
  faqs: AppFaq[];
  seoKeywords: string[];
  aeoSummary: string;
  adMob: {
    publisherId: string;
    appAdsEntry: string;
    appAdsUrl: string;
    status: string;
    certification: string;
  };
}

export const goshbuzzApps: AppDetail[] = [
  {
    id: "emf-sentinel",
    slug: "emf-sentinel",
    name: "EMF Sentinel",
    tagline: "Tactical-Grade Electromagnetic Field Scanner, Wi-Fi Triangulation & RF Spatial Telemetry",
    shortDescription: "Unlock the unseen wireless spectrum around you with EMF Sentinel—a tactical-grade EMF radar scanner, Wi-Fi multilateration solver, and spatial RF dynamics analyzer.",
    fullDescription: "Unlock the unseen wireless spectrum around you with EMF Sentinel—a sophisticated, tactical-grade electromagnetic field (EMF) scanner and spatial RF dynamics analyzer. Designed with an ultra-modern, high-contrast cybernetic theme, EMF Sentinel transforms your mobile device into a powerful telemetry hub for tracking, measuring, and visualizing ambient fields and wireless signals in real time. Features include real-time microTesla (µT) and milliGauss (mG) sensor logging, interactive sweeping polar radar, Cramer's Matrix Wi-Fi multilateration solver, futuristic AR Camera HUD scanner, and Bio-Sync waveform spectral charts.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.goshbuzz.emfsentinel",
    packageId: "com.goshbuzz.emfsentinel",
    developer: "GoshBuzz",
    category: "Tools & Utilities / Sensors",
    rating: 4.9,
    reviewsCount: "500+",
    downloads: "10,000+",
    version: "1.0.4",
    size: "12 MB",
    requiresAndroid: "Android 7.0 (Nougat) and up",
    contentRating: "Everyone",
    price: "Free (100% Free on Google Play)",
    icon: emfIcon,
    banner: emfBanner,
    screenshots: [
      emfBanner,
      emfIcon
    ],
    badges: [
      "Verified on Google Play",
      "Hardware Magnetometer",
      "Wi-Fi Triangulation",
      "AR Camera HUD",
      "100% Offline Sensor",
      "Privacy-First (UMP Compliant)"
    ],
    interactiveType: 'sensor',
    keyFeatures: [
      {
        title: "Real-Time EMF Radar & Magnetic Scanner",
        description: "Log microTesla (µT) and milliGauss (mG) fluctuations in real-time with an active sweeping polar radar and high-frequency audio-visual feedback.",
        iconName: "Radar"
      },
      {
        title: "Wi-Fi Sensing & Signal Triangulation",
        description: "Utilize a live Cramer's Matrix trilateration algorithm to map the spatial coordinates of network routers, access points, and signal attenuation.",
        iconName: "Radio"
      },
      {
        title: "Futuristic AR Camera HUD Scanner",
        description: "Point your camera to see physical devices, targets, and signal hotspots overlaid directly onto your real-world environment with spatial perspective vectors.",
        iconName: "Eye"
      },
      {
        title: "Bio-Sync Waveform Monitor & Spectral Logger",
        description: "Analyze electromagnetic waves, RF frequencies, and ELF sweeps with beautifully rendered spectral charts and environment baseline profiling.",
        iconName: "Gauge"
      },
      {
        title: "Precision Metal & Stud Finder",
        description: "Pinpoint hidden ferromagnetic objects, water pipes, wall studs, screws, and live electrical wiring through drywall, wood, and concrete.",
        iconName: "Magnet"
      },
      {
        title: "Multi-Sensory Warning System",
        description: "Configurable audio pitch beeps, haptic vibration pulses, and flashlight strobe alerts activate instantly when magnetic density exceeds safe limits.",
        iconName: "BellRing"
      }
    ],
    specifications: [
      { label: "App Name", value: "EMF Sentinel" },
      { label: "Package ID", value: "com.goshbuzz.emfsentinel" },
      { label: "Developer", value: "GoshBuzz (Solat Nadeem)" },
      { label: "Official Store", value: "Google Play Store" },
      { label: "Category", value: "Tools / Scientific Sensor Measurement" },
      { label: "Target Sensors", value: "Hardware Magnetometer, Wi-Fi Subsystem, Accelerometer" },
      { label: "Measurement Units", value: "microTesla (µT), milliGauss (mG), RSSI (dBm)" },
      { label: "Earth Magnetic Baseline", value: "≈ 30 μT to 60 μT (Normal ambient range)" },
      { label: "Sampling Rate", value: "Continuous hardware-accelerated 60-100 Hz" },
      { label: "Data Architecture", value: "100% Local processing, Zero data collection (UMP Compliant)" },
      { label: "Verification Status", value: "Developer Verified & IAB app-ads.txt Compliant" }
    ],
    howToUse: [
      {
        step: 1,
        title: "Calibrate Your Phone's Magnetometer",
        instruction: "Open EMF Sentinel and wave your phone in a smooth 'Figure-8' motion in the air for 3-5 seconds to calibrate the internal magnetic sensor against environmental drift."
      },
      {
        step: 2,
        title: "Select Radar, Gauge, or AR HUD Mode",
        instruction: "Choose between the Polar Radar, Analog Dial, Digital XYZ Vector Readout, or AR Camera HUD overlay from the bottom navigation console."
      },
      {
        step: 3,
        title: "Scan Target Surfaces or Electronic Equipment",
        instruction: "Slowly move the top edge of your smartphone close to walls, appliances, or wireless hardware to read real-time magnetic and RF flux."
      },
      {
        step: 4,
        title: "Monitor Reading Spikes & Triangulate",
        instruction: "Normal ambient background reads 30-60 µT. Metal studs and live electrical circuits jump above 100-150 µT, triggering audio-visual cues and coordinate logging."
      }
    ],
    safetyGuide: [
      {
        title: "Safe Ambient Level (30 - 60 μT)",
        description: "Natural geomagnetic field level of the Earth. Normal, safe everyday living environment.",
        level: "Safe"
      },
      {
        title: "Moderate Radiation / Proximity (60 - 150 μT)",
        description: "Common near laptops, smartphones, Wi-Fi routers, smart meters, and low-voltage household appliances.",
        level: "Moderate"
      },
      {
        title: "High Radiation / Metal Proximity (150 - 500+ μT)",
        description: "Indicates close proximity to ferromagnetic metal (screws, pipes, studs) or high-EMF devices like microwave ovens, electric panels, and power supplies.",
        level: "High / Detection"
      }
    ],
    faqs: [
      {
        question: "How does EMF Sentinel detect electromagnetic fields and metals?",
        answer: "EMF Sentinel accesses your smartphone's built-in hardware magnetometer (the sensor used for compass navigation). It measures changes in magnetic flux density (in microTesla μT and milliGauss mG) caused by ferromagnetic metals (like iron and steel) or electromagnetic radiation from live electronics."
      },
      {
        question: "How does the Wi-Fi Sensing & Trilateration feature work?",
        answer: "EMF Sentinel utilizes a live Cramer's Matrix trilateration algorithm that analyzes RSSI dBm signals, path-loss models, and spatial triangulation to estimate the physical coordinates and signal anchors of connected routers and access points."
      },
      {
        question: "Does EMF Sentinel work on any Android phone?",
        answer: "Yes, EMF Sentinel works on any Android phone equipped with a magnetic sensor (magnetometer) running Android 7.0 or higher. Over 95% of modern Android smartphones have this sensor built-in."
      },
      {
        question: "Is EMF Sentinel verified for Google AdMob and IAB Tech Lab app-ads.txt?",
        answer: "Yes. GoshBuzz publishes official app-ads.txt verification records on goshbuzz.com/app-ads.txt in full compliance with Google AdMob and IAB Tech Lab standards for direct developer inventory."
      },
      {
        question: "Can EMF Sentinel detect hidden spy cameras and microphones?",
        answer: "Yes. Spy cameras, covert microphones, and audio bugs contain magnetic coils and electromagnetic circuits. Sweeping EMF Sentinel across smoke detectors, mirrors, and power sockets reveals anomalous magnetic spikes."
      },
      {
        question: "Does EMF Sentinel require an active internet connection?",
        answer: "No. EMF Sentinel runs 100% offline for all sensor and magnetometer diagnostics. It processes data on-device, ensuring complete privacy, zero battery drain from cloud sync, and instant offline usability."
      },
      {
        question: "Is EMF Sentinel free to download on Google Play?",
        answer: "Yes, EMF Sentinel is 100% free to install from the official Google Play Store with no subscription barriers."
      }
    ],
    seoKeywords: [
      "emf sentinel app",
      "emf scanner android",
      "wifi triangulation android",
      "metal detector app google play",
      "goshbuzz apps",
      "best emf meter app",
      "com.goshbuzz.emfsentinel",
      "stud finder app android",
      "hidden camera detector app",
      "magnetic field sensor microtesla",
      "radiation scanner for mobile",
      "admob app ads txt pub-4067724379997931"
    ],
    aeoSummary: "EMF Sentinel is an Android utility app by GoshBuzz (com.goshbuzz.emfsentinel) that converts any smartphone into a tactical electromagnetic field scanner, Wi-Fi trilateration solver, and metal detector. It provides real-time microTesla (µT) telemetry, sweeping polar radar, 3-axis XYZ vectors, AR Camera HUD overlays, and multi-sensory alerts.",
    adMob: {
      publisherId: "pub-4067724379997931",
      appAdsEntry: "google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0",
      appAdsUrl: "https://goshbuzz.com/app-ads.txt",
      status: "Authorized Digital Seller (IAB Spec 1.0)",
      certification: "Google AdMob Direct Inventory Verified"
    }
  },
  {
    id: "global-bite",
    slug: "global-bite",
    name: "Global Bite: World Recipes",
    tagline: "Authentic International Recipes, Step-by-Step Cooking Timers & Smart Meal Planning",
    shortDescription: "Explore authentic cuisines spanning 190+ countries with simultaneous multi-step cooking timers, smart grocery checklists, pantry recipe finder, and 100% offline access.",
    fullDescription: "Welcome to Global Bite – your passport to authentic world cuisines, home-cooked traditions, and hassle-free kitchen adventures! Discover hundreds of handcrafted recipes spanning 190+ countries and cultures. From aromatic Biryani and hand-rolled Tokyo Sushi to sizzling street Tacos and comforting Italian pasta, Global Bite empowers everyday cooks to prepare authentic meals with ease. Features include simultaneous step countdown timers, dynamic serving scalers with instant Metric/Imperial conversions, smart pantry finder to reduce food waste, consolidated weekly meal planning, and an offline-first multilingual recipe database.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.goshbuzz.globalbite",
    packageId: "com.goshbuzz.globalbite",
    developer: "GoshBuzz",
    category: "Food & Drink / Culinary & Lifestyle",
    rating: 5.0,
    reviewsCount: "150+",
    downloads: "500+",
    version: "1.0.3",
    size: "15 MB",
    requiresAndroid: "Android 8.0 (Oreo) and up",
    contentRating: "Everyone",
    price: "Free (100% Free on Google Play)",
    icon: globalBiteIcon,
    banner: globalBiteBanner,
    screenshots: [
      globalBiteBanner,
      globalBiteIcon
    ],
    badges: [
      "Verified on Google Play",
      "190+ Global Cuisines",
      "Simultaneous Multi-Timers",
      "Pantry Recipe Finder",
      "100% Offline Database",
      "Multilingual Support"
    ],
    interactiveType: 'recipe',
    keyFeatures: [
      {
        title: "190+ Authentic Global Cuisines",
        description: "Explore culinary traditions from Asian, Mediterranean, Latin American, Middle Eastern, European, and African regions with origin stories and cultural context.",
        iconName: "Globe"
      },
      {
        title: "Step-by-Step Guide & Multi-Timers",
        description: "Clear guided cooking steps with built-in concurrent countdown timers and background alerts so every dish finishes perfectly.",
        iconName: "Clock"
      },
      {
        title: "Smart Grocery & Ingredient Checklist",
        description: "One-tap syncing from recipes to your organized grocery list, dynamic serving scaler, Metric & Imperial conversions, and ingredient substitutions.",
        iconName: "ShoppingBag"
      },
      {
        title: "\"What Can I Cook?\" Pantry Finder",
        description: "Enter random ingredients from your fridge, and Global Bite instantly suggests matching authentic dishes to minimize food waste.",
        iconName: "ChefHat"
      },
      {
        title: "Weekly Meal Planner & Calendar Export",
        description: "Plan breakfasts, lunches, and dinners day by day, auto-generate consolidated shopping lists, and export your schedule directly to your calendar (.ics).",
        iconName: "Calendar"
      },
      {
        title: "100% Offline-Ready & Multilingual",
        description: "Access your complete offline recipe book and grocery list anywhere with zero internet required. Supports English, Hindi, Urdu, Spanish, Arabic, and Chinese.",
        iconName: "Languages"
      }
    ],
    specifications: [
      { label: "App Name", value: "Global Bite: World Recipes" },
      { label: "Package ID", value: "com.goshbuzz.globalbite" },
      { label: "Developer", value: "GoshBuzz (Solat Nadeem)" },
      { label: "Official Store", value: "Google Play Store" },
      { label: "Category", value: "Food & Drink / Culinary & Lifestyle" },
      { label: "Coverage", value: "190+ Countries & 6 Global Culinary Regions" },
      { label: "Dietary Filters", value: "Halal, Vegan, Vegetarian, High-Protein, Gluten-Free, Low-Carb, Kosher" },
      { label: "Languages Supported", value: "English, हिन्दी (Hindi), اردو (Urdu), Español (Spanish), العربية (Arabic), 中文 (Chinese)" },
      { label: "Database Architecture", value: "100% Offline SQLite database with local image caching" },
      { label: "Timer Engine", value: "Background-safe multi-step concurrent timers with haptic feedback" },
      { label: "Export Capabilities", value: "Calendar (.ics) integration & synchronized shopping checklists" },
      { label: "License", value: "100% Free on Google Play" }
    ],
    howToUse: [
      {
        step: 1,
        title: "Discover Recipes by Region or Pantry",
        instruction: "Browse curated collections by region (Asian, Mediterranean, etc.), filter by dietary needs (Halal, Vegan), or use the Pantry Finder with fridge items."
      },
      {
        step: 2,
        title: "Scale Servings & Sync Ingredients",
        instruction: "Adjust the serving slider to automatically scale ingredient quantities, and tap the checklist to add required items to your grocery list."
      },
      {
        step: 3,
        title: "Cook with Guided Multi-Timers",
        instruction: "Follow crystal-clear instructions and tap timer badges to run simultaneous boiling, baking, and simmering countdowns with background alerts."
      },
      {
        step: 4,
        title: "Plan Your Week & Save Favorites",
        instruction: "Schedule recipes into the weekly meal planner, export to your phone's calendar, and save custom family recipes in your offline cookbook."
      }
    ],
    safetyGuide: [
      {
        title: "Plant-Based & Vegan Friendly",
        description: "100% plant-derived recipes with protein-dense legume, tofu, and whole grain substitutes for healthy vegan dining.",
        level: "Dietary"
      },
      {
        title: "Allergen & Gluten-Free Support",
        description: "Certified gluten-free options and clear substitution guides for nuts, dairy, soy, and common food allergens.",
        level: "Allergen"
      },
      {
        title: "Halal & Kosher Compliant Guides",
        description: "Dedicated filtration and cultural cooking tips adhering strictly to Halal and Kosher dietary preparation standards.",
        level: "Compliance"
      }
    ],
    faqs: [
      {
        question: "Does Global Bite work completely offline?",
        answer: "Yes! Global Bite is built with an offline-first architecture. All recipe databases, cooking instructions, timers, and saved collections are stored locally on your device, requiring zero internet connection in the kitchen."
      },
      {
        question: "How does the 'What Can I Cook?' Pantry Finder work?",
        answer: "Simply check off the ingredients you currently have in your refrigerator or pantry. Global Bite instantly calculates matches across hundreds of world recipes, sorting dishes by highest ingredient match to reduce grocery waste."
      },
      {
        question: "Can I run multiple cooking timers at the same time?",
        answer: "Yes. Global Bite features a simultaneous multi-timer engine. You can run concurrent timers for simmering sauce, roasting vegetables, and boiling pasta, complete with background notifications and haptic alerts."
      },
      {
        question: "Does the app support both Metric and Imperial units?",
        answer: "Yes. You can switch between Metric (grams, milliliters) and Imperial (ounces, cups, pounds) units with a single tap, and scale serving portions dynamically from 1 to 20+ people."
      },
      {
        question: "Which languages are supported in Global Bite?",
        answer: "Global Bite provides complete multilingual interface support in 6 languages: English, हिन्दी (Hindi), اردو (Urdu), Español (Spanish), العربية (Arabic), and 中文 (Chinese)."
      },
      {
        question: "Is Global Bite free to download on Google Play?",
        answer: "Yes, Global Bite: World Recipes is 100% free to install on the official Google Play Store with no hidden paywalls."
      }
    ],
    seoKeywords: [
      "global bite app",
      "world recipes app",
      "authentic cooking guides android",
      "meal planner app google play",
      "com.goshbuzz.globalbite",
      "pantry ingredient finder",
      "offline recipe book android",
      "halal recipe app",
      "cooking timer app",
      "goshbuzz apps"
    ],
    aeoSummary: "Global Bite is an Android culinary application by GoshBuzz (com.goshbuzz.globalbite) that brings authentic recipes from 190+ countries to home cooks. It features concurrent multi-step cooking timers, dynamic serving scaling, smart grocery lists, a fridge pantry recipe matcher, and 100% offline multi-language support.",
    adMob: {
      publisherId: "pub-4067724379997931",
      appAdsEntry: "google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0",
      appAdsUrl: "https://goshbuzz.com/app-ads.txt",
      status: "Authorized Digital Seller (IAB Spec 1.0)",
      certification: "Google AdMob Direct Inventory Verified"
    }
  }
];

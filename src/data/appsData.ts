import emfIcon from '../assets/images/regenerated_image_1787513847291.png';
import emfBanner from '../assets/images/emf_sentinel_banner_1787513383000.jpg';
import goshbuzzLogo from '../assets/images/goshbuzz_logo_1783631495534.jpg';

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
  keyFeatures: {
    title: string;
    description: string;
    iconName: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  howToUse: {
    step: number;
    title: string;
    instruction: string;
  }[];
  safetyGuide: {
    title: string;
    description: string;
    level: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
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
    name: "EMF Sentinel: EMF Scan & Metal Detector",
    tagline: "High-Precision Magnetometer, Radiation Scanner & Hidden Metal Finder",
    shortDescription: "Turn your smartphone into a professional-grade EMF radiation meter, stud finder, and metal detector using your device's built-in magnetometer sensor.",
    fullDescription: "EMF Sentinel: EMF Scan & Metal Detector transforms your Android phone into an advanced scientific instrument for measuring electromagnetic field (EMF) radiation and detecting hidden ferromagnetic metals (iron, steel, studs, and electrical wiring). Powered by hardware-accelerated magnetometer calculations, it delivers real-time flux density readings in microTesla (μT) and milliGauss (mG) with customizable audio-visual alert thresholds.",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.goshbuzz.emfsentinel",
    packageId: "com.goshbuzz.emfsentinel",
    developer: "GoshBuzz Apps",
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
      "No Cloud Tracking",
      "100% Offline Sensor",
      "Real-time 60 FPS Gauge",
      "Privacy-First",
      "Official Developer App"
    ],
    keyFeatures: [
      {
        title: "Precision Metal & Stud Finder",
        description: "Pinpoint hidden ferromagnetic objects, water pipes, wall studs, nails, screws, and buried metals through drywall, wood, and concrete.",
        iconName: "Magnet"
      },
      {
        title: "Real-Time EMF Radiation Meter",
        description: "Monitor electromagnetic field radiation from microwaves, WiFi routers, high-voltage transformers, power lines, and household electronics in real-time microTesla (μT).",
        iconName: "Radio"
      },
      {
        title: "3-Axis Vector Magnetometer (X, Y, Z)",
        description: "Analyze raw flux density across X (lateral), Y (longitudinal), and Z (vertical) spatial axes to triangulate signal origins with pinpoint accuracy.",
        iconName: "Compass"
      },
      {
        title: "Multi-Mode Visual Consoles",
        description: "Switch seamlessly between an analog speedometer dial gauge, high-contrast digital coordinate display, and continuous dynamic waveform graphs.",
        iconName: "Gauge"
      },
      {
        title: "Hidden Camera & Bug Lens Detector",
        description: "Detect covert spy cameras, microphones, and hidden surveillance devices by identifying localized magnetic field spikes emitted by electromagnetic components.",
        iconName: "Eye"
      },
      {
        title: "Multi-Sensory Warning System",
        description: "Configurable audio pitch beeps, haptic vibration pulses, and flashlight strobe alerts activate instantly when magnetic density exceeds safe limits.",
        iconName: "BellRing"
      }
    ],
    specifications: [
      { label: "App Name", value: "EMF Sentinel: EMF Scan - Metal Detector" },
      { label: "Package ID", value: "com.goshbuzz.emfsentinel" },
      { label: "Developer", value: "GoshBuzz Apps (GoshBuzz LLC)" },
      { label: "Official Store", value: "Google Play Store" },
      { label: "Verification Status", value: "Developer Verified & IAB app-ads.txt Compliant" },
      { label: "Target Sensor", value: "Hardware Magnetometer / Hall-Effect Sensor" },
      { label: "Measurement Units", value: "microTesla (μT) & milliGauss (mG)" },
      { label: "Earth Magnetic Baseline", value: "≈ 30 μT to 60 μT (Normal ambient range)" },
      { label: "Sampling Rate", value: "Up to 100 Hz (Hardware-accelerated continuous)" },
      { label: "Required Permissions", value: "Vibration & Flashlight (for alerts). Zero camera or location permissions required." },
      { label: "Data Storage", value: "100% Local processing, Zero data collection" }
    ],
    howToUse: [
      {
        step: 1,
        title: "Calibrate Your Phone's Magnetometer",
        instruction: "Open EMF Sentinel and wave your phone in a smooth 'Figure-8' motion in the air for 3-5 seconds to calibrate the internal magnetic sensor against environmental drift."
      },
      {
        step: 2,
        title: "Choose Your Preferred Scanner Mode",
        instruction: "Select Analog Meter (dial gauge), Digital Readout (X/Y/Z vectors), or Live Graph (waveform history) from the bottom navigation bar."
      },
      {
        step: 3,
        title: "Scan Target Surfaces or Electronic Equipment",
        instruction: "Slowly move the top edge of your smartphone close to the wall, surface, or appliance. The top edge houses the device's magnetic compass sensor for maximum sensitivity."
      },
      {
        step: 4,
        title: "Monitor Reading Spikes & Alerts",
        instruction: "Normal ambient background reads between 30 μT - 60 μT. When approaching metal studs, live wiring, or strong EMF emitters, readings jump above 100 μT triggering haptic and sound alerts."
      }
    ],
    safetyGuide: [
      {
        title: "Safe Ambient Level (30 - 60 μT)",
        description: "Natural geomagnetic field level of the Earth. Normal, safe everyday environment.",
        level: "Safe"
      },
      {
        title: "Moderate Radiation / Proximity (60 - 150 μT)",
        description: "Common near laptops, smartphones, Wi-Fi routers, and low-voltage household appliances.",
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
        question: "How does EMF Sentinel detect metals and EMF radiation?",
        answer: "EMF Sentinel accesses your smartphone's built-in hardware magnetometer (the sensor used for compass navigation). It measures changes in magnetic flux density (in microTesla μT) caused by ferromagnetic metals (like iron and steel) or electromagnetic radiation from live electronics."
      },
      {
        question: "Does EMF Sentinel work on any Android phone?",
        answer: "Yes, EMF Sentinel works on any Android phone equipped with a magnetic sensor (magnetometer). Over 95% of modern Android smartphones have this sensor built-in."
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
        answer: "No. EMF Sentinel runs 100% offline. It does not send any data to external servers, ensuring complete privacy, zero battery drain from network calls, and instant offline usability in remote locations."
      },
      {
        question: "Is EMF Sentinel free to download on Google Play?",
        answer: "Yes, EMF Sentinel is 100% free to install from the official Google Play Store with no hidden subscriptions."
      },
      {
        question: "Can it find studs and pipes inside drywalls?",
        answer: "Yes. Move your phone slowly across the wall. When the sensor passes over drywall screws, steel studs, or iron water pipes, the magnetic reading spikes and triggers the audio-visual indicator."
      }
    ],
    seoKeywords: [
      "emf sentinel app",
      "emf scanner android",
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
    aeoSummary: "EMF Sentinel is an Android utility app by GoshBuzz (com.goshbuzz.emfsentinel) that converts any smartphone with a magnetometer into a high-precision EMF radiation meter and metal detector. It provides real-time microTesla (μT) readings, 3-axis XYZ vectors, analog gauges, live graphs, and audio-vibration alerts for stud finding, appliance radiation checks, and spy camera detection.",
    adMob: {
      publisherId: "pub-4067724379997931",
      appAdsEntry: "google.com, pub-4067724379997931, DIRECT, f08c47fec0942fa0",
      appAdsUrl: "https://goshbuzz.com/app-ads.txt",
      status: "Authorized Digital Seller (IAB Spec 1.0)",
      certification: "Google AdMob Direct Inventory Verified"
    }
  }
];

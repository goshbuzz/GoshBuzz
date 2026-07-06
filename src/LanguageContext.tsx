import React, { createContext, useContext, useState } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: "Home",
    earningIdeas: "Earning Ideas",
    survivalSkills: "Survival Skills",
    cart: "Cart",
    quickLinks: "Quick Links",
    aboutUs: "About Us",
    howToPay: "How to Pay",
    contact: "Contact",
    trackOrder: "Track Order",
    legal: "Legal",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",
    deliveryPolicy: "Delivery Policy",
    noReturnPolicy: "No Return Policy",
    disclaimer: "Disclaimer",
    newsletter: "Newsletter",
    subscribe: "Subscribe",
    subscribeText:
      "Subscribe for updates on new guides and earning opportunities.",
    enterEmail: "Enter your email",
    subscribedSuccessfully: "Subscribed successfully!",
  },
  ur: {
    home: "ہوم",
    earningIdeas: "کمانے کے طریقے",
    survivalSkills: "بقا کی مہارتیں",
    cart: "کارٹ",
    quickLinks: "فوری روابط",
    aboutUs: "ہمارے بارے میں",
    howToPay: "ادائیگی کا طریقہ",
    contact: "رابطہ کریں",
    trackOrder: "آرڈر ٹریک کریں",
    legal: "قانونی",
    privacyPolicy: "رازداری کی پالیسی",
    terms: "شرائط و ضوابط",
    deliveryPolicy: "ترسیل کی پالیسی",
    noReturnPolicy: "واپسی کی پالیسی نہیں",
    disclaimer: "اعلان دستبرداری",
    newsletter: "نیوز لیٹر",
    subscribe: "سبسکرائب کریں",
    subscribeText:
      "نئے گائیڈز اور کمانے کے مواقع پر اپ ڈیٹس کے لیے سبسکرائب کریں۔",
    enterEmail: "اپنا ای میل درج کریں",
    subscribedSuccessfully: "کامیابی سے سبسکرائب ہو گیا!",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("en");

  React.useEffect(() => {
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

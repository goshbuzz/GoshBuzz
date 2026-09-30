import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import emfBanner from "../assets/images/emf_sentinel_banner_1787513383000.jpg";

type Accent = "amber" | "indigo" | "emerald";

interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  to: string;
  ctaLabel: string;
  meta: string[];
  accent: Accent;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "adsense",
    eyebrow: "Content Creation — Masterclass",
    title: "Blogging & Google AdSense Blueprint",
    description:
      "Build a high-RPM niche publication from zero: profitable niche selection, SEO content architecture, and passing publisher review with no policy violations.",
    image:
      "/thumbnails/blogging-adsense-blueprint.webp",
    to: "/blogs/news/blogging-adsense-blueprint",
    ctaLabel: "Read the Blueprint",
    meta: ["12 min read", "High-RPM Niches", "Policy Safe"],
    accent: "amber",
  },
  {
    id: "dropshipping",
    eyebrow: "E-Commerce — Winning Products",
    title: "Local Dropshipping & Supplier Sourcing",
    description:
      "Launch a zero-inventory store built for South Asia — local fulfillment networks, TikTok creative testing, and cash-on-delivery management that actually collects.",
    image:
      "/thumbnails/ebay-dropshipping-guide.webp",
    to: "/blogs/news/ebay-dropshipping-guide",
    ctaLabel: "Read the Blueprint",
    meta: ["15 min read", "Cash on Delivery", "TikTok Ads"],
    accent: "amber",
  },
  {
    id: "youtube",
    eyebrow: "Tech & AI — Automation",
    title: "Faceless YouTube Automation",
    description:
      "Produce scalable video channels with AI scripting, natural neural voiceovers, and automated editing workflows built for global ad revenue.",
    image:
      "/thumbnails/faceless-youtube-automation.webp",
    to: "/blogs/news/faceless-youtube-automation",
    ctaLabel: "Read the Blueprint",
    meta: ["10 min read", "AI Scripts", "Neural Voice"],
    accent: "indigo",
  },
  {
    id: "emf-sentinel",
    eyebrow: "Android Utility — Featured Software",
    title: "EMF Sentinel: EMF Scan & Metal Detector",
    description:
      "Turn your phone's hardware magnetometer into a high-precision radiation scanner and metal detector. 100% offline, privacy-first, zero telemetry.",
    image: emfBanner,
    to: "/apps/emf-sentinel",
    ctaLabel: "View App Specs",
    meta: ["4.9 ★ Rating", "10,000+ Downloads", "100% Offline"],
    accent: "emerald",
  },
  {
    id: "freelancing",
    eyebrow: "Freelancing — Survival Skill",
    title: "Upwork Top Rated & PKR Withdrawals",
    description:
      "Position a profile clients trust, send proposals that convert, then withdraw earnings to Payoneer, SadaPay, NayaPay, or JazzCash without losing margin.",
    image:
      "/thumbnails/freelancing-upwork.webp",
    to: "/blogs/news/freelancing-upwork",
    ctaLabel: "Read the Guide",
    meta: ["Zero Investment", "Payoneer + JazzCash", "Proposal Templates"],
    accent: "indigo",
  },
];

const ACCENTS: Record<Accent, { badge: string; bar: string; glow: string }> = {
  amber: {
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/40",
    bar: "bg-amber-400",
    glow: "from-amber-400/40 to-amber-600/20",
  },
  indigo: {
    badge: "bg-indigo-500/20 text-indigo-200 border-indigo-400/40",
    bar: "bg-indigo-400",
    glow: "from-indigo-400/40 to-indigo-600/20",
  },
  emerald: {
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
    bar: "bg-emerald-400",
    glow: "from-emerald-400/40 to-emerald-600/20",
  },
};

const SLIDE_DURATION = 6000;
const TICK = 50;

export function HeroSlideshow() {
  const total = heroSlides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const jumpTo = useCallback((next: number) => {
    progressRef.current = 0;
    setProgress(0);
    setIndex(((next % total) + total) % total);
  }, [total]);

  const step = useCallback((delta: number) => {
    progressRef.current = 0;
    setProgress(0);
    setIndex((current) => (current + delta + total) % total);
  }, [total]);

  const autoplayStopped = paused || hovered || reducedMotion;

  useEffect(() => {
    if (autoplayStopped) return;
    const timer = window.setInterval(() => {
      progressRef.current += TICK / SLIDE_DURATION;
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        setIndex((current) => (current + 1) % total);
      }
      setProgress(progressRef.current);
    }, TICK);
    return () => window.clearInterval(timer);
  }, [autoplayStopped, total]);

  const accent = ACCENTS[heroSlides[index].accent];

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured GoshBuzz blueprints and utilities"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
      }}
    >
      {/* Ambient accent glow that shifts with the active slide */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-4 sm:-inset-6 rounded-[2.5rem] bg-gradient-to-br blur-3xl opacity-70 transition-all duration-700 ${accent.glow}`}
      />

      <div className="relative h-[430px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden bg-gray-950 border border-gray-200/70 dark:border-gray-800 shadow-2xl">
        {heroSlides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          const slideAccent = ACCENTS[slide.accent];

          return (
            <motion.div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${total}: ${slide.title}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 ${isActive ? "" : "pointer-events-none"}`}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, ease: "easeOut" }}
            >
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading={slideIndex === 0 ? "eager" : "lazy"}
                fetchPriority={slideIndex === 0 ? "high" : "low"}
                initial={false}
                animate={{ scale: isActive && !reducedMotion ? 1.06 : 1 }}
                transition={{
                  duration: reducedMotion ? 0 : SLIDE_DURATION / 1000 + 1,
                  ease: "linear",
                }}
              />

              {/* Legibility scrim — keeps headline contrast high on any photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/70 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${slideAccent.badge}`}
                >
                  {slide.eyebrow}
                </span>

                <h2 className="mt-3 text-xl sm:text-2xl lg:text-[1.75rem] font-extrabold text-white tracking-tight leading-snug">
                  {slide.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl line-clamp-3">
                  {slide.description}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {slide.meta.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Link
                  to={slide.to}
                  tabIndex={isActive ? 0 : -1}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold rounded-xl text-xs sm:text-sm transition-colors shadow-lg"
                >
                  <span>{slide.ctaLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          );
        })}

        {/* Story-style progress rail + autoplay toggle */}
        <div className="absolute inset-x-0 top-0 p-4 sm:p-5 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-1.5">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => jumpTo(slideIndex)}
                aria-label={`Show slide ${slideIndex + 1}: ${slide.title}`}
                aria-current={slideIndex === index}
                className="group flex-1 h-4 flex items-center focus:outline-none"
              >
                <span className="relative block w-full h-1 rounded-full bg-white/25 overflow-hidden group-hover:bg-white/40 group-focus-visible:ring-2 group-focus-visible:ring-white/70 transition-colors">
                  <span
                    className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-75 ease-linear ${accent.bar}`}
                    style={{
                      width:
                        slideIndex < index
                          ? "100%"
                          : slideIndex === index
                            ? `${Math.min(progress, 1) * 100}%`
                            : "0%",
                    }}
                  />
                </span>
              </button>
            ))}
          </div>

          <span className="hidden sm:inline-flex shrink-0 text-[11px] font-bold text-white/80 font-mono tabular-nums bg-gray-950/50 border border-white/15 rounded-full px-2.5 py-1 backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          {/* Controls live in the top rail so they never collide with slide copy */}
          <div className="shrink-0 flex items-center gap-0.5 p-1 rounded-full bg-gray-950/50 border border-white/15 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous slide"
              className="w-7 h-7 rounded-full text-white hover:bg-amber-500 hover:text-gray-950 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className="w-7 h-7 rounded-full text-white hover:bg-amber-500 hover:text-gray-950 flex items-center justify-center transition-colors"
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next slide"
              className="w-7 h-7 rounded-full text-white hover:bg-amber-500 hover:text-gray-950 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

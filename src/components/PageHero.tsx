import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { products } from "../data";

type Accent = "amber" | "indigo" | "emerald" | "rose";

const ACCENT_TEXT: Record<Accent, string> = {
  amber: "from-amber-300 via-amber-400 to-amber-500",
  indigo: "from-indigo-300 via-indigo-400 to-violet-400",
  emerald: "from-emerald-300 via-emerald-400 to-teal-400",
  rose: "from-rose-300 via-rose-400 to-pink-400",
};

const ACCENT_BADGE: Record<Accent, string> = {
  amber: "bg-amber-500/15 text-amber-200 border-amber-400/40",
  indigo: "bg-indigo-500/15 text-indigo-200 border-indigo-400/40",
  emerald: "bg-emerald-500/15 text-emerald-200 border-emerald-400/40",
  rose: "bg-rose-500/15 text-rose-200 border-rose-400/40",
};

const ACCENT_GLOW: Record<Accent, string> = {
  amber: "bg-amber-500",
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
};

/** Deterministic slice of product thumbnails used as a mosaic backdrop. */
export function thumbnailMosaic(offset = 0, count = 18, type?: "idea" | "skill"): string[] {
  const pool = products.filter((p) => !type || p.type === type).map((p) => p.image);
  return Array.from({ length: count }, (_, i) => pool[(offset + i * 7) % pool.length]);
}

interface PageHeroProps {
  title: ReactNode;
  /** Highlighted (gradient) part rendered on a new line after the title. */
  highlight?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  eyebrowIcon?: LucideIcon;
  accent?: Accent;
  /** Single full-bleed background photo. */
  image?: string;
  /** Mosaic of images used as the backdrop when no single image is given. */
  mosaic?: string[];
  /** Large decorative icon shown faintly on the right (legal / utility pages). */
  icon?: LucideIcon;
  /** CTAs / extra content rendered under the subtitle. */
  children?: ReactNode;
  /** Optional right-hand column (e.g. a catalogue image or slideshow). */
  aside?: ReactNode;
  align?: "center" | "left";
  /** Show the aside above the copy on small screens (product catalog image). */
  asideFirstOnMobile?: boolean;
  /** Rendered above the eyebrow (e.g. breadcrumbs). */
  breadcrumb?: ReactNode;
  /** Scroll cue at the bottom of the hero. */
  scrollCue?: boolean;
}

/**
 * Full-viewport hero banner (fills the screen below the 5rem sticky header).
 * Always dark with a layered scrim so the copy stays legible on any backdrop,
 * in both light and dark mode.
 */
export function PageHero({
  title,
  highlight,
  subtitle,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  accent = "amber",
  image,
  mosaic,
  icon: Icon,
  children,
  aside,
  align = aside ? "left" : "center",
  scrollCue,
  breadcrumb,
  asideFirstOnMobile = false,
}: PageHeroProps) {
  const tiles = image ? [] : mosaic ?? thumbnailMosaic();
  const centered = align === "center";

  return (
    <section
      className="relative isolate flex items-center min-h-[calc(100svh-5rem)] overflow-hidden bg-gray-950 text-white"
      data-page-hero
    >
      {/* Backdrop */}
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-30 h-full w-full object-cover scale-110 blur-[2px]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute -inset-[10%] -z-30 grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 rotate-[-8deg] opacity-70"
        >
          {tiles.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              loading={i < 8 ? "eager" : "lazy"}
              className="aspect-square w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}

      {/* Scrims — keep text readable over any image */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gray-950/60" />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-20 ${
          centered
            ? "bg-[radial-gradient(ellipse_at_center,rgba(3,7,18,0.45)_0%,rgba(3,7,18,0.85)_80%)]"
            : "bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/30"
        }`}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-20 h-40 bg-gradient-to-t from-gray-950 to-transparent" />
      <div aria-hidden="true" className={`absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full blur-3xl opacity-25 ${ACCENT_GLOW[accent]}`} />
      <div aria-hidden="true" className="absolute -bottom-40 -right-24 -z-10 h-96 w-96 rounded-full blur-3xl opacity-20 bg-indigo-600" />

      {Icon && (
        <Icon
          aria-hidden="true"
          strokeWidth={1}
          className="pointer-events-none absolute right-[-4rem] top-1/2 -z-10 h-[28rem] w-[28rem] -translate-y-1/2 text-white/[0.06] hidden md:block"
        />
      )}

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div
          className={
            aside
              ? "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
              : ""
          }
        >
          <div
            className={`${aside ? "lg:col-span-7 text-center lg:text-left" : ""} ${
              centered && !aside ? "max-w-4xl mx-auto text-center" : ""
            } ${!centered && !aside ? "max-w-3xl text-left" : ""} space-y-6`}
          >
            {breadcrumb}
            {eyebrow && (
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold backdrop-blur-sm ${ACCENT_BADGE[accent]}`}
              >
                {EyebrowIcon && <EyebrowIcon className="w-4 h-4 shrink-0" />}
                <span>{eyebrow}</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className={`block sm:inline bg-gradient-to-r bg-clip-text text-transparent ${ACCENT_TEXT[accent]}`}>
                    {highlight}
                  </span>
                </>
              )}
            </h1>

            {subtitle && (
              <p
                className={`text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] ${
                  centered && !aside ? "max-w-3xl mx-auto" : "max-w-2xl mx-auto lg:mx-0"
                }`}
              >
                {subtitle}
              </p>
            )}

            {children}
          </div>

          {aside && <div className={`lg:col-span-5 ${asideFirstOnMobile ? "order-first lg:order-none" : ""}`}>{aside}</div>}
        </div>
      </div>

      {(scrollCue ?? !aside) && (
        <div aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <span>Scroll</span>
          <span className="h-9 w-5 rounded-full border-2 border-gray-500 flex justify-center pt-1.5">
            <span className="h-2 w-1 rounded-full bg-amber-400 animate-bounce" />
          </span>
        </div>
      )}
    </section>
  );
}

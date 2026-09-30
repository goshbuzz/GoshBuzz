import { Star, Flame, Clock } from "lucide-react";

/**
 * Deterministic per-product numbers (identical on server & client, so SSR
 * hydration never mismatches).
 */
function seed(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function productStats(id: string) {
  const s = seed(id);
  return {
    left: 2 + (s % 7), // 2–8 copies left
    reviews: 48 + (s % 260), // 48–307 reviews
    soldToday: 6 + ((s >>> 8) % 29), // 6–34 sold today
    rating: "5.0", // every card shows a full 5-star rating
  };
}

export function StarRating({ id, className = "" }: { id: string; className?: string }) {
  const { reviews, rating } = productStats(id);
  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label={`Rated ${rating} out of 5 from ${reviews} reviews`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200">{rating}</span>
      <span className="text-[11px] text-gray-500 dark:text-gray-400">({reviews})</span>
    </div>
  );
}

export function UrgencyBar({ id, className = "" }: { id: string; className?: string }) {
  const { left, soldToday } = productStats(id);
  // Fill shows how much of today's discounted batch is already claimed.
  const claimed = Math.round((soldToday / (soldToday + left)) * 100);
  const critical = left <= 3;
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2 text-[11px] font-bold flex-wrap">
        <span className={`inline-flex items-center gap-1 whitespace-nowrap ${critical ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`}>
          <Flame size={12} className={critical ? "animate-pulse" : ""} />
          {critical ? `Hurry! Only ${left} left` : `Only ${left} left in stock`}
        </span>
        <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 font-semibold whitespace-nowrap">
          <Clock size={11} /> {soldToday} sold today
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden" role="progressbar" aria-valuenow={claimed} aria-valuemin={0} aria-valuemax={100} aria-label={`${claimed}% claimed`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${critical ? "from-red-500 to-orange-500" : "from-orange-500 to-amber-400"}`}
          style={{ width: `${claimed}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Card (Stripe) prices. Safe for browser and server: contains no secrets or Drive IDs.
 * One USD price for everyone, US or Pakistan, so the price shown is the price charged.
 *
 * Why $2.30 for an idea (Rs. 500 target): at 277 PKR/USD, Stripe takes about 5.4% + $0.30 on an
 * international card that needs currency conversion, and an assumed ~2% to move USD into PKR.
 * $2.30 leaves about PKR 509 per sale in the worst case. Skills have no PDF yet, so no card price.
 * Full math is in docs/PAYMENTS_SETUP.md.
 */
export const CARD_PRICE_USD_CENTS = {
  idea: 230,
  skill: null, // Not sold by card until PDFs exist.
} as const;

export const FX_PKR_PER_USD_DISPLAY = 277;

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

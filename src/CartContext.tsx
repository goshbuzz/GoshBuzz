import React, { createContext, useContext, useState, useEffect } from "react";
import { findProductByIdentifier } from "./data";

export interface CartItem {
  id: string;
  title: string;
  type: "idea" | "skill";
  price: number;
  image?: string;
  icon?: string;
  category?: string;
  slug?: string;
}

/**
 * Normalizes cart items from legacy structures (such as items saved with
 * blog-slug identifiers instead of catalog IDs like 'idea-2') and deduplicates
 * them by canonical product ID.
 */
export function normalizeCart(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) return [];

  const seenIds = new Set<string>();
  const normalized: CartItem[] = [];

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;
    const item = raw as Partial<CartItem>;
    const rawId = typeof item.id === "string" ? item.id.trim() : "";
    const rawSlug = typeof item.slug === "string" ? item.slug.trim() : "";
    const identifier = rawId || rawSlug;
    if (!identifier) continue;

    const catalogProduct = findProductByIdentifier(identifier);
    const id = catalogProduct ? catalogProduct.id : rawId;
    if (!id || seenIds.has(id)) continue;
    seenIds.add(id);

    const type: "idea" | "skill" =
      (catalogProduct?.type === "skill" || item.type === "skill") ? "skill" : "idea";

    const defaultPrice = type === "idea" ? 500 : 200;
    const price = typeof item.price === "number" && !Number.isNaN(item.price)
      ? item.price
      : defaultPrice;

    normalized.push({
      id,
      title: catalogProduct?.title || item.title || id,
      type,
      price,
      image: catalogProduct?.image || item.image,
      icon: catalogProduct?.icon || item.icon,
      category: catalogProduct?.category || item.category,
      slug: catalogProduct?.slug || item.slug,
    });
  }

  return normalized;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("goshbuzz_cart");
      if (stored) {
        setCart(normalizeCart(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("goshbuzz_cart", JSON.stringify(cart));
      } catch {}
    }
  }, [cart, mounted]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const [normalized] = normalizeCart([item]);
      if (!normalized) return prev;
      if (prev.some((i) => i.id === normalized.id)) {
        return prev; // Prevent duplicates
      }
      return [...prev, normalized];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

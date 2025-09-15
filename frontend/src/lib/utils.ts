import type { Order } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export const formatPrice = (price: number | string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(price));
  } catch {
    return `$${price}`;
  }
};

export const formatPriceSimple = (price: number) => {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  }
  return `$${price}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculateTotal = (
  items: { price: number; quantity: number }[]
) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const formatOrderNumber = (orderId: number) => {
  return `#${orderId.toString().padStart(6, "0")}`;
};

export const firstLetterUppercase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

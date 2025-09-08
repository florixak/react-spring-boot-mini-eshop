import type { Order } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "PAID":
      return "bg-blue-100 text-blue-800";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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

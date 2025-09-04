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

import type { Order } from "@/types";
import { Package, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { useState } from "react";
import useOrderCalculations from "./useOrderCalculations";
import { SHIPPING_METHODS } from "@/constants";

export const useOrder = (
  order: Order | undefined,
  withCalculations: boolean = true
) => {
  const [isOrderIdCopied, setOrderIdCopied] = useState(false);
  const calculations = useOrderCalculations(
    order?.orderItems ? order.orderItems : [],
    order?.shippingMethod
      ? SHIPPING_METHODS[order.shippingMethod].cost
      : undefined,
    withCalculations
  );

  const getStatusIcon = () => {
    switch (order?.status.toLowerCase()) {
      case "pending":
        return Package;
      case "processing":
        return Package;
      case "paid":
        return CreditCard;
      case "completed":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = () => {
    switch (order?.status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const copyOrderId = async () => {
    try {
      if (!order) return;
      await navigator.clipboard.writeText(`#${order.id}`);
      setOrderIdCopied(true);
      setTimeout(() => setOrderIdCopied(false), 2000);
    } catch {
      console.error("Failed to copy order ID");
    }
  };

  return {
    getStatusIcon,
    getStatusColor,
    copyOrderId,
    isOrderIdCopied,
    calculations,
  };
};

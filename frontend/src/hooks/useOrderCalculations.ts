import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import type { CartItem } from "@/types";

const useOrderCalculations = (
  orderItems: CartItem[],
  shippingFee: number = 0
) => {
  const quantity = orderItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = orderItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : shippingFee;
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;

  return {
    quantity,
    subtotal,
    shipping,
    tax,
    total,
    isFreeShipping,
  };
};

export default useOrderCalculations;

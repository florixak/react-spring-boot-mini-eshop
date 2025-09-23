import type { CartItem } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
  isInCart: (productId: number) => boolean;
  incrementItemQuantity: (productId: number) => void;
  decrementItemQuantity: (productId: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      cartItems: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.product.id === item.product.id
          );

          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            state.cartItems.push(item);
          }
        }),
      removeFromCart: (productId) =>
        set((state) => {
          state.cartItems = state.cartItems.filter(
            (item) => item.product.id !== productId
          );
        }),
      clearCart: () =>
        set((state) => {
          state.cartItems = [];
        }),
      getTotalItems: () =>
        get().cartItems.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      getItemQuantity: (productId) => {
        const item = get().cartItems.find(
          (item) => item.product.id === productId
        );
        return item ? item.quantity : 0;
      },
      isInCart: (productId) =>
        get().cartItems.some((item) => item.product.id === productId),
      updateItemQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.cartItems.find(
            (item) => item.product.id === productId
          );
          if (item) {
            item.quantity = quantity;
          }
        }),
      incrementItemQuantity: (productId) =>
        set((state) => {
          const item = state.cartItems.find(
            (item) => item.product.id === productId
          );
          if (item) {
            item.quantity += 1;
          }
        }),
      decrementItemQuantity: (productId) =>
        set((state) => {
          const item = state.cartItems.find(
            (item) => item.product.id === productId
          );
          if (item && item.quantity > 1) {
            item.quantity -= 1;
          }
        }),
    })),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

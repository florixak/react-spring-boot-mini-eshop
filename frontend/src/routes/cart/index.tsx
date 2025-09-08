import CartContent from "@/components/cart/CartContent";
import CartHeader from "@/components/cart/CartHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/")({
  component: Cart,
});

function Cart() {
  return (
    <>
      <CartHeader />
      <CartContent />
    </>
  );
}

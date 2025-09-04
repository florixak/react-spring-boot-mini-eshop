import CartContent from "@/components/CartContent";
import CartHeader from "@/components/CartHeader";
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

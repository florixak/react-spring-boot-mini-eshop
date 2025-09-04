import CartContent from "@/components/CartContent";
import CartHeader from "@/components/CartHeader";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CartHeader />
      <CartContent />
    </>
  );
}

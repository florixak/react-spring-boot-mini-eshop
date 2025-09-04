import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/checkout/")({
  component: Checkout,
});

function Checkout() {
  return <div></div>;
}

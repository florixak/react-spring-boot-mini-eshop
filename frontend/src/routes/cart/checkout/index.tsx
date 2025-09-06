import CheckoutContent from "@/components/checkout/CheckoutContent";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_STEPS } from "@/constants";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/checkout/")({
  component: Checkout,
  validateSearch: (search) => ({
    step: search.step ? Number(search.step) : 1,
  }),
});

function Checkout() {
  const { step } = Route.useSearch();

  return (
    <>
      <CheckoutHeader currentStep={step} totalSteps={CHECKOUT_STEPS.length} />
      <CheckoutContent step={step} />
    </>
  );
}

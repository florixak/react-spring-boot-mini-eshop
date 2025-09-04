import CheckoutHeader from "@/components/CheckoutHeader";
import CheckoutSteps from "@/components/CheckoutSteps";
import OrderSummary from "@/components/OrderSummary";
import { CHECKOUT_STEPS } from "@/constants";
import { dummyProducts } from "@/dummyData";
import type { OrderItem } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/checkout/")({
  component: Checkout,
  validateSearch: (search) => ({
    step: search.step ? Number(search.step) : 1,
  }),
});

function Checkout() {
  const { step } = Route.useSearch();
  const orderItems: OrderItem[] = [
    {
      id: 1,
      product: dummyProducts[0],
      quantity: 2,
    },
    {
      id: 2,
      product: dummyProducts[1],
      quantity: 1,
    },
  ];

  return (
    <>
      <CheckoutHeader currentStep={step} totalSteps={CHECKOUT_STEPS.length} />
      <div className="flex flex-col md:flex-row justify-center gap-4 px-6 md:px-16 lg:px-36 py-8">
        <div className="mb-8 md:mb-0 w-full md:w-2/3 lg:w-3/4">
          <CheckoutSteps currentStep={step} />
        </div>
        <OrderSummary orderItems={orderItems} />
      </div>
    </>
  );
}

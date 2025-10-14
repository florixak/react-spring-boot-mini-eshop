import CheckoutContent from "@/components/checkout/CheckoutContent";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { CHECKOUT_STEPS } from "@/constants";
import { useUserStore } from "@/stores/useUserStore";
import { createFileRoute, redirect } from "@tanstack/react-router";
import toast from "react-hot-toast";

type CheckoutSearch = {
  step: number;
  order_id?: string;
};

export const Route = createFileRoute("/cart/checkout/")({
  component: Checkout,
  validateSearch: (search): CheckoutSearch => ({
    step: search.step ? Number(search.step) : 1,
    order_id: search.order_id as string | undefined,
  }),
  beforeLoad: ({ search }) => {
    const verified = useUserStore.getState().user?.verified;
    if (!verified) {
      toast.error("Please verify your email to proceed to checkout.");
      throw redirect({
        to: "/cart",
      });
    }
    if (
      (search.step && isNaN(Number(search.step))) ||
      Number(search.step) < 1 ||
      Number(search.step) > CHECKOUT_STEPS.length
    ) {
      throw redirect({ to: "/cart/checkout", search: { step: 1 } });
    }
  },
  loaderDeps: ({ search: { order_id } }) => ({
    order_id,
  }),
  loader: async ({ deps: { order_id } }) => {
    if (order_id) {
      return { orderValid: true };
    }
    return { orderValid: false };
  },
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

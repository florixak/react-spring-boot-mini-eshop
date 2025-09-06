import type { CartItem } from "@/types";
import CheckoutSteps from "../CheckoutSteps";
import OrderSummary from "../OrderSummary";
import ShippingInfoStep from "../ShippingInfoStep";
import { dummyProducts } from "@/dummyData";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PaymentStep from "./PaymentStep";
import { SHIPPING_METHODS } from "@/constants";
import { Route } from "@/routes/cart/checkout";

type CheckoutContentProps = {
  step: number;
};

const orderItems: CartItem[] = [
  {
    product: dummyProducts[2],
    quantity: 2,
  },
  {
    product: dummyProducts[3],
    quantity: 1,
  },
];

const CheckoutContent = ({ step }: CheckoutContentProps) => {
  const navigate = Route.useNavigate();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      shippingMethod: "STANDARD",
    },
  });
  form.watch("shippingMethod");

  const handleShippingSubmit = async () => {
    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
    ]);

    if (isValid) {
      navigate({
        to: "/cart/checkout",
        search: { step: 2 },
        replace: false,
      });
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      const shippingData = form.getValues();

      //window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const getValidStep = (requestedStep: number) => {
    if (requestedStep <= 1) return 1;

    const shippingValid = form.formState.isValid;
    if (requestedStep >= 2 && !shippingValid) return 1;

    return Math.min(requestedStep, 2);
  };

  const validStep = getValidStep(step);

  const renderStepContent = () => {
    switch (validStep) {
      case 1:
        return <ShippingInfoStep form={form} onSubmit={handleShippingSubmit} />;
      case 2:
        return (
          <PaymentStep
            shippingData={form.getValues()}
            isSubmitting={form.formState.isSubmitting}
            cartItems={orderItems}
            onSubmit={handlePaymentSubmit}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CheckoutSteps currentStep={validStep} />
          {renderStepContent()}
        </div>
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={orderItems}
            shippingCost={
              SHIPPING_METHODS[form.getValues().shippingMethod].cost || 0
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;

import type { CartItem } from "@/types";
import CheckoutSteps from "../CheckoutSteps";
import OrderSummary from "../OrderSummary";
import ShippingInfoStep from "../ShippingInfoStep";
import OrderConfirmation from "./OrderConfirmation";
import { dummyProducts } from "@/dummyData";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PaymentStep from "./PaymentStep";
import { SHIPPING_METHODS } from "@/constants";

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
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      // Shipping defaults
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
      // Payment defaults
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });
  form.watch("shippingMethod");

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ShippingInfoStep form={form} />;
      case 2:
        return (
          <PaymentStep
            shippingData={form.getValues()}
            isSubmitting={form.formState.isSubmitting}
            cartItems={orderItems}
            onSubmit={form.handleSubmit((data) => {})}
          />
        );
      case 3:
        return <OrderConfirmation />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CheckoutSteps currentStep={step} />
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

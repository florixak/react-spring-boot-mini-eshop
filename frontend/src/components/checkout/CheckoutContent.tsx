import CheckoutSteps from "./CheckoutSteps";
import { checkoutSchema, type CheckoutFormData } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PaymentStep from "./PaymentStep";
import { SHIPPING_METHODS } from "@/constants";
import { Route } from "@/routes/cart/checkout";
import ShippingInfoStep from "./ShippingInfoStep";
import OrderSummary from "./OrderSummary";
import { useUserStore } from "@/stores/useUserStore";
import { createOrder } from "@/lib/api";
import { useCartStore } from "@/stores/useCartStore";

type CheckoutContentProps = {
  step: number;
};

const CheckoutContent = ({ step }: CheckoutContentProps) => {
  const { user, isAuthenticated } = useUserStore();
  const { cartItems } = useCartStore();
  const navigate = Route.useNavigate();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "",
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

      const {
        data: { checkoutUrl },
      } = await createOrder(
        {
          orderItems: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customerEmail: shippingData.email,
          customerPhone: shippingData.phone,
          paymentMethod: "PAYPAL",
          shippingAddress: `${shippingData.firstName} ${shippingData.lastName}, ${shippingData.address}, ${shippingData.city}, ${shippingData.state}, ${shippingData.postalCode}, ${shippingData.country}`,
        },
        isAuthenticated
      );
      window.location.href = checkoutUrl;
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
            cartItems={cartItems}
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

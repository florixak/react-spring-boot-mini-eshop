import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { CreditCard, Shield, Lock, ArrowLeft } from "lucide-react";
import type { CartItem } from "@/types";
import type { CheckoutFormData } from "@/lib/schema";
import { formatPrice } from "@/lib/utils";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { SHIPPING_METHODS } from "@/constants";
import { Link } from "@tanstack/react-router";

type PaymentStepProps = {
  shippingData: CheckoutFormData;
  cartItems: CartItem[];
  onSubmit: () => void;
  isSubmitting: boolean;
};

const PaymentStep = ({
  shippingData,
  onSubmit,
  isSubmitting,
  cartItems,
}: PaymentStepProps) => {
  const { total } = useOrderCalculations(
    cartItems,
    SHIPPING_METHODS[shippingData.shippingMethod].cost || 0
  );
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-primary font-playfair">
            Shipping Address
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-secondary-200">
            <p className="font-medium">
              {shippingData.firstName} {shippingData.lastName}
            </p>
            <p>{shippingData.address}</p>
            <p>
              {shippingData.city}, {shippingData.state}{" "}
              {shippingData.postalCode}
            </p>
            <p>{shippingData.country}</p>
            <div className="mt-2 pt-2 border-t">
              <p>{shippingData.email}</p>
              <p>{shippingData.phone}</p>
            </div>
          </div>
          <Link to="/cart/checkout" search={{ step: 1 }}>
            <Button
              variant="link"
              className="text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Edit Shipping Info
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="flex items-center text-xl font-bold text-primary font-playfair">
            <CreditCard className="inline-block mr-2" size={24} />
            Secure Payment
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Protected by Stripe
              </span>
            </div>
            <p className="text-sm text-blue-700">
              Your payment is processed securely by Stripe. Your card details
              are never stored on our servers.
            </p>
          </div>

          <div className="flex items-center justify-center space-x-4 py-4 bg-gray-50 rounded-lg">
            <img src="/visa.svg" alt="Visa" className="h-8 opacity-70" />
            <img
              src="/mastercard.svg"
              alt="Mastercard"
              className="h-8 opacity-70"
            />
            <img
              src="/amex.svg"
              alt="American Express"
              className="h-8 opacity-70"
            />
            <span className="text-sm text-secondary-200">+ more</span>
          </div>

          <Button
            onClick={onSubmit}
            className="w-full bg-primary hover:bg-primary/90 py-3"
            disabled={isSubmitting}
          >
            <div className="flex items-center justify-center space-x-2">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Redirecting to payment...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay {formatPrice(total)}</span>
                </>
              )}
            </div>
          </Button>

          <div className="text-center">
            <p className="text-xs text-secondary-200 mb-2">
              You'll be redirected to Stripe to complete your payment securely
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-secondary-200">
              <Lock className="h-3 w-3" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStep;

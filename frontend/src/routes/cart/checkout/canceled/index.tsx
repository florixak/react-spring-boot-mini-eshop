import { createFileRoute } from "@tanstack/react-router";
import { XCircle, ArrowLeft, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/lib/api";

type CheckoutCanceledSearch = {
  orderId?: string;
};

export const Route = createFileRoute("/cart/checkout/canceled/")({
  component: CheckoutCanceled,
  validateSearch: (search): CheckoutCanceledSearch => ({
    orderId: search.orderId as string,
  }),
});

function CheckoutCanceled() {
  const { orderId } = Route.useSearch();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => await fetchOrder(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading order details.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary font-playfair mb-2">
            Payment Canceled
          </h1>
          <p className="text-secondary-200">
            Don't worry! Your order is saved and you can complete payment
            anytime.
          </p>
        </div>

        {orderId && (
          <Card className="mb-6 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Clock className="h-5 w-5" />
                Order Pending Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-200">Order ID:</span>
                  <span className="font-mono text-primary">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-200">Status:</span>
                  <span className="text-orange-600 font-medium">
                    Awaiting Payment
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-md border border-secondary-100">
                <p className="text-xs text-orange-700">
                  <strong>Your order is held for 24 hours.</strong> Complete
                  payment to secure your items.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              What happened?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-sm text-secondary-200">
              <li>• You clicked the back button during payment</li>
              <li>• The payment window was closed</li>
              <li>• Payment was declined by your bank</li>
              <li>• Session timed out</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {orderId ? (
            <Button asChild className="w-full">
              <Link
                to="/cart/checkout"
                search={{
                  step: 2,
                  order_id: orderId,
                }}
              >
                Complete Payment
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link to="/cart/checkout" search={{ step: 1 }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
          )}

          {orderId && (
            <Button variant="outline" asChild className="w-full">
              <Link to="/order/$orderId" params={{ orderId: orderId }}>
                View Order Details
              </Link>
            </Button>
          )}

          <Button variant="outline" asChild className="w-full">
            <Link to="/cart">Back to Cart</Link>
          </Button>
        </div>

        <div className="mt-8 text-xs text-secondary-200">
          <p>Need help? Contact our support team at support@yourstore.com</p>
        </div>
      </div>
    </div>
  );
}

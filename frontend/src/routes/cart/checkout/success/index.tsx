import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/useCartStore";
import { useEffect } from "react";

type CheckoutSuccessSearch = {
  session_id?: string;
  order_id?: string;
};

export const Route = createFileRoute("/cart/checkout/success/")({
  component: CheckoutSuccess,
  validateSearch: (search): CheckoutSuccessSearch => ({
    session_id: search.session_id as string,
    order_id: search.order_id as string,
  }),
  beforeLoad: ({ search }) => {
    if (!search.session_id && !search.order_id) {
      throw redirect({ to: "/cart" });
    }
  },
});

function CheckoutSuccess() {
  const { session_id, order_id } = Route.useSearch();
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex items-center justify-center py-8 px-4 min-h-screen container mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-primary font-playfair mb-2">
            Payment Successful!
          </h1>
          <p className="text-secondary-200">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order_id && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">{order_id}</span>
                </div>
                {session_id && (
                  <div className="flex justify-between">
                    <span>Payment ID:</span>
                    <span className="font-mono">{session_id}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {order_id && (
            <Button asChild className="w-full">
              <Link
                to="/account/orders/$orderId"
                params={{ orderId: order_id }}
              >
                View Order Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}

          <Button variant="outline" asChild className="w-full">
            <Link
              to="/shop"
              search={{
                category: "all",
                sortBy: "no-filter",
                view: "grid",
                query: "",
                price: "0-1000",
                stock: "in-stock",
              }}
            >
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

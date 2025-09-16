import { createFileRoute, redirect } from "@tanstack/react-router";
import { CheckCircle, Package, ArrowRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/stores/useCartStore";
import { useEffect, useState } from "react";

type CheckoutSuccessSearch = {
  sessionId?: string;
  orderId?: string;
};

export const Route = createFileRoute("/cart/checkout/success/")({
  component: CheckoutSuccess,
  validateSearch: (search): CheckoutSuccessSearch => ({
    sessionId: search.sessionId as string,
    orderId: search.orderId as string,
  }),
  beforeLoad: ({ search }) => {
    if (!search.sessionId && !search.orderId) {
      throw redirect({ to: "/cart" });
    }
  },
});

function CheckoutSuccess() {
  const { sessionId, orderId } = Route.useSearch();
  const { clearCart } = useCartStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center justify-center pt-28 px-4 min-h-screen container mx-auto">
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
          <CardContent className="space-y-4">
            {orderId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Order Number
                    </p>
                    <p className="text-lg font-mono font-bold text-green-900">
                      #{orderId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(orderId, "order")}
                    className="border-green-300 text-green-700 hover:bg-green-100 h-8 w-8 p-0"
                  >
                    {copiedField === "order" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Save this number for your records
                </p>
              </div>
            )}
            {sessionId && (
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      Payment Reference
                    </p>
                    <p className="text-sm font-mono text-secondary-800 break-all">
                      {sessionId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(sessionId, "payment")}
                    className="border-secondary-300 text-secondary-600 hover:bg-secondary-100 h-8 w-8 p-0 flex-shrink-0 ml-3"
                  >
                    {copiedField === "payment" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {orderId && (
            <Button asChild className="w-full">
              <Link to="/account/orders/$orderId" params={{ orderId: orderId }}>
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
                page: "1",
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

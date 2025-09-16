import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { cancelOrder, fetchOrder } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/account/orders/$orderId";
import { SHIPPING_METHODS } from "@/constants";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderDetailsItems from "./OrderDetailsItems";
import OrderDetailsSummary from "./OrderDetailsSummary";
import { useUserStore } from "@/stores/useUserStore";

const OrderDetailsPage = () => {
  const { isAuthenticated } = useUserStore();
  const { orderId } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const order = data?.data;

  const queryClient = new QueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => await cancelOrder(Number(orderId), isAuthenticated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: () => {
      alert("Failed to cancel the order. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 px-6 md:px-16 lg:px-28 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-secondary-100 rounded w-1/4"></div>
            <div className="h-64 bg-secondary-100 rounded"></div>
            <div className="h-48 bg-secondary-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-secondary-50 px-6 md:px-16 lg:px-28 py-8 pt-28">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-2">
              Order Not Found
            </h1>
            <p className="text-secondary-200 mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Button variant="outline" asChild>
              <Link to="/account" search={{ section: "orders" }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      mutate();
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 px-6 md:px-16 lg:px-28 py-8 pt-28">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="outline" asChild>
          <Link to="/account" search={{ section: "orders" }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>

        <OrderDetailsHeader order={order} />

        {["pending", "processing", "shipped", "delivered"].includes(
          order.status.toLowerCase()
        ) && (
          <Card className="shadow-sm border-secondary-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Order Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {[
                  { status: "pending", label: "Order Placed", icon: Package },
                  { status: "processing", label: "Processing", icon: Package },
                  { status: "shipped", label: "Shipped", icon: Truck },
                  {
                    status: "delivered",
                    label: "Delivered",
                    icon: CheckCircle,
                  },
                ].map((step, index) => {
                  const isActive = order.status.toLowerCase() === step.status;
                  const isPast =
                    ["pending", "processing", "shipped", "delivered"].indexOf(
                      order.status.toLowerCase()
                    ) > index;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                          isActive || isPast
                            ? "bg-primary text-white"
                            : "bg-secondary-100 text-secondary-300"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isActive ? "text-primary" : "text-secondary-200"
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <OrderDetailsItems orderItems={order.orderItems} />

        <OrderDetailsSummary order={order} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm border-secondary-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="font-medium">Pepa Novák</p>
                <p>Adresa ulice 123</p>
                <p>Město, Kraj 12345</p>
                <p>Česká republika</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-secondary-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-200">Payment Method:</span>
                  <span className="font-medium">
                    {SHIPPING_METHODS[order?.shippingMethod]?.label ||
                      "Standard"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-200">Payment Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1" asChild>
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
          <Button variant="outline" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          {order.status.toLowerCase() === "pending" && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/lib/api";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatDate, formatPrice } from "@/lib/utils";
import { Route } from "@/routes/account/orders/$orderId";

const OrderDetailsPage = () => {
  const { orderId } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">Loading order details...</div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Order not found</p>
          <Link to="/account" search={{ section: "orders" }}>
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Link to="/account" search={{ section: "orders" }}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary font-playfair">
                  Order #{order.id}
                </h1>
                <p className="text-secondary-200">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(order.totalPrice)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {/* Status badge */}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Order Items</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <img
                    src={item.product.imageUrl || "/placeholder.jpg"}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.title}</h3>
                    <p className="text-secondary-200">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <p className="text-sm text-secondary-200">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Billing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>Pepa Novák</p>
                <p>Adresa ulice 123</p>
                <p>Město, Kraj 12345</p>
                <p>Česká republika</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </CardHeader>
            <CardContent>
              <p>{order.paymentMethod}</p>
              <p className="text-secondary-200">Status: {order.status}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

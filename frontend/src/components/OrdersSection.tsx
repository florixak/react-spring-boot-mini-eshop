import type { Order } from "@/types";
import OrderCard from "./OrderCard";
import { Card, CardContent, CardHeader } from "./ui/card";
import { PackageOpen } from "lucide-react";

const OrdersSection = () => {
  const orders: Order[] = [];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary font-playfair">
            Order History
          </h2>
          <p className="text-secondary-200">Track and manage your orders</p>
        </CardHeader>
        <CardContent className="px-4 md:px-8">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center text-secondary-200 py-10">
              <PackageOpen className="mx-auto mb-4 h-12 w-12 text-secondary-300" />
              You have no orders yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersSection;

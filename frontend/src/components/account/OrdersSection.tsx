import type { Order } from "@/types";

import { Card, CardContent, CardHeader } from "../ui/card";
import { PackageOpen } from "lucide-react";
import OrderCard from "../checkout/OrderCard";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api";

const OrdersSection = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: fetchOrders,
  });

  const orders = data?.data;

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
          {!isLoading && orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: Order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : !isLoading && orders && orders.length === 0 ? (
            <div className="text-center text-secondary-200 py-10">
              <PackageOpen className="mx-auto mb-4 h-12 w-12 text-secondary-300" />
              You have no orders yet.
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-red-500">
                Error loading orders. Please try again.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersSection;

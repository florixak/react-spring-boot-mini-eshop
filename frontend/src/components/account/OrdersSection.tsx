import type { Order } from "@/types";

import { Card, CardContent, CardHeader } from "../ui/card";
import { PackageOpen } from "lucide-react";
import OrderCard from "../checkout/OrderCard";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api";
import Pagination from "../Pagination";
import { Route } from "@/routes/account";
import { useUserStore } from "@/stores/useUserStore";
import useObjectPaging from "@/hooks/useObjectPaging";

const OrdersSection = () => {
  const { user } = useUserStore();
  const search = Route.useSearch();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userOrders", user?.id, search.page],
    queryFn: () => fetchOrders({ page: search.page, size: 10 }),
  });
  const { items, totalItems, totalPages, currentPage } = useObjectPaging(
    data?.data
  );

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
          {!isLoading && items && items.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold">
                Your Orders ({totalItems})
              </h3>
              <div className="space-y-4">
                {items.map((order: Order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              <Pagination<{ page: number }>
                currentPage={currentPage}
                totalPages={totalPages}
                getPageSearch={(page) => ({ page })}
              />
            </>
          ) : !isLoading && items && items.length === 0 ? (
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

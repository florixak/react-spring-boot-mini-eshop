import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import ProductStats from "./ProductStats";
import UserStats from "./UserStats";
import OrderStats from "./OrderStats";
import RecentOrders from "./RecentOrders";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats } from "@/lib/api";
import RevenueStats from "./RevenueStats";

const AdminDashboardContent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });

  return (
    <>
      <h1 className="text-3xl font-bold text-primary font-playfair mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          <>
            <div className="h-24 bg-white animate-pulse rounded-lg"></div>
            <div className="h-24 bg-white animate-pulse rounded-lg"></div>
            <div className="h-24 bg-white animate-pulse rounded-lg"></div>
            <div className="h-24 bg-white animate-pulse rounded-lg"></div>
          </>
        ) : isError ? (
          <>
            <div className="h-24 bg-red-300 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-red-300 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-red-300 animate-pulse rounded-lg"></div>
            <div className="h-24 bg-red-300 animate-pulse rounded-lg"></div>
          </>
        ) : (
          <>
            <ProductStats
              totalProducts={data?.data.totalProducts || 0}
              lowStockProducts={data?.data.lowStockProducts || 0}
            />
            <UserStats
              totalUsers={data?.data.totalUsers || 0}
              newUsers={data?.data.newUsers || 0}
            />
            <OrderStats
              totalOrders={data?.data.totalOrders || 0}
              totalPendingOrders={data?.data.totalPendingOrders || 0}
            />
            <RevenueStats totalRevenue={data?.data.totalRevenue || 0} />
          </>
        )}
      </div>

      <Separator className="mb-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrders />
        </CardContent>
      </Card>
    </>
  );
};

export default AdminDashboardContent;

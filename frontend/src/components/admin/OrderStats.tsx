import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

type OrderStatsProps = {
  totalOrders: number;
  totalPendingOrders?: number;
};

const OrderStats = ({ totalOrders, totalPendingOrders }: OrderStatsProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-start py-6">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary">Orders</span>
        </div>
        <div className="text-3xl font-bold text-primary">{totalOrders}</div>
        <div className="text-sm text-secondary-200">
          {totalPendingOrders} pending
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStats;

import { cn, getStatusColor } from "@/lib/utils";
import { Eye, Package } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { Order } from "@/types";

type OrderCardProps = {
  order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div
      key={order.id}
      className="flex items-center justify-between p-1 md:p-4 border border-secondary-100 rounded-lg hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <Package className="h-8 w-8 text-secondary-200" />
        <div>
          <h3 className="font-semibold text-primary">{order.id}</h3>
          <p className="text-sm text-secondary-200">
            {order.created_at} • {order.order_items.length} item
            {order.order_items.length > 1 ? "s" : ""}
          </p>
          <div className="mt-2 flex items-center space-x-2 md:hidden">
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <span className="font-semibold text-primary">
              {order.total_price}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-col md:flex-row">
        <Badge className={cn("hidden md:block", getStatusColor(order.status))}>
          {order.status}
        </Badge>
        <span className="hidden md:block font-semibold text-primary">
          {order.total_price}
        </span>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;

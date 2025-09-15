import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { useOrder } from "@/hooks/useOrder";
import type { Order } from "@/types";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

type OrderDetailsSummaryProps = {
  order: Order;
};

const OrderDetailsSummary = ({ order }: OrderDetailsSummaryProps) => {
  const {
    calculations: { subtotal, shipping, tax, total, isFreeShipping },
  } = useOrder(order);
  return (
    <Card className="shadow-sm border-secondary-100">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-secondary-200">
            Subtotal (
            {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            items)
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary-200">Shipping</span>
          <span className="font-medium">
            {isFreeShipping
              ? `Free (over ${formatPrice(FREE_SHIPPING_THRESHOLD)})`
              : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary-200">Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsSummary;

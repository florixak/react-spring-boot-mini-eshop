import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { Order } from "@/types";

type OrderDetailsItemsProps = {
  orderItems: Order["orderItems"];
};

const OrderDetailsItems = ({ orderItems }: OrderDetailsItemsProps) => {
  return (
    <Card className="shadow-sm border-secondary-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Items ({orderItems.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={item.product.imageUrl || "/placeholder.jpg"}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-secondary-200 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-secondary-200">
                    Unit Price: {formatPrice(item.product.price)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
              {index < orderItems.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsItems;

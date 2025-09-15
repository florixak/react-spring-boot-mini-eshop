import { formatDate, cn, formatPrice, firstLetterUppercase } from "@/lib/utils";
import { Check, Copy, Badge, Download, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import type { Order } from "@/types";
import { useOrder } from "@/hooks/useOrder";

type OrderDetailsHeaderProps = {
  order: Order;
};

const OrderDetailsHeader = ({ order }: OrderDetailsHeaderProps) => {
  const {
    getStatusIcon,
    copyOrderId,
    isOrderIdCopied,
    getStatusColor,
    calculations,
  } = useOrder(order);
  const StatusIcon = getStatusIcon();

  return (
    <Card className="shadow-sm border-secondary-100">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-primary font-playfair">
                Order #{order.id}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyOrderId}
                className="p-1 h-6 w-6"
              >
                {isOrderIdCopied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-secondary-300" />
                )}
              </Button>
            </div>
            <p className="text-secondary-200">
              Placed on {formatDate(order.createdAt)}
            </p>
            <Badge
              className={cn(
                "mt-2 inline-flex items-center gap-1",
                getStatusColor()
              )}
            >
              {<StatusIcon />}
              {firstLetterUppercase(order.status)}
            </Badge>
          </div>

          <div className="text-left md:text-right">
            <p className="text-sm text-secondary-200 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(order.totalPrice)}
            </p>
            <div className="flex md:justify-end gap-2 mt-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Support
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default OrderDetailsHeader;

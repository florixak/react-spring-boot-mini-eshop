import type { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

type OrderSummaryProps = {
  orderItems: {
    product: Product;
    quantity: number;
  }[];
};

const OrderSummary = ({ orderItems }: OrderSummaryProps) => {
  const quantity = orderItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = orderItems
    .reduce((total, item) => total + item.product.price * item.quantity, 0)
    .toFixed(2);
  const shipping = 5.0;
  const tax = (parseFloat(subtotal) * 0.1).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2);

  return (
    <Card className="w-full md:w-1/3 lg:w-1/4 font-playfair">
      <CardHeader className="text-2xl font-semibold text-primary">
        Order Summary
      </CardHeader>
      <CardContent className="space-y-4">
        {orderItems.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-4">
            <img
              src={item.product.image_url}
              alt={item.product.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="text-lg font-semibold text-primary">
                {item.product.title}
              </h4>
              <p className="text-sm text-secondary-200">
                Quantity: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col space-y-2 items-start">
        <Separator className="bg-secondary-100" />
        <div className="w-full flex justify-between text-sm text-primary font-inter">
          <span className="text-secondary-200">
            Subtotal ({quantity} items)
          </span>
          <span className="font-semibold">${subtotal}</span>
        </div>

        <div className="w-full flex justify-between text-sm text-primary font-inter">
          <span className="text-secondary-200">Shipping</span>
          <span className="font-semibold">${shipping}</span>
        </div>

        <div className="w-full flex justify-between text-sm text-primary font-inter">
          <span className="text-secondary-200">Tax (10%)</span>
          <span className="font-semibold">${tax}</span>
        </div>

        <Separator className="bg-secondary-100" />

        <div className="w-full flex justify-between text-lg font-semibold text-primary font-inter">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;

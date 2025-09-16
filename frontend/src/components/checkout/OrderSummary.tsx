import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import useOrderCalculations from "@/hooks/useOrderCalculations";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import { useCartStore } from "@/stores/useCartStore";

type OrderSummaryProps = {
  shippingCost: number;
  isCartPage?: boolean;
};

const OrderSummary = ({ shippingCost, isCartPage }: OrderSummaryProps) => {
  const { cartItems } = useCartStore();
  const { quantity, subtotal, shipping, tax, total, isFreeShipping } =
    useOrderCalculations(cartItems, shippingCost);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <h2 className="text-xl font-bold text-primary font-playfair">
          Order Summary
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center space-x-4">
            <img
              src={item.product.imageUrl}
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
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>

        <div className="w-full flex justify-between text-sm text-primary font-inter">
          <span className="text-secondary-200">Shipping</span>
          {isFreeShipping ? (
            <span className="font-semibold">
              Free (over {formatPrice(FREE_SHIPPING_THRESHOLD)})
            </span>
          ) : (
            <span className="font-semibold">{formatPrice(shipping)}</span>
          )}
        </div>

        <div className="w-full flex justify-between text-sm text-primary font-inter">
          <span className="text-secondary-200">Tax (10%)</span>
          <span className="font-semibold">{formatPrice(tax)}</span>
        </div>

        <Separator className="bg-secondary-100" />

        <div className="w-full flex justify-between text-lg font-semibold text-primary font-inter">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {isCartPage && (
          <div className="flex flex-col w-full mt-2">
            <Separator className="bg-secondary-100 mb-2" />

            <p className="text-secondary-200 text-xs text-center mb-2">
              Shipping calculated at checkout.
            </p>

            <div className="flex flex-col gap-2">
              {cartItems.length === 0 ? (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                  disabled={true}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-3"
                  asChild
                >
                  <Link to="/cart/checkout" search={{ step: 1 }}>
                    Proceed to Checkout
                  </Link>
                </Button>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link
                  to="/shop"
                  search={{
                    category: "all",
                    sortBy: "no-filter",
                    view: "grid",
                    query: "",
                    price: "0-1000",
                    stock: "in-stock",
                    page: "1",
                  }}
                >
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;

import { Link } from "@tanstack/react-router";
import { Lock, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { formatPrice } from "@/lib/utils";
import useOrderCalculations from "@/hooks/useOrderCalculations";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import OrderSummary from "../checkout/OrderSummary";
import { useCartStore } from "@/stores/useCartStore";
import CartItem from "./CartItem";

const CartContent = () => {
  const {
    cartItems,
    incrementItemQuantity,
    decrementItemQuantity,
    updateItemQuantity,
    removeFromCart,
  } = useCartStore();
  const { shipping } = useOrderCalculations(cartItems, 0);

  return (
    <section className="py-12 px-6 md:px-16 lg:px-28 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-primary font-playfair">
                  Items in your cart ({cartItems.length})
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <CartItem
                      key={item.product.id}
                      item={item}
                      onIncrement={() => incrementItemQuantity(item.product.id)}
                      onDecrement={() => decrementItemQuantity(item.product.id)}
                      onUpdateQuantity={updateItemQuantity}
                      onRemove={removeFromCart}
                    />
                  ))
                ) : (
                  <div className="max-w-2xl mx-auto text-center space-y-6 p-4">
                    <ShoppingBag className="h-24 w-24 text-secondary-200 mx-auto" />
                    <h2 className="text-2xl font-bold text-primary font-playfair">
                      Your cart is empty
                    </h2>
                    <p className="text-secondary-200">
                      Add some products to get started!
                    </p>
                    <Button className="bg-primary hover:bg-primary/90" asChild>
                      <Link
                        to="/shop"
                        search={{
                          category: "all",
                          sortBy: "no-filter",
                          view: "grid",
                          query: "",
                          price: "0-1000",
                          stock: "in-stock",
                          page: 1,
                        }}
                      >
                        Start Shopping
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-secondary-200">
                      Secure Checkout
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-secondary-200">
                      Free Shipping {formatPrice(FREE_SHIPPING_THRESHOLD)}+
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <RotateCcw className="h-5 w-5 text-orange-600" />
                    <span className="text-sm text-secondary-200">
                      30-Day Returns
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary shippingCost={shipping} isCartPage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartContent;

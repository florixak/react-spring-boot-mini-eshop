import { Link } from "@tanstack/react-router";
import { Lock, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import type { OrderItem } from "@/types";
import { useEffect, useState } from "react";
import { getCartProducts } from "@/dummyData";
import { formatPrice } from "@/lib/utils";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import CartItem from "../cart/CartItem";

import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import OrderSummary from "../checkout/OrderSummary";

const CartContent = () => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const { shipping } = useOrderCalculations(cartItems, 0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const response = await getCartProducts([1, 2]);
      setCartItems(response);
    };
    fetchCartItems();
  }, []);

  if (cartItems.length === 0) {
    return (
      <section className="py-12 px-6 md:px-16 lg:px-28 min-h-screen bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <ShoppingBag className="h-24 w-24 text-secondary-200 mx-auto" />
          <h2 className="text-2xl font-bold text-primary font-playfair">
            Your cart is empty
          </h2>
          <p className="text-secondary-200">
            Add some products to get started!
          </p>
          <Link
            to="/shop"
            search={{
              category: "all",
              sortBy: "no-filter",
              view: "grid",
              query: "",
              rating: "any-rating",
              price: "0-1000",
              stock: "in-stock",
            }}
          >
            <Button className="bg-primary hover:bg-primary/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const updateQuantity = (id: number, quantity: number) => {};
  const removeItem = (id: number) => {};

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
                {cartItems.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
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
            <OrderSummary
              cartItems={cartItems}
              shippingCost={shipping}
              isCartPage
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartContent;

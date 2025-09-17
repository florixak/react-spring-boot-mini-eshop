import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

const CartHeader = () => {
  return (
    <section className="bg-secondary-50 py-12 pt-24 px-6 md:px-16 lg:px-28">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
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
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-primary font-playfair">
                Shopping Cart
              </h1>
            </div>
            <p className="text-secondary-200 font-playfair">
              Review your items before checkout
            </p>
          </div>

          <div className="w-32 hidden md:block">
            {/* Spacer for centering */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartHeader;

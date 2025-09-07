import ProductCard from "./ProductCard";
import type { Product, View } from "@/types";

import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { useCartStore } from "@/stores/useCartStore";

type ProductsProps = {
  products?: Product[];
  viewMode: View;
  className?: string;
};

const Products = ({ products, viewMode }: ProductsProps) => {
  const { addToCart } = useCartStore();

  return (
    <div className="w-full">
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}
      >
        {products && products.length > 0
          ? products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={addToCart}
              />
            ))
          : Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                className="h-80 p-0 border-secondary-100 rounded-md"
              >
                <Skeleton className="h-full" />
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Products;

import ProductCard from "./ProductCard";
import type { Product, View } from "@/types";

import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "./ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import Pagination from "./Pagination";

import type { ShopSearch } from "@/routes/shop";
import { cn } from "@/lib/utils";

type ProductsProps = {
  products?: Product[] | undefined;
  currentPage?: number;
  totalPages?: number;
  isLoading?: boolean;
  isError?: boolean;
  retry?: () => void;
  viewMode: View;
  className?: string;
  search: ShopSearch;
};

const Products = ({
  products,
  currentPage = 1,
  totalPages = 1,
  isLoading,
  isError,
  retry,
  viewMode,
  className,
  search,
}: ProductsProps) => {
  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (isError) {
    return (
      <div className="w-full">
        <p className="text-center text-red-500">Error loading products.</p>
        {retry && (
          <Button onClick={retry} variant="outline">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if ((!products || products.length === 0) && !isLoading) {
    return (
      <div className="w-full">
        <p className="text-center text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          `grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`,
          className
        )}
      >
        {!isLoading && products
          ? products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={addToCart}
                isInWishlist={isInWishlist(product.id)}
                toggleWishlist={toggleWishlist}
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
      <Pagination<ShopSearch>
        currentPage={currentPage}
        totalPages={totalPages}
        getPageSearch={(page) => ({ ...search, page })}
        to="/shop"
      />
    </div>
  );
};

export default Products;

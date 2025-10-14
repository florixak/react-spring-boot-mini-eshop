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
import { useUserStore } from "@/stores/useUserStore";

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
  const { isAuthenticated } = useUserStore();
  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlist();

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
        {isError && (
          <div className="col-span-full text-center py-20">
            <p className="text-red-500 mb-4">Failed to load products.</p>
            <Button variant="outline" onClick={retry}>
              Retry
            </Button>
          </div>
        )}
        {!isLoading && products
          ? products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                onAddToCart={addToCart}
                isInWishlist={isInWishlist(product.id)}
                toggleWishlist={toggleWishlist}
                isAuthenticated={isAuthenticated}
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
        to="."
      />
    </div>
  );
};

export default Products;

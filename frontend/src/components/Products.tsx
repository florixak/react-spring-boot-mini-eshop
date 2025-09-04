import { getProducts } from "@/dummyData";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import type { Product, View } from "@/types";
import { Route } from "@/routes";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

type ProductsProps = {
  search: ReturnType<typeof Route.useSearch>;
  viewMode: View;
  className?: string;
};

const Products = ({ search, viewMode }: ProductsProps) => {
  const [getPro, setGetPro] = useState<Product[]>([]);
  const { category } = search;

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts({
        categorySlug: category ? category : "all",
        query: search.query ? search.query : "",
        priceRange: search.price
          ? (search.price.split("-").map(Number) as [number, number])
          : [0, 1000],
        inStockOnly: search.stock ? search.stock === "in-stock" : false,
        sortBy: search.sortBy ? search.sortBy : "no-filter",
      });

      setGetPro(fetchedProducts);
    };

    fetchProducts();
  }, [category, search]);

  return (
    <div className="w-full">
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
            : "grid-cols-1 max-w-4xl mx-auto"
        }`}
      >
        {getPro.length > 0
          ? getPro.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
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

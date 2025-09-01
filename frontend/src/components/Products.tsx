import { categories, getProducts } from "@/dummyData";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { Route } from "@/routes";
import { slugify } from "@/lib/utils";

const Products = () => {
  const [getPro, setGetPro] = useState<Product[]>([]);
  const { category, filter } = Route.useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts(
        categories.find((cat) => cat.slug === category)?.id
      );

      setGetPro(fetchedProducts);
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = () => {
    switch (filter) {
      case slugify("Price: Low to High"):
        return [...getPro].sort((a, b) => a.price - b.price);
      case slugify("Price: High to Low"):
        return [...getPro].sort((a, b) => b.price - a.price);
      /*case slugify("Newest Arrivals"):
        return [...getPro].sort((a, b) => b.createdAt - a.createdAt);
      case slugify("Best Rating"):
        return [...getPro].sort((a, b) => b.rating - a.rating);*/
      default:
        return getPro;
    }
  };

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredProducts().map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;

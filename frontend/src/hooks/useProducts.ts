import { fetchProducts, type ProductFilter } from "@/lib/api";
import type { ProductPageResponse, Response } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";

export type ProductSearchParams = {
  category?: string;
  query?: string;
  price?: string;
  stock?: string;
  sortBy?: string;
  page?: string;
};

export const useProducts = (
  search: ProductSearchParams,
  context: "shop" | "home" = "shop"
) => {
  const formatSearchToFilter = (search: ProductSearchParams): ProductFilter => {
    const filter: ProductFilter = {};

    if (search.category && search.category !== "all") {
      filter.categorySlug = search.category;
    }

    if (search.query) {
      filter.search = search.query;
    }

    if (search.price && search.price !== "0-1000") {
      const [minStr, maxStr] = search.price.split("-");
      const minPrice = Number(minStr);
      const maxPrice = Number(maxStr);

      if (!isNaN(minPrice) && minPrice > 0) {
        filter.minPrice = minPrice;
      }
      if (!isNaN(maxPrice) && maxPrice < 1000) {
        filter.maxPrice = maxPrice;
      }
    }

    if (search.stock) {
      if (search.stock === "in-stock") {
        filter.inStock = true;
      } else if (search.stock === "out-of-stock") {
        filter.inStock = false;
      }
    }
    return filter;
  };

  const productFilter = formatSearchToFilter(search);

  const { data, isLoading, isError, refetch } = useQuery<
    Response<ProductPageResponse>
  >({
    queryKey: [context, "products", search],
    queryFn: async () => await fetchProducts(productFilter),
  });

  return {
    products: data?.data.products || [],
    total: data?.data.totalItems || 0,
    totalPages: data?.data.totalPages || 1,
    currentPage: data?.data.page || 1,
    isLoading,
    isError,
    refetch,
  };
};

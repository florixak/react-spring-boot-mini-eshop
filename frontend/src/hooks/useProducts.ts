import { fetchProducts, type ProductFilter } from "@/lib/api";
import type { Product } from "@/types";
import type { PagingObjectResponse, Response } from "@/types/responses";
import { useQuery } from "@tanstack/react-query";
import useObjectPaging from "./useObjectPaging";
import { getDummyProducts, products } from "@/lib/dummyData";

export type ProductSearchParams = {
  category?: string;
  query?: string;
  price?: string;
  stock?: string;
  sortBy?: string;
  page?: number;
  size?: number;
};

export const useProducts = (
  search: ProductSearchParams,
  context: "shop" | "home" | "admin" = "shop"
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

    if (search.page && search.page > 0) {
      filter.page = search.page;
    } else {
      filter.page = 1;
    }

    if (search.size && search.size > 0) {
      filter.size = search.size;
    } else {
      filter.size = 9;
    }

    return filter;
  };

  const productFilter = formatSearchToFilter(search);

  const { data, isLoading, isError, refetch } = useQuery<
    Response<PagingObjectResponse<Product>>
  >({
    queryKey: [context, "products", search],
    queryFn: async () => {
      try {
        return await fetchProducts(productFilter);
      } catch {
        return {
          data: {
            items: getDummyProducts(productFilter),
            totalItems: products.length,
            totalPages: Math.ceil(products.length / 9),
            page: 1,
            size: 9,
          },
        } as Response<PagingObjectResponse<Product>>;
      }
    },
  });

  const { items, totalItems, totalPages, currentPage } =
    useObjectPaging<Product>(data?.data);

  return {
    products: items || products,
    total: totalItems,
    totalPages,
    currentPage,
    isLoading,
    isError,
    refetch,
  };
};

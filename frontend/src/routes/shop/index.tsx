import FilterSidebar from "@/components/shop/FilterSidebar";
import Products from "@/components/Products";
import SectionHeader from "@/components/SectionHeader";
import type { PRODUCT_FILTERS } from "@/constants";
import type { View } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useProducts } from "@/hooks/useProducts";

export type ShopSearch = {
  category: string | "all";
  sortBy: (typeof PRODUCT_FILTERS)[number]["value"];
  view: View;
  query: string;
  price: string;
  stock: string;
  page: number;
};

export const Route = createFileRoute("/shop/")({
  component: Shop,
  validateSearch: (search): ShopSearch => ({
    category: (search.category as string) ?? "all",
    sortBy:
      (search.sortBy as (typeof PRODUCT_FILTERS)[number]["value"]) ??
      "no-filter",
    view: (search.view as View) ?? "grid",
    query: (search.query as string) ?? "",
    price: (search.price as string) ?? "0-1000",
    stock: (search.stock as string) ?? "in-stock",
    page: (search.page as number) ?? 1,
  }),
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { products, isLoading, isError, refetch, totalPages } = useProducts(
    search,
    "shop"
  );

  return (
    <>
      <SectionHeader
        title="Shop All Products"
        description="Discover our complete collection of minimalist home essentials, carefully curated for modern living."
      />
      <section className="flex flex-col lg:flex-row gap-8 px-6 md:px-16 py-12">
        <FilterSidebar search={search} navigate={navigate} />
        <div className="flex-1">
          <Products
            products={products}
            isLoading={isLoading}
            isError={isError}
            retry={refetch}
            viewMode={search.view}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            currentPage={search.page ?? 1}
            totalPages={totalPages}
            search={search}
          />
        </div>
      </section>
    </>
  );
}

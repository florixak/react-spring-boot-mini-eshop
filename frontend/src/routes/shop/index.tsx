import FilterSidebar from "@/components/shop/FilterSidebar";
import Products from "@/components/Products";
import SectionHeader from "@/components/SectionHeader";
import type { PRODUCT_FILTERS } from "@/constants";
import type { categories } from "@/dummyData";
import type { View } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ProductPageResponse, Response } from "@/types/responses";
import { fetchProducts } from "@/lib/api";

type ShopSearch = {
  category: (typeof categories)[number]["slug"];
  sortBy: (typeof PRODUCT_FILTERS)[number]["value"];
  view: View;
  query: string;
  price: string;
  stock: string;
};

export const Route = createFileRoute("/shop/")({
  component: Shop,
  validateSearch: (search): ShopSearch => ({
    category: (search.category as (typeof categories)[number]["slug"]) ?? "all",
    sortBy:
      (search.sortBy as (typeof PRODUCT_FILTERS)[number]["value"]) ??
      "no-filter",
    view: (search.view as View) ?? "grid",
    query: (search.query as string) ?? "",
    price: (search.price as string) ?? "0-1000",
    stock: (search.stock as string) ?? "in-stock",
  }),
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading, isError, refetch } = useQuery<
    Response<ProductPageResponse>
  >({
    queryKey: ["shopProducts", search],
    queryFn: async () => await fetchProducts(search),
  });

  console.log(data);

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
            products={data?.data.products}
            isLoading={isLoading}
            isError={isError}
            retry={refetch}
            viewMode={search.view}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          />
        </div>
      </section>
    </>
  );
}

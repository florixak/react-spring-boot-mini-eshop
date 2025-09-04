import FilterSidebar from "@/components/FilterSidebar";
import Products from "@/components/Products";
import SectionHeader from "@/components/SectionHeader";
import type { PRODUCT_FILTERS, PRODUCT_RATINGS } from "@/constants";
import type { categories } from "@/dummyData";
import type { View } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

type ShopSearch = {
  category: (typeof categories)[number]["slug"];
  sortBy: (typeof PRODUCT_FILTERS)[number]["value"];
  view: View;
  query: string;
  rating: (typeof PRODUCT_RATINGS)[number];
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
    rating: (search.rating as (typeof PRODUCT_RATINGS)[number]) ?? "any-rating",
    price: (search.price as string) ?? "0-1000",
    stock: (search.stock as string) ?? "in-stock",
  }),
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
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
            search={search}
            viewMode={search.view}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          />
        </div>
      </section>
    </>
  );
}

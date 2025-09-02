import CategoryProducts from "@/components/CategoryProducts";
import Hero from "@/components/Hero";
import StayUpdated from "@/components/StayUpdated";
import type { PRODUCT_FILTERS } from "@/constants";
import type { categories } from "@/dummyData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => ({
    category: (search.category as (typeof categories)[number]["slug"]) ?? "all",
    filter: (search.filter as (typeof PRODUCT_FILTERS)[number]) ?? "no-filter",
  }),
});

function Index() {
  return (
    <>
      <Hero />
      <CategoryProducts />
      <StayUpdated />
    </>
  );
}

import CategoryProducts from "@/components/home/CategoryProducts";
import Hero from "@/components/home/Hero";
import StayUpdated from "@/components/home/StayUpdated";
import type { PRODUCT_FILTERS } from "@/constants";
import type { categories } from "@/dummyData";
import type { View } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import LandingImage from "../assets/landing-image4.jpg";

type IndexSearch = {
  category: (typeof categories)[number]["slug"];
  sortBy: (typeof PRODUCT_FILTERS)[number]["value"];
  view: View;
};

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search): IndexSearch => ({
    category: (search.category as (typeof categories)[number]["slug"]) ?? "all",
    sortBy:
      (search.sortBy as (typeof PRODUCT_FILTERS)[number]["value"]) ??
      "no-filter",
    view: (search.view as View) ?? "grid",
  }),
});

function Index() {
  const navigate = Route.useNavigate();
  return (
    <>
      <Hero
        title="Minimal Design,"
        subtitle="Maximum Impact"
        description="Discover our curated collection of minimalist home essentials."
        primaryButton={{
          text: "Shop Collection",
          onClick: () =>
            navigate({
              to: "/shop",
              search: {
                category: "all",
                sortBy: "no-filter",
                view: "grid",
                query: "",
                rating: "any-rating",
                price: "0-1000",
                stock: "in-stock",
              },
            }),
        }}
        secondaryButton={{
          text: "Learn More",
          onClick: () => navigate({ to: "/about" }),
        }}
        image={LandingImage}
      />

      <CategoryProducts title={"Shop By Category"} />
      <StayUpdated />
    </>
  );
}

import CategoryProducts from "@/components/CategoryProducts";
import Hero from "@/components/Hero";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => ({
    category: (search.category as string) ?? "all",
    filter: (search.filter as string) ?? "no-filter",
  }),
});

function Index() {
  return (
    <>
      <Hero />
      <CategoryProducts />
    </>
  );
}

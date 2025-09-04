import { createFileRoute } from "@tanstack/react-router";

type AccountSearch = {
  section: "general" | "orders" | "wishlist" | "settings";
};

export const Route = createFileRoute("/account/")({
  component: RouteComponent,
  validateSearch: (search): AccountSearch => ({
    section: (search.section as AccountSearch["section"]) ?? "general",
  }),
});

function RouteComponent() {
  return <div>Hello "/account/"!</div>;
}

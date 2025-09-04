import AccountContent from "@/components/AccountContent";
import AccountHeader from "@/components/AccountHeader";
import { createFileRoute } from "@tanstack/react-router";

type AccountSearch = {
  section: "profile" | "orders" | "wishlist" | "settings";
};

export const Route = createFileRoute("/account/")({
  component: RouteComponent,
  validateSearch: (search): AccountSearch => ({
    section: (search.section as AccountSearch["section"]) ?? "profile",
  }),
});

function RouteComponent() {
  return (
    <>
      <AccountHeader />
      <AccountContent />
    </>
  );
}

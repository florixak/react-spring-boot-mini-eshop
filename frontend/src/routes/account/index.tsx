import AccountContent from "@/components/AccountContent";
import AccountHeader from "@/components/AccountHeader";
import { createFileRoute } from "@tanstack/react-router";

type AccountSearch = {
  section: "profile" | "orders" | "wishlist" | "settings";
};

export const Route = createFileRoute("/account/")({
  component: Account,
  validateSearch: (search): AccountSearch => ({
    section: (search.section as AccountSearch["section"]) ?? "profile",
  }),
});

function Account() {
  return (
    <>
      <AccountHeader />
      <AccountContent />
    </>
  );
}

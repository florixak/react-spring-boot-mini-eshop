import AccountContent from "@/components/account/AccountContent";
import AccountHeader from "@/components/account/AccountHeader";
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

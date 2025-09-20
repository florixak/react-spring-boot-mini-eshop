import AccountContent from "@/components/account/AccountContent";
import AccountHeader from "@/components/account/AccountHeader";
import useAuthCheck from "@/hooks/useAuthCheck";
import { createFileRoute } from "@tanstack/react-router";

type AccountSearch = {
  section: "profile" | "orders" | "settings" | "wishlist";
  page?: number;
};

export const Route = createFileRoute("/account/")({
  component: Account,
  validateSearch: (search): AccountSearch => ({
    section: (search.section as AccountSearch["section"]) ?? "profile",
    page: search.page ? Number(search.page) : undefined,
  }),
});

function Account() {
  const { isAuthenticated } = useAuthCheck();
  const navigate = Route.useNavigate();

  if (!isAuthenticated) {
    navigate({
      to: "/auth",
      search: { mode: "login", redirectTo: "/account" },
    });
    return null;
  }

  return (
    <>
      <AccountHeader />
      <AccountContent />
    </>
  );
}

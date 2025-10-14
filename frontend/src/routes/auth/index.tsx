import AuthContent from "@/components/auth/AuthContent";
import { useUserStore } from "@/stores/useUserStore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: Auth,
  validateSearch: (search) => {
    const mode =
      (search.mode as
        | "login"
        | "register"
        | "forgot-password"
        | "verify-email") ?? "login";

    const result: {
      mode: "login" | "register" | "forgot-password" | "verify-email";
      redirectTo?: string;
      email?: string;
    } = { mode };

    if (search.redirectTo) result.redirectTo = String(search.redirectTo);
    if (search.email) result.email = String(search.email);

    return result;
  },
  beforeLoad: async (params) => {
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    const mode = params.search.mode;
    if (isAuthenticated && mode !== "verify-email") {
      throw redirect({
        to: "/account",
        search: {
          section: "profile",
        },
      });
    }
  },
});

function Auth() {
  return (
    <>
      <AuthContent />
    </>
  );
}

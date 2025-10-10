import AuthContent from "@/components/auth/AuthContent";
import { createFileRoute } from "@tanstack/react-router";

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
});

function Auth() {
  return (
    <>
      <AuthContent />
    </>
  );
}

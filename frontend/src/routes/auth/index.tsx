import AuthContent from "@/components/auth/AuthContent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: Auth,
  validateSearch: (search) => ({
    mode: (search.mode as "login" | "register" | "forgot-password") ?? "login",
    redirectTo: (search.redirectTo as string) || undefined,
  }),
});

function Auth() {
  return (
    <>
      <AuthContent />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: Auth,
  validateSearch: (search) => ({
    mode: (search.mode as "login" | "register" | "forgot-password") ?? "login",
  }),
});

function Auth() {
  return <div>Hello "/auth/"!</div>;
}

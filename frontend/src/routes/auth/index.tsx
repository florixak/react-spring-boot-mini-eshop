import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
  validateSearch: (search) => ({
    mode: (search.mode as "login" | "register" | "forgot-password") ?? "login",
  }),
});

function RouteComponent() {
  return <div>Hello "/auth/"!</div>;
}

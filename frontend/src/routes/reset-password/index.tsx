import ResetPasswordForm from "@/components/auth/PasswordResetForm";
import { verifyResetPasswordToken } from "@/lib/api";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password/")({
  component: RouteComponent,
  validateSearch: (search) => ({
    token: (search.token as string) ?? "",
  }),
  beforeLoad: async (context) => {
    const { search } = context;
    if (!search.token) {
      return redirect({
        to: "/auth",
        search: { mode: "login" },
      });
    }

    const data = await verifyResetPasswordToken(search.token);
    if (!data.success) {
      return redirect({
        to: "/auth",
        search: { mode: "login" },
      });
    }
  },
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <ResetPasswordForm token={token} />
    </section>
  );
}

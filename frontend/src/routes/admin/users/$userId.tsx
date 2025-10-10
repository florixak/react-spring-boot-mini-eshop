import AdminLayout from "@/components/admin/AdminLayout";
import UserDetails from "@/components/admin/UserDetails";
import NotFound from "@/components/NotFound";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  const numericUserId = Number(userId);

  if (isNaN(numericUserId)) {
    return <NotFound />;
  }

  return (
    <AdminLayout>
      <UserDetails userId={numericUserId} />
    </AdminLayout>
  );
}

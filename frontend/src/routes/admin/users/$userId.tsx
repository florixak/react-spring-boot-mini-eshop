import AdminLayout from "@/components/admin/AdminLayout";
import UserDetails from "@/components/admin/UserDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();
  return (
    <AdminLayout>
      <UserDetails userId={Number(userId)} />
    </AdminLayout>
  );
}

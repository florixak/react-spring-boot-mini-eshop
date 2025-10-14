import AdminLayout from "@/components/admin/AdminLayout";
import UserEditForm from "@/components/admin/UserEditForm";
import NotFound from "@/components/NotFound";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/edit/$userId")({
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
      <UserEditForm userId={numericUserId} />
    </AdminLayout>
  );
}

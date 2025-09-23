import AdminLayout from "@/components/admin/AdminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div>User Details Page - to be implemented</div>
    </AdminLayout>
  );
}

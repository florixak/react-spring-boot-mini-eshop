import AdminLayout from "@/components/admin/AdminLayout";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <p>New User Form - to be implemented</p>
    </AdminLayout>
  );
}

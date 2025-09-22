import AdminLayout from "@/components/admin/AdminLayout";
import OrdersList from "@/components/admin/OrdersList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <OrdersList />
    </AdminLayout>
  );
}

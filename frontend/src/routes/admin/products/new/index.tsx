import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/new/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <ProductForm />
    </AdminLayout>
  );
}

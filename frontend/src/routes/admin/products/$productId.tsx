import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();
  return (
    <AdminLayout>
      <ProductForm productId={Number(productId)} />
    </AdminLayout>
  );
}

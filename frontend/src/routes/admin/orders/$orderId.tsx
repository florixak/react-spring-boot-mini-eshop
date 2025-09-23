import OrderDetailsPage from "@/components/orderDetails/OrderDetailsPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = Route.useParams();

  if (!orderId) {
    redirect({ to: "/admin/orders" });
  }

  return <OrderDetailsPage orderId={orderId} isAdminView />;
}

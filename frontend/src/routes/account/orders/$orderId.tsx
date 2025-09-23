import OrderDetailsPage from "@/components/orderDetails/OrderDetailsPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders/$orderId")({
  component: OrderDetails,
});

function OrderDetails() {
  const { orderId } = Route.useParams();

  if (!orderId) {
    redirect({ to: "/account", search: { section: "orders" } });
  }

  return (
    <>
      <OrderDetailsPage orderId={orderId} />
    </>
  );
}

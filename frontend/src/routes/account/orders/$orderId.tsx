import OrderDetailsPage from "@/components/orderDetails/OrderDetailsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/orders/$orderId")({
  component: OrderDetails,
});

function OrderDetails() {
  return (
    <>
      <OrderDetailsPage />
    </>
  );
}

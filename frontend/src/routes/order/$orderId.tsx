import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrder } from "@/lib/api";

export const Route = createFileRoute("/order/$orderId")({
  component: OrderDetails,
});

function OrderDetails() {
  const { orderId } = Route.useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId!),
  });

  if (!order) {
    return <div>Order not found</div>;
  }

  if (isLoading) {
    return <div>Loading order...</div>;
  }
  if (!order) {
    throw new Error("Failed to fetch order");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Order #{orderId}</h1>
      {/* Order details UI */}
    </div>
  );
}

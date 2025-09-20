import { formatPrice } from "@/lib/utils";
import { Badge } from "../ui/badge";

const orders = [
  { id: 1, customer: "Alice", total: 120, status: "pending" },
  { id: 2, customer: "Bob", total: 80, status: "shipped" },
  { id: 3, customer: "Charlie", total: 200, status: "delivered" },
];

const RecentOrders = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-secondary-200">
            <th className="py-2 px-4 text-left">Order</th>
            <th className="py-2 px-4 text-left">Customer</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-secondary-100">
              <td className="py-2 px-4 font-semibold text-primary">
                #{order.id}
              </td>
              <td className="py-2 px-4">{order.customer}</td>
              <td className="py-2 px-4">{formatPrice(order.total)}</td>
              <td className="py-2 px-4">
                <Badge variant="outline">{order.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;

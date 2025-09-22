import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import useOrders from "@/hooks/useOrders";

const columns = [
  { header: "Order ID", accessor: "id" },
  { header: "Customer", accessor: "customerName" },
  { header: "Date", accessor: "createdAt" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
  { header: "Actions", accessor: "actions" },
];

const OrdersList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();

  const { orders } = useOrders({ query: debouncedSearch, size: 100 });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const filteredOrders = orders.filter((order: Order) =>
    order.customerName.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleOrderDetail = (orderId: number) => {
    navigate({ to: `/admin/orders/${orderId}` });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-secondary-300" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-secondary-200">
              {columns.map((col) => (
                <th key={col.header} className="py-2 px-4 text-left">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 px-4 text-secondary-300 italic text-center"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: Order) => (
                <tr key={order.id} className="border-b border-secondary-100">
                  <td className="py-2 px-4 text-primary">{order.id}</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{formatPrice(order.total)}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOrderDetail(order.id)}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;

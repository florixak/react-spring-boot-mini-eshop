import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import useOrders from "@/hooks/useOrders";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import AdminTable from "./AdminTable";

const columnHelper = createColumnHelper<Order>();

type OrdersListProps = {
  size?: number;
  recent?: boolean;
};

const OrdersList = ({ size, recent = false }: OrdersListProps) => {
  const navigate = useNavigate();
  const search = useSearch({ from: "__root__" }) as { query?: string };
  const { orders, isLoading, error } = useOrders({
    query: search.query || "",
    size: size || 100,
    recent,
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "Order ID",
      cell: (info) => (
        <span className="text-primary font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("customerEmail", {
      header: "Customer Email",
      cell: (info) => (
        <span className="text-secondary-200">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => (
        <span className="text-secondary-200">
          {new Date(info.getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Total Price",
      cell: (info) => (
        <span className="text-secondary-200">
          {formatPrice(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span className="capitalize text-secondary-200">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/admin/orders/${info.row.original.id}` });
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/admin/orders/${info.row.original.id}/edit` });
            }}
          >
            Edit
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <AdminTable
      data={
        orders?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) || []
      }
      columns={columns as ColumnDef<Order>[]}
      searchableColumns={["customerEmail", "status", "id"]}
      searchPlaceholder="Search orders..."
      isLoading={isLoading}
      error={error?.message || null}
      emptyMessage="No orders found."
      onRowClick={(order) => navigate({ to: `/admin/orders/${order.id}` })}
    />
  );
};

export default OrdersList;

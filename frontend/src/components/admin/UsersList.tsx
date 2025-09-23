import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import useUsers from "@/hooks/useUsers";
import AdminTable from "./AdminTable";
import type { User } from "@/types";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

const columnHelper = createColumnHelper<User>();

const UsersList = () => {
  const { users, isLoading, error } = useUsers({ size: 100 });
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("id", {
      header: "User ID",
      cell: (info) => (
        <span className="text-primary font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-secondary-200">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
    }),
    columnHelper.accessor("role", {
      header: "Role",
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
              e.stopPropagation(); // Prevent row click
              navigate({ to: `/admin/users/${info.row.original.id}` });
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/admin/users/${info.row.original.id}/edit` });
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
      data={users || []}
      columns={columns as ColumnDef<User>[]}
      searchableColumns={["email", "firstName", "lastName"]}
      searchPlaceholder="Search users..."
      isLoading={isLoading}
      error={error?.message || null}
      emptyMessage="No users found."
      onRowClick={(user) => navigate({ to: `/admin/users/${user.id}` })}
    />
  );
};

export default UsersList;

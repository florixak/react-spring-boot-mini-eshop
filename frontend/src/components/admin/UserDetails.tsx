import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { deleteUser } from "@/lib/api";
import type { User } from "@/types";
import toast from "react-hot-toast";
import useUsers from "@/hooks/useUsers";
import NotFound from "../NotFound";

type UserDetailsProps = {
  userId: User["id"] | undefined;
};

const UserDetails = ({ userId }: UserDetailsProps) => {
  const navigate = useNavigate();
  const {
    user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useUsers({ userId });

  if (!user) {
    return <NotFound />;
  }

  const handleDelete = async () => {
    if (!user) return;
    if (!confirm(`Delete user ${user.email}?`)) return;
    try {
      await deleteUser(user.id);
      toast.success("User deleted.");
      refetchUser();
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to delete user.");
    }
  };

  if (userLoading) {
    return (
      <div className="py-12 text-center text-secondary-200">Loading user…</div>
    );
  }

  if (userError) {
    return (
      <div className="py-12 text-center text-red-500">Failed to load user.</div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <h2 className="text-2xl font-semibold text-primary">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-secondary-400">{user?.email}</p>

              <div className="mt-3 flex items-center gap-2">
                <Badge className="px-2 py-1 text-sm">
                  {user?.role ?? "user"}
                </Badge>
                <Badge className="px-2 py-1 text-sm">
                  {user?.verified ? "Verified" : "Not verified"}
                </Badge>
              </div>

              <p className="mt-3 text-sm text-secondary-200">
                Joined {user?.createdAt ? formatDate(user.createdAt) : "—"}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate({ to: `/admin/users/edit/${user?.id}` })
                  }
                >
                  Edit
                </Button>

                <Button size="sm" variant="outline" asChild>
                  <Link
                    to={`/admin/orders`}
                    search={{ query: `user:${user?.id}` }}
                  >
                    View orders
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserDetails;

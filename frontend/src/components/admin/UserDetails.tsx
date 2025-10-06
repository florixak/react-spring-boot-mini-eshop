import { useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrice } from "@/lib/utils";
import { resendVerificationCode, deactivateUser } from "@/lib/api";
import useOrders from "@/hooks/useOrders";
import type { User, Order } from "@/types";
import toast from "react-hot-toast";
import useUsers from "@/hooks/useUsers";

type Props = {
  userId: User["id"] | undefined;
};

const UserDetails = ({ userId }: Props) => {
  const navigate = useNavigate();
  const {
    user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useUsers({ userId });

  const { orders = [], isLoading: ordersLoading } = useOrders({
    userId: userId,
    query: "",
    size: 1000,
    recent: false,
  });

  const ordersCount = orders?.length ?? 0;
  const lifetimeSpend = useMemo(
    () =>
      orders?.reduce((sum: number, o: Order) => sum + (o.totalPrice ?? 0), 0) ??
      0,
    [orders]
  );

  const handleResend = useCallback(async () => {
    if (!user?.email) {
      toast.error("No email available to resend verification.");
      return;
    }
    try {
      await resendVerificationCode(user.email);
      toast.success("Verification code resent.");
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to resend code.");
    }
  }, [user]);

  const handleDeactivate = useCallback(async () => {
    if (!user) return;
    if (!confirm(`Deactivate user ${user.email}?`)) return;
    try {
      await deactivateUser(user.id);
      toast.success("User deactivated.");
      refetchUser();
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to deactivate user.");
    }
  }, [user, refetchUser]);

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
          <div className="flex items-start justify-between gap-4">
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

            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate({ to: `/admin/users/${user?.id}/edit` })
                  }
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate({
                      to: "/admin/orders",
                      search: user?.id ? { query: String(user.id) } : undefined,
                    })
                  }
                >
                  View orders
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeactivate}
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    toast(
                      `Orders: ${ordersCount}, Lifetime: ${formatPrice(
                        lifetimeSpend
                      )}`
                    )
                  }
                >
                  Quick stats
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div>
            <h3 className="text-sm font-medium text-secondary-600 mb-2">
              Orders
            </h3>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-secondary-500">Total orders</p>
                <p className="text-lg font-semibold text-primary">
                  {ordersLoading ? "…" : ordersCount}
                </p>
              </div>

              <div>
                <p className="text-xs text-secondary-500">Lifetime spend</p>
                <p className="text-lg font-semibold text-primary">
                  {ordersLoading ? "…" : formatPrice(lifetimeSpend)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;

import { useUserStore } from "@/stores/useUserStore";
import { createFileRoute, redirect } from "@tanstack/react-router";
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  beforeLoad: async () => {
    await useUserStore.getState().fetchUser();

    const isAdmin = useUserStore.getState().isAdmin;
    const isAuthenticated = useUserStore.getState().isAuthenticated;
    if (!isAuthenticated || !isAdmin()) {
      throw redirect({
        to: "/",
        search: {
          category: "all",
          sortBy: "no-filter",
          view: "grid",
        },
      });
    }
  },
});

function AdminDashboard() {
  return (
    <>
      <AdminDashboardContent />
    </>
  );
}

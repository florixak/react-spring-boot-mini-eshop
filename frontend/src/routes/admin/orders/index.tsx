import AdminLayout from "@/components/admin/AdminLayout";
import OrdersList from "@/components/admin/OrdersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary font-playfair">
          Orders
        </h1>
      </div>

      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersList />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import ProductList from "@/components/admin/ProductList";
import AdminLayout from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary font-playfair">
          Products
        </h1>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            Product List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

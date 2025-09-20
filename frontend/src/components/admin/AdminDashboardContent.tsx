import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Package, Plus } from "lucide-react";
import AdminNav from "./AdminNav";
import ProductStats from "./ProductStats";
import UserStats from "./UserStats";
import OrderStats from "./OrderStats";
import RecentOrders from "./RecentOrders";
import ProductList from "./ProductList";

const AdminDashboardContent = () => {
  return (
    <div className="min-h-screen bg-secondary-50 px-4 md:px-12 py-8 pt-28">
      <div className="max-w-7xl mx-auto">
        <AdminNav />

        <h1 className="text-3xl font-bold text-primary font-playfair mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProductStats />
          <UserStats />
          <OrderStats />
        </div>

        <Separator className="mb-8" />

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
            <Button asChild size="sm">
              <Link to="/admin/products/new" className="flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ProductList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardContent;

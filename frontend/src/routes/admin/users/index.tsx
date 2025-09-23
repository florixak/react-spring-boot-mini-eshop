import AdminLayout from "@/components/admin/AdminLayout";
import UsersList from "@/components/admin/UsersList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary font-playfair">Users</h1>
        <Button asChild>
          <Link to="/admin/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">
            User List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersList />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

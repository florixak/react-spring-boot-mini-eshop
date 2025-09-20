import { Link } from "@tanstack/react-router";
import { BarChart2, Package, Users, ShoppingCart } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: BarChart2, to: "/admin" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
  { label: "Users", icon: Users, to: "/admin/users" },
];

const AdminNav = () => {
  return (
    <nav className="mb-8 flex gap-4">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-secondary-100 font-medium transition-colors"
          activeProps={{
            className: "bg-primary text-white hover:bg-primary/90",
          }}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default AdminNav;

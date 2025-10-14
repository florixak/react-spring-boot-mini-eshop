import { Link } from "@tanstack/react-router";
import { BarChart2, Package, Users, ShoppingCart } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: BarChart2, to: "/admin" },
  { name: "Products", icon: Package, to: "/admin/products" },
  { name: "Orders", icon: ShoppingCart, to: "/admin/orders?query=" },
  { name: "Users", icon: Users, to: "/admin/users" },
];

const AdminNav = () => {
  return (
    <nav className="mb-8 flex gap-4 items-center justify-start flex-wrap">
      {navItems.map((link) => {
        const Icon = link.icon;
        const isActive = window.location.pathname === link.to;
        return (
          <Link
            key={link.name}
            to={link.to}
            className={`group relative px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer w-full max-w-[200px] ${
              isActive
                ? "bg-white border-primary shadow-lg scale-105"
                : "bg-white/80 border-secondary-100 hover:border-primary hover:shadow-md hover:scale-102"
            }`}
            resetScroll={false}
          >
            <div className="flex flex-row items-center gap-4">
              <div
                className={`p-3 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-secondary-50 text-secondary-200 group-hover:bg-primary group-hover:text-white"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h3
                className={`font-semibold font-playfair transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-primary group-hover:text-primary"
                }`}
              >
                {link.name}
              </h3>
            </div>

            {isActive && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;

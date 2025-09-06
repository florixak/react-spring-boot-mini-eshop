import { Link } from "@tanstack/react-router";
import { Route } from "@/routes/account";
import { User, Package, Heart, Settings } from "lucide-react";

const ACCOUNT_NAV = [
  {
    name: "Profile",
    section: "profile" as const,
    icon: User,
    description: "Personal information",
  },
  {
    name: "Orders",
    section: "orders" as const,
    icon: Package,
    description: "Order history & tracking",
  },
  {
    name: "Wishlist",
    section: "wishlist" as const,
    icon: Heart,
    description: "Saved items",
  },
  {
    name: "Settings",
    section: "settings" as const,
    icon: Settings,
    description: "Account preferences",
  },
];

const AccountHeader = () => {
  const search = Route.useSearch();

  return (
    <section className="bg-secondary-50 py-12 px-6 md:px-16 lg:px-28 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary font-playfair mb-2">
            My Account
          </h1>
          <p className="text-secondary-200">
            Manage your account settings and preferences
          </p>
        </div>
        <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCOUNT_NAV.map((link) => {
            const Icon = link.icon;
            const isActive = search.section === link.section;

            return (
              <Link
                key={link.name}
                to="/account"
                search={{ ...search, section: link.section }}
                className={`group relative px-6 py-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white border-primary shadow-lg scale-105"
                    : "bg-white/80 border-secondary-100 hover:border-primary hover:shadow-md hover:scale-102"
                }`}
                resetScroll={false}
              >
                <div className="flex flex-row items-start gap-4">
                  <div
                    className={`p-3 rounded-full transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "bg-secondary-50 text-secondary-200 group-hover:bg-primary group-hover:text-white"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <h3
                      className={`font-semibold font-playfair transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-primary group-hover:text-primary"
                      }`}
                    >
                      {link.name}
                    </h3>
                    <p className="text-sm text-secondary-200 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default AccountHeader;

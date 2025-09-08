import { Route } from "@/routes/account";
import ProfileSection from "./ProfileSection";
import OrdersSection from "./OrdersSection";
import WishlistSection from "./WishlistSection";
import SettingsSection from "./SettingsSection";

const AccountContent = () => {
  const search = Route.useSearch();

  const renderContent = () => {
    switch (search.section) {
      case "profile":
        return <ProfileSection />;
      case "orders":
        return <OrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <section className="py-12 px-6 md:px-16 lg:px-28 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </section>
  );
};

export default AccountContent;

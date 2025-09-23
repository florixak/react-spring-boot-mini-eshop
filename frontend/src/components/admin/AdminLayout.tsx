import AdminNav from "./AdminNav";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary-50 px-4 md:px-12 py-8 pt-28">
      <div className="max-w-7xl mx-auto">
        <AdminNav />
        <main>{children}</main>
      </div>
    </div>
  );
}

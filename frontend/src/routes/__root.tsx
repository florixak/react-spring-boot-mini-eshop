import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RouteComponent() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RouteComponent,
});

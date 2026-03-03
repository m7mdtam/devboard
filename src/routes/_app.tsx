import { createRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { Route as rootRoute } from "./__root";

function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 pt-20 px-3 py-6 sm:px-4 sm:py-8 md:py-12">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: "_app",
  component: AppLayout,
});

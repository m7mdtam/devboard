import { createRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Route as rootRoute } from "./__root";

function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-20 px-3 py-6 sm:px-4 sm:py-8 md:py-12">
        <Outlet />
      </div>
    </>
  );
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  id: "_app",
  component: AppLayout,
});

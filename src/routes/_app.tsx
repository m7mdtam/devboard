import { createRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/shared/navbar";
import { Route as rootRoute } from "./__root";

function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-32">
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

import { NavBar } from "~/components/Navbar";
import { Outlet } from "react-router";
import { DataProvider } from "~/context/DataContext";
import ModalManager from "~/components/modals/ModalManager";

export default function Layout() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-4 text-gray-800 dark:text-white bg-white dark:bg-gray-900 transition-colors">
      <NavBar />
      <div className="container mx-auto p-4">
        <DataProvider>
          <Outlet />
          <ModalManager />
        </DataProvider>
      </div>
    </div>
  );
}

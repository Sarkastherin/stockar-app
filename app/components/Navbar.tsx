import {
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { Logo } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useNavItems } from "~/hooks/useNavItems";
const NavLinkComponent = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `self-center block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 ${
        isActive ? "text-indigo-700 dark:text-indigo-500" : "text-gray-700 dark:text-gray-300"
      }`
    }
  >
    {children}
  </NavLink>
);

export function NavBar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { navItems } = useNavItems();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesion:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Navbar className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-800 shadow-md">
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <Logo className="mr-3 h-6 sm:h-9 text-indigo-600 dark:text-indigo-400" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Stock<span className="text-indigo-600 dark:text-indigo-400">AR</span>
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {navItems.map((item) => (
          <NavLinkComponent key={item.to} to={item.to}>
            {item.name}
          </NavLinkComponent>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="block py-2 pl-3 pr-4 text-left text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:text-red-300 md:p-0"
        >
          {isLoggingOut ? "Cerrando sesion..." : "Cerrar sesion"}
        </button>
        <DarkThemeToggle className="ml-auto" />
      </NavbarCollapse>
    </Navbar>
  );
}

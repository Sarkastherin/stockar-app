import {
  DarkThemeToggle,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { NavLink, Link } from "react-router";
import { Logo } from "./Logo";

const menuItems = [
  { name: "Inicio", to: "/" },
  { name: "Productos", to: "/productos" },
  // Agrega más enlaces aquí según sea necesario
];
const NavLinkComponent = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `self-center block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0 ${
        isActive ? "text-cyan-700 dark:text-cyan-500" : "text-gray-700 dark:text-gray-300"
      }`
    }
  >
    {children}
  </NavLink>
);

export function NavBar() {
  return (
    <Navbar className="sticky top-0 z-50 bg-gray-100 dark:bg-gray-800 shadow-md">
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <Logo className="mr-3 h-6 sm:h-9 text-cyan-600 dark:text-cyan-400" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          StockAR
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {menuItems.map((item) => (
          <NavLinkComponent key={item.to} to={item.to}>
            {item.name}
          </NavLinkComponent>
        ))}
        <DarkThemeToggle className="ml-auto" />
      </NavbarCollapse>
    </Navbar>
  );
}

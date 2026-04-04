import { useMemo } from "react";
import { useAuth } from "~/context/AuthContext";
import type { IconType } from "react-icons";
import { FiDownload, FiUpload } from "react-icons/fi";
import { FaBoxesStacked } from "react-icons/fa6";
import { LuUserCog } from "react-icons/lu";
import { TbSitemap } from "react-icons/tb";

type Role = "ADMIN" | "SUPERVISOR" | "USER";

export type NavItem = {
  name: string;
  to: string;
};

export type QuickAction = {
  name: string;
  to: string;
  icon: {
    component: IconType;
    color: string;
    size: number;
  };
  color: string;
};

export type ConfigItem = {
  name: string;
  path: string;
  icon: { component: IconType; color: string };
  description: string;
};

const allNavItems: (NavItem & { allowedRoles: Role[] })[] = [
  { name: "Inicio", to: "/", allowedRoles: ["USER", "SUPERVISOR", "ADMIN"] },
  { name: "Stock", to: "/stock", allowedRoles: ["SUPERVISOR", "ADMIN"] },
  { name: "Productos", to: "/productos", allowedRoles: ["SUPERVISOR", "ADMIN"] },
  { name: "Movimientos", to: "/movimientos", allowedRoles: ["SUPERVISOR", "ADMIN"] },
  { name: "Configuraciones", to: "/configuraciones", allowedRoles: ["SUPERVISOR", "ADMIN"] },
];

const allQuickActions: (QuickAction & { allowedRoles: Role[] })[] = [
  {
    name: "Agregar entrada",
    to: "/movimientos/nuevo?type=entrada",
    icon: { component: FiDownload, color: "text-green-500 dark:text-green-400", size: 20 },
    color: "bg-green-200 dark:bg-green-900",
    allowedRoles: ["USER", "SUPERVISOR", "ADMIN"],
  },
  {
    name: "Agregar salida",
    to: "/movimientos/nuevo?type=salida",
    icon: { component: FiUpload, color: "text-red-500 dark:text-red-400", size: 20 },
    color: "bg-red-200 dark:bg-red-900",
    allowedRoles: ["USER", "SUPERVISOR", "ADMIN"],
  },
  {
    name: "Ver stock",
    to: "/stock",
    icon: { component: FaBoxesStacked, color: "text-blue-500 dark:text-blue-400", size: 20 },
    color: "bg-blue-200 dark:bg-blue-900",
    allowedRoles: ["SUPERVISOR", "ADMIN"],
  },
];

const allConfigItems: (ConfigItem & { allowedRoles: Role[] })[] = [
  {
    name: "Productos",
    path: "/configuraciones/productos",
    icon: { component: TbSitemap, color: "text-orange-500 dark:text-orange-400" },
    description: "Gestione las familias, categorías, subcategorías y unidades de medida de sus productos",
    allowedRoles: ["SUPERVISOR", "ADMIN"],
  },
  {
    name: "Usuarios",
    path: "/configuraciones/usuarios",
    icon: { component: LuUserCog, color: "text-blue-600 dark:text-blue-400" },
    description: "Modifique los usuarios de su sistema, asigne roles y controle el acceso a las diferentes funcionalidades de StockAR",
    allowedRoles: ["ADMIN"],
  },
];

export function useNavItems() {
  const { user } = useAuth();
  const role = (user?.role ?? "USER") as Role;

  const navItems = useMemo(
    () => allNavItems.filter((item) => item.allowedRoles.includes(role)),
    [role],
  );

  const quickActions = useMemo(
    () => allQuickActions.filter((item) => item.allowedRoles.includes(role)),
    [role],
  );

  const configItems = useMemo(
    () => allConfigItems.filter((item) => item.allowedRoles.includes(role)),
    [role],
  );

  return { navItems, quickActions, configItems };
}

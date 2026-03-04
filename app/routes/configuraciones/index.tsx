import type { Route } from "../+types/home";
import { LuUserCog } from "react-icons/lu";
import { TbSitemap } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { getIcon } from "~/components/IconComponent";
import { Card } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { NavLink } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuraciones" },
    { name: "description", content: "Configuraciones en StockAR" },
  ];
}

export default function Configuraciones() {
  const submenu = [
    {
      name: "Productos",
      path: "/configuraciones/productos",
      icon: {
        component: TbSitemap,
        color: "text-orange-500 dark:text-orange-400",
      },
      description:
        "Gestione las familias, categorías, subcategorías y unidades de medida de sus productos",
    },
    {
      name: "Usuarios",
      path: "/configuraciones/usuarios",
      icon: { component: LuUserCog, color: "text-blue-600 dark:text-blue-400" },
      description:
        "Modifique los usuarios de su sistema, asigne roles y controle el acceso a las diferentes funcionalidades de StockAR",
    },
  ];
  return (
    <div>
      <SubTitles
        title="Configuraciones"
        back_path="/"
        icon={{
          component: IoSettingsOutline,
          color: "text-purple-600 dark:text-purple-400",
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20 auto-rows-fr">
        {submenu.map((item) => (
          <NavLink key={item.path} to={item.path}>
            <Card className="hover:shadow-2xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 h-full flex flex-col cursor-pointer">
              <div className="flex items-center space-x-4">
                {getIcon({
                  icon: item.icon.component,
                  size: 24,
                  color: item.icon.color,
                })}
                <h2 className="text-xl font-semibold">{item.name}</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

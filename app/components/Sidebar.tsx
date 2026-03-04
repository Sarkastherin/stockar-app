import {
  Sidebar as FlowbiteSidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { LuPencilRuler, LuLayers2, LuLayers3, LuNetwork } from "react-icons/lu";
import type { TabsTypes } from "~/routes/configuraciones/productos";

export function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabsTypes;
  setActiveTab: (tab: TabsTypes) => void;
}) {
  const submenu = [
    {
      key: "familias",
      name: "Familias",
      icon: LuNetwork,
    },
    {
      key: "categorias",
      name: "Categorías",
      icon: LuLayers2,
    },
    {
      key: "subcategorias",
      name: "Subcategorías",
      icon: LuLayers3,
    },
    {
      key: "unidades",
      name: "Unidades",
      icon: LuPencilRuler,
    },
  ]; //familias, categorias, subcategorias, unidades de medida
  return (
    <FlowbiteSidebar
      aria-label="Menu de configuración de productos"
    >
      <SidebarItems>
        <SidebarItemGroup>
          {submenu.map((item) => (
            <SidebarItem
              key={item.key}
              onClick={() => setActiveTab(item.key as TabsTypes)}
              icon={item.icon}
              active={activeTab === item.key}
              className="cursor-pointer"
            >
              {item.name}
            </SidebarItem>
          ))}
        </SidebarItemGroup>
      </SidebarItems>
    </FlowbiteSidebar>
  );
}

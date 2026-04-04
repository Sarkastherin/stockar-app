import { useState } from "react";
import type { Route } from "../+types/home";
import { Sidebar } from "~/components/Sidebar";
import Table from "~/components/Table";
import useItemsConfig from "~/hooks/useItemsConfig";
import { FaPlus } from "react-icons/fa";
import { Button } from "flowbite-react";
import { LuPencilRuler, LuLayers2, LuLayers3, LuNetwork, LuMapPin } from "react-icons/lu";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuraciones de Productos" },
    { name: "description", content: "Configuraciones de Productos en StockAR" },
  ];
}
export type TabsTypes =
  | "familias"
  | "categorias"
  | "subcategorias"
  | "unidades"
  | "ubicaciones";
  
 const submenu = [
    {
      key: "familias" as TabsTypes,
      name: "Familias",
      icon: LuNetwork,
    },
    {
      key: "categorias" as TabsTypes,
      name: "Categorías",
      icon: LuLayers2,
    },
    {
      key: "subcategorias" as TabsTypes,
      name: "Subcategorías",
      icon: LuLayers3,
    },
    {
      key: "unidades" as TabsTypes,
      name: "Unidades",
      icon: LuPencilRuler,
    },
    {
      key: "ubicaciones" as TabsTypes,
      name: "Ubicaciones",
      icon: LuMapPin,
    }
  ]; //familias, categorias, subcategorias, unidades de medida

export default function ProductosSettings() {
  const { getItemsConfig } = useItemsConfig();
  const [activeTab, setActiveTab] = useState<TabsTypes>("familias");
  const itemsConfig = getItemsConfig();
  const activeItem = itemsConfig.find((item) => item.tab === activeTab);
  return (
    <div className="flex" style={{ height: "calc(100vh - 128px)" }}>
      <Sidebar aria-label="Menu de configuraciones de productos" submenu={submenu} activeTab={activeTab} setActiveTab={setActiveTab as (tab: string) => void} collapsible />
      <div className="relative flex-1 min-w-0 p-6">
        {activeItem && (
          <div key={activeItem.tab}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{activeItem.name}</h2>
              <div>
                <Button size="sm" color="blue" onClick={activeItem.onOpenNew}>
                  <FaPlus className="mr-2" />
                  Nuevo {activeItem.name.slice(0, -1)}
                </Button>
              </div>
            </div>
              <Table
                columns={activeItem.columns}
                data={activeItem.data}
                onRowClick={activeItem.onOpenDetails}
                filterFields={activeItem.filterFields}
                scrollHeightOffset={378}
                inactiveField="active"
                emptyState={{
                  title: `No hay ${activeItem.name.toLowerCase()} cargadas`,
                  description: `Puedes crear la primera ${activeItem.name.slice(0, -1).toLowerCase()} para comenzar.`,
                  actionLabel: `Crear ${activeItem.name.slice(0, -1)}`,
                  onAction: activeItem.onOpenNew,
                }}
              />
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import type { Route } from "../+types/home";
import { Sidebar } from "~/components/Sidebar";
import Table from "~/components/Table";
import useItemsConfig from "~/hooks/useItemsConfig";
import { FaPlus } from "react-icons/fa";
import { Button } from "flowbite-react";
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
  | "unidades";
export default function ProductosSettings() {
  const { getItemsConfig } = useItemsConfig();
  const [activeTab, setActiveTab] = useState<TabsTypes>("familias");
  const itemsConfig = getItemsConfig();
  const activeItem = itemsConfig.find((item) => item.tab === activeTab);

  return (
    <div className="flex" style={{ height: "calc(100vh - 128px)" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="relative flex-1 p-6">
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
            />
          </div>
        )}
      </div>
    </div>
  );
}

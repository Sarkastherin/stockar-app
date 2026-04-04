import { useState } from "react";
import {
  Sidebar as FlowbiteSidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import type { IconType } from "react-icons";
import type { SidebarProps } from "flowbite-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export function Sidebar({
  submenu,
  activeTab,
  setActiveTab,
  collapsible = false,
  ...props
}: {
  submenu: {
    key: string;
    name: string;
    icon: IconType;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsible?: boolean;
} & SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`relative shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="overflow-hidden w-full h-full">
        <FlowbiteSidebar collapsed={collapsed} {...props}>
          <SidebarItems>
            <SidebarItemGroup>
              {submenu.map((item) => (
                <SidebarItem
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
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
      </div>
      {collapsible && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={collapsed ? "Expandir menú" : "Contraer menú"}
        >
          {collapsed ? <LuChevronRight size={12} /> : <LuChevronLeft size={12} />}
        </button>
      )}
    </div>
  );
}

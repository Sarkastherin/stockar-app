import {
  Sidebar as FlowbiteSidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import type { IconType } from "react-icons";
import type { SidebarProps } from "flowbite-react";

export function Sidebar({
  submenu,
  activeTab,
  setActiveTab,
  ...props
}: {
  submenu: {
    key: string;
    name: string;
    icon: IconType;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
} & SidebarProps) {
  return (
    <FlowbiteSidebar {...props}>
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
  );
}

import { getIcon } from "./IconComponent";
import { RiArrowGoBackFill } from "react-icons/ri";
import { NavLink } from "react-router";
import type { IconType } from "react-icons";

export const SubTitles = ({
  title,
  back_path,
  icon,
}: {
  title: string;
  back_path?: string;
  icon?: { component: IconType; color?: string };
}) => {
  const ArrowIcon = getIcon({
    icon: RiArrowGoBackFill,
    size: 24,
    color: "text-gray-600 dark:text-gray-400",
  });
  return (
    <div className="flex items-center gap-3 mb-4">
      {back_path && (
        <NavLink
          to={back_path}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-purple-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
          title="Volver"
        >
          {ArrowIcon}
        </NavLink>
      )}
      <div className="flex gap-2 items-center">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>
        {icon && getIcon({ icon: icon.component, size: 28, color: icon.color })}
      </div>
    </div>
  );
};

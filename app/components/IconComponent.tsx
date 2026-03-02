import type { IconType } from "react-icons";

export const getIcon = ({
  size,
  color,
  icon,
}: {
  size?: number;
  color?: string;
  icon: IconType;
}) => {
  const IconComponent: IconType = icon;
  return (
    <IconComponent
      className={`w-${size || 6} h-${size || 6} ${color ? color : ""}`}
    />
  );
};

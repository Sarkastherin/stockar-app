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
      size={size || 24}
      className={color ? color : ""}
    />
  );
};

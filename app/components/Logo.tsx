import { useThemeMode } from "flowbite-react";
import logoDark from "/logo_dark.png";
import logoLight from "/logo_light.png";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-6 sm:h-9" }: LogoProps) {
  const { computedMode } = useThemeMode();
    const isDarkMode = computedMode === "dark";
  const logo = isDarkMode ? logoDark : logoLight;
  return (
    <img src={logo} alt="StockAR Logo" className={className} />
  );
}

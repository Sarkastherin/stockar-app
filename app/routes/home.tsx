import type { Route } from "./+types/home";
import { DarkThemeToggle } from "flowbite-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function MyPage() {
  return (
    <div className="min-h-screen w-full flex flex-col gap-4 justify-center items-center bg-white dark:bg-gray-900 transition-colors">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Hola</h1>
      <p className="text-gray-600 dark:text-gray-300">Este texto debería cambiar de color</p>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-800 dark:text-gray-200">Contenedor con fondo</p>
      </div>
      <DarkThemeToggle />
    </div>
  );
}

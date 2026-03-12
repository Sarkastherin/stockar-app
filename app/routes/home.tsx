import { useEffect } from "react";
import type { Route } from "./+types/home";
import { useDataContext } from "~/context/DataContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "StockAR" },
    { name: "description", content: "Welcome to StockAR!" },
  ];
}

export default function Home() {
  const {productos, getProductos} = useDataContext();
  /* useEffect(() => {
    if(!productos) {
      getProductos();
    }
    if(productos) {
      console.log("Productos en Home:", productos);
    }
  }, [getProductos, productos]); */
  return (
    <h1>Home</h1>
  );
}

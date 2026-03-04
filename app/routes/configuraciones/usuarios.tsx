import type {Route} from "../+types/home" 
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Configuraciones de Usuarios" },
    { name: "description", content: "Configuraciones de Usuarios en StockAR" },
  ];
}

export default function UsuariosSettings() {
  return (
    <h1>Configuraciones de Usuarios</h1>
  );
}
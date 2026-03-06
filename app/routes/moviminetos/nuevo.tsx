import type { Route } from "../+types/home";
import { Button } from "flowbite-react";
import { useMovimientos } from "~/hooks/useMovimientos";
import TemplateNuevoMovimiento from "~/components/forms/templates/NuevoMovimiento";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Movimiento" },
    {
      name: "description",
      content: "Registro de un nuevo movimiento de productos",
    },
  ];
}
export default function NuevoMovimiento() {
  const { form, onSubmitNew, onError } = useMovimientos();
  return (
    <form
      onSubmit={form.handleSubmit(onSubmitNew, onError)}
      className="max-w-md mx-auto p-4"
    >
      <TemplateNuevoMovimiento form={form} />
      <Button type="submit" className="mt-4 w-full" color="indigo">
        Guardar
      </Button>
    </form>
  );
}

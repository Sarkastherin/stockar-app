import { type UseFormReturn } from "react-hook-form";
import type { ProductoDB } from "~/types/productos";
import { useEffect, useState } from "react";
import { useDataContext } from "~/context/DataContext";
import { Spinner, ListGroup, ListGroupItem, TextInput } from "flowbite-react";

export function SeleccionarProductoModal({
  props,
}: {
  props: { onSelect: (producto: ProductoDB) => void };
}) {
  const [filterData, setFilterData] = useState<ProductoDB[]>([]);
  const { getProductos, productos } = useDataContext();
  useEffect(() => {
    if (!productos) getProductos();
    if (productos) setFilterData(productos);
  }, [productos, getProductos]);
  if (!productos) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }
  return (
    <div>
      <TextInput
        type="search"
        placeholder="Buscar producto..."
        onChange={(e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filteredItems = productos.filter((item) =>
            item.name.toLowerCase().includes(searchTerm),
          );
          setFilterData(filteredItems);
        }}
      />
      <ListGroup className={`mt-2 max-h-50 overflow-y-scroll p-1`}>
        {filterData.map((item) => (
          <ListGroupItem
            key={item.id}
            onClick={() => props.onSelect(item)}
          >
            {item.name}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}

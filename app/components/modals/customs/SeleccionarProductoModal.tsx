import type { StockListItem } from "~/types/productos";
import { useEffect, useState, useRef } from "react";
import { useStockServices } from "~/services/useCrud";
import { Spinner, ListGroup, ListGroupItem, TextInput } from "flowbite-react";

const DEBOUNCE_MS = 300;
const INITIAL_LIMIT = 30;

export function SeleccionarProductoModal({
  props,
}: {
  props: { onSelect: (item: StockListItem) => void };
}) {
  const [results, setResults] = useState<StockListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const stockServices = useStockServices();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProducts = async (name: string) => {
    setIsLoading(true);
    const { data } = await stockServices.read({
      limit: INITIAL_LIMIT,
      query: { active: "true", ...(name ? { name } : {}) },
    });
    setResults(data ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts("");
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchProducts(value), DEBOUNCE_MS);
  };

  return (
    <div>
      <TextInput
        type="search"
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        autoFocus
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-6">
          <Spinner aria-label="Cargando productos..." />
        </div>
      ) : (
        <ListGroup className="mt-2 max-h-64 overflow-y-auto p-1">
          {results.length === 0 ? (
            <ListGroupItem disabled>Sin resultados</ListGroupItem>
          ) : (
            results.map((item) => (
              <ListGroupItem key={item.id} onClick={() => props.onSelect(item)}>
                <div className="flex justify-between w-full">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                    Stock: {Number(item.stock).toFixed(2)}
                  </span>
                </div>
              </ListGroupItem>
            ))
          )}
        </ListGroup>
      )}
      {!isLoading && results.length === INITIAL_LIMIT && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
          Mostrando los primeros {INITIAL_LIMIT} resultados. Escribí para filtrar.
        </p>
      )}
    </div>
  );
}

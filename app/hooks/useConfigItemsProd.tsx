import { useDataContext } from "~/context/DataContext";
import { useCallback, useEffect, useMemo } from "react";
export const useConfigItemsProd = () => {
  // Carga los datos necesarios para las configuraciones de productos
  const {
    subcategorias,
    categorias,
    familias,
    unidades,
    getSubcategorias,
    getCategorias,
    getFamilias,
    getUnidades,
  } = useDataContext();

  const loadData = useCallback(() => {
    if (!subcategorias) getSubcategorias();
    if (!categorias) getCategorias();
    if (!familias) getFamilias();
    if (!unidades) getUnidades();
  }, [
    subcategorias,
    categorias,
    familias,
    unidades,
    getSubcategorias,
    getCategorias,
    getFamilias,
    getUnidades,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Opciones para selects
  const familiasOptions = useMemo(
    () =>
      familias?.map((fam) => ({
        value: fam.id,
        label: fam.name,
      })) || [],
    [familias],
  );
  const unidadesOptions = useMemo(
    () =>
      unidades?.map((unit) => ({
        value: unit.id,
        label: unit.name,
      })) || [],
    [unidades],
  );
  const categoriasOptions = useMemo(
    () => (categorias ?? []).map((cat) => ({ value: cat.id, label: cat.name, id_family: cat.id_family })),
    [categorias],
  );
  const subcategoriaOptions = useMemo(
    () =>
      subcategorias?.map((sub) => ({
        value: sub.id,
        label: sub.name,
      })) || [],
    [subcategorias],
  );
  const getCategoriasFiltradasOptions = useCallback(
    (familiaId: string) =>
      categorias
        ?.filter((cat) => cat.id_family === familiaId)
        .map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || [],
    [categorias],
  );
  const getSubcategoriasFiltradasOptions = useCallback(
    (categoriaId: string) =>
      subcategorias
        ?.filter((sub) => sub.id_category === categoriaId)
        .map((sub) => ({
          value: sub.id,
          label: sub.name,
        })) || [],
    [subcategorias],
  );
  
  // Opciones filtradas por familia y categoría
  /* const categoriasFiltradasOptions = useMemo(
    () =>
      categorias
        ?.filter((cat) => cat.id_family === familiaId)
        .map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || [],
    [categorias, familiaId],
  ); */

  /* const subcategoriasFiltradasOptions = useMemo(
    () =>
      subcategorias
        ?.filter((sub) => sub.id_category === categoriaId)
        .map((sub) => ({
          value: sub.id,
          label: sub.name,
        })) || [],
    [subcategorias, categoriaId],
  ); */
  return {
    subcategorias,
    categorias,
    familias,
    unidades,
    familiasOptions,
    unidadesOptions,
    categoriasOptions,
    subcategoriaOptions,
    getCategoriasFiltradasOptions,
    getSubcategoriasFiltradasOptions,
  };
};

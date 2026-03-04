import { useCallback, useEffect, useMemo } from "react";
import { useDataContext } from "~/context/DataContext";
import type { TableColumn } from "react-data-table-component";
import type { TabsTypes } from "~/routes/configuraciones/productos";
import { useModal } from "~/context/ModalContext";
import { ItemConfigModal } from "~/components/modals/customs/ItemConfigModal";
import { useItemConfigForm } from "./useItemConfigForm";
import type { FilterField } from "~/components/Table";

type ItemConfig<T = any> = {
  tab: TabsTypes;
  name: string;
  columns: TableColumn<T>[];
  data: T[];
  onOpenDetails?: (row: T) => void;
  onOpenNew?: () => void;
  filterFields?: FilterField[];
};

export type FieldsForm = FilterField & {
  required?: boolean;
};

const TAB_ORDER: TabsTypes[] = [
  "familias",
  "categorias",
  "subcategorias",
  "unidades",
];

const TAB_META: Record<TabsTypes, { name: string; singular: string }> = {
  familias: { name: "Familias", singular: "Familia" },
  categorias: { name: "Categorías", singular: "Categoría" },
  subcategorias: { name: "Subcategorías", singular: "Subcategoría" },
  unidades: { name: "Unidades", singular: "Unidad" },
};

const createDateColumn = (
  name: string,
  key: "created_at" | "updated_at",
): TableColumn<any> => ({
  name,
  selector: (row: any) =>
    new Date(row[key]).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  sortable: true,
  width: "190px",
});

const toFilterFields = (fields: FieldsForm[]): FilterField[] =>
  fields.map(({ required, ...field }) => field);

export default function useItemsConfig() {
  const { openModal } = useModal();
  const { form, onSubmit } = useItemConfigForm();
  const {
    getFamilias,
    getCategorias,
    getSubcategorias,
    getUnidades,
    familias,
    categorias,
    subcategorias,
    unidades,
  } = useDataContext();

  useEffect(() => {
    if (!familias) getFamilias();
    if (!categorias) getCategorias();
    if (!subcategorias) getSubcategorias();
    if (!unidades) getUnidades();
  }, []);

  const familiasOptions = useMemo(
    () => (familias ?? []).map((fam) => ({ value: fam.id, label: fam.name })),
    [familias],
  );

  const categoriasOptions = useMemo(
    () =>
      (categorias ?? []).map((cat) => ({ value: cat.id, label: cat.name })),
    [categorias],
  );

  const categoriasConFamilia = useMemo(
    () =>
      (categorias ?? []).map((cat) => ({
        ...cat,
        familia:
          (familias ?? []).find((fam) => fam.id === cat.id_family)?.name ??
          "Sin familia",
      })),
    [categorias, familias],
  );

  const subCategoriasConDetalles = useMemo(
    () =>
      (subcategorias ?? []).map((subcat) => {
        const categoria = (categorias ?? []).find(
          (cat) => cat.id === subcat.id_categoria,
        );
        const familia = (familias ?? []).find(
          (fam) => fam.id === categoria?.id_family,
        );

        return {
          ...subcat,
          categoria: categoria?.name ?? "Sin categoría",
          familia: familia?.name ?? "Sin familia",
          id_family: familia?.id ?? "",
        };
      }),
    [subcategorias, categorias, familias],
  );

  const createOnOpenDetails = useCallback(
    (fieldsForm: FieldsForm[]) => (row: any) => {
      const newForm = form;
      newForm.reset(row);
      openModal("form", {
        component: ItemConfigModal,
        props: {
          form: newForm,
          title: `Editar ${row.name}`,
          fieldsForm,
        },
        onSubmit: form.handleSubmit(onSubmit),
      });
    },
    [form, openModal, onSubmit],
  );

  const createOnOpenNew = useCallback(
    (fieldsForm: FieldsForm[], itemName: string) => () => {
      const newForm = form;
      newForm.reset({});
      openModal("form", {
        component: ItemConfigModal,
        props: {
          form: newForm,
          title: `Nuevo ${itemName}`,
          fieldsForm,
        },
        onSubmit: form.handleSubmit(onSubmit),
      });
    },
    [form, openModal, onSubmit],
  );

  const fieldsByTab = useMemo<Record<TabsTypes, FieldsForm[]>>(
    () => ({
      familias: [
        { key: "name", label: "Nombre", type: "text", required: true },
      ],
      categorias: [
        { key: "name", label: "Nombre", type: "text", required: true },
        {
          key: "id_family",
          label: "Familia",
          type: "select",
          options: familiasOptions,
          required: true,
        },
      ],
      subcategorias: [
        { key: "name", label: "Nombre", type: "text", required: true },
        {
          key: "id_categoria",
          label: "Categoría",
          type: "select",
          options: categoriasOptions,
          required: true,
        },
        {
          key: "id_family",
          label: "Familia",
          type: "select",
          options: familiasOptions,
          required: false,
        },
      ],
      unidades: [
        { key: "name", label: "Nombre", type: "text", required: true },
        {
          key: "abbreviation",
          label: "Abreviación",
          type: "text",
          required: true,
        },
      ],
    }),
    [familiasOptions, categoriasOptions],
  );

  const columnsByTab = useMemo<Record<TabsTypes, TableColumn<any>[]>>(
    () => ({
      familias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        createDateColumn("Última actualización", "updated_at"),
      ],
      categorias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        { name: "Familia", selector: (row: any) => row.familia, sortable: true },
        createDateColumn("Última actualización", "updated_at"),
      ],
      subcategorias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        {
          name: "Categoría",
          selector: (row: any) => row.categoria,
          sortable: true,
        },
        { name: "Familia", selector: (row: any) => row.familia, sortable: true },
        createDateColumn("Última actualización", "updated_at"),
      ],
      unidades: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        {
          name: "Abreviación",
          selector: (row: any) => row.abbreviation,
          sortable: true,
        },
        createDateColumn("Última actualización", "updated_at"),
      ],
    }),
    [],
  );

  const dataByTab = useMemo<Record<TabsTypes, any[]>>(
    () => ({
      familias: familias ?? [],
      categorias: categoriasConFamilia,
      subcategorias: subCategoriasConDetalles,
      unidades: unidades ?? [],
    }),
    [familias, categoriasConFamilia, subCategoriasConDetalles, unidades],
  );

  const getItemsConfig = (): ItemConfig[] => {
    if (!familias || !categorias || !subcategorias || !unidades) return [];

    return TAB_ORDER.map((tab) => {
      const fields = fieldsByTab[tab];

      return {
        tab,
        name: TAB_META[tab].name,
        columns: columnsByTab[tab],
        data: dataByTab[tab],
        onOpenDetails: createOnOpenDetails(fields),
        onOpenNew: createOnOpenNew(fields, TAB_META[tab].singular),
        filterFields: toFilterFields(fields),
      };
    });
  };

  return { getItemsConfig };
}

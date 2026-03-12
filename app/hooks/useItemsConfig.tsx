import { useCallback, useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { TabsTypes } from "~/routes/configuraciones/productos";
import { useModal } from "~/context/ModalContext";
import { ItemConfigModal } from "~/components/modals/customs/ItemConfigModal";
import type { FilterField } from "~/components/Table";
import { useConfigItemsProd } from "./useConfigItemsProd";
import { useDataContext } from "~/context/DataContext";
import { useForm } from "react-hook-form";
import { prepareUpdatePayload } from "~/utils/functions";
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
  onChange?: (value: any) => void;
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
  fields.map(({ required, onChange, ...field }) => field);

export default function useItemsConfig() {
  const {
    subcategorias,
    categorias,
    familias,
    unidades,
    familiasOptions,
    categoriasOptions,
  } = useConfigItemsProd();
  const {
    createFamilias,
    updateFamilias,
    deleteFamilias,
    reactivateFamilias,
    createCategorias,
    updateCategorias,
    deleteCategorias,
    reactivateCategorias,
    createSubcategorias,
    updateSubcategorias,
    deleteSubcategorias,
    reactivateSubcategorias,
    createUnidades,
    updateUnidades,
    deleteUnidades,
    reactivateUnidades,
  } = useDataContext();
  const { openModal, setMessageForm, setStepForm } = useModal();
  const form = useForm<any>({
    defaultValues: {},
  });

  // Factory para crear handlers dinámicos por tipo de entidad
  const createHandlers = useCallback(
    (
      createFn: (data: any) => Promise<any>,
      updateFn: (id: string, data: any) => Promise<any>,
      desactivateFn: (id: string) => Promise<any>,
      reactivateFn: (id: string) => Promise<any>,
      entityName: string,
    ) => ({
      onCreate: async (data: any) => {
        const { id, created_at, updated_at, active, ...payload } = data;
        const result = await createFn(payload);
        if (result.error) {
          setMessageForm(
            result.error.message || `Error al crear ${entityName}`,
          );
          setStepForm("error");
          return;
        }
        setMessageForm(`${entityName} creado exitosamente`);
        setStepForm("success");
      },
      onUpdate: async (data: any) => {
        const { id, created_at, updated_at, active, ...rest } = data;
        const payload = prepareUpdatePayload({
          dirtyFields: form.formState.dirtyFields,
          formData: rest,
        });
        const result = await updateFn(id, payload);
        if (result.error) {
          setMessageForm(
            result.error.message || `Error al actualizar ${entityName}`,
          );
          setStepForm("error");
          return;
        }
        setMessageForm(`${entityName} actualizado exitosamente`);
        setStepForm("success");
      },
      onDelete: async (id: string) => {
        const result = await desactivateFn(id);
        if (result.error) {
          setMessageForm(
            result.error.message || `Error al dar de baja ${entityName}`,
          );
          setStepForm("error");
          return;
        }
        setMessageForm(`${entityName} dado de baja exitosamente`);
        setStepForm("success");
      },
      onReactivate: async (id: string) => {
        const result = await reactivateFn(id);
        if (result.error) {
          setMessageForm(
            result.error.message || `Error al reactivar ${entityName}`,
          );
          setStepForm("error");
          return;
        }
        setMessageForm(`${entityName} reactivado exitosamente`);
        setStepForm("success");
      },
    }),
    [form, setMessageForm, setStepForm],
  );

  // Handlers específicos por tipo de entidad
  const handlersByTab = useMemo(
    () => ({
      familias: createHandlers(
        createFamilias,
        updateFamilias,
        deleteFamilias,
        reactivateFamilias,
        "Familia",
      ),
      categorias: createHandlers(
        createCategorias,
        updateCategorias,
        deleteCategorias,
        reactivateCategorias,
        "Categoría",
      ),
      subcategorias: createHandlers(
        createSubcategorias,
        updateSubcategorias,
        deleteSubcategorias,
        reactivateSubcategorias,

        "Subcategoría",
      ),
      unidades: createHandlers(
        createUnidades,
        updateUnidades,
        deleteUnidades,
        reactivateUnidades,
        "Unidad",
      ),
    }),
    [
      createHandlers,
      createFamilias,
      updateFamilias,
      deleteFamilias,
      reactivateFamilias,
      createCategorias,
      updateCategorias,
      createSubcategorias,
      updateSubcategorias,
      createUnidades,
      updateUnidades,
    ],
  );

  const categoriasConFamilia = useMemo(
    () =>
      (categorias ?? []).map((cat) => ({
        ...cat,
        name_family:
          (familias ?? []).find((fam) => fam.id === cat.id_family)?.name ??
          "Sin familia",
      })),
    [categorias, familias],
  );

  const subCategoriasConDetalles = useMemo(
    () =>
      (subcategorias ?? []).map((subcat) => {
        const category = (categorias ?? []).find(
          (cat) => cat.id === subcat.id_category,
        );
        const family = (familias ?? []).find(
          (fam) => fam.id === category?.id_family,
        );

        return {
          ...subcat,
          name_category: category?.name ?? "Sin categoría",
          name_family: family?.name ?? "Sin familia",
          id_family: family?.id ?? "",
        };
      }),
    [subcategorias, categorias, familias],
  );

  const createOnOpenDetails = useCallback(
    (fieldsForm: FieldsForm[], tab: TabsTypes) => (row: any) => {
      const newForm = form;
      newForm.reset(row);
      const handlers = handlersByTab[tab];
      openModal("form", {
        component: ItemConfigModal,
        props: {
          form: newForm,
          title: `Editar ${row.name}`,
          fieldsForm,
          onDelete: () => handlers.onDelete(row.id),
          onReactivate: () => handlers.onReactivate(row.id),
        },
        onSubmit: form.handleSubmit(handlers.onUpdate),
      });
    },
    [form, openModal, handlersByTab],
  );

  const createOnOpenNew = useCallback(
    (fieldsForm: FieldsForm[], itemName: string, tab: TabsTypes) => () => {
      const newForm = form;
      newForm.reset({});
      const handlers = handlersByTab[tab];
      openModal("form", {
        component: ItemConfigModal,
        props: {
          form: newForm,
          title: `Nuevo ${itemName}`,
          fieldsForm,
        },
        onSubmit: form.handleSubmit(handlers.onCreate),
      });
    },
    [form, openModal, handlersByTab],
  );

  const fieldsByTab = useMemo<Record<TabsTypes, FieldsForm[]>>(
    () => ({
      familias: [
        {
          key: "name",
          label: "Nombre",
          type: "text",
          required: true,
        },
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
          key: "id_family",
          label: "Familia",
          type: "select",
          options: familiasOptions,
          required: false,
          onChange: (value) => {
            form.setValue("id_category", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
        },
        {
          key: "id_category",
          label: "Categoría",
          type: "select",
          options: categoriasOptions,
          required: true,
          onChange: (value) => {
            const id_family = categorias?.find(
              (cat) => cat.id === value,
            )?.id_family;
            form.setValue("id_family", id_family || "", {
              shouldDirty: true,
              shouldValidate: true,
            });
          },
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
    [familiasOptions, categoriasOptions, categorias],
  );

  const columnsByTab = useMemo<Record<TabsTypes, TableColumn<any>[]>>(
    () => ({
      familias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        createDateColumn("Última actualización", "updated_at"),
        {name: "Estado", selector: (row: any) => (row.active ? "Activo" : "Inactivo"), sortable: true, width: "120px"},
      ],
      categorias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        {
          name: "Familia",
          selector: (row: any) => row.name_family,
          sortable: true,
        },
        createDateColumn("Última actualización", "updated_at"),
         {name: "Estado", selector: (row: any) => (row.active ? "Activo" : "Inactivo"), sortable: true, width: "120px"},
      ],
      subcategorias: [
        createDateColumn("Fecha de creación", "created_at"),
        { name: "Nombre", selector: (row: any) => row.name, sortable: true },
        {
          name: "Categoría",
          selector: (row: any) => row.name_category,
          sortable: true,
        },
        {
          name: "Familia",
          selector: (row: any) => row.name_family,
          sortable: true,
        },
        createDateColumn("Última actualización", "updated_at"),
         {name: "Estado", selector: (row: any) => (row.active ? "Activo" : "Inactivo"), sortable: true, width: "120px"},
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
         {name: "Estado", selector: (row: any) => (row.active ? "Activo" : "Inactivo"), sortable: true, width: "120px"},
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
        onOpenDetails: createOnOpenDetails(fields, tab),
        onOpenNew: createOnOpenNew(fields, TAB_META[tab].singular, tab),
        filterFields: toFilterFields(fields),
      };
    });
  };

  return { getItemsConfig };
}

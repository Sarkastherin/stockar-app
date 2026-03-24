export type DirtyMap<T> = Partial<Record<keyof T, boolean>>;

type Props<T extends { id: number | string }> = {
  dirtyFields: DirtyMap<T>;
  formData: T;
};

export const prepareUpdatePayload = <T extends { id: number | string }>({
  dirtyFields,
  formData,
}: Props<T>) => {
  const updatePayload = Object.entries(dirtyFields).reduce(
    (acc, [key, isDirty]) => {
      if (isDirty && key != undefined) {
        acc[key as keyof T] = formData[key as keyof T];
      }
      return acc;
    },
    {} as Partial<T>,
  );
  return updatePayload;
};
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const relativeTimeFormat = (date: string) => {
  const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });
  const iso = date
    .replace(" ", "T")
    .replace(/([+-]\d{2})$/, "$1:00") // Convierte -03 a -03:00
    .replace("+00:00", "Z") // +00:00 → Z
    .split(".")[0]; // Elimina milisegundos para compatibilidad
  const timestamp = new Date(iso).getTime();
  const now = Date.now();
  // diferencia en días
  const diffInDays = Math.round((timestamp - now) / (1000 * 60 * 60 * 24));
  if (Math.abs(diffInDays) < 4) {
    return `${capitalize(rtf.format(diffInDays, "day"))} ${new Date(iso).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  else {
    return new Date(iso).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

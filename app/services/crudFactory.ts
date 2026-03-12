const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/";

type CreatePayload<T> = Omit<T, "id" | "created_at" | "updated_at" | "active">;
type UpdatePayload<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;

export type ServiceResult<T> = {
  data: T | null;
  error: Error | null;
};

export type CrudService<T> = {
  read: () => Promise<ServiceResult<T[]>>;
  insert: (data: CreatePayload<T>) => Promise<ServiceResult<T>>;
  update: (id: string, data: UpdatePayload<T>) => Promise<ServiceResult<T>>;
  delete: (id: string) => Promise<ServiceResult<void>>;
  desactivate: (id: string) => Promise<ServiceResult<void>>;
};

const toError = (error: unknown) =>
  error instanceof Error ? error : new Error("Unknown error");

const parseHttpError = async (response: Response): Promise<Error> => {
  const fallbackMessage = `HTTP error! status: ${response.status}`;

  try {
    const body = (await response.json()) as Record<string, unknown>;
    const message =
      typeof body.message === "string" && body.message.trim() !== ""
        ? body.message
        : fallbackMessage;
    const constraint =
      typeof body.constraint === "string" && body.constraint.trim() !== ""
        ? body.constraint
        : null;

    return new Error(constraint ? `${message} (${constraint})` : message);
  } catch {
    return new Error(fallbackMessage);
  }
};

export const createCrud = <T,>(table: string): CrudService<T> => {
  return {
    read: async () => {
      const url = `${API_BASE_URL}${table}`;
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw await parseHttpError(response);
        }
        const data = await response.json();
        return { data, error: null };
      } catch (err) {
        const error = toError(err);
        console.error(`Error fetching data from ${url}:`, error);
        return { data: null, error };
      }
    },

    insert: async (data: CreatePayload<T>) => {
      const url = `${API_BASE_URL}${table}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw await parseHttpError(response);
        }
        const result = await response.json();
        return { data: result, error: null };
      } catch (err) {
        return { data: null, error: toError(err)};
      }
    },

    update: async (id: string, data: UpdatePayload<T>) => {
      const url = `${API_BASE_URL}${table}/${id}`;
      try {
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = await response.json();
        return { data: result, error: null };
      } catch (err) {
        const error = toError(err);
        console.error(`Error updating data at ${url}:`, error);
        return { data: null, error };
      }
    },

    delete: async (id: string) => {
      const url = `${API_BASE_URL}${table}/${id}`;
      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        return { data: undefined, error: null };
      } catch (err) {
        const error = toError(err);
        console.error(`Error deleting data at ${url}:`, error);
        return { data: null, error };
      }
    },
    desactivate: async (id: string) => {
      const url = `${API_BASE_URL}${table}/${id}/soft-delete`;
      try {
        const response = await fetch(url, {
          method: "PATCH",
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        return { data: undefined, error: null };
      } catch (err) {
        const error = toError(err);
        console.error(`Error deactivating data at ${url}:`, error);
        return { data: null, error };
      }
    }
  };
};

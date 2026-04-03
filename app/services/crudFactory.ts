const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/";

import type { AuthContextType } from "~/context/AuthContext";

type CreatePayload<T> = Omit<T, "id" | "created_at" | "updated_at" | "active">;
type UpdatePayload<T> = Partial<Omit<T, "id" | "created_at" | "updated_at">>;

type AuditFields = {
  created_by?: string;
  updated_by?: string;
};

type PaginationMeta = {
  total: number;
  limit: number;
  offset: number;
  count: number;
  hasNextPage: boolean;
};

type ApiEnvelope<T> = {
  message?: string;
  count?: number;
  data?: T;
  pagination?: PaginationMeta;
  [key: string]: unknown;
};

let resolveActorId: (() => string | null | undefined) | null = null;

export const setCrudActorResolver = (
  resolver: (() => string | null | undefined) | null,
) => {
  resolveActorId = resolver;
};

const getAuditFields = (mode: "insert" | "update"): AuditFields => {
  const actorId = resolveActorId?.();
  if (!actorId) return {};

  if (mode === "insert") {
    return { created_by: actorId, updated_by: actorId };
  }

  return { updated_by: actorId };
};

export type ServiceResult<T> = {
  data: T | null;
  error: Error | null;
};

export type ListServiceResult<T> = {
  data: T[] | null;
  pagination: PaginationMeta | null;
  error: Error | null;
};

export type CrudService<T> = {
  read: () => Promise<ListServiceResult<T>>;
  insert: (data: CreatePayload<T>) => Promise<ServiceResult<T>>;
  insertMany: (data: CreatePayload<T>[]) => Promise<ServiceResult<T[]>>;
  update: (id: string, data: UpdatePayload<T>) => Promise<ServiceResult<T>>;
  delete: (id: string) => Promise<ServiceResult<void>>;
  desactivate: (id: string) => Promise<ServiceResult<T>>;
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

const extractTablePayload = <T>(
  table: string,
  body: Record<string, unknown>,
): T | null => {
  const payload = body[table];

  if (payload === undefined || payload === null) {
    return null;
  }

  return payload as T;
};

export const createCrud = <T>(
  table: string,
  fetchWithAuth: AuthContextType["fetchWithAuth"],
): CrudService<T> => {
  return {
    read: async () => {
      const url = `${API_BASE_URL}${table}`;
      try {
        const response = await fetchWithAuth(url);

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = (await response.json()) as ApiEnvelope<T[]>;
        return {
          data: Array.isArray(result.data) ? result.data : [],
          pagination: result.pagination ?? null,
          error: null,
        };
      } catch (err) {
        const error = toError(err);
        console.error(`Error fetching data from ${url}:`, error);
        return { data: null, pagination: null, error };
      }
    },

    insert: async (data: CreatePayload<T>) => {
      const url = `${API_BASE_URL}${table}`;
      try {
        const payload = {
          ...data,
          ...getAuditFields("insert"),
        };

        const response = await fetchWithAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = (await response.json()) as Record<string, unknown>;
        return {
          data: extractTablePayload<T>(table, result),
          error: null,
        };
      } catch (err) {
        return { data: null, error: toError(err) };
      }
    },

    insertMany: async (data: CreatePayload<T>[]) => {
      const url = `${API_BASE_URL}${table}/bulk`;
      try {
        const payload = data.map((item) => ({
          ...item,
          ...getAuditFields("insert"),
        }));

        const response = await fetchWithAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = (await response.json()) as Record<string, unknown>;
        return {
          data: extractTablePayload<T[]>(table, result) ?? [],
          error: null,
        };
      } catch (err) {
        const error = toError(err);
        console.error(`Error inserting many data at ${url}:`, error);
        return { data: null, error };
      }
    },

    update: async (id: string, data: UpdatePayload<T>) => {
      const url = `${API_BASE_URL}${table}/${id}`;
      try {
        const payload = {
          ...data,
          ...getAuditFields("update"),
        };

        const response = await fetchWithAuth(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = (await response.json()) as T;
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
        const response = await fetchWithAuth(url, {
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
        const response = await fetchWithAuth(url, {
          method: "PATCH",
        });

        if (!response.ok) {
          throw await parseHttpError(response);
        }

        const result = (await response.json()) as Record<string, unknown>;
        return {
          data: extractTablePayload<T>(table, result),
          error: null,
        };
      } catch (err) {
        const error = toError(err);
        console.error(`Error deactivating data at ${url}:`, error);
        return { data: null, error };
      }
    },
  };
};
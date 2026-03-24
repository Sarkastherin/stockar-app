import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { setCrudActorResolver } from "~/services/crudFactory";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

interface AuthContextType {
  me: () => Promise<any | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: (
    input: RequestInfo,
    init?: RequestInit,
    retry?: boolean,
  ) => Promise<Response>;
  user: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveUrl(input: RequestInfo): RequestInfo {
  if (typeof input !== "string") return input;
  // If it's already absolute, return it; otherwise build absolute from base
  try {
    const maybeUrl = new URL(input);
    return maybeUrl.toString();
  } catch {
    // input is relative
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    return new URL(input.replace(/^\//, ""), base).toString();
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const me = useCallback(async (): Promise<any | null> => {
    const url = resolveUrl("/api/auth/me") as string;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (res.status === 200) {
      const body = await res.json();
      // backend returns { user: { ... } }
      return body;
    }
    if (res.status === 401) return null;
    throw new Error(`me() failed: ${res.status}`);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const url = resolveUrl("/api/auth/login") as string;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user || null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    const url = resolveUrl("/api/auth/logout") as string;
    await fetch(url, { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
    const url = resolveUrl("/api/auth/refresh") as string;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return false;
    // If refresh succeeded, update user state from /me (optional but useful)
    try {
      const body = await me();
      setUser(body?.user ?? null);
    } catch {}
    return true;
  }, [me]);

  const fetchWithAuth = useCallback(
    async (
      input: RequestInfo,
      init: RequestInit = {},
      retry = true,
    ): Promise<Response> => {
      const resolved = resolveUrl(input);
      const opts: RequestInit = { ...init, credentials: "include" };
      let res = await fetch(resolved as RequestInfo, opts);
      if (res.status !== 401) return res;

      if (retry) {
        const refreshed = await tryRefresh();
        if (refreshed) {
          // reintentar la petición original una vez
          res = await fetch(resolved as RequestInfo, opts);
          // si la petición ahora es ok, opcionalmente refrescamos user
          if (res.ok) {
            try {
              const body = await me();
              setUser(body?.user ?? null);
            } catch {
              // noop
            }
          }
          return res;
        }
      }
      return res;
    },
    [me, tryRefresh],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await me();
        if (!mounted) return;
        setUser(result?.user ?? null);
      } catch (err) {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [me]);

  useEffect(() => {
    setCrudActorResolver(() => user?.id ?? null);

    return () => {
      setCrudActorResolver(null);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ me, login, logout, fetchWithAuth, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  apiFetch,
  ApiError,
  AUTH_UNAUTHORIZED_EVENT,
  clearAuthToken,
  setAuthToken,
} from "../lib/api";
import { AuthContext } from "./authContextInstance";

const STORAGE_KEY = "forward_auth_session";
const STORAGE_VERSION = 3;

const SAFE_USER_FIELDS = [
  "id",
  "name",
  "email",
  "accountType",
  "brandName",
  "phoneNumber",
  "location",
];

const ACCOUNT_TYPE_MAP = {
  client: "client",
  "brand owner": "client",
  staff: "staff",
  "agency staff": "agency",
  agency: "agency",
};

function normalizeAccountType(raw) {
  if (!raw) return "client";
  const key = String(raw).trim().toLowerCase();
  return ACCOUNT_TYPE_MAP[key] || key;
}

function toSafeUser(fullUser) {
  if (!fullUser || typeof fullUser !== "object") return null;
  const safe = {};
  for (const field of SAFE_USER_FIELDS) {
    if (fullUser[field] !== undefined) {
      safe[field] = fullUser[field];
    }
  }
  safe.accountType = normalizeAccountType(fullUser.accountType);
  return safe;
}

function readPersistedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      parsed.__v !== STORAGE_VERSION ||
      !parsed.user ||
      !parsed.token
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return { token: parsed.token, user: parsed.user };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writePersistedSession(session) {
  if (!session || !session.token || !session.user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      __v: STORAGE_VERSION,
      token: session.token,
      user: toSafeUser(session.user),
    }),
  );
}

export function AuthProvider({ children }) {
  const initialSession = useMemo(() => readPersistedSession(), []);
  const [token, setToken] = useState(initialSession?.token ?? null);
  const [user, setUser] = useState(initialSession?.user ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      clearAuthToken();
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      writePersistedSession({ token, user });
    } else {
      writePersistedSession(null);
    }
  }, [token, user]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      const next = readPersistedSession();
      setToken(next?.token ?? null);
      setUser(next?.user ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const applyAuthResponse = useCallback((data) => {
    if (!data || typeof data !== "object" || !data.token || !data.user) {
      throw new ApiError("Invalid response from server.", 0);
    }
    const nextUser = {
      ...data.user,
      accountType: normalizeAccountType(data.user.accountType),
    };
    setAuthToken(data.token);
    setToken(data.token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signIn = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        const data = await apiFetch("/user/auth/login", {
          method: "POST",
          body: { email, password },
          skipAuth: true,
        });
        return applyAuthResponse(data);
      } finally {
        setLoading(false);
      }
    },
    [applyAuthResponse],
  );

  const signUp = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const data = await apiFetch("/add/user", {
          method: "POST",
          body: payload,
          skipAuth: true,
        });
        return applyAuthResponse(data);
      } finally {
        setLoading(false);
      }
    },
    [applyAuthResponse],
  );

  const signOut = useCallback(async () => {
    const hadToken = Boolean(token);
    setToken(null);
    setUser(null);
    clearAuthToken();
    if (hadToken) {
      try {
        await apiFetch("/user/auth/logout", { method: "POST" });
      } catch {
        // Ignore logout errors; the local session is already cleared.
      }
    }
  }, [token]);

  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setUser(null);
      clearAuthToken();
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    return () =>
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isAgency: user?.accountType === "agency",
      signIn,
      signUp,
      signOut,
    }),
    [user, token, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

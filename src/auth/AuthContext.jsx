import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "../lib/api";
import { AuthContext } from "./authContextInstance";

const STORAGE_KEY = "forward_auth_user";
const STORAGE_VERSION = 2;

const SAFE_USER_FIELDS = [
  "id",
  "name",
  "email",
  "accountType",
  "brandName",
  "phoneNumber",
  "location",
  "token",
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

function readPersistedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (!parsed || parsed.__v !== STORAGE_VERSION || !parsed.user) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.user;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function writePersistedUser(safeUser) {
  if (!safeUser) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ __v: STORAGE_VERSION, user: safeUser }),
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readPersistedUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    writePersistedUser(user ? toSafeUser(user) : null);
  }, [user]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;
      setUser(readPersistedUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await apiFetch("/user/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (!data || typeof data !== "object") {
        throw new ApiError("Invalid response from server.", 0);
      }
      const nextUser = {
        ...data,
        accountType: normalizeAccountType(data.accountType),
      };
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (payload) => {
    setLoading(true);
    try {
      const data = await apiFetch("/add/user", {
        method: "POST",
        body: payload,
      });
      if (!data || typeof data !== "object") {
        throw new ApiError("Invalid response from server.", 0);
      }
      const nextUser = {
        ...data,
        accountType: normalizeAccountType(data.accountType),
      };
      setUser(nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAgency: user?.accountType === "agency",
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

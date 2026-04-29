const DEFAULT_API_BASE_URL =
  "https://forwardbackendserver-production-da6a.up.railway.app/";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

let currentToken = null;

export function setAuthToken(token) {
  currentToken = typeof token === "string" && token.length > 0 ? token : null;
}

export function clearAuthToken() {
  currentToken = null;
}

export function getAuthToken() {
  return currentToken;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path, options = {}) {
  const { body, headers, method = "GET", skipAuth = false, ...rest } = options;

  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(!skipAuth && currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {}),
      ...(headers || {}),
    },
    ...rest,
  };

  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, init);
  } catch (networkError) {
    throw new ApiError(
      "Unable to reach the server right now. Please try again.",
      0,
      networkError,
    );
  }

  const data = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && !skipAuth) {
      clearAuthToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
      }
    }
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

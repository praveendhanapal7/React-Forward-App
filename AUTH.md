# Authentication Notes

This document describes the current auth flow between the React client and the
Spring Boot API (`ForwardBackendServer`).

## How it works

1. The client calls `POST /user/auth/login` or `POST /add/user` with email and
   password (plus the organization access code on signup). Requests go through
   `apiFetch` in `src/lib/api.js`.
2. The server verifies the credentials, issues an opaque bearer token (32-byte
   `SecureRandom`, Base64 URL-safe), persists it in the `user_sessions` table,
   and returns:

   ```json
   {
     "token": "...",
     "user": {
       "email": "...",
       "name": "...",
       "accountType": "client | staff | agency",
       "brandName": "...",
       "phoneNumber": "...",
       "location": "..."
     }
   }
   ```

   `password` and `secretKey` are never returned.
3. The client stores `{ token, user }` in `localStorage` under
   `forward_auth_session` (versioned by `STORAGE_VERSION = 3`) and sets the
   token on the API module so every subsequent `apiFetch` includes
   `Authorization: Bearer <token>`.
4. Protected endpoints are guarded by `BearerAuthFilter`, which resolves the
   token to a `Users` row and exposes it via `CurrentUser.require(request)`.
   Controllers derive the caller's role and brand from that user; no client
   body carries `secretKey` anymore.
5. `POST /user/auth/logout` deletes the current session on the server; the
   client also clears local state.
6. If any request returns `401`, the API helper dispatches an
   `auth:unauthorized` window event and `AuthProvider` signs the user out.

## Frontend pieces

- `src/lib/api.js`: `setAuthToken`, `clearAuthToken`, `apiFetch` (attaches the
  bearer header, handles 401).
- `src/auth/AuthContext.jsx`: `AuthProvider` exposes
  `{ user, token, isAuthenticated, isAgency, signIn, signUp, signOut, loading }`
  via `useAuth()`.
- `src/auth/ProtectedRoute.jsx` / `src/auth/GuestRoute.jsx`: route guards.
- `accountType` is normalized on the server to `"client" | "staff" | "agency"`
  and re-normalized on the client to stay resilient.

## Server-side role rules

- `POST /add/leads`, `POST /add/notes`, `PUT /leads/:id/status`: any
  authenticated user. For non-agency callers, `clientName` on a new lead is
  forced to the caller's brand.
- `GET /get/leads/all` (also accepts legacy `POST`): agency gets every lead,
  everyone else is scoped to their `brandName`.
- `GET /get/all/brands` (also accepts legacy `POST`): agency only; others get
  `403`.

## Session lifetime

- Default TTL is 7 days; override with `APP_AUTH_SESSION_TTL_HOURS` on the
  server.
- Expired sessions are removed on access; there is no background sweeper yet.

## Out of scope (tracked for later)

- Refresh tokens / token rotation
- Password reset flow
- Email verification
- OAuth / social login
- Rate limiting on login / signup

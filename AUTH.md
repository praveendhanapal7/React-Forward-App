# Authentication Notes

This document captures the current (frontend-side) auth architecture after the
"Robust Auth Refactor" and the recommended backend changes that should follow.

## Frontend state today

- Single source of truth: `AuthContext` (`src/auth/AuthContext.jsx`) exposes
  `{ user, isAuthenticated, isAgency, signIn, signUp, signOut, loading }` via
  the `useAuth()` hook.
- Only a small **safe subset** of the user is persisted to `localStorage`
  (`id`, `name`, `email`, `accountType`, `brandName`, `phoneNumber`,
  `location`, `token`). The backend's `password` and `secretKey` are kept
  **only in memory** and are cleared on reload, sign-out, or tab close.
- `accountType` is normalized on the client to one of:
  `"client" | "staff" | "agency"`. Legacy values like `"Agency Staff"` or
  `"Brand Owner"` are mapped automatically.
- Route protection lives in `src/auth/ProtectedRoute.jsx` (requires auth) and
  `src/auth/GuestRoute.jsx` (redirects logged-in users away from
  `/signin` and `/signup`).
- All API calls go through `apiFetch` in `src/lib/api.js`, which uses
  `VITE_API_BASE_URL` (see `.env.example`).

### Known trade-off

Because `secretKey` is no longer persisted, the Dashboard signs the user out
on reload if `secretKey` is missing. This is an interim measure so we never
store the organization access code on disk. Fix by moving to token-based auth
below.

## Recommended backend changes

The frontend still has to include `secretKey` in a few request bodies because
the backend uses it to authorize reads. That should change.

### 1. Return a token (not the whole user record)

`POST /user/auth/login` should respond with:

```json
{
  "token": "<opaque or JWT>",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "accountType": "client | staff | agency",
    "brandName": "..."
  }
}
```

- Do **not** include `password` or `secretKey` in the response.
- Normalize `accountType` server-side to one of the three values above.

### 2. Authenticate protected routes with `Authorization: Bearer <token>`

Endpoints that currently accept `secretKey` in the body should instead read
the token and derive:

- the caller's role (`client` / `staff` / `agency`)
- the `brandName` they are allowed to access

Affected endpoints:

- `POST /get/leads/all`
- `POST /add/leads`
- `PUT  /leads/:id/status`
- `POST /add/notes`
- `POST /get/all/brands` (agency-only)

### 3. Server-enforced role checks

Today the frontend uses the hardcoded string `"forward@2025"` to decide if a
user is an agency member. That check has been removed from the frontend and
replaced with `accountType === "agency"`, but the backend must enforce the
same rule on each request. Never trust the frontend for authorization.

### 4. Optional: token refresh / expiry

Adding short-lived access tokens plus a refresh flow would allow us to safely
persist the token and avoid the "sign in again on every reload" behavior
noted above.

## Out of scope (tracked for later)

- Password reset flow
- Email verification
- OAuth / social login
- Rate limiting on login / signup (belongs on backend)

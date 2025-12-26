# Authentication Implementation with Kubb

This document describes the new authentication system implemented in `/apps/web` using Kubb-generated hooks.

## Overview

The authentication system has been completely reimplemented to use Kubb as the API client provider instead of manual fetch calls. This provides better type safety, automatic request/response handling, and cleaner code organization.

## Key Changes

### 1. Auth Context (`/apps/web/src/contexts/AuthContext.tsx`)

A new React Context has been created that:
- Uses the Kubb-generated `useLogin` hook from `@visus/api`
- Manages authentication state (user, token, isAuthenticated, isLoading)
- Handles automatic token validation and expiration checking
- Provides `login()` and `logout()` functions to the entire app

**Usage:**
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // ...
}
```

### 2. Authentication Guards (`/apps/web/src/lib/guards/auth.ts`)

Three guard functions for TanStack Router:

- **`requireAuth()`**: Protects private routes, redirects to login if not authenticated
- **`redirectIfAuthenticated()`**: Redirects authenticated users away from public pages (login, register)
- **`requireRole(allowedRoles)`**: Role-based access control for specific user types

**Usage in routes:**
```tsx
export const Route = createFileRoute("/_private/gestor")({
  beforeLoad: () => {
    requireRole(['GESTOR']);
  },
  component: GestorLayout,
});
```

### 3. Updated Login Page (`/apps/web/src/routes/_public/login.tsx`)

- Removed manual fetch implementation
- Now uses `useAuth()` context hook
- Cleaner error handling
- Automatic navigation after successful login

### 4. API Client Configuration (`/apps/web/src/config/api-setup.ts`)

Configures Axios with:
- Base URL from environment variables
- Request interceptor that automatically adds `Authorization: Bearer {token}` header
- Response interceptor that handles 401 errors and redirects to login

### 5. Route Protection

All layout routes now have authentication guards:

- **`/_public/layout.tsx`**: Uses `redirectIfAuthenticated()` to prevent logged-in users from accessing login/register
- **`/_private/gestor/layout.tsx`**: Uses `requireRole(['GESTOR'])`
- **`/_private/educador/layout.tsx`**: Uses `requireRole(['EDUCADOR'])`
- **`/_private/estudante/layout.tsx`**: Uses `requireRole(['ESTUDANTE'])`

### 6. Updated Components

All sidebar and navbar components now use `useAuth()` from the new context:
- `/apps/web/src/routes/_private/gestor/-components/sidebar.tsx`
- `/apps/web/src/routes/_private/educador/-components/sidebar.tsx`
- `/apps/web/src/routes/_private/estudante/-components/sidebar.tsx`
- `/apps/web/src/routes/_private/-components/navbar.tsx`

### 7. Root Configuration

- **`/apps/web/src/routes/__root.tsx`**: Wraps app with `AuthProvider`
- **`/apps/web/src/main.tsx`**: Calls `setupApiClient()` on app initialization

## How Authentication Works

### Login Flow

1. User enters credentials in login form
2. `useAuth().login()` is called with credentials
3. Kubb's `useLogin` mutation sends request to `/auth/login`
4. On success:
   - Token and user data are stored in localStorage
   - Auth context state is updated
   - User is redirected to appropriate dashboard based on role
5. On error:
   - Error message is displayed
   - Auth state is cleared

### Protected Routes

1. User navigates to a private route (e.g., `/gestor`)
2. `beforeLoad` guard runs (e.g., `requireRole(['GESTOR'])`)
3. Guard checks:
   - Token exists in localStorage
   - Token is not expired
   - User has required role
4. If check fails:
   - localStorage is cleared
   - User is redirected to `/login`
5. If check passes:
   - Route renders normally

### API Requests

1. Any Kubb-generated hook/function makes an API request
2. Axios request interceptor runs
3. Auth token is retrieved from localStorage
4. `Authorization: Bearer {token}` header is added
5. Request proceeds to backend
6. If backend returns 401:
   - Response interceptor catches it
   - Auth is cleared
   - User is redirected to login

### Logout Flow

1. User clicks logout button
2. `useAuth().logout()` is called
3. localStorage is cleared
4. Auth context state is reset
5. User is redirected to home page

## Environment Configuration

Create `.env.local` in `/apps/web/`:

```env
VITE_API_URL=http://localhost:8080
```

For production, update to your production API URL.

## Token Storage

Tokens are stored in localStorage with the following keys:
- `auth_token`: JWT token
- `auth_user`: User object (including roles)

## Migration Notes

### Old System (Manual Fetch)
```tsx
const loginViaFetch = async (params) => {
  const res = await fetch(`${API_BASE}/auth/login`, { ... });
  // Manual token and user storage
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}
```

### New System (Kubb + Context)
```tsx
const { login } = useAuth();
await login({ email, senha });
// Token and user storage handled automatically
// State management handled by context
```

## Benefits

1. **Type Safety**: Full TypeScript support from OpenAPI schema
2. **Centralized Auth**: Single source of truth via React Context
3. **Automatic Token Management**: Interceptors handle auth headers automatically
4. **Route Protection**: Declarative guards in route configuration
5. **Better UX**: Automatic redirect on auth errors
6. **Cleaner Code**: No manual localStorage manipulation in components
7. **Token Expiration**: Automatic checking and cleanup of expired tokens

## Testing

To test the authentication system:

1. Start the backend API on `http://localhost:8080`
2. Run the frontend: `npm run dev` in `/apps/web`
3. Navigate to `/login`
4. Enter valid credentials
5. Verify redirect to appropriate dashboard
6. Check that API requests include auth header (use browser DevTools Network tab)
7. Test logout functionality
8. Try accessing protected routes without auth (should redirect to login)

## Future Enhancements

- Implement `useRegister` hook using Kubb-generated mutation
- Add refresh token logic
- Add remember me functionality
- Implement password reset flow using Kubb hooks
- Add user profile update using Kubb mutations

# Quick Reference: Using Kubb Authentication

## 🚀 Quick Start

### In a Component

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return <div>Welcome, {user?.nome}!</div>;
}
```

### Making Authenticated API Calls

All Kubb-generated hooks automatically include auth headers:

```tsx
import { useGetEducador } from '@visus/api';

function EducadorProfile() {
  const { data, isLoading, error } = useGetEducador({
    params: { id: '123' }
  });

  // The request automatically includes: Authorization: Bearer {token}
}
```

### Protecting Routes

```tsx
// In your route file
import { createFileRoute } from '@tanstack/react-router';
import { requireRole } from '../lib/guards/auth';

export const Route = createFileRoute("/_private/admin")({
  beforeLoad: () => {
    requireRole(['GESTOR']); // Only allow GESTOR role
  },
  component: AdminPage,
});
```

## 📚 Available Guards

### `requireAuth()`
Ensures user is logged in, redirects to /login if not.

```tsx
beforeLoad: () => {
  requireAuth();
}
```

### `redirectIfAuthenticated()`
Redirects logged-in users away from public pages.

```tsx
// Use on login/register pages
beforeLoad: () => {
  redirectIfAuthenticated();
}
```

### `requireRole(allowedRoles)`
Checks if user has specific role(s).

```tsx
beforeLoad: () => {
  requireRole(['GESTOR', 'EDUCADOR']); // Allow either role
}
```

## 🔐 Auth Context API

### Properties

- `user: User | null` - Current user object
- `token: string | null` - JWT token
- `isAuthenticated: boolean` - Whether user is logged in
- `isLoading: boolean` - Loading state

### Methods

#### `login(credentials)`
```tsx
const { login } = useAuth();

await login({
  email: 'user@example.com',
  senha: 'password123'
});
```

#### `logout()`
```tsx
const { logout } = useAuth();

logout(); // Clears auth and redirects
```

## 🎯 User Object Structure

```typescript
interface User {
  id: number;
  nome: string;
  email: string;
  roles?: string[]; // e.g., ['GESTOR', 'EDUCADOR']
  userType?: string;
}
```

## 🔄 Common Patterns

### Conditional Rendering Based on Role

```tsx
function Dashboard() {
  const { user } = useAuth();

  const isGestor = user?.roles?.includes('GESTOR');
  const isEducador = user?.roles?.includes('EDUCADOR');

  return (
    <div>
      {isGestor && <GestorFeatures />}
      {isEducador && <EducadorFeatures />}
    </div>
  );
}
```

### Protected Action

```tsx
function DeleteButton() {
  const { user } = useAuth();
  const canDelete = user?.roles?.includes('GESTOR');

  if (!canDelete) return null;

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Logout with Confirmation

```tsx
function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate({ to: '/' });
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
```

## 🛠️ Using Kubb Mutations with Auth

All mutations automatically include auth headers:

```tsx
import { useCreateDisciplina } from '@visus/api';

function CreateDisciplina() {
  const mutation = useCreateDisciplina({
    mutation: {
      onSuccess: (data) => {
        console.log('Created:', data);
      },
    },
  });

  const handleCreate = () => {
    mutation.mutate({
      data: {
        nome: 'Math',
        descricao: 'Mathematics course',
      },
    });
  };

  return <Button onClick={handleCreate}>Create</Button>;
}
```

## ⚠️ Important Notes

1. **Auth headers are automatic** - Don't manually add Authorization headers
2. **Token stored in localStorage** - Persists across page refreshes
3. **Auto-redirect on 401** - If API returns unauthorized, user is redirected to login
4. **Token expiration checked** - Every 5 minutes and on component mount
5. **Role names are case-sensitive** - Use exact strings: 'GESTOR', 'EDUCADOR', 'ESTUDANTE'

## 🐛 Troubleshooting

### User not redirecting after login
Check that the user object has the correct `roles` array.

### 401 errors even when logged in
Check:
1. Token is stored in localStorage (check DevTools > Application > Local Storage)
2. Token is not expired (it's a JWT, decode it to check `exp`)
3. Backend is accepting the token format

### Protected route not blocking access
Make sure `beforeLoad` is using the guard correctly:
```tsx
// ❌ Wrong
beforeLoad: requireAuth

// ✅ Correct
beforeLoad: () => {
  requireAuth();
}
```

## 📖 Related Files

- **Auth Context**: `/apps/web/src/contexts/AuthContext.tsx`
- **Guards**: `/apps/web/src/lib/guards/auth.ts`
- **API Setup**: `/apps/web/src/config/api-setup.ts`
- **Auth Utils**: `/apps/web/src/lib/api/auth.ts`
- **Login Page**: `/apps/web/src/routes/_public/login.tsx`

# Tutorial de Integração Backend-Frontend

## 1. **Camada do Cliente API** (`src/lib/api/`)

### **Configuração** (`config.ts`)
- Define a URL base da API: `http://localhost:8080` (configurável via variável de ambiente `VITE_API_URL`)
- Centraliza todos os endpoints da API no objeto `API_ENDPOINTS`
- Fornece a função `getAuthHeaders()` para anexar tokens JWT nas requisições

### **Tipos** (`types.ts`)
- Interfaces TypeScript que espelham seus DTOs Java:
  - `UsuarioDetailsDTO` - Dados do perfil do usuário
  - `LoginResponseDTO` - Contém token JWT + dados do usuário
  - `RegisterDTO` - Payload de registro com todos os tipos de usuário
  - Enums: `UserTypeEnum`, `Genero`, `Periodo`, `AnoEscolar`

### **Cliente** (`client.ts`)
- **Classe ApiClient**: Wrapper em torno da Fetch API nativa
  - Manipula métodos GET, POST, PUT, DELETE
  - Anexa automaticamente headers `Authorization: Bearer <token>`
  - Faz parsing de respostas JSON
  - Trata erros (404, 403, 500, etc.)
  - Retorna respostas tipadas

- **Objeto authApi**: Métodos específicos de autenticação
  ```typescript
  authApi.login({ email, senha }) → LoginResponseDTO
  authApi.register(userData) → Objeto de usuário
  ```

### **Utilitários de Auth** (`auth.ts`)
- **authStorage**: Gerenciamento do LocalStorage
  - `getToken()` / `setToken()` - Persistência do JWT
  - `getUser()` / `setUser()` - Persistência dos dados do usuário
  - `clear()` - Limpeza no logout
  - `isAuthenticated()` - Verifica se está logado

- **Utilitários de token**:
  - `decodeToken()` - Decodifica payload JWT (base64)
  - `isTokenExpired()` - Verifica timestamp de expiração

## 2. **Hook React** (`src/lib/hooks/useAuth.ts`)

O hook `useAuth` fornece gerenciamento de estado e efeitos colaterais:

### **Estado**
```typescript
{
  user: UsuarioDetailsDTO | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null
}
```

### **Funções**
- **`login(credentials)`**
  1. Chama `authApi.login()` → backend `/auth/login`
  2. Recebe resposta `{ token, usuario }`
  3. Salva no localStorage via `authStorage`
  4. Atualiza o estado do React
  5. Usuário está autenticado

- **`register(userData)`**
  1. Chama `authApi.register()` → backend `/auth/register`
  2. Valida campos específicos por tipo de usuário
  3. Cria usuário no banco de dados
  4. Retorna objeto de usuário (sem login automático)

- **`logout()`**
  1. Limpa o localStorage
  2. Reseta o estado para null/false
  3. Usuário precisa fazer login novamente

### **Auto-expiração**
- No mount: Verifica se o token expirou → faz logout automático
- A cada 5 minutos: Re-verifica expiração do token
- Previne sessões obsoletas

## 3. Fluxo de Login

```
1. Usuário preenche email/senha
2. Frontend → POST /auth/login
3. Backend valida credenciais
4. Backend retorna { token, usuario }
5. Frontend salva no localStorage
6. Redireciona para /estudante, /educador ou /gestor
```

## 4. Fluxo de Registro

**Frontend valida campos por perfil:**
- **Estudante**: cpf, matricula, telefone, periodo, anoEscolar, genero
- **Educador**: cpf, telefone, genero, dataNascimento, titulo
- **Gestor**: cpf, telefone, genero, dataNascimento, cargo

**Backend processa:**
1. Cria usuário baseado no tipo (Estudante/Educador/Gestor)
2. Criptografa senha com BCrypt
3. Salva no banco de dados

## 5. Requisições Autenticadas

Toda requisição após login envia o token:

```typescript
Headers: {
  'Authorization': 'Bearer eyJhbG...',
  'Content-Type': 'application/json'
}
```

Backend valida o token antes de processar.

## 6. Segurança (Spring Boot)

**CORS**: Permite `localhost:5173` (frontend dev)

**Rotas públicas**: `/auth/login`, `/auth/register`

**Rotas protegidas**: Todas as outras (requer token JWT)

## 7. Variáveis de Ambiente

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:8080
```

## 8. Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| **403** | CORS ou campos faltando | Verifique CORS no backend e campos obrigatórios |
| **401** | Credenciais inválidas | Confira email/senha |
| **409** | Email já existe | Use outro email |
| **400** | Dados inválidos | Preencha todos os campos |

## 9. Resumo Rápido

1. `useAuth` hook gerencia autenticação
2. `authApi` faz chamadas HTTP para Spring Boot
3. Token JWT salvo no localStorage
4. Toda requisição protegida envia token no header
5. Backend valida token antes de processar
6. Redirecionamento automático por perfil após login

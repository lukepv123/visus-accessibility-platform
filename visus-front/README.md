# Visus — Monorepo (Web + Mobile)

Plataforma de comunicação acadêmica com foco em **acessibilidade para pessoas com deficiência visual**.
Stack: **React (Vite) + Material UI (MD3)** na web, **Expo + React Native Paper (MD3)** no mobile, com **tokens de tema compartilhados**.

---

## Tutorial para integração no backend

[😲](https://github.com/bluds-sa/visus/blob/main/integracao-tutorial.md)

## Estrutura

```
visus/
  package.json              # workspaces + scripts
  apps/
    web/                    # Vite + React + MUI
    mobile/                 # Expo + React Native + Paper (MD3)
  packages/
    theme/                  # @visus/theme (tokens MD3 compartilhados)
```

---

## Pré-requisitos

* **Node.js LTS** e **npm ≥ 7** (recomendado npm 10+)
* **Android Studio** (opcional para emulador) ou **Expo Go** no celular

---

## Instalação (na raiz)

```bash
npm install
```

> **WSL**: se o repositório estiver em `C:\...` (montado em `/mnt/c`), veja “Solução WSL”.

---

## Rodando

### Web (Vite + MUI)

```bash
npm run dev:web
```

* Usa `@visus/theme` (tokens compartilhados) com `ThemeProvider`.
* Alternância claro/escuro via `ThemeRoot` (`src/theme-toggle.tsx`).

### Mobile (Expo + Paper MD3)

**Rápido (Expo Go no celular):**

```bash
cd apps/mobile
npx expo start
```

Abra o app **Expo Go** (Android) e escaneie o QR (modo **LAN**).

**Emulador Android (Windows):**

1. Android Studio → *Virtual Device Manager* → crie/inicie um AVD.
2. No **Windows** (não no WSL), em `apps/mobile`:

   ```bash
   npx expo start
   ```
3. Clique em **Run on Android device/emulator**.

---

## Tokens de tema (compartilhados)

* Pacote: `packages/theme` (nome: **@visus/theme**)
* Entrada: `src/index.ts` exporta `{ light, dark }`

**Web:**

```ts
import { light, dark } from "@visus/theme";
```

**Mobile:**

```ts
import { light as tokensLight, dark as tokensDark } from "@visus/theme";
```

---

## Scripts úteis

```bash
# na raiz
npm run dev:web      # inicia a web (Vite)
npm run dev:mobile   # (se mapeado) inicia o mobile (Expo)
npm run lint         # lint no monorepo
npm run typecheck    # verificação de tipos
```

---

## Solução WSL (quando o Vite não resolve @visus/theme)

Se trabalha no **WSL** com o repo em `/mnt/c/...`, o Vite pode falhar ao resolver o symlink do workspace. O projeto já inclui:

**Alias no Vite (`apps/web/vite.config.ts`):**

```ts
resolve: {
  alias: { "@visus/theme": path.resolve(__dirname, "../../packages/theme/src") },
  preserveSymlinks: true
},
optimizeDeps: { exclude: ["@visus/theme"] },
ssr: { noExternal: ["@visus/theme"] }
```

**Paths no TS (`apps/web/tsconfig.app.json`):**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@visus/theme": ["../../packages/theme/src"]
    }
  }
}
```

> Alternativas: mover o repo para o filesystem do **WSL** (ex.: `~/code/visus`) **ou** gerar `dist/` em `@visus/theme` e exportar via `package.json`.

---

## Decisões do projeto

* **Material Design (MD3)** apenas: simplicidade, consistência e acessibilidade.
* **Tokens compartilhados** centralizam cores/tipografia/elevação.
* **Acessibilidade** é prioridade: leitores de tela, contraste e foco.

---

## Checklist de Acessibilidade (mínimo)

* Usar **sempre** as cores do tema (evitar hex solto nas telas).
* Alvos de toque **≥ 48 px**.
* Hierarquia de textos clara (`Typography` / heading levels).
* **Labels/ARIA** para ícones/botões e ordem de foco previsível.
* Testar com **TalkBack** (Android), **VoiceOver** (iOS) e leitor de tela no desktop.

---

## Problemas comuns

* **`Failed to resolve @visus/theme` (web):** confira alias no `vite.config.ts` e `paths` no `tsconfig.app.json`. Instale **na raiz**.
* **Android SDK no WSL:** rode o Expo no **Windows** (recomendado) ou configure `ANDROID_HOME` no WSL apontando para `C:\Users\<user>\AppData\Local\Android\Sdk`.
* **Portas/Firewall:** Expo precisa de rede local; use **LAN** e permita no firewall.

---

## Licença

Ainda não definimos uma licença.

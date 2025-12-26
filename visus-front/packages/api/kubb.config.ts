// packages/api/kubb.config.ts
import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig({
    input: {
        // Use a URL do OpenAPI (ex.: SpringDoc /v3/api-docs) ou caminho do arquivo.
        // Não estamos usando essa configuração porque o Gimas usa WSL e e ele não enxerga o localhost do Windows
        // path: process.env.KUBB_OAS ?? 'http://localhost:8080/v3/api-docs',
        path: "./openapi.json",
    },
    output: {
        path: "./src", // geraremos dentro do pacote
        clean: true,
    },
    plugins: [
        pluginOas({
            // Se seu OpenAPI tiver múltiplos "servers", escolha o index usado como baseURL:
            serverIndex: 0,
        }),
        pluginTs({
            output: { path: "models" },
        }),
        pluginClient({
            output: { path: "client" }, // <= Gera o client com "createClient"
            // Por padrão usa Axios. Para Fetch, troque para: client: 'fetch'
            client: "axios",
            // Você pode forçar um baseURL (senão herda do server do OpenAPI):
            // baseURL: process.env.API_BASE_URL,
        }),
        pluginReactQuery({
            output: { path: "react-query" },
            // Agrupa por "tag" do OpenAPI (facilita imports):
            group: { type: "tag" },
            // Faz os hooks usarem o client gerado acima (sem precisar passar baseUrl toda hora)
            client: { importPath: "../client" },
            // Se quiser que os hooks retornem data tipada via Zod:
            // parser: 'zod',
        }),
        pluginZod({
            output: { path: "zod" },
        }),
    ],
});

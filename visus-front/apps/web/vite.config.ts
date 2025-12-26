import path from "node:path";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
            generatedRouteTree: "./src/routeTree.gen.ts",
            routesDirectory: "./src/routes",
            routeToken: "layout",
        }),
        react(),
    ],
    resolve: {
        alias: {
            // aponta direto para o código do pacote de tema
            "@visus/theme": path.resolve(__dirname, "../../packages/theme/src"),
        },
        preserveSymlinks: true,
    },
    optimizeDeps: {
        // evita que o Vite tente pré-empacotar o pacote
        exclude: ["@visus/theme"],
    },
    ssr: { noExternal: ["@visus/theme"] },
});

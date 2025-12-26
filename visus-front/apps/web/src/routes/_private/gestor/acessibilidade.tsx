import { createFileRoute } from "@tanstack/react-router";
import Acessibilidade from "../-pages/acessibilidade";

export const Route = createFileRoute("/_private/gestor/acessibilidade")({
    component: Acessibilidade,
});

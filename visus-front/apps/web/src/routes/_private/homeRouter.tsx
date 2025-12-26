import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { authStorage } from "../../lib/api/auth";

export const Route = createFileRoute("/_private/homeRouter")({
    component: HomeRedirect,
});

// REVIEW: Provavelmente trocar por: https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes

function HomeRedirect() {
    const navigate = useNavigate();

    useEffect(() => {
        const currentRole = localStorage.getItem("role") || "ESTUDANTE";
        const user = authStorage.getUser();

        switch (currentRole) {
            case "ESTUDANTE":
                navigate({ to: "/estudante" });
                break;
            case "EDUCADOR":
                navigate({ to: "/educador" });
                break;
            case "GESTOR":
                // Check if gestor has an institution
                if (!user?.instituicao) {
                    navigate({ to: "/gestor/instituicao/criar" });
                } else {
                    navigate({ to: "/gestor" });
                }
                break;
            default:
                navigate({
                    to: "/estudante",
                });
        }
    }, [navigate]);

    return null;
}

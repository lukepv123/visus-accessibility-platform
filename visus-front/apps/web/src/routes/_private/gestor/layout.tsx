import { Box } from "@mui/material";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authStorage } from "../../../lib/api/auth";
import { requireRole } from "../../../lib/guards/auth";
import { Layout, RoleContext } from "../-components/main-layout";
import { GestorSidebar } from "./-components/sidebar";

export const Route = createFileRoute("/_private/gestor")({
    beforeLoad: ({ location }) => {
        requireRole(["GESTOR"]);

        // Check if gestor has an institution assigned
        const user = authStorage.getUser();
        const hasInstitution = user?.instituicao != null;

        // Allow access to criar page, acessibilidade page, and perfil page
        const isCreatingInstitution =
            location.pathname === "/gestor/instituicao/criar";
        const isAccessibilityPage =
            location.pathname === "/gestor/acessibilidade";
        const isProfilePage = location.pathname === "/gestor/perfil";

        // If gestor has no institution and is not on allowed pages, redirect
        if (
            !hasInstitution &&
            !isCreatingInstitution &&
            !isAccessibilityPage &&
            !isProfilePage
        ) {
            throw redirect({
                to: "/gestor/instituicao/criar",
            });
        }
    },
    component: GestorLayout,
});

function GestorLayout() {
    return (
        <RoleContext.Provider value="gestor">
            <Layout Sidebar={<GestorSidebar />}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                        bgcolor: "background.default",
                    }}
                >
                    <Outlet />
                </Box>
            </Layout>
        </RoleContext.Provider>
    );
}

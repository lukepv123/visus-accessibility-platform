import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireRole } from "../../../lib/guards/auth";
import { Layout, RoleContext } from "../-components/main-layout";
import { EstudanteSidebar } from "./-components/sidebar";

export const Route = createFileRoute("/_private/estudante")({
    beforeLoad: () => {
        requireRole(["ESTUDANTE"]);
    },
    component: EstudanteLayout,
});

export default function EstudanteLayout() {
    return (
        <RoleContext.Provider value="estudante">
            <Layout Sidebar={<EstudanteSidebar />}>
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

import { Box } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireRole } from "../../../lib/guards/auth";
import { Layout, RoleContext } from "../-components/main-layout";
import { EducadorSidebar } from "./-components/sidebar";

export const Route = createFileRoute("/_private/educador")({
    beforeLoad: () => {
        requireRole(["EDUCADOR"]);
    },
    component: EducadorLayout,
});

export default function EducadorLayout() {
    return (
        <RoleContext.Provider value="educador">
            <Layout Sidebar={<EducadorSidebar />}>
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

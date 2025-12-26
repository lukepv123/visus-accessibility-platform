import { Container } from "@mui/material";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { redirectIfAuthenticated } from "../../lib/guards/auth";
import { Footer } from "./-components/footer";
import { NavBar } from "./-components/navbar";

export const Route = createFileRoute("/_public")({
    beforeLoad: () => {
        redirectIfAuthenticated();
    },
    component: PublicLayout,
});

function PublicLayout() {
    return (
        <>
            <NavBar />
            <Container sx={{ py: 3 }}>
                <Outlet />
            </Container>
            <Footer />
        </>
    );
}

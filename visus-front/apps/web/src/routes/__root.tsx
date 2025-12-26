import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";
import { AuthProvider } from "../contexts/AuthContext";

export const Route = createRootRoute({ component: Root });

function Root() {
    return (
        <AuthProvider>
            <AccessibilityProvider>
                <HeadContent />
                <Outlet />
            </AccessibilityProvider>
        </AuthProvider>
    );
}

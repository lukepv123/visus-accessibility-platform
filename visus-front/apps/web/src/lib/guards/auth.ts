import { redirect } from "@tanstack/react-router";
import { authStorage, isTokenExpired } from "../api/auth";

/**
 * Authentication guard for TanStack Router
 * Use this in beforeLoad to protect private routes
 */
export function requireAuth() {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    // Check if user is authenticated and token is valid
    if (!token || !user || isTokenExpired(token)) {
        authStorage.clear();
        throw redirect({
            to: "/login",
            search: {
                redirect: window.location.pathname,
            },
        });
    }

    return { user, token };
}

/**
 * Guard to redirect authenticated users away from public pages (like login)
 */
export function redirectIfAuthenticated() {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (token && user && !isTokenExpired(token)) {
        // Get user's role and redirect to appropriate dashboard
        const roles = user.roles || [];

        if (roles.includes("GESTOR")) {
            // Check if gestor has an institution
            if (!user.instituicao) {
                throw redirect({ to: "/gestor/instituicao/criar" });
            }
            throw redirect({ to: "/gestor" });
        } else if (roles.includes("EDUCADOR")) {
            throw redirect({ to: "/educador" });
        } else if (roles.includes("ESTUDANTE")) {
            throw redirect({ to: "/estudante" });
        } else {
            throw redirect({ to: "/" });
        }
    }
}

/**
 * Role-based authorization guard
 */
export function requireRole(allowedRoles: string[]) {
    const { user } = requireAuth();
    const userRoles = user?.roles || [];

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
        throw redirect({
            to: "/",
            search: {
                error: "unauthorized",
            },
        });
    }

    return user;
}

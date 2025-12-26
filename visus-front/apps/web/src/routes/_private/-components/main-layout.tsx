import { Box } from "@mui/material";
import * as React from "react";
import { NavBar } from "./navbar";

// Contexto de perfil passado através do link
export type Role = "educador" | "gestor" | "estudante" | "publico";
export const RoleContext = React.createContext<Role>("publico");

interface LayoutProps {
    Sidebar: React.ReactNode;
    children: React.ReactNode;
}

export function Layout({ Sidebar, children }: LayoutProps) {
    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                bgcolor: "background.default",
            }}
        >
            {/* Sidebar dinâmica */}
            {Sidebar}

            {/* Área principal */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <NavBar />

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        p: 3,
                        overflowY: "auto",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

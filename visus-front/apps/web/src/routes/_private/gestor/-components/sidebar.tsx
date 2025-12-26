import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpIcon from "@mui/icons-material/Help";

import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

export function GestorSidebar() {
    const [expanded, setExpanded] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    // Check if gestor has an institution assigned
    const hasInstitution = user?.instituicao != null;

    // If no institution, only show Acessibilidade menu item
    const menu = hasInstitution
        ? [
              {
                  icon: <HomeIcon />,
                  label: "Home",
                  to: "/gestor",
              },
              {
                  icon: <SettingsAccessibilityIcon />,
                  label: "Acessibilidade",
                  to: "/gestor/acessibilidade",
              },
              {
                  icon: <DashboardIcon />,
                  label: "Dashboard",
                  to: "/gestor/dashboard",
              },
              {
                  icon: <SchoolIcon />,
                  label: "Disciplinas",
                  to: "/gestor/disciplinas",
              },
              {
                  icon: <GroupsIcon />,
                  label: "Usuários",
                  to: "/gestor/usuarios",
              },

              {
                  icon: <SummarizeIcon />,
                  label: "Relatórios",
                  to: "/gestor/relatorios",
              },
          ]
        : [
              {
                  icon: <SettingsAccessibilityIcon />,
                  label: "Acessibilidade",
                  to: "/gestor/acessibilidade",
              },
          ];

    const handleLogout = () => {
        logout();
        navigate({ to: "/" });
    };

    const bottom = hasInstitution
        ? [
              { icon: <HelpIcon />, label: "Ajuda", to: "/gestor/ajuda" },
              {
                  icon: <LogoutIcon />,
                  label: "Sair",
                  onClick: handleLogout,
                  color: "error.main",
              },
          ]
        : [
              {
                  icon: <LogoutIcon />,
                  label: "Sair",
                  onClick: handleLogout,
                  color: "error.main",
              },
          ];

    return (
        <Box
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            sx={{
                width: expanded ? 220 : 90,
                transition: "width 0.3s ease",
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: expanded ? "flex-start" : "center",
                py: 2,
                borderRadius: "16px 0 0 16px",
                ml: 1,
                mt: 1,
                mb: 1,
                boxShadow: 2,
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
            }}
        >
            {/* Logo */}
            <Box
                component="img"
                src="/src/assets/logo.svg"
                alt="logo"
                sx={{
                    height: 36,
                    mb: 3,
                    ml: expanded ? 2 : 0,
                    alignSelf: expanded ? "flex-start" : "center",
                    transition: "all 0.3s",
                }}
            />

            {/* Menu principal */}
            <Box sx={{ flex: 1 }}>
                {menu.map((item) => (
                    <Tooltip
                        key={item.label}
                        title={!expanded ? item.label : ""}
                        placement="right"
                    >
                        <Box
                            component={Link}
                            to={item.to}
                            aria-label={item.label}
                            role="button"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "text.secondary",
                                mb: 1,
                                px: expanded ? 2 : 1,
                                py: 1.5,
                                borderRadius: 2,
                                cursor: "pointer",
                                "&:hover": {
                                    color: "primary.main",
                                    bgcolor: "action.hover",
                                },
                                "&:focus": {
                                    outline: "2px solid",
                                    outlineColor: "primary.main",
                                    outlineOffset: "2px",
                                },
                                transition: "all 0.3s",
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: 28,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {item.icon}
                            </Box>
                            {expanded && (
                                <Typography
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                    aria-hidden="true"
                                >
                                    {item.label}
                                </Typography>
                            )}
                        </Box>
                    </Tooltip>
                ))}
            </Box>

            {/* Menu inferior */}
            {bottom.map((item, idx) => (
                <Tooltip key={item.label} title={item.label} placement="right">
                    <Box
                        component={item.onClick ? "button" : Link}
                        to={item.to}
                        onClick={item.onClick}
                        aria-label={item.label}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            border: "none",
                            bgcolor: "transparent",
                            color: item.color || "primary.main",
                            cursor: "pointer",
                            textDecoration: "none",
                            mb: idx < bottom.length - 1 ? 1 : 0,
                            "&:hover": {
                                bgcolor: "action.hover",
                                transform: "scale(1.1)",
                                transition: "all 0.2s ease",
                            },
                            "&:focus": {
                                outline: "2px solid",
                                outlineColor: "primary.main",
                                outlineOffset: "2px",
                            },
                        }}
                    >
                        <Box sx={{ fontSize: 28 }}>{item.icon}</Box>
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );
}

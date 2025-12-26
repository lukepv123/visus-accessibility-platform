import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import { Box, Tooltip, Typography } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../../contexts/AuthContext";

export function EstudanteSidebar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menu = [
        {
            icon: <HomeIcon />,
            label: "Home",
            to: "/estudante",
        },
        {
            icon: <SettingsAccessibilityIcon />,
            label: "Acessibilidade",
            to: "/estudante/acessibilidade",
        },
        {
            icon: <LibraryBooksIcon />,
            label: "Disciplinas",
            to: "/estudante/disciplinas",
        },
        {
            icon: <AssignmentIcon />,
            label: "Tarefas",
            to: "/estudante/tarefas",
        },
    ];

    const handleLogout = () => {
        logout();
        navigate({ to: "/" });
    };

    const bottom = [
        { icon: <HelpIcon />, label: "Ajuda", to: "/estudante/ajuda" },
        {
            icon: <LogoutIcon />,
            label: "Sair",
            onClick: handleLogout,
            color: "error.main",
        },
    ];

    return (
        <Box
            sx={{
                width: 90,
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
                borderRadius: "16px 0 0 16px",
                ml: 1,
                mt: 1,
                mb: 1,
                boxShadow: 2,
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
                    transition: "opacity 0.3s ease",
                    "&:hover": { opacity: 0.9 },
                }}
            />

            {/* Menu principal */}
            {menu.map((item) => (
                <Tooltip key={item.label} title={item.label} placement="right">
                    <Box
                        component={Link}
                        to={item.to}
                        aria-label={item.label}
                        role="button"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "text.secondary",
                            mb: 2,
                            borderRadius: 2,
                            px: 1,
                            py: 1.5,
                            cursor: "pointer",
                            "&:hover": {
                                color: "primary.main",
                                bgcolor: "action.hover",
                                transform: "translateY(-2px)",
                                transition: "all 0.2s ease",
                            },
                            "&:focus": {
                                outline: "2px solid",
                                outlineColor: "primary.main",
                                outlineOffset: "2px",
                            },
                        }}
                    >
                        <Box sx={{ fontSize: 28, mb: 0.5 }}>{item.icon}</Box>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: "0.7rem",
                                fontWeight: 500,
                            }}
                            aria-hidden="true"
                        >
                            {item.label}
                        </Typography>
                    </Box>
                </Tooltip>
            ))}

            <Box sx={{ flex: 1 }} />

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

import ApartmentIcon from "@mui/icons-material/Apartment";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useColorMode } from "../../../theme-toggle";
import { RoleContext } from "./main-layout";

export function NavBar() {
    const theme = useTheme();
    const paletteMode = theme.palette.mode;
    const { toggle } = useColorMode();
    const { user } = useAuth();

    const userName = user?.nome || "Usuário";
    const instituicao =
        user?.instituicao?.nome || "Não vinculado a instituição";

    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(
        undefined,
    );
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatarSrc(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    // Função para redirecionar para "{perfil}/ajustes" ao invés de só "/ajustes"
    // Esse valor é passado no layout.tsx de cada perfil (estudante, educador, gestor)
    const role = React.useContext(RoleContext);
    const perfilHref = role !== "publico" ? `/${role}/perfil` : "/perfil";
    // Condicional para "Instituição" ficar com link apenas se for gestor
    const isGestor = role === "gestor";

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                borderBottom: 1,
                borderColor: "divider",
                borderRadius: "0 0 16px 16px",
                px: 2,
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                {/* Logo / título */}
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Visus
                </Typography>

                <Box sx={{ flex: 1 }} />

                {/* Instituição */}
                <Box
                    component={isGestor ? Link : "div"}
                    to={isGestor ? "/gestor/instituicao" : undefined}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mr: 2,
                        textDecoration: "none",
                        color: "inherit",
                        ...(isGestor && {
                            cursor: "pointer",
                            "&:hover": { opacity: 0.9 },
                        }),
                    }}
                >
                    <ApartmentIcon sx={{ color: "text.primary" }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {instituicao}
                    </Typography>
                </Box>

                {/* �🌙/☀️ Alternar tema */}
                <Tooltip
                    title={
                        paletteMode === "dark"
                            ? "Usar tema claro"
                            : "Usar tema escuro"
                    }
                >
                    <IconButton
                        onClick={toggle}
                        color="inherit"
                        aria-label="Alternar tema"
                        sx={{
                            "&:focus-visible": {
                                outline: `3px solid ${theme.palette.primary.main}`,
                                outlineOffset: 2,
                            },
                        }}
                    >
                        {paletteMode === "dark" ? (
                            <Brightness7Icon />
                        ) : (
                            <Brightness4Icon />
                        )}
                    </IconButton>
                </Tooltip>

                {/* 🔔 Notificações */}
                <Tooltip title="Notificações">
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                </Tooltip>

                {/* 👤 Perfil e Conta */}
                <Tooltip title="Perfil e Conta">
                    <IconButton onClick={handleOpenMenu} sx={{ ml: 2 }}>
                        <Avatar
                            alt={userName}
                            src={avatarSrc}
                            sx={{
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                                border: "2px solid transparent",
                                "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                },
                            }}
                        />
                    </IconButton>
                </Tooltip>

                {/* Menu de Perfil */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <MenuItem disabled>{userName}</MenuItem>
                    <MenuItem
                        component={Link}
                        to={perfilHref}
                        onClick={handleCloseMenu}
                    >
                        Ver perfil
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Configurações</MenuItem>
                    <MenuItem
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                    >
                        Sair
                    </MenuItem>
                </Menu>

                {/* Upload opcional de avatar */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                    id="avatar-upload"
                />
            </Toolbar>
        </AppBar>
    );
}

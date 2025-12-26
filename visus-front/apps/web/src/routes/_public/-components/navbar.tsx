import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useColorMode } from "../../../theme-toggle.tsx";

export function NavBar() {
    const theme = useTheme();
    const paletteMode = theme.palette.mode;
    const { toggle } = useColorMode();

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: "background.paper",
                color: "text.primary",
                borderBottom: 1,
                borderColor: "divider",
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                {/* Logo + título */}
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "inherit",
                        mr: 2,
                    }}
                >
                    <Box
                        component="img"
                        src="/src/assets/logo.svg"
                        alt="Visus"
                        sx={{ height: 28, width: "auto", mr: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Visus
                    </Typography>
                </Box>

                <Box sx={{ flex: 1 }} />

                {/* Toggle do tema */}
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
                            // foco acessível
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

                <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    sx={{ ml: 1, textTransform: "none" }}
                >
                    Entrar
                </Button>
            </Toolbar>
        </AppBar>
    );
}

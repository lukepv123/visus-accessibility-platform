// apps/web/src/routes/_public/login.tsx
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useAuth } from "../../contexts/AuthContext";

function getDashboardRoute(user?: { roles?: string[]; instituicao?: any }) {
    if (!user?.roles) return "/";
    if (user.roles.includes("GESTOR")) {
        // If gestor has no institution, redirect to create institution page
        if (!user.instituicao) {
            return "/gestor/instituicao/criar";
        }
        return "/gestor";
    }
    if (user.roles.includes("EDUCADOR")) return "/educador";
    if (user.roles.includes("ESTUDANTE")) return "/estudante";
    return "/";
}

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading, user } = useAuth();

    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Navigate after user is set in context
    React.useEffect(() => {
        if (user) {
            navigate({ to: getDashboardRoute(user) });
        }
    }, [user, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!email || !senha) {
            setError("E-mail e senha são obrigatórios.");
            return;
        }

        try {
            await login({ email, senha });
        } catch (err: any) {
            setError(err?.message ?? "Erro ao realizar login");
        }
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={3}>
                <Typography variant="h4">Entrar</Typography>

                <Typography variant="body2" color="text.secondary">
                    Ainda não possui uma conta?{" "}
                    <Button
                        component={Link}
                        to="/cadastro"
                        variant="text"
                        size="small"
                        sx={{ textTransform: "none", px: 0 }}
                    >
                        Cadastre-se.
                    </Button>
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            autoComplete="email"
                            disabled={isLoading}
                            slotProps={{ input: { inputMode: "email" } }}
                        />

                        <TextField
                            label="Senha"
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            fullWidth
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    mostrarSenha
                                                        ? "Ocultar senha"
                                                        : "Mostrar senha"
                                                }
                                                onClick={() =>
                                                    setMostrarSenha((v) => !v)
                                                }
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                edge="end"
                                                disabled={isLoading}
                                            >
                                                {mostrarSenha ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                component={Link}
                                to="/recuperar-senha"
                                variant="text"
                                sx={{ textTransform: "none", px: 0 }}
                                disabled={isLoading}
                            >
                                Esqueceu sua senha?
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}

export const Route = createFileRoute("/_public/login")({
    component: LoginPage,
});

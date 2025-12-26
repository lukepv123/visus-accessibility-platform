import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

function RedefinirSenhaPage() {
    // e-mail vem na URL: /_public/redefinir-senha?email=usuario@dominio.com
    const emailFromQuery = useMemo(() => {
        if (typeof window === "undefined") return "";
        return new URLSearchParams(window.location.search).get("email") ?? "";
    }, []);

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [showNova, setShowNova] = useState(false);
    const [showConfirma, setShowConfirma] = useState(false);

    const senhasIguais = novaSenha.length > 0 && novaSenha === confirmaSenha;
    const podeEnviar = emailFromQuery && senhasIguais && novaSenha.length >= 8;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!podeEnviar) return;
        // TODO: chamar sua API: { email: emailFromQuery, novaSenha }
        console.log({ email: emailFromQuery, novaSenha });
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={3}>
                <Typography variant="h4">Redefinir senha</Typography>
                <Typography variant="body2" color="text.secondary">
                    Defina uma nova senha para a sua conta.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="E-mail"
                            value={emailFromQuery}
                            fullWidth
                            disabled
                        />

                        <TextField
                            label="Nova senha"
                            type={showNova ? "text" : "password"}
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            fullWidth
                            required
                            autoComplete="new-password"
                            helperText="Mínimo de 8 caracteres."
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showNova
                                                        ? "Ocultar senha"
                                                        : "Mostrar senha"
                                                }
                                                onClick={() =>
                                                    setShowNova((v) => !v)
                                                }
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                edge="end"
                                            >
                                                {showNova ? (
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

                        <TextField
                            label="Confirmar nova senha"
                            type={showConfirma ? "text" : "password"}
                            value={confirmaSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            fullWidth
                            required
                            autoComplete="new-password"
                            error={confirmaSenha.length > 0 && !senhasIguais}
                            helperText={
                                confirmaSenha.length > 0 && !senhasIguais
                                    ? "As senhas não coincidem."
                                    : " "
                            }
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showConfirma
                                                        ? "Ocultar senha"
                                                        : "Mostrar senha"
                                                }
                                                onClick={() =>
                                                    setShowConfirma((v) => !v)
                                                }
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                edge="end"
                                            >
                                                {showConfirma ? (
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

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!podeEnviar}
                        >
                            Redefinir senha
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}

export const Route = createFileRoute("/_public/redefinir-senha")({
    component: RedefinirSenhaPage,
});

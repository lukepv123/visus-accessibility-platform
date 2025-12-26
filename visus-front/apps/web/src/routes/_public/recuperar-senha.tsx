import {
    Box,
    Button,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

function RecuperarSenhaPage() {
    const [email, setEmail] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: chamar sua API para enviar o e-mail de redefinição
        console.log({ email });
    }

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Stack spacing={3}>
                <Typography variant="h4">Recuperar senha</Typography>
                <Typography variant="body2" color="text.secondary">
                    Informe o e-mail cadastrado para receber um link de
                    redefinição de senha.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="E-mail cadastrado"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            autoComplete="email"
                            slotProps={{ input: { inputMode: "email" } }}
                        />

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Button
                                component={Link}
                                to="/login"
                                variant="text"
                                sx={{ textTransform: "none", px: 0 }}
                            >
                                Voltar ao login
                            </Button>

                            <Button type="submit" variant="contained">
                                Enviar link
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
}

export const Route = createFileRoute("/_public/recuperar-senha")({
    component: RecuperarSenhaPage,
});

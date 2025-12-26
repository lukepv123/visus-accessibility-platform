import { Box, Button, TextField, Typography } from "@mui/material";
import type React from "react";
import { useState } from "react";

// REVIEW: Não sei se e pra ter esse arquivo aqui, se nao pode apagar a pasta -pages tambem, tava com uma ideia mas mudei de ideia
function PrivateLayout() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        senhaConfirm: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: handle submit logic
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                bgcolor: "background.default",
            }}
        >
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        maxWidth: 400,
                        mx: "auto",
                        mt: 4,
                        p: 3,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Alterar informações da conta
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="Nome"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="E-mail"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Nova senha"
                                name="senha"
                                type="password"
                                value={form.senha}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                label="Confirmar nova senha"
                                name="senhaConfirm"
                                type="password"
                                value={form.senhaConfirm}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Salvar alterações
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

// apps/web/src/routes/_private/gestor/instituicao/criar.tsx

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    createFileRoute,
    useNavigate,
    useRouter,
} from "@tanstack/react-router";
import { createInstituicao, useCreateInstituicao } from "@visus/api";
import * as React from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { authStorage } from "../../../../lib/api/auth";

export const Route = createFileRoute("/_private/gestor/instituicao/criar")({
    component: NovaInstituicaoPage,
});

// ---------- Utils (máscaras simples) ----------
const onlyDigits = (s: string) => s.replace(/\D/g, "");

function formatPhoneBR(s: string) {
    const d = onlyDigits(s).slice(0, 11); // (99) 99999-9999
    const p1 = d.slice(0, 2);
    const p2 = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
    const p3 = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
    if (!p2) return p1 ? `(${p1}` : "";
    if (!p3) return `(${p1}) ${p2}`;
    return `(${p1}) ${p2}-${p3}`;
}

function formatCNPJ(s: string) {
    const d = onlyDigits(s).slice(0, 14); // 99.999.999/9999-99
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 5);
    const p3 = d.slice(5, 8);
    const p4 = d.slice(8, 12);
    const p5 = d.slice(12, 14);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `/${p4}`;
    if (p5) out += `-${p5}`;
    return out;
}

function formatCEP(s: string) {
    const d = onlyDigits(s).slice(0, 8); // 99999-999
    const p1 = d.slice(0, 5);
    const p2 = d.slice(5, 8);
    return p2 ? `${p1}-${p2}` : p1;
}

const UFs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
];

// ---------- Página ----------
function NovaInstituicaoPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [cnpj, setCnpj] = React.useState("");
    const [email, setEmail] = React.useState("");

    const [logradouro, setLogradouro] = React.useState("");
    const [numero, setNumero] = React.useState("");
    const [bairro, setBairro] = React.useState("");
    const [cidade, setCidade] = React.useState("");
    const [estado, setEstado] = React.useState("");
    const [cep, setCep] = React.useState("");

    const [isLoading, setIsLoading] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const canSubmit =
        nome.trim() &&
        telefone.trim() &&
        cnpj.trim() &&
        email.trim() &&
        logradouro.trim() &&
        numero.trim() &&
        bairro.trim() &&
        cidade.trim() &&
        estado.trim() &&
        cep.trim();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            nome: nome.trim(),
            telefone: onlyDigits(telefone),
            cnpj: onlyDigits(cnpj),
            email: email.trim(),
            endereco: {
                logradouro: logradouro.trim(),
                numero: numero.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                estado: estado.trim(),
                cep: onlyDigits(cep),
            },
        };

        const token = authStorage.getToken();
        if (!token) {
            setSnackbar({
                open: true,
                message: "Usuário não autenticado. Faça login novamente.",
                severity: "error",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await createInstituicao(payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSnackbar({
                open: true,
                message: "Instituição criada com sucesso!",
                severity: "success",
            });

            // Atualiza os dados do usuário para incluir a instituição
            await refreshUser();

            // Aguarda um momento para o usuário ver a mensagem e então navega
            setTimeout(() => {
                // Navega para a página de instituição e força reload
                router.navigate({ to: "/gestor/instituicao" }).then(() => {
                    // Força o reload da página para atualizar todos os componentes
                    window.location.reload();
                });
            }, 1500);
        } catch (error: any) {
            console.error("Erro ao criar instituição:", error);

            let errorMessage = "Erro ao criar instituição. Tente novamente.";

            if (error?.response?.status === 409) {
                errorMessage = "CNPJ, email ou telefone já cadastrados.";
            } else if (error?.response?.status === 422) {
                errorMessage = "Dados inválidos. Verifique os campos.";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={700}
                    gutterBottom
                >
                    Criar instituição
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            <TextField
                                label="Nome da instituição"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                fullWidth
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(
                                            formatPhoneBR(e.target.value),
                                        )
                                    }
                                    required
                                    fullWidth
                                    slotProps={{
                                        htmlInput: { inputMode: "numeric" },
                                    }}
                                    placeholder="(11) 99999-9999"
                                />
                                <TextField
                                    label="CNPJ"
                                    value={cnpj}
                                    onChange={(e) =>
                                        setCnpj(formatCNPJ(e.target.value))
                                    }
                                    required
                                    fullWidth
                                    slotProps={{
                                        htmlInput: { inputMode: "numeric" },
                                    }}
                                    placeholder="12.345.678/0001-90"
                                />
                            </Stack>

                            <TextField
                                label="E-mail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                slotProps={{
                                    htmlInput: { inputMode: "email" },
                                }}
                            />

                            <Typography variant="h6" sx={{ mt: 1 }}>
                                Endereço
                            </Typography>

                            <TextField
                                label="Logradouro"
                                value={logradouro}
                                onChange={(e) => setLogradouro(e.target.value)}
                                required
                                fullWidth
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Número"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Stack>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    select
                                    label="Estado (UF)"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                    fullWidth
                                >
                                    {UFs.map((uf) => (
                                        <MenuItem key={uf} value={uf}>
                                            {uf}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>

                            <TextField
                                label="CEP"
                                value={cep}
                                onChange={(e) =>
                                    setCep(formatCEP(e.target.value))
                                }
                                required
                                fullWidth
                                slotProps={{
                                    htmlInput: { inputMode: "numeric" },
                                }}
                                placeholder="12345-678"
                            />

                            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!canSubmit || isLoading}
                                    startIcon={
                                        isLoading ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        ) : null
                                    }
                                >
                                    {isLoading
                                        ? "Criando..."
                                        : "Criar instituição"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        router.navigate({ to: "/gestor" })
                                    }
                                    disabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Dica: CNPJ, CEP e telefone são enviados sem pontuação
                    (somente dígitos).
                </Typography>
            </Box>

            {/* Snackbar para notificações */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

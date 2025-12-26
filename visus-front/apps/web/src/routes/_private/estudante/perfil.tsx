// apps/web/src/routes/_private/estudante/perfil.tsx

import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import {
    type EstudanteUpdateDTO,
    useAtualizar,
    useBuscarPorId,
} from "@visus/api";
import * as React from "react";

// Helpers para labels amigáveis
const periodoLabel: Record<string, string> = {
    MATUTINO: "Matutino",
    VESPERTINO: "Vespertino",
    NOTURNO: "Noturno",
};

const anoEscolarLabel: Record<string, string> = {
    PRIMEIRO_ANO: "1º ano",
    SEGUNDO_ANO: "2º ano",
    TERCEIRO_ANO: "3º ano",
    QUARTO_ANO: "4º ano",
    QUINTO_ANO: "5º ano",
    SEXTO_ANO: "6º ano",
    SETIMO_ANO: "7º ano",
    OITAVO_ANO: "8º ano",
    NONO_ANO: "9º ano",
    PRIMEIRO_ANO_EM: "1º ano do EM",
    SEGUNDO_ANO_EM: "2º ano do EM",
    PRIMEIO_ANO_EM: "1º ano do EM", // tem um typo no contrato, mantemos para não quebrar
};

const generoOptions = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMININO", label: "Feminino" },
    { value: "OUTRO", label: "Outro" },
    { value: "PREFIRO_NAO_INFORMAR", label: "Prefiro não informar" },
];

export const Route = createFileRoute("/_private/estudante/perfil")({
    component: EstudantePerfilPage,
});

function EstudantePerfilPage() {
    // 1) Recupera usuário logado do localStorage
    const rawUser =
        typeof window !== "undefined"
            ? localStorage.getItem("auth_user")
            : null;
    const authUser = rawUser ? JSON.parse(rawUser) : null;
    const estudanteId: number | null =
        authUser && typeof authUser.id === "number" ? authUser.id : null;

    const token =
        typeof window !== "undefined"
            ? (localStorage.getItem("auth_token") ?? "")
            : "";

    // Config comum para o Kubb (manda o JWT no header)
    const authClient = React.useMemo(
        () => ({
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        }),
        [token],
    );

    // 2) Busca os dados do estudante
    const { data, isLoading, isError, error, refetch } = useBuscarPorId(
        estudanteId as number,
        {
            client: authClient,
            query: {
                enabled: !!estudanteId && !!token,
            },
        },
    );

    // 3) Estados do formulário (apenas campos editáveis no back-end)
    const [form, setForm] = React.useState({
        nome: "",
        telefone: "",
        genero: "",
        dataNascimento: "",
    });

    const [saveError, setSaveError] = React.useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    // 4) Preenche o formulário quando os dados chegam
    React.useEffect(() => {
        if (data) {
            setForm({
                nome: data.nome ?? "",
                telefone: data.telefone ?? "",
                genero: data.genero ?? "",
                // já vem como "YYYY-MM-DD", serve direto para <input type="date" />
                dataNascimento: data.dataNascimento ?? "",
            });
        }
    }, [data]);

    // 5) Mutation de atualização
    const updateMutation = useAtualizar({
        client: authClient,
    });

    function handleChangeField<K extends keyof typeof form>(
        field: K,
        value: (typeof form)[K],
    ) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!estudanteId) return;

        setSaveError(null);
        setSaveSuccess(false);

        // Monta o payload conforme EstudanteUpdateDTO
        const payload: EstudanteUpdateDTO = {
            nome: form.nome.trim(),
            telefone: form.telefone.trim(),
            genero: form.genero as EstudanteUpdateDTO["genero"],
            dataNascimento: form.dataNascimento, // "YYYY-MM-DD" conforme contrato
        };

        try {
            await updateMutation.mutateAsync({
                id: estudanteId,
                data: payload,
            });
            setSaveSuccess(true);
            // Atualiza dados na tela
            refetch();
        } catch (err: any) {
            console.error(err);
            setSaveError(
                "Não foi possível salvar as alterações. Tente novamente.",
            );
        }
    }

    // 6) Tratativas de erro de contexto / auth
    if (!authUser || authUser.roles !== "ESTUDANTE") {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    Não foi possível identificar o estudante logado. Verifique
                    se o usuário (auth_user) está correto no localStorage e se o
                    perfil é ESTUDANTE.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                gutterBottom
            >
                Meu perfil
            </Typography>

            {isLoading && <Typography>Carregando dados…</Typography>}

            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Erro ao carregar os dados do estudante.
                </Alert>
            )}

            {saveError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {saveError}
                </Alert>
            )}

            {saveSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Dados atualizados com sucesso.
                </Alert>
            )}

            {data && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2, sm: 3 },
                        mt: 2,
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={3}>
                            {/* DADOS BÁSICOS */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Dados pessoais
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Nome completo"
                                            fullWidth
                                            value={form.nome}
                                            onChange={(e) =>
                                                handleChangeField(
                                                    "nome",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Telefone"
                                            fullWidth
                                            value={form.telefone}
                                            onChange={(e) =>
                                                handleChangeField(
                                                    "telefone",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Gênero"
                                            fullWidth
                                            value={form.genero}
                                            onChange={(e) =>
                                                handleChangeField(
                                                    "genero",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {generoOptions.map((opt) => (
                                                <MenuItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Data de nascimento"
                                            type="date"
                                            fullWidth
                                            value={form.dataNascimento}
                                            onChange={(e) =>
                                                handleChangeField(
                                                    "dataNascimento",
                                                    e.target.value,
                                                )
                                            }
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* DADOS ESCOLARES / FIXOS */}
                            <Box>
                                <Typography variant="h6" gutterBottom>
                                    Dados escolares
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="CPF"
                                            fullWidth
                                            value={data.cpf ?? ""}
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Matrícula"
                                            fullWidth
                                            value={data.matricula ?? ""}
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Período"
                                            fullWidth
                                            value={
                                                (data.periodo &&
                                                    periodoLabel[
                                                        data.periodo
                                                    ]) ||
                                                data.periodo ||
                                                ""
                                            }
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Ano escolar"
                                            fullWidth
                                            value={
                                                (data.anoEscolar &&
                                                    anoEscolarLabel[
                                                        data.anoEscolar
                                                    ]) ||
                                                data.anoEscolar ||
                                                ""
                                            }
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* AÇÕES */}
                            <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? "Salvando…"
                                        : "Salvar alterações"}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            )}
        </Container>
    );
}

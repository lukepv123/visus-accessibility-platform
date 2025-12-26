import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { getGestorById } from "../../../../../../packages/api/src/client/getGestorById";
import type { UpdateGestorDTO } from "../../../../../../packages/api/src/models/UpdateGestorDTO";
import { useGetGestorById } from "../../../../../../packages/api/src/react-query/mduloDeGestoresController/useGetGestorById";
import { useUpdateGestor } from "../../../../../../packages/api/src/react-query/mduloDeGestoresController/useUpdateGestor";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/gestor/perfil")({
    component: GestorAjustes,
});

function GestorAjustes() {
    // Reload na página
    const router = useRouter();
    const { refreshUser } = useAuth();

    // 1) Recupera usuário logado do localStorage
    const rawUser =
        typeof window !== "undefined"
            ? localStorage.getItem("auth_user")
            : null;
    const authUser = rawUser ? JSON.parse(rawUser) : null;
    const gestorId: number | null =
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

    // 2) Busca os dados do gestor
    const { data, isLoading, isError, error, refetch } = useGetGestorById(
        gestorId as number,
        {
            client: authClient,
            query: {
                enabled: !!gestorId && !!token,
            },
        },
    );

    const [form, setForm] = useState({
        nome: "",
        telefone: "",
        genero: "MASCULINO",
        dataNascimento: "",
        cargo: "",
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
                cargo: data.cargo ?? "",
            });
        }
    }, [data]);

    // 5) Mutation de atualização
    const updateMutation = useUpdateGestor({
        client: authClient,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelect = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gestorId) return;

        await refreshUser();

        const payload: UpdateGestorDTO = {
            nome: form.nome.trim(),
            telefone: form.telefone.trim(),
            genero: form.genero as UpdateGestorDTO["genero"],
            dataNascimento: form.dataNascimento,
            cargo: form.cargo.trim(),
        };

        setSaveError(null);
        setSaveSuccess(false);

        try {
            await updateMutation.mutateAsync({
                id: gestorId,
                data: payload,
            });

            setSaveSuccess(true);

            setTimeout(() => {
                // Navega para a página de instituição e força reload
                router.navigate({ to: "/gestor/perfil" }).then(() => {
                    // Força o reload da página para atualizar todos os componentes
                    window.location.reload();
                });
            }, 1500);
        } catch (e) {
            console.error(e);
            setSaveError(
                "Não foi possível salvar as alterações. Tente novamente.",
            );
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Dados do perfil
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    maxWidth: 600,
                }}
            >
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

                <TextField
                    label="Nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Telefone"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel id="genero-label">Gênero</InputLabel>
                    <Select
                        labelId="genero-label"
                        value={form.genero}
                        label="Gênero"
                        onChange={(e) => handleSelect("genero", e.target.value)}
                    >
                        <MenuItem value="MASCULINO">Masculino</MenuItem>
                        <MenuItem value="FEMININO">Feminino</MenuItem>
                        <MenuItem value="OUTRO">Outro</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Data de Nascimento"
                    name="dataNascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Cargo"
                    name="cargo"
                    value={form.cargo}
                    onChange={handleChange}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    Salvar
                </Button>
            </Box>
        </Box>
    );
}

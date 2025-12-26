import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    Button,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";
import { useState } from "react";
import { number } from "zod/v4";
import { useAdicionarFormacao } from "../../../../../../packages/api/src/react-query/EducadoresController/useAdicionarFormacao";
import { useGetEducador } from "../../../../../../packages/api/src/react-query/EducadoresController/useGetEducador";
import { useRemoverFormacao } from "../../../../../../packages/api/src/react-query/EducadoresController/useRemoverFormacao";
import { useUpdateEducador } from "../../../../../../packages/api/src/react-query/EducadoresController/useUpdateEducador";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/educador/perfil")({
    component: EducadorAjustes,
});

type Formacao = {
    id?: number;
    titulo: string;
    instituicao: string;
    dataInicio: string;
    dataConclusao: string;
    descricao: string;
};

function EducadorAjustes() {
    // Reload na página
    const router = useRouter();
    const { refreshUser } = useAuth();

    // 1) Recupera usuário logado do localStorage
    const rawUser =
        typeof window !== "undefined"
            ? localStorage.getItem("auth_user")
            : null;
    const authUser = rawUser ? JSON.parse(rawUser) : null;
    const educadorId: number | null =
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

    // 2) Busca os dados do educador
    const { data, isLoading, isError, error, refetch } = useGetEducador(
        educadorId as number,
        {
            client: authClient,
            query: {
                enabled: !!educadorId && !!token,
            },
        },
    );

    const [form, setForm] = useState({
        nome: "",
        matricula: "",
        titulo: "",
    });

    const [formacoes, setFormacoes] = useState<Formacao[]>([
        {
            id: 1,
            titulo: "",
            instituicao: "",
            dataInicio: "",
            dataConclusao: "",
            descricao: "",
        },
    ]);

    const [saveError, setSaveError] = React.useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = React.useState(false);

    // 4) Preenche o formulário quando os dados chegam
    React.useEffect(() => {
        if (data) {
            setForm({
                nome: data.nome ?? "",
                matricula: data.matricula ?? "",
                titulo: data.titulo ?? "",
            });

            setFormacoes(
                data.formacaoAcademica?.map((f) => ({
                    id: f.id,
                    titulo: f.titulo ?? "",
                    instituicao: f.instituicao ?? "",
                    dataInicio: f.dataInicio ?? "",
                    dataConclusao: f.dataConclusao ?? "",
                    descricao: f.descricao ?? "",
                })) ?? [],
            );
        }
    }, [data]);

    // 5) Mutation de atualização
    const updateMutation = useUpdateEducador({
        client: authClient,
    });

    const addFormacaoMutation = useAdicionarFormacao({
        client: authClient,
    });

    const removeFormacaoMutation = useRemoverFormacao({
        client: authClient,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFormacaoChange = (
        index: number,
        key: keyof Formacao,
        value: string,
    ) => {
        setFormacoes((prev) =>
            prev.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
        );
    };

    const addFormacao = () => {
        setFormacoes((prev) => [
            ...prev,
            {
                titulo: "",
                instituicao: "",
                dataInicio: "",
                dataConclusao: "",
                descricao: "",
            },
        ]);
    };

    const removeFormacao = async (index: number) => {
        const formacaoToRemove = formacoes[index];

        console.log(formacaoToRemove.id);

        if (formacaoToRemove.id) {
            setSaveError(null);
            setSaveSuccess(false);

            try {
                await removeFormacaoMutation.mutateAsync({
                    id: educadorId!,
                    formacaoId: formacaoToRemove.id,
                });

                setFormacoes((prev) => prev.filter((_, i) => i !== index));

                setSaveSuccess(true);
                refetch();
            } catch (e) {
                console.error(e);
                setSaveError("Falha ao excluir formação. Tente novamente");
            }
        } else {
            setFormacoes((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!educadorId) return;

        setSaveError(null);
        setSaveSuccess(false);

        try {
            const trimmedForm = {
                nome: form.nome.trim(),
                matricula: form.matricula.trim(),
                titulo: form.titulo.trim(),
            };

            await updateMutation.mutateAsync({
                id: educadorId,
                data: trimmedForm,
            });

            const newFormacoes = formacoes.filter((f) => !f.id);

            if (newFormacoes.length > 0) {
                await Promise.all(
                    newFormacoes.map((f) =>
                        addFormacaoMutation.mutateAsync({
                            id: educadorId,
                            data: {
                                titulo: f.titulo,
                                instituicao: f.instituicao,
                                dataInicio: f.dataInicio,
                                dataConclusao: f.dataConclusao,
                                descricao: f.descricao,
                            },
                        }),
                    ),
                );
            }

            setSaveSuccess(true);
            refetch();
        } catch (err) {
            console.error(err);
            setSaveError("Erro ao salvar dados.");
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
                    maxWidth: 800,
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
                    label="Matrícula"
                    name="matricula"
                    value={form.matricula}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Título"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    fullWidth
                />

                <Box>
                    <Typography variant="h6">Formação Acadêmica</Typography>
                    {formacoes.map((f, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr auto",
                                gap: 1,
                                mt: 1,
                                alignItems: "center",
                            }}
                        >
                            <TextField
                                label="Título"
                                value={f.titulo}
                                onChange={(e) =>
                                    handleFormacaoChange(
                                        index,
                                        "titulo",
                                        e.target.value,
                                    )
                                }
                            />
                            <TextField
                                label="Instituição"
                                value={f.instituicao}
                                onChange={(e) =>
                                    handleFormacaoChange(
                                        index,
                                        "instituicao",
                                        e.target.value,
                                    )
                                }
                            />
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => removeFormacao(index)}
                                    aria-label="remover"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                label="Data Início"
                                type="date"
                                value={f.dataInicio}
                                onChange={(e) =>
                                    handleFormacaoChange(
                                        index,
                                        "dataInicio",
                                        e.target.value,
                                    )
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Data Conclusão"
                                type="date"
                                value={f.dataConclusao}
                                onChange={(e) =>
                                    handleFormacaoChange(
                                        index,
                                        "dataConclusao",
                                        e.target.value,
                                    )
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Descrição"
                                value={f.descricao}
                                onChange={(e) =>
                                    handleFormacaoChange(
                                        index,
                                        "descricao",
                                        e.target.value,
                                    )
                                }
                                fullWidth
                                sx={{ gridColumn: "1 / -1" }}
                            />
                        </Box>
                    ))}
                    <Button
                        startIcon={<AddCircleIcon />}
                        onClick={addFormacao}
                        sx={{ mt: 2 }}
                    >
                        Adicionar formação
                    </Button>
                </Box>

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Salvar
                </Button>
            </Box>
        </Box>
    );
}

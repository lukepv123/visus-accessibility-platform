import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Typography,
} from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
    type SummaryTarefaDTO,
    useGetDisciplinasByEstudante,
    getTarefasByDisciplina,
} from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/estudante/")({
    component: EstudanteHome,
});

function guessEstudanteIdFromUser(user: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId, user.estudanteId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

export default function EstudanteHome() {
    const { user, token } = useAuth();

    // Resolver estudanteId do user
    const estudanteId = useMemo(() => guessEstudanteIdFromUser(user), [user]);

    // Buscar disciplinas do estudante
    const { data: disciplinas, isLoading: loadingDisciplinas } =
        useGetDisciplinasByEstudante(
            { estudanteId: estudanteId || 0 },
            {
                query: {
                    enabled: !!estudanteId && !!token && estudanteId > 0,
                },
            },
        );

    // Buscar tarefas de cada disciplina
    const disciplinaIds = useMemo(() => {
        return (disciplinas || [])
            .map((d) => d.id)
            .filter((id): id is number => id !== undefined);
    }, [disciplinas]);

    const [allTarefas, setAllTarefas] = useState<SummaryTarefaDTO[]>([]);
    const [loadingTarefas, setLoadingTarefas] = useState(false);

    useEffect(() => {
        if (!disciplinaIds.length || !token) {
            setAllTarefas([]);
            return;
        }

        setLoadingTarefas(true);

        Promise.all(
            disciplinaIds.map(async (disciplinaId) => {
                try {
                    const res = await getTarefasByDisciplina(disciplinaId, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "*/*",
                        },
                    });
                    return Array.isArray(res) ? res : [];
                } catch (error) {
                    console.error(
                        `Erro ao buscar tarefas da disciplina ${disciplinaId}:`,
                        error,
                    );
                    return [];
                }
            }),
        )
            .then((results) => {
                const combined = results.flat();
                setAllTarefas(combined);
                setLoadingTarefas(false);
            })
            .catch((error) => {
                console.error("Erro ao carregar tarefas:", error);
                setLoadingTarefas(false);
            });
    }, [disciplinaIds, token]);

    // Delivered assignments state from local storage
    const [deliveredAssignments] = useState<Record<number, boolean>>(() => {
        const stored = localStorage.getItem("deliveredAssignments");
        return stored ? JSON.parse(stored) : {};
    });

    // Calcular estatísticas
    const totalClasses = disciplinas?.length || 0;

    const assignmentsOpen = allTarefas.filter((t) => {
        const tarefaId = t.id ?? 0;
        const isDelivered = deliveredAssignments[tarefaId] || false;
        if (isDelivered) return false;

        const dataExpiracao = t.dataExpiracao
            ? new Date(t.dataExpiracao)
            : null;
        const now = new Date();
        if (dataExpiracao && dataExpiracao < now) return false;

        return true;
    }).length;

    const assignmentsSubmitted = allTarefas.filter((t) => {
        const tarefaId = t.id ?? 0;
        return deliveredAssignments[tarefaId] || false;
    }).length;

    const assignmentsLate = allTarefas.filter((t) => {
        const tarefaId = t.id ?? 0;
        const isDelivered = deliveredAssignments[tarefaId] || false;
        if (isDelivered) return false;

        const dataExpiracao = t.dataExpiracao
            ? new Date(t.dataExpiracao)
            : null;
        const now = new Date();
        return dataExpiracao && dataExpiracao < now;
    }).length;

    const isLoading = loadingDisciplinas || loadingTarefas;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Bem-vindo, {user?.nome?.split(" ")[0] ?? "Aluno"}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Resumo rápido das suas disciplinas e tarefas
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 16,
                }}
            >
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: "primary.main" }}>D</Avatar>
                            <Box>
                                <Typography variant="h6">
                                    Disciplinas
                                </Typography>
                                <Typography color="text.secondary">
                                    {isLoading ? (
                                        <CircularProgress
                                            size={16}
                                            sx={{ ml: 1 }}
                                        />
                                    ) : (
                                        `Você está matriculado em ${totalClasses} ${totalClasses === 1 ? "disciplina" : "disciplinas"}`
                                    )}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : disciplinas && disciplinas.length > 0 ? (
                                disciplinas
                                    .slice(0, 4)
                                    .map((d) => (
                                        <Chip
                                            key={d.id}
                                            label={d.nome || "Sem nome"}
                                        />
                                    ))
                            ) : (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Nenhuma disciplina encontrada
                                </Typography>
                            )}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button
                            component={Link}
                            to="/estudante/disciplinas"
                            size="small"
                        >
                            Ver disciplinas
                        </Button>
                    </CardActions>
                </Card>

                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: "secondary.main" }}>
                                T
                            </Avatar>
                            <Box>
                                <Typography variant="h6">Tarefas</Typography>
                                <Typography color="text.secondary">
                                    {isLoading ? (
                                        <CircularProgress
                                            size={16}
                                            sx={{ ml: 1 }}
                                        />
                                    ) : (
                                        "Resumo das suas tarefas"
                                    )}
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                gap: 2,
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    <Chip
                                        label={`Abertas: ${assignmentsOpen}`}
                                        color="primary"
                                    />
                                    <Chip
                                        label={`Entregues: ${assignmentsSubmitted}`}
                                        color="success"
                                    />
                                    <Chip
                                        label={`Atrasadas: ${assignmentsLate}`}
                                        color="warning"
                                    />
                                </>
                            )}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button
                            component={Link}
                            to="/estudante/tarefas"
                            size="small"
                        >
                            Ver tarefas
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}

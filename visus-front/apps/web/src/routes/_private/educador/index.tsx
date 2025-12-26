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
    useGetDisciplinasByEducador,
    getTarefasByDisciplina,
} from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/educador/")({
    component: EducadorHome,
});

function guessEducadorIdFromUser(user: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId, user.educadorId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

export default function EducadorHome() {
    const { user, token } = useAuth();

    // Resolver educadorId do user
    const educadorId = useMemo(() => guessEducadorIdFromUser(user), [user]);

    // Buscar disciplinas do educador
    const { data: disciplinas, isLoading: loadingDisciplinas } =
        useGetDisciplinasByEducador(
            { educadorId: educadorId || 0 },
            {
                query: {
                    enabled: !!educadorId && !!token && educadorId > 0,
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

    // Calcular estatísticas do educador
    const totalClasses = disciplinas?.length || 0;

    // Calcular total de estudantes em todas as disciplinas
    const totalStudents = useMemo(() => {
        if (!disciplinas) return 0;
        return disciplinas.reduce((sum, d) => {
            const estudantesCount = d.estudantes?.length || 0;
            return sum + estudantesCount;
        }, 0);
    }, [disciplinas]);

    // Tarefas publicadas
    const publishedTasks = allTarefas.length;

    // Tarefas ativas (não expiradas)
    const activeTasks = allTarefas.filter((t) => {
        const dataExpiracao = t.dataExpiracao
            ? new Date(t.dataExpiracao)
            : null;
        const now = new Date();
        return !dataExpiracao || dataExpiracao >= now;
    }).length;

    // Tarefas expiradas
    const expiredTasks = allTarefas.filter((t) => {
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
                Bem-vindo, Prof. {user?.nome?.split(" ")[0] ?? "Educador"}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Resumo das suas disciplinas e atividades de ensino
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 2,
                    mb: 4,
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
                                        `Você leciona ${totalClasses} ${totalClasses === 1 ? "disciplina" : "disciplinas"}`
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
                            to="/educador/disciplinas"
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
                            <Avatar sx={{ bgcolor: "success.main" }}>T</Avatar>
                            <Box>
                                <Typography variant="h6">Atividades</Typography>
                                <Typography color="text.secondary">
                                    {isLoading ? (
                                        <CircularProgress
                                            size={16}
                                            sx={{ ml: 1 }}
                                        />
                                    ) : (
                                        "Resumo das suas atividades"
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
                                        label={`Publicadas: ${publishedTasks}`}
                                        color="info"
                                    />
                                    <Chip
                                        label={`Ativas: ${activeTasks}`}
                                        color="success"
                                    />
                                    <Chip
                                        label={`Expiradas: ${expiredTasks}`}
                                        color="warning"
                                    />
                                </>
                            )}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button
                            component={Link}
                            to="/educador/atividades"
                            size="small"
                        >
                            Ver atividades
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}

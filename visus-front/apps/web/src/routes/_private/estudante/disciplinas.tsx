import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useGetDisciplinasByEstudante } from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/estudante/disciplinas")({
    component: EstudanteDisciplinas,
});

const API_BASE_URL = "http://localhost:8080";

interface DisciplinaApi {
    id: number | string;
    nome: string;
    descricao?: string;
    educadorResponsavel?: string;
    instituicao?: string;
}

interface DisciplinaCard {
    id: number | string;
    title: string;
    teacher: string;
    description: string;
    color: string;
}

function guessEstudanteIdFromUser(user: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId, user.estudanteId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

function getColorForId(id: string | number, index: number): string {
    const palette = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"];
    const s = String(id);
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash + s.charCodeAt(i) * 31) | 0;
    }
    const pos = Math.abs(hash + index) % palette.length;
    return palette[pos];
}

export default function EstudanteDisciplinas() {
    const { user, token } = useAuth();

    const [estudanteId, setEstudanteId] = useState<number | null>(null);
    const [resolvingEstudanteId, setResolvingEstudanteId] = useState(false);
    const [resolveError, setResolveError] = useState<string | null>(null);

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!token || !user) return;

        async function resolveEstudanteId() {
            setResolvingEstudanteId(true);
            setResolveError(null);

            const directId = guessEstudanteIdFromUser(user as any);
            if (directId) {
                setEstudanteId(directId);
                setResolvingEstudanteId(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/usuarios`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(
                        `Falha ao buscar /usuarios (status ${res.status})`,
                    );
                }

                const data = (await res.json()) as any[];

                const userEmail =
                    (user as any)?.email ??
                    (user as any)?.usuarioEmail ??
                    (user as any)?.username ??
                    null;

                let found: any | undefined;

                if (userEmail) {
                    found = data.find(
                        (u) =>
                            u.email === userEmail ||
                            u.usuarioEmail === userEmail ||
                            u.username === userEmail,
                    );
                }

                if (!found) {
                    found = data.find((u) => {
                        const roles = u.roles ?? u.tipoUsuario ?? u.role;
                        if (Array.isArray(roles)) {
                            return roles
                                .map((r: string) => r.toUpperCase())
                                .some((r: string) => r.includes("ESTUDANTE"));
                        }
                        if (typeof roles === "string") {
                            return roles.toUpperCase().includes("ESTUDANTE");
                        }
                        return false;
                    });
                }

                const id =
                    found?.id ??
                    found?.usuarioId ??
                    found?.userId ??
                    found?.estudanteId ??
                    null;

                if (!id) {
                    throw new Error(
                        "Não foi possível resolver o ID do estudante a partir de /usuarios.",
                    );
                }

                setEstudanteId(Number(id));
            } catch (err: any) {
                console.error(err);
                setResolveError(
                    err?.message ??
                        "Erro ao resolver o ID do estudante. Verifique o backend.",
                );
            } finally {
                setResolvingEstudanteId(false);
            }
        }

        void resolveEstudanteId();
    }, [token, user]);

    const effectiveEstudanteId = estudanteId ?? 0;

    const disciplinasQuery = useGetDisciplinasByEstudante(
        { estudanteId: effectiveEstudanteId },
        {
            query: {
                enabled: !!token && !!estudanteId,
            },
            client: token
                ? {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
                : undefined,
        },
    );

    const disciplinasCards: DisciplinaCard[] = useMemo(() => {
        const rawData = disciplinasQuery.data;

        // Ensure data is an array before mapping
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }

        const data = rawData as DisciplinaApi[];

        return data.map((d, index) => ({
            id: d.id,
            title: d.nome,
            teacher: d.educadorResponsavel || "Professor não atribuído",
            description: d.descricao || "Sem descrição",
            color: getColorForId(d.id ?? index, index),
        }));
    }, [disciplinasQuery.data]);

    const disciplinasFiltradas = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (!term) return disciplinasCards;
        return disciplinasCards.filter((d) =>
            d.title.toLowerCase().includes(term),
        );
    }, [disciplinasCards, search]);

    const isLoading =
        resolvingEstudanteId || disciplinasQuery.isLoading || !estudanteId;

    return (
        <Box sx={{ p: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h4">Disciplinas</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Suas turmas e atividades recentes
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                        size="small"
                        placeholder="Pesquisar disciplinas"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>
            </Box>

            {resolveError && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {resolveError}
                </Typography>
            )}

            {disciplinasQuery.isError && (
                <Typography color="error" sx={{ mb: 2 }}>
                    Erro ao carregar disciplinas:{" "}
                    {disciplinasQuery.error?.message || "Erro desconhecido"}
                </Typography>
            )}

            {isLoading ? (
                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : disciplinasFiltradas.length === 0 ? (
                <Typography color="text.secondary">
                    Nenhuma disciplina encontrada para este estudante.
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: 3,
                        mt: 2,
                    }}
                >
                    {disciplinasFiltradas.map((c) => (
                        <Card
                            key={c.id}
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: c.color }}>
                                        {c.title.charAt(0)}
                                    </Avatar>
                                }
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={c.title}
                                subheader={c.teacher}
                            />

                            <CardContent sx={{ flex: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    {c.description}
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button
                                    size="small"
                                    component={Link}
                                    to="/estudante/disciplina-especifica"
                                    search={{
                                        disciplinaId: c.id,
                                        nome: c.title,
                                    }}
                                >
                                    Entrar
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

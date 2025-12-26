import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";

import { createFileRoute } from "@tanstack/react-router";
import {
    type SummaryTarefaDTO,
    useCriarRespostaComUpload,
    useEnviarResposta,
    useGetDisciplinasByEstudante,
    getTarefasByDisciplina,
} from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/estudante/tarefas")({
    component: EstudanteTarefas,
});

type Assignment = {
    id: number;
    title: string;
    description?: string;
    dueDate: string; // ISO
    points?: string;
    status: "open" | "submitted" | "late";
    teacher: string;
    disciplinaId: number;
};

function guessEstudanteIdFromUser(user: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId, user.estudanteId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

function getUserIdFromUser(user: any): number | null {
    return guessEstudanteIdFromUser(user);
}

export default function EstudanteTarefas() {
    const { user, token } = useAuth();
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState(0);

    // Popup da tarefa
    const [selected, setSelected] = useState<Assignment | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Popup de confirmação
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Estado do texto da resposta
    const [respostaTexto, setRespostaTexto] = useState("");

    // File upload states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

    // Delivered assignments state with local storage
    const [deliveredAssignments, setDeliveredAssignments] = useState<
        Record<number, boolean>
    >(() => {
        const stored = localStorage.getItem("deliveredAssignments");
        return stored ? JSON.parse(stored) : {};
    });

    // Assignment submissions content with local storage
    const [assignmentSubmissions, setAssignmentSubmissions] = useState<
        Record<
            number,
            { comment: string; fileNames: string[]; respostaId?: number }
        >
    >(() => {
        const stored = localStorage.getItem("assignmentSubmissions");
        return stored ? JSON.parse(stored) : {};
    });

    // Persist delivered assignments to local storage
    React.useEffect(() => {
        localStorage.setItem(
            "deliveredAssignments",
            JSON.stringify(deliveredAssignments),
        );
    }, [deliveredAssignments]);

    // Persist assignment submissions to local storage
    React.useEffect(() => {
        localStorage.setItem(
            "assignmentSubmissions",
            JSON.stringify(assignmentSubmissions),
        );
    }, [assignmentSubmissions]);

    const toggleDelivered = (tarefaId: number) => {
        setDeliveredAssignments((prev) => ({
            ...prev,
            [tarefaId]: !prev[tarefaId],
        }));
    };

    // Resolver estudanteId do user
    const estudanteId = useMemo(() => {
        const id = guessEstudanteIdFromUser(user);
        console.log("EstudanteId resolved:", id, "User:", user);
        return id;
    }, [user]);

    // 1. Buscar disciplinas do estudante
    const {
        data: disciplinas,
        isLoading: loadingDisciplinas,
        error: errorDisciplinas,
    } = useGetDisciplinasByEstudante(
        { estudanteId: estudanteId || 0 },
        {
            query: {
                enabled: !!estudanteId && !!token && estudanteId > 0,
            },
        },
    );

    useEffect(() => {
        if (errorDisciplinas) {
            console.error("Error loading disciplinas:", errorDisciplinas);
        }
        if (disciplinas) {
            console.log("Disciplinas loaded:", disciplinas);
        }
    }, [disciplinas, errorDisciplinas]);

    // 2. Buscar tarefas de cada disciplina
    const disciplinaIds = useMemo(() => {
        return (disciplinas || [])
            .map((d) => d.id)
            .filter((id): id is number => id !== undefined);
    }, [disciplinas]);

    // Para cada disciplina, fazer um useGetTarefasByDisciplina
    // Vamos combinar os resultados manualmente
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
                    // Em caso de 403, limpamos resultados dessa disciplina
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

    // Auth client config for API calls
    const authClientConfig = token
        ? ({
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "*/*",
              },
          } as const)
        : undefined;

    // Mutations para enviar resposta - with auth config
    const enviarRespostaMutation = useEnviarResposta({
        client: authClientConfig,
    });
    const criarRespostaComUploadMutation = useCriarRespostaComUpload({
        client: authClientConfig,
    });

    // Transformar tarefas da API para o formato da UI
    const assignments: Assignment[] = useMemo(() => {
        return allTarefas.map((tarefa): Assignment => {
            const now = new Date();
            const dataExpiracao = tarefa.dataExpiracao
                ? new Date(tarefa.dataExpiracao)
                : null;
            const tarefaId = tarefa.id ?? 0;

            // Check if already delivered from local storage
            const isDelivered = deliveredAssignments[tarefaId] || false;

            let status: "open" | "submitted" | "late" = "open";
            if (isDelivered) {
                status = "submitted";
            } else if (dataExpiracao && dataExpiracao < now) {
                status = "late";
            }

            return {
                id: tarefaId,
                title: tarefa.titulo ?? "Sem título",
                description: tarefa.resumoConteudo,
                dueDate: tarefa.dataExpiracao ?? new Date().toISOString(),
                points: tarefa.valorTotal
                    ? `${tarefa.valorTotal} pts`
                    : undefined,
                status,
                teacher: tarefa.educadorResponsavel ?? "Professor",
                disciplinaId: tarefa.disciplinaId ?? 0,
            };
        });
    }, [allTarefas, deliveredAssignments]);

    function openTask(a: Assignment) {
        setSelected(a);
        setRespostaTexto("");
        setSelectedFiles([]);
        setSubmissionError(null);
        setSubmissionSuccess(false);
        setIsAlreadySubmitted(false);

        // Restore saved submission content if exists
        const savedSubmission = assignmentSubmissions[a.id];
        if (savedSubmission) {
            setRespostaTexto(savedSubmission.comment || "");
            setIsAlreadySubmitted(true);
        }

        setDialogOpen(true);
    }

    function closeTask() {
        setDialogOpen(false);
        setSelected(null);
        setRespostaTexto("");
        setSelectedFiles([]);
        setSubmissionError(null);
        setSubmissionSuccess(false);
        setIsAlreadySubmitted(false);
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
        }
        // Reset input value so same file can be selected again
        event.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    function confirmEntrega() {
        setConfirmOpen(true);
    }

    async function finalizarEntrega() {
        try {
            setSubmissionError(null);
            setConfirmOpen(false);

            if (!selected) {
                setSubmissionError("Nenhuma tarefa selecionada.");
                return;
            }

            if (!token) {
                setSubmissionError("Sessão expirada. Faça login novamente.");
                return;
            }

            const userId = getUserIdFromUser(user as any);
            if (!userId) {
                setSubmissionError("Não foi possível identificar o usuário.");
                return;
            }

            const existingSubmission = assignmentSubmissions[selected.id];
            const existingRespostaId = existingSubmission?.respostaId;
            let respostaId: number | undefined = existingRespostaId;

            // Check if updating existing answer or creating new one
            if (existingRespostaId) {
                // For updates, create additional responses
                if (selectedFiles.length > 0) {
                    for (const file of selectedFiles) {
                        const response =
                            await criarRespostaComUploadMutation.mutateAsync({
                                data: {
                                    tarefaId: selected.id,
                                    conteudoTexto:
                                        respostaTexto.trim() || undefined,
                                    arquivo: file,
                                },
                            });
                        if (
                            response &&
                            typeof response === "object" &&
                            "id" in response
                        ) {
                            respostaId = (response as any).id;
                        }
                    }
                } else if (respostaTexto.trim()) {
                    const response = await enviarRespostaMutation.mutateAsync({
                        data: {
                            tarefaId: selected.id,
                            estudanteId: userId,
                            conteudoTexto: respostaTexto.trim(),
                        },
                    });
                    if (
                        response &&
                        typeof response === "object" &&
                        "id" in response
                    ) {
                        respostaId = (response as any).id;
                    }
                } else {
                    setSubmissionError(
                        "Por favor, adicione arquivos ou escreva um comentário antes de entregar.",
                    );
                    return;
                }
            } else {
                // Create new answer
                if (selectedFiles.length > 0) {
                    for (const file of selectedFiles) {
                        const response =
                            await criarRespostaComUploadMutation.mutateAsync({
                                data: {
                                    tarefaId: selected.id,
                                    conteudoTexto:
                                        respostaTexto.trim() || undefined,
                                    arquivo: file,
                                },
                            });
                        if (
                            !respostaId &&
                            response &&
                            typeof response === "object" &&
                            "id" in response
                        ) {
                            respostaId = (response as any).id;
                        }
                    }
                } else if (respostaTexto.trim()) {
                    const response = await enviarRespostaMutation.mutateAsync({
                        data: {
                            tarefaId: selected.id,
                            estudanteId: userId,
                            conteudoTexto: respostaTexto.trim(),
                        },
                    });
                    if (
                        response &&
                        typeof response === "object" &&
                        "id" in response
                    ) {
                        respostaId = (response as any).id;
                    }
                } else {
                    setSubmissionError(
                        "Por favor, adicione arquivos ou escreva um comentário antes de entregar.",
                    );
                    return;
                }
            }

            setSubmissionSuccess(true);
            setIsAlreadySubmitted(true);

            // Mark as delivered
            toggleDelivered(selected.id);

            // Save submission content to local storage including answer ID
            setAssignmentSubmissions((prev) => ({
                ...prev,
                [selected.id]: {
                    comment: respostaTexto.trim(),
                    fileNames: selectedFiles.map((f) => f.name),
                    respostaId: respostaId,
                },
            }));

            // Reset success message and files after brief display
            setTimeout(() => {
                setSubmissionSuccess(false);
                setSelectedFiles([]);
                setRespostaTexto("");
            }, 2000);
        } catch (error: any) {
            console.error("Erro ao entregar tarefa:", error);
            setSubmissionError(
                error?.message ?? "Erro ao entregar tarefa. Tente novamente.",
            );
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return assignments.filter((a) => {
            if (
                q &&
                !`${a.title} ${a.description || ""} ${a.teacher}`
                    .toLowerCase()
                    .includes(q)
            )
                return false;

            if (tab === 0) return a.status === "open";
            if (tab === 1) return a.status === "submitted";
            if (tab === 2) return a.status === "late";
            return true;
        });
    }, [query, tab, assignments]);

    const isLoading = loadingDisciplinas || loadingTarefas;

    return (
        <Box sx={{ p: 4 }}>
            {/* Cabeçalho */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Box>
                    <Typography variant="h4">Tarefas</Typography>
                    <Typography color="text.secondary" variant="body2">
                        Veja suas atividades e prazos
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                        size="small"
                        placeholder="Pesquisar tarefas"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 360 }}
                    />
                </Box>
            </Box>

            {/* Tabs */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Ativas" />
                <Tab label="Entregues" />
                <Tab label="Atrasadas" />
            </Tabs>

            {/* Loading */}
            {!estudanteId ? (
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Não foi possível identificar o estudante. Faça login
                        novamente.
                    </Typography>
                </Box>
            ) : isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 4,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : errorDisciplinas ? (
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="body1" color="error">
                        Erro ao carregar disciplinas:{" "}
                        {errorDisciplinas?.response?.status ||
                            "Erro desconhecido"}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Verifique se você está matriculado em alguma disciplina.
                    </Typography>
                </Box>
            ) : filtered.length === 0 ? (
                <Box
                    sx={{
                        p: 4,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="body1" color="text.secondary">
                        Nenhuma tarefa encontrada.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filtered.map((a) => (
                        <Card key={a.id}>
                            <CardHeader
                                avatar={<Avatar>{a.teacher.charAt(0)}</Avatar>}
                                title={a.title}
                                subheader={`${new Date(a.dueDate).toLocaleString()} • ${a.points || ""}`}
                                action={
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            gap: 1,
                                        }}
                                    >
                                        <Chip
                                            label={
                                                a.status === "open"
                                                    ? "Aberta"
                                                    : a.status === "submitted"
                                                      ? "Entregue"
                                                      : "Atrasada"
                                            }
                                            color={
                                                a.status === "open"
                                                    ? "primary"
                                                    : a.status === "submitted"
                                                      ? "success"
                                                      : "warning"
                                            }
                                            size="small"
                                        />
                                        <IconButton
                                            aria-label="Abrir"
                                            onClick={() => openTask(a)}
                                        >
                                            Abrir
                                        </IconButton>
                                    </Box>
                                }
                            />

                            <CardContent>
                                <Typography color="text.secondary">
                                    {a.description}
                                </Typography>
                            </CardContent>

                            <Divider />

                            <CardActions sx={{ justifyContent: "flex-end" }}>
                                <Button
                                    size="small"
                                    onClick={() => openTask(a)}
                                >
                                    Abrir tarefa
                                </Button>
                            </CardActions>
                        </Card>
                    ))}
                </Box>
            )}

            {/* ------------------------------------------------- */}
            {/* POPUP DE DETALHES */}
            {/* ------------------------------------------------- */}

            <Dialog
                open={dialogOpen}
                onClose={closeTask}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        p: 3, // <-- MAIS ESPAÇAMENTO
                    },
                }}
            >
                {selected && (
                    <>
                        <DialogTitle
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pb: 2,
                            }}
                        >
                            <Typography variant="h5">
                                {selected.title}
                            </Typography>

                            <IconButton onClick={closeTask}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers sx={{ px: 4, py: 3 }}>
                            <Chip
                                label={
                                    selected.status === "open"
                                        ? "Aberta"
                                        : selected.status === "submitted"
                                          ? "Entregue"
                                          : "Atrasada"
                                }
                                color={
                                    selected.status === "open"
                                        ? "primary"
                                        : selected.status === "submitted"
                                          ? "success"
                                          : "warning"
                                }
                                sx={{ mb: 3 }}
                            />

                            <Typography variant="body1" sx={{ mb: 3 }}>
                                {selected.description ||
                                    "Sem descrição disponível."}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mb: 3 }}
                                color="text.secondary"
                            >
                                Entrega até{" "}
                                <strong>
                                    {new Date(selected.dueDate).toLocaleString(
                                        "pt-BR",
                                    )}
                                </strong>
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mb: 3 }}
                                color="text.secondary"
                            >
                                Valor:{" "}
                                <strong>{selected.points || "0 pts"}</strong>
                            </Typography>

                            {submissionError && (
                                <Alert
                                    severity="error"
                                    onClose={() => setSubmissionError(null)}
                                    sx={{ mb: 2 }}
                                >
                                    {submissionError}
                                </Alert>
                            )}

                            {submissionSuccess && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {isAlreadySubmitted && !submissionSuccess
                                        ? "Tarefa atualizada com sucesso!"
                                        : "Tarefa entregue com sucesso!"}
                                </Alert>
                            )}

                            {/* Show saved submission info if already submitted */}
                            {selected && assignmentSubmissions[selected.id] && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        sx={{ mb: 1 }}
                                    >
                                        Conteúdo da entrega anterior:
                                    </Typography>
                                    {assignmentSubmissions[selected.id]
                                        .fileNames.length > 0 && (
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 0.5 }}
                                        >
                                            Arquivos:{" "}
                                            {assignmentSubmissions[
                                                selected.id
                                            ].fileNames.join(", ")}
                                        </Typography>
                                    )}
                                </Alert>
                            )}

                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Anexar arquivos
                            </Typography>

                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                                sx={{ mb: 2 }}
                                disabled={submissionSuccess}
                            >
                                Selecionar arquivos
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFileSelect}
                                    disabled={submissionSuccess}
                                />
                            </Button>

                            {selectedFiles.length > 0 && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        Arquivos selecionados (
                                        {selectedFiles.length}):
                                    </Typography>
                                    <List dense>
                                        {selectedFiles.map((file, index) => (
                                            <ListItem
                                                key={index}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() =>
                                                            handleRemoveFile(
                                                                index,
                                                            )
                                                        }
                                                        disabled={
                                                            submissionSuccess
                                                        }
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AttachFileIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={file.name}
                                                    secondary={`${(file.size / 1024).toFixed(2)} KB`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Respostas
                            </Typography>

                            <TextField
                                multiline
                                minRows={3}
                                fullWidth
                                placeholder="Escreva sua resposta..."
                                value={respostaTexto}
                                onChange={(e) =>
                                    setRespostaTexto(e.target.value)
                                }
                                disabled={submissionSuccess}
                            />
                        </DialogContent>

                        <DialogActions sx={{ px: 4, py: 2 }}>
                            <Button
                                onClick={closeTask}
                                disabled={
                                    criarRespostaComUploadMutation.isPending ||
                                    enviarRespostaMutation.isPending
                                }
                            >
                                {submissionSuccess ? "Fechar" : "Cancelar"}
                            </Button>

                            <Button
                                variant="contained"
                                onClick={confirmEntrega}
                                disabled={
                                    submissionSuccess ||
                                    isAlreadySubmitted ||
                                    criarRespostaComUploadMutation.isPending ||
                                    enviarRespostaMutation.isPending ||
                                    (selectedFiles.length === 0 &&
                                        !respostaTexto.trim())
                                }
                                startIcon={
                                    criarRespostaComUploadMutation.isPending ||
                                    enviarRespostaMutation.isPending ? (
                                        <CircularProgress size={20} />
                                    ) : undefined
                                }
                            >
                                {criarRespostaComUploadMutation.isPending ||
                                enviarRespostaMutation.isPending
                                    ? "Enviando..."
                                    : isAlreadySubmitted
                                      ? "Entregue"
                                      : "Entregar Tarefa"}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* MODAL DE CONFIRMAÇÃO */}
            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {isAlreadySubmitted
                        ? "Confirmar atualização"
                        : "Confirmar entrega"}
                </DialogTitle>

                <DialogContent sx={{ py: 2 }}>
                    <Typography>
                        {isAlreadySubmitted
                            ? "Tem certeza que deseja atualizar esta tarefa?"
                            : "Tem certeza que deseja entregar esta tarefa agora?"}
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={finalizarEntrega}
                        disabled={
                            criarRespostaComUploadMutation.isPending ||
                            enviarRespostaMutation.isPending
                        }
                    >
                        {criarRespostaComUploadMutation.isPending ||
                        enviarRespostaMutation.isPending
                            ? "Enviando..."
                            : isAlreadySubmitted
                              ? "Confirmar atualização"
                              : "Confirmar entrega"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

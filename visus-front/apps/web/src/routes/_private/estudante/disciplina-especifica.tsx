// apps/web/src/routes/_private/estudante/disciplina-especifica.tsx
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
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
    Checkbox,
    Chip,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
// Kubb hooks
import {
    useCriarRespostaComUpload,
    useEnviarResposta,
    useGetEstudantesFromDisciplina,
    useGetPublicacoes,
    useGetTarefaById,
    useListarArquivos,
    useObterComentariosDaPublicacao,
    useResponderComentario,
    useResponderPublicacao,
} from "@visus/api";
import React, { useState } from "react";
// Auth
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute(
    "/_private/estudante/disciplina-especifica",
)({
    component: DisciplinaEspecificaPage,
});

// Base da API
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// Tipos
interface Estudante {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    matricula: string;
    periodo: string;
    anoEscolar: string;
    telefone: string;
    genero: string;
    dataNascimento: string;
}

interface Arquivo {
    id: number;
    nomeOriginal: string;
    caminho: string;
    dataEnvio: string;
    tipoMime: string;
    enviadoPor: string;
}

interface Publicacao {
    id: number;
    titulo: string;
    conteudo?: string;
    caminhoAnexo?: string;
    dataEnvio: string;
    autor?: {
        id: number;
        nome: string;
        email: string;
        matricula: string;
        titulo: string;
    };
}

interface Tarefa {
    id: number;
    titulo: string;
    resumoConteudo?: string;
    dataCriacao?: string;
    dataExpiracao?: string;
    valorTotal?: number;
    educadorResponsavel?: string;
    disciplinaId: number;
}

interface Comentario {
    id: number;
    conteudo: string;
    dataEnvio: string;
    autor: {
        id: number;
        nome: string;
        email: string;
    };
    respostas?: Comentario[];
}

// COMPONENTE -----------------------------

function DisciplinaEspecificaPage() {
    const [tab, setTab] = useState(0);

    // Get disciplina ID from route search params
    const { disciplinaId, nome } = Route.useSearch() as {
        disciplinaId?: string | number;
        nome?: string;
    };

    const disciplinaIdNumber = disciplinaId ? Number(disciplinaId) : 0;
    const hasDisciplinaId =
        disciplinaIdNumber > 0 && !Number.isNaN(disciplinaIdNumber);

    const nomeDisciplina =
        nome ??
        (hasDisciplinaId ? `Disciplina #${disciplinaIdNumber}` : "Disciplina");

    const { user, token } = useAuth();

    // Modal states for activity details
    const [selectedTarefa, setSelectedTarefa] = useState<Tarefa | null>(null);
    const [tarefaDialogOpen, setTarefaDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Tarefa submission states
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [tarefaComment, setTarefaComment] = useState("");
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

    // Comments state
    const [expandedComments, setExpandedComments] = useState<
        Record<number, boolean>
    >({});
    const [commentText, setCommentText] = useState<Record<number, string>>({});
    const [replyText, setReplyText] = useState<Record<number, string>>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [commentError, setCommentError] = useState<string | null>(null);

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

    const toggleComments = (publicacaoId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [publicacaoId]: !prev[publicacaoId],
        }));
    };

    const openTarefa = (tarefa: Tarefa) => {
        setSelectedTarefa(tarefa);
        setTarefaDialogOpen(true);

        // Restore saved submission content if exists
        const savedSubmission = assignmentSubmissions[tarefa.id];
        if (savedSubmission) {
            setTarefaComment(savedSubmission.comment || "");
            // Note: We can't restore actual File objects, but we show the file names
            setIsAlreadySubmitted(true);
        }

        // Check if there are existing responses for this task
        checkExistingSubmission(tarefa.id);
    };

    const checkExistingSubmission = async (tarefaId: number) => {
        try {
            if (!token) return;

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/tarefas/${tarefaId}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userId = getUserIdFromUser(user as any);

                // Check if the current user has submitted a response
                if (
                    data.respostas &&
                    Array.isArray(data.respostas) &&
                    data.respostas.length > 0
                ) {
                    // If there are any responses, mark as delivered
                    // You could also check if one of the responses belongs to current user
                    // by comparing estudanteId or estudanteNome
                    const hasUserResponse = data.respostas.some((r: any) => {
                        // The API might return different field names, adjust as needed
                        return true; // For now, any response marks it as delivered
                    });

                    if (hasUserResponse) {
                        setDeliveredAssignments((prev) => ({
                            ...prev,
                            [tarefaId]: true,
                        }));
                        setIsAlreadySubmitted(true);

                        // Save submission content from server response
                        const userResponse = data.respostas[0]; // Take first response
                        if (userResponse) {
                            setAssignmentSubmissions((prev) => ({
                                ...prev,
                                [tarefaId]: {
                                    comment: userResponse.conteudoTexto || "",
                                    fileNames: userResponse.arquivo
                                        ? [userResponse.arquivo.nomeOriginal]
                                        : [],
                                    respostaId: userResponse.id,
                                },
                            }));

                            // Set the comment in the UI
                            setTarefaComment(userResponse.conteudoTexto || "");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error checking existing submission:", error);
            // Don't show error to user, just silently fail
        }
    };

    const closeTarefa = () => {
        setTarefaDialogOpen(false);
        setSelectedTarefa(null);
        setSelectedFiles([]);
        setTarefaComment("");
        setSubmissionError(null);
        setSubmissionSuccess(false);
        setIsAlreadySubmitted(false);
    };

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

    const confirmEntrega = () => {
        setConfirmOpen(true);
    };

    const finalizarEntrega = async () => {
        try {
            setSubmissionError(null);
            setConfirmOpen(false);

            if (!selectedTarefa) {
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

            const existingSubmission = assignmentSubmissions[selectedTarefa.id];
            const existingRespostaId = existingSubmission?.respostaId;
            let respostaId: number | undefined = existingRespostaId;

            // Check if updating existing answer or creating new one
            if (existingRespostaId) {
                // Update existing answer - use direct API call since there might not be a mutation
                const base = API_BASE_URL.replace(/\/+$/, "");

                // For updates, we need to handle file uploads differently
                // We'll delete old answer and create a new one as a workaround
                // or just create additional responses
                if (selectedFiles.length > 0) {
                    for (const file of selectedFiles) {
                        const response =
                            await criarRespostaComUploadMutation.mutateAsync({
                                data: {
                                    tarefaId: selectedTarefa.id,
                                    conteudoTexto:
                                        tarefaComment.trim() || undefined,
                                    arquivo: file,
                                },
                            });
                        // Update respostaId with the latest response
                        if (
                            response &&
                            typeof response === "object" &&
                            "id" in response
                        ) {
                            respostaId = (response as any).id;
                        }
                    }
                } else if (tarefaComment.trim()) {
                    const response = await enviarRespostaMutation.mutateAsync({
                        data: {
                            tarefaId: selectedTarefa.id,
                            estudanteId: userId,
                            conteudoTexto: tarefaComment.trim(),
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
                                    tarefaId: selectedTarefa.id,
                                    conteudoTexto:
                                        tarefaComment.trim() || undefined,
                                    arquivo: file,
                                },
                            });
                        // Store the first response ID
                        if (
                            !respostaId &&
                            response &&
                            typeof response === "object" &&
                            "id" in response
                        ) {
                            respostaId = (response as any).id;
                        }
                    }
                } else if (tarefaComment.trim()) {
                    const response = await enviarRespostaMutation.mutateAsync({
                        data: {
                            tarefaId: selectedTarefa.id,
                            estudanteId: userId,
                            conteudoTexto: tarefaComment.trim(),
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
            toggleDelivered(selectedTarefa.id);

            // Save submission content to local storage including answer ID
            setAssignmentSubmissions((prev) => ({
                ...prev,
                [selectedTarefa.id]: {
                    comment: tarefaComment.trim(),
                    fileNames: selectedFiles.map((f) => f.name),
                    respostaId: respostaId,
                },
            }));

            // Reset success message and files after brief display, but keep modal open
            setTimeout(() => {
                setSubmissionSuccess(false);
                setSelectedFiles([]);
                setTarefaComment("");
            }, 2000);
        } catch (error: any) {
            console.error("Erro ao entregar tarefa:", error);
            setSubmissionError(
                error?.message ?? "Erro ao entregar tarefa. Tente novamente.",
            );
        }
    };

    const authClientConfig = token
        ? ({
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "*/*",
              },
          } as const)
        : undefined;

    const [downloadError, setDownloadError] = useState<string | null>(null);
    const [pubError, setPubError] = useState<string | null>(null);

    // ---------------------------------------------
    // ARQUIVOS – Kubb (apenas listar e download)
    // ---------------------------------------------

    const arquivosQuery = useListarArquivos(
        hasDisciplinaId ? disciplinaIdNumber : 0,
        {
            query: {
                enabled: hasDisciplinaId && !!token,
            },
            client: authClientConfig,
        },
    );

    const arquivos = React.useMemo(() => {
        const rawData = arquivosQuery.data;
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }
        return rawData as Arquivo[];
    }, [arquivosQuery.data]);

    const handleDownloadArquivo = async (arquivo: Arquivo) => {
        try {
            setDownloadError(null);

            if (!token) {
                setDownloadError("Sessão expirada. Faça login novamente.");
                return;
            }

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/arquivos/download/${arquivo.id}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Erro ao baixar arquivo (status ${response.status}). Verifique suas permissões.`,
                );
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = arquivo.nomeOriginal || "arquivo";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error: any) {
            console.error("Erro ao baixar arquivo:", error);
            setDownloadError(
                error?.message ?? "Erro ao baixar arquivo. Tente novamente.",
            );
        }
    };

    // ---------------------------------------------
    // PUBLICAÇÕES
    // ---------------------------------------------

    const publicacoesQuery = useGetPublicacoes(
        { discplinaId: hasDisciplinaId ? disciplinaIdNumber : 0 },
        {
            query: {
                enabled: hasDisciplinaId && !!token,
            },
            client: authClientConfig,
        },
    );

    const publicacoes = React.useMemo(() => {
        const rawData = publicacoesQuery.data;
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }
        return rawData as Publicacao[];
    }, [publicacoesQuery.data]);

    // ---------------------------------------------
    // COMMENTS MUTATION
    // ---------------------------------------------

    const responderPublicacaoMutation = useResponderPublicacao({
        client: authClientConfig,
    });

    const responderComentarioMutation = useResponderComentario({
        client: authClientConfig,
    });

    const criarRespostaComUploadMutation = useCriarRespostaComUpload({
        client: authClientConfig,
    });

    const enviarRespostaMutation = useEnviarResposta({
        client: authClientConfig,
    });

    const getUserIdFromUser = (user?: any): number | null => {
        if (!user) return null;
        const candidates = [user.id, user.usuarioId, user.userId];
        const found = candidates.find(
            (v) => typeof v === "number" || typeof v === "string",
        );
        return found != null ? Number(found) : null;
    };

    const handleSubmitComment = async (publicacaoId: number) => {
        try {
            setCommentError(null);

            const comment = commentText[publicacaoId]?.trim();
            if (!comment) {
                setCommentError("Digite um comentário antes de enviar.");
                return;
            }

            if (!token) {
                setCommentError("Sessão expirada. Faça login novamente.");
                return;
            }

            const userId = getUserIdFromUser(user as any);
            if (!userId) {
                setCommentError("Não foi possível identificar o usuário.");
                return;
            }

            await responderPublicacaoMutation.mutateAsync({
                data: {
                    conteudo: comment,
                },
                params: {
                    publicacaoId,
                    usuarioId: userId,
                },
            });

            // Clear the comment text after successful submission
            setCommentText((prev) => ({
                ...prev,
                [publicacaoId]: "",
            }));

            // Refetch publications to get updated comments
            await publicacoesQuery.refetch();
        } catch (error: any) {
            console.error("Erro ao enviar comentário:", error);
            setCommentError(
                error?.message ?? "Erro ao enviar comentário. Tente novamente.",
            );
        }
    };

    const handleSubmitReply = async (
        comentarioId: number,
        publicacaoId: number,
    ) => {
        try {
            setCommentError(null);

            const reply = replyText[comentarioId]?.trim();
            if (!reply) {
                setCommentError("Digite uma resposta antes de enviar.");
                return;
            }

            if (!token) {
                setCommentError("Sessão expirada. Faça login novamente.");
                return;
            }

            const userId = getUserIdFromUser(user as any);
            if (!userId) {
                setCommentError("Não foi possível identificar o usuário.");
                return;
            }

            await responderComentarioMutation.mutateAsync({
                data: {
                    conteudo: reply,
                },
                params: {
                    comentarioId,
                    usuarioId: userId,
                },
            });

            // Clear the reply text after successful submission
            setReplyText((prev) => ({
                ...prev,
                [comentarioId]: "",
            }));
            setReplyingTo(null);

            // Force refetch to show new reply
            await publicacoesQuery.refetch();
        } catch (error: any) {
            console.error("Erro ao enviar resposta:", error);
            setCommentError(
                error?.message ?? "Erro ao enviar resposta. Tente novamente.",
            );
        }
    };

    const handleOpenAnexo = async (caminhoAnexo?: string | null) => {
        try {
            setPubError(null);

            if (!caminhoAnexo) {
                setPubError("Publicação não possui anexo.");
                return;
            }

            if (!token) {
                setPubError("Sessão expirada. Faça login novamente.");
                return;
            }

            const trimmed = caminhoAnexo.trim();
            if (!trimmed) {
                setPubError("Caminho do anexo inválido.");
                return;
            }

            // Extract arquivo ID from path like "/arquivos/download/123"
            const arquivoIdMatch = trimmed.match(/\/arquivos\/download\/(\d+)/);
            let filename = "anexo";

            if (arquivoIdMatch && arquivoIdMatch[1]) {
                const arquivoId = Number(arquivoIdMatch[1]);
                // Try to find the arquivo in our list to get the original name
                const arquivo = arquivos.find((a) => a.id === arquivoId);
                if (arquivo && arquivo.nomeOriginal) {
                    filename = arquivo.nomeOriginal;
                }
            }

            let url: string;
            if (/^https?:\/\//i.test(trimmed)) {
                url = trimmed;
            } else {
                const base = API_BASE_URL.replace(/\/+$/, "");
                const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
                url = `${base}${path}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Erro ao baixar anexo (status ${response.status}). Verifique suas permissões.`,
                );
            }

            // Try to get filename from Content-Disposition header if we don't have it yet
            if (filename === "anexo") {
                const contentDisposition = response.headers.get(
                    "content-disposition",
                );
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(
                        /filename[^;=\n]*=(['"]?)([^'"\n]*)\1/,
                    );
                    if (filenameMatch && filenameMatch[2]) {
                        filename = decodeURIComponent(filenameMatch[2]);
                    }
                }
            }

            const blob = await response.blob();
            const contentType =
                blob.type || response.headers.get("content-type") || "";

            // If still no extension, add one based on content type
            if (!filename.includes(".")) {
                const extensionMap: Record<string, string> = {
                    "image/jpeg": ".jpg",
                    "image/jpg": ".jpg",
                    "image/png": ".png",
                    "image/gif": ".gif",
                    "image/webp": ".webp",
                    "image/svg+xml": ".svg",
                    "application/pdf": ".pdf",
                    "application/msword": ".doc",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                        ".docx",
                    "application/vnd.ms-excel": ".xls",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                        ".xlsx",
                    "application/vnd.ms-powerpoint": ".ppt",
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                        ".pptx",
                    "text/plain": ".txt",
                    "application/zip": ".zip",
                };
                const extension = extensionMap[contentType];
                if (extension) {
                    filename += extension;
                }
            }

            const blobUrl = URL.createObjectURL(blob);

            // For images, try to open in new tab; otherwise download
            if (contentType.startsWith("image/")) {
                const win = window.open(
                    blobUrl,
                    "_blank",
                    "noopener,noreferrer",
                );
                if (!win) {
                    // Fallback to download if popup blocked
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobUrl);
                }
            } else {
                // For non-images, download directly
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }
        } catch (error: any) {
            console.error("Erro ao abrir anexo:", error);
            setPubError(
                error?.message ??
                    "Erro ao abrir anexo. Tente novamente mais tarde.",
            );
        }
    };

    // ---------------------------------------------
    // ESTUDANTES
    // ---------------------------------------------

    const estudantesQuery = useGetEstudantesFromDisciplina(
        hasDisciplinaId ? disciplinaIdNumber : 0,
        {
            query: {
                enabled: hasDisciplinaId && !!token,
            },
            client: authClientConfig,
        },
    );

    const estudantes = React.useMemo(() => {
        const rawData = estudantesQuery.data;
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }
        return rawData as Estudante[];
    }, [estudantesQuery.data]);

    // ---------------------------------------------
    // TAREFAS / ATIVIDADES
    // ---------------------------------------------

    const tarefasQuery = useQuery<Tarefa[]>({
        queryKey: ["tarefas", disciplinaIdNumber, token],
        enabled: hasDisciplinaId && !!token,
        staleTime: 0,
        queryFn: async () => {
            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }
            if (!hasDisciplinaId) {
                throw new Error("ID da disciplina inválido.");
            }

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/tarefas/disciplina/${disciplinaIdNumber}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(
                    text ||
                        `Erro ao buscar atividades (status ${response.status})`,
                );
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        },
    });

    const tarefas = tarefasQuery.data ?? [];

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER DA DISCIPLINA */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4">{nomeDisciplina}</Typography>
                <Typography color="text.secondary">
                    Visualização da disciplina
                </Typography>
            </Box>

            {/* ABAS */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Publicações" />
                <Tab label="Arquivos" />
                <Tab label="Estudantes" />
                <Tab label="Atividades" />
            </Tabs>

            {/* PUBLICAÇÕES */}
            {tab === 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {publicacoesQuery.isLoading && hasDisciplinaId && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {publicacoesQuery.isError &&
                        hasDisciplinaId &&
                        !publicacoesQuery.isLoading && (
                            <Alert severity="error">
                                Erro ao carregar publicações desta disciplina.
                            </Alert>
                        )}

                    {pubError && (
                        <Alert
                            severity="error"
                            onClose={() => setPubError(null)}
                            sx={{ mb: 1 }}
                        >
                            {pubError}
                        </Alert>
                    )}

                    {hasDisciplinaId &&
                        !publicacoesQuery.isLoading &&
                        !publicacoesQuery.isError &&
                        publicacoes.length === 0 && (
                            <Typography color="text.secondary">
                                Nenhuma publicação nesta disciplina.
                            </Typography>
                        )}

                    {hasDisciplinaId &&
                        !publicacoesQuery.isLoading &&
                        !publicacoesQuery.isError &&
                        publicacoes.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {publicacoes.map((pub) => {
                                    const autorNome =
                                        pub.autor?.nome || "Autor desconhecido";
                                    const dataEnvio = pub.dataEnvio
                                        ? new Date(
                                              pub.dataEnvio,
                                          ).toLocaleString()
                                        : "Data desconhecida";

                                    return (
                                        <Card key={pub.id}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar>
                                                        {autorNome.charAt(0)}
                                                    </Avatar>
                                                }
                                                title={
                                                    pub.titulo || "Sem título"
                                                }
                                                subheader={`${autorNome} • ${dataEnvio}`}
                                            />
                                            <CardContent>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {pub.conteudo ||
                                                        "Sem conteúdo."}
                                                </Typography>

                                                {pub.caminhoAnexo && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={
                                                            <AttachFileIcon />
                                                        }
                                                        onClick={() =>
                                                            handleOpenAnexo(
                                                                pub.caminhoAnexo,
                                                            )
                                                        }
                                                    >
                                                        Abrir anexo
                                                    </Button>
                                                )}
                                            </CardContent>

                                            {/* Comments Section - Always Visible */}
                                            <CardContent
                                                sx={{
                                                    bgcolor:
                                                        "background.default",
                                                    pt: 2,
                                                }}
                                            >
                                                <CommentsSection
                                                    publicacaoId={pub.id!}
                                                    token={token}
                                                    authClientConfig={
                                                        authClientConfig
                                                    }
                                                    commentText={
                                                        commentText[pub.id!] ||
                                                        ""
                                                    }
                                                    setCommentText={(text) =>
                                                        setCommentText(
                                                            (prev) => ({
                                                                ...prev,
                                                                [pub.id!]: text,
                                                            }),
                                                        )
                                                    }
                                                    handleSubmitComment={async () => {
                                                        await handleSubmitComment(
                                                            pub.id!,
                                                        );
                                                    }}
                                                    isSubmitting={
                                                        responderPublicacaoMutation.isPending
                                                    }
                                                    replyText={replyText}
                                                    setReplyText={setReplyText}
                                                    replyingTo={replyingTo}
                                                    setReplyingTo={
                                                        setReplyingTo
                                                    }
                                                    handleSubmitReply={async (
                                                        comentarioId: number,
                                                    ) => {
                                                        await handleSubmitReply(
                                                            comentarioId,
                                                            pub.id!,
                                                        );
                                                    }}
                                                    isSubmittingReply={
                                                        responderComentarioMutation.isPending
                                                    }
                                                />
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                </Box>
            )}

            {/* ARQUIVOS */}
            {tab === 1 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {arquivosQuery.isLoading && hasDisciplinaId && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {arquivosQuery.isError &&
                        hasDisciplinaId &&
                        !arquivosQuery.isLoading && (
                            <Alert severity="error">
                                Erro ao carregar arquivos desta disciplina.
                            </Alert>
                        )}

                    {downloadError && (
                        <Alert
                            severity="error"
                            onClose={() => setDownloadError(null)}
                            sx={{ mb: 1 }}
                        >
                            {downloadError}
                        </Alert>
                    )}

                    {hasDisciplinaId &&
                        !arquivosQuery.isLoading &&
                        !arquivosQuery.isError &&
                        arquivos.length === 0 && (
                            <Typography color="text.secondary">
                                Nenhum arquivo nesta disciplina.
                            </Typography>
                        )}

                    {hasDisciplinaId &&
                        !arquivosQuery.isLoading &&
                        !arquivosQuery.isError &&
                        arquivos.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {arquivos.map((arq) => (
                                    <Card key={arq.id}>
                                        <CardHeader
                                            title={arq.nomeOriginal}
                                            subheader={`Enviado por ${arq.enviadoPor || "—"} em ${new Date(
                                                arq.dataEnvio,
                                            ).toLocaleString()}`}
                                        />
                                        <CardContent
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 2,
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {arq.tipoMime ||
                                                    "application/octet-stream"}
                                            </Typography>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<AttachFileIcon />}
                                                onClick={() =>
                                                    handleDownloadArquivo(arq)
                                                }
                                            >
                                                Baixar arquivo
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        )}
                </Box>
            )}

            {/* ESTUDANTES */}
            {tab === 2 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {estudantesQuery.isLoading && hasDisciplinaId && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {estudantesQuery.isError &&
                        hasDisciplinaId &&
                        !estudantesQuery.isLoading && (
                            <Alert severity="error">
                                Erro ao carregar estudantes desta disciplina.
                            </Alert>
                        )}

                    {hasDisciplinaId &&
                        !estudantesQuery.isLoading &&
                        !estudantesQuery.isError &&
                        estudantes.length === 0 && (
                            <Typography color="text.secondary">
                                Nenhum estudante matriculado nesta disciplina.
                            </Typography>
                        )}

                    {hasDisciplinaId &&
                        !estudantesQuery.isLoading &&
                        !estudantesQuery.isError &&
                        estudantes.length > 0 && (
                            <List>
                                {estudantes.map((e) => (
                                    <ListItem key={e.id}>
                                        <ListItemAvatar>
                                            <Avatar>{e.nome.charAt(0)}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={e.nome}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        Matrícula:{" "}
                                                        {e.matricula || "—"}
                                                    </Typography>
                                                    {` — ${e.email || "sem e-mail"}`}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                </Box>
            )}

            {/* ATIVIDADES (TAREFAS) */}
            {tab === 3 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {tarefasQuery.isLoading && hasDisciplinaId && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: 2,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {tarefasQuery.isError &&
                        hasDisciplinaId &&
                        !tarefasQuery.isLoading && (
                            <Alert severity="error">
                                Erro ao carregar atividades desta disciplina.
                            </Alert>
                        )}

                    {hasDisciplinaId &&
                        !tarefasQuery.isLoading &&
                        !tarefasQuery.isError &&
                        tarefas.length === 0 && (
                            <Typography color="text.secondary">
                                Nenhuma atividade criada para esta disciplina.
                            </Typography>
                        )}

                    {hasDisciplinaId &&
                        !tarefasQuery.isLoading &&
                        !tarefasQuery.isError &&
                        tarefas.length > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {tarefas.map((t) => {
                                    const expiracao = t.dataExpiracao
                                        ? new Date(t.dataExpiracao)
                                        : null;
                                    const agora = new Date();
                                    const status =
                                        expiracao && expiracao < agora
                                            ? "Encerrada"
                                            : "Aberta";

                                    const isDelivered =
                                        deliveredAssignments[t.id] || false;

                                    return (
                                        <Card key={t.id}>
                                            <CardHeader
                                                title={t.titulo}
                                                subheader={`Prazo: ${
                                                    expiracao
                                                        ? expiracao.toLocaleDateString()
                                                        : "Sem prazo"
                                                } • Valor: ${
                                                    t.valorTotal != null
                                                        ? t.valorTotal.toLocaleString(
                                                              "pt-BR",
                                                              {
                                                                  maximumFractionDigits: 2,
                                                              },
                                                          )
                                                        : "-"
                                                } pts`}
                                                action={
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        {isDelivered && (
                                                            <Chip
                                                                label="Entregue"
                                                                color="success"
                                                                size="small"
                                                            />
                                                        )}
                                                        <Chip
                                                            label={status}
                                                            color={
                                                                status ===
                                                                "Aberta"
                                                                    ? "primary"
                                                                    : "default"
                                                            }
                                                        />
                                                    </Box>
                                                }
                                            />
                                            <CardContent>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {t.resumoConteudo ||
                                                        "Sem descrição."}
                                                </Typography>
                                            </CardContent>
                                            <Divider />
                                            <CardActions
                                                sx={{
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                <Button
                                                    size="small"
                                                    onClick={() =>
                                                        openTarefa(t)
                                                    }
                                                >
                                                    Abrir tarefa
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                </Box>
            )}

            {/* MODAL DE DETALHES DA TAREFA */}
            <Dialog
                open={tarefaDialogOpen}
                onClose={closeTarefa}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        p: 3,
                    },
                }}
            >
                {selectedTarefa && (
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
                                {selectedTarefa.titulo}
                            </Typography>

                            <IconButton onClick={closeTarefa}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent dividers sx={{ px: 4, py: 3 }}>
                            <Chip
                                label={
                                    selectedTarefa.dataExpiracao &&
                                    new Date(selectedTarefa.dataExpiracao) <
                                        new Date()
                                        ? "Encerrada"
                                        : "Aberta"
                                }
                                color={
                                    selectedTarefa.dataExpiracao &&
                                    new Date(selectedTarefa.dataExpiracao) <
                                        new Date()
                                        ? "default"
                                        : "primary"
                                }
                                sx={{ mb: 3 }}
                            />

                            <Typography variant="body1" sx={{ mb: 3 }}>
                                {selectedTarefa.resumoConteudo ||
                                    "Sem descrição disponível."}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mb: 3 }}
                                color="text.secondary"
                            >
                                Entrega até{" "}
                                <strong>
                                    {selectedTarefa.dataExpiracao
                                        ? new Date(
                                              selectedTarefa.dataExpiracao,
                                          ).toLocaleString("pt-BR")
                                        : "Sem prazo definido"}
                                </strong>
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ mb: 3 }}
                                color="text.secondary"
                            >
                                Valor:{" "}
                                <strong>
                                    {selectedTarefa.valorTotal ?? 0} pts
                                </strong>
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
                            {selectedTarefa &&
                                assignmentSubmissions[selectedTarefa.id] && (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            sx={{ mb: 1 }}
                                        >
                                            Conteúdo da entrega anterior:
                                        </Typography>
                                        {assignmentSubmissions[
                                            selectedTarefa.id
                                        ].fileNames.length > 0 && (
                                            <Typography
                                                variant="body2"
                                                sx={{ mb: 0.5 }}
                                            >
                                                Arquivos:{" "}
                                                {assignmentSubmissions[
                                                    selectedTarefa.id
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
                                value={tarefaComment}
                                onChange={(e) =>
                                    setTarefaComment(e.target.value)
                                }
                                disabled={submissionSuccess}
                            />
                        </DialogContent>

                        <DialogActions sx={{ px: 4, py: 2 }}>
                            <Button
                                onClick={closeTarefa}
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
                                        !tarefaComment.trim())
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
                                      ? "Entregue."
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
                    <Button variant="contained" onClick={finalizarEntrega}>
                        {isAlreadySubmitted
                            ? "Confirmar atualização"
                            : "Confirmar entrega"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

// Comments Section Component
interface CommentsSectionProps {
    publicacaoId: number;
    token: string | null;
    authClientConfig: any;
    commentText: string;
    setCommentText: (text: string) => void;
    handleSubmitComment: () => Promise<void>;
    isSubmitting: boolean;
    replyText: Record<number, string>;
    setReplyText: (
        setter: (prev: Record<number, string>) => Record<number, string>,
    ) => void;
    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    handleSubmitReply: (
        comentarioId: number,
        publicacaoId: number,
    ) => Promise<void>;
    isSubmittingReply: boolean;
}

function CommentsSection({
    publicacaoId,
    token,
    authClientConfig,
    commentText,
    setCommentText,
    handleSubmitComment,
    isSubmitting,
    replyText,
    setReplyText,
    replyingTo,
    setReplyingTo,
    handleSubmitReply,
    isSubmittingReply,
}: CommentsSectionProps) {
    // Fetch comments for this publication
    const comentariosQuery = useObterComentariosDaPublicacao(
        { publicacaoId },
        {
            query: {
                enabled: !!token && !!publicacaoId,
                refetchInterval: 5000, // Auto-refresh every 5 seconds
                refetchOnWindowFocus: true, // Refetch when window regains focus
            },
            client: authClientConfig,
        },
    );

    const comentarios = React.useMemo(() => {
        const rawData = comentariosQuery.data;
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }
        return rawData as any[];
    }, [comentariosQuery.data]);

    const renderComment = (comentario: any, isReply = false) => (
        <Box key={comentario.id} sx={{ mb: 2 }}>
            <ListItem alignItems="flex-start" sx={{ px: 0, pb: 1 }}>
                <ListItemAvatar>
                    <Avatar
                        sx={{
                            width: isReply ? 32 : 40,
                            height: isReply ? 32 : 40,
                        }}
                    >
                        {comentario.autor?.nome?.charAt(0) || "?"}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                variant={isReply ? "body2" : "subtitle2"}
                                fontWeight="bold"
                            >
                                {comentario.autor?.nome ||
                                    "Usuário desconhecido"}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                •
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {comentario.dataEnvio
                                    ? new Date(
                                          comentario.dataEnvio,
                                      ).toLocaleString("pt-BR")
                                    : ""}
                            </Typography>
                        </Box>
                    }
                    secondary={
                        <>
                            <Typography variant="body2" sx={{ mt: 0.5, mb: 1 }}>
                                {comentario.conteudo}
                            </Typography>
                            {!isReply && (
                                <Button
                                    size="small"
                                    onClick={() => setReplyingTo(comentario.id)}
                                    sx={{
                                        minWidth: "auto",
                                        px: 1,
                                        textTransform: "none",
                                    }}
                                >
                                    Responder
                                </Button>
                            )}
                        </>
                    }
                />
            </ListItem>

            {/* Reply Form */}
            {!isReply && replyingTo === comentario.id && (
                <Box sx={{ ml: 6, mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "flex-start",
                        }}
                    >
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            maxRows={4}
                            placeholder="Escreva sua resposta..."
                            value={replyText[comentario.id] || ""}
                            onChange={(e) =>
                                setReplyText((prev) => ({
                                    ...prev,
                                    [comentario.id]: e.target.value,
                                }))
                            }
                            disabled={isSubmittingReply}
                            size="small"
                        />
                        <IconButton
                            color="primary"
                            onClick={() =>
                                handleSubmitReply(comentario.id, publicacaoId)
                            }
                            disabled={
                                isSubmittingReply ||
                                !replyText[comentario.id]?.trim()
                            }
                            sx={{ mt: 0.5 }}
                        >
                            <SendIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => setReplyingTo(null)}
                            disabled={isSubmittingReply}
                            sx={{ mt: 0.5 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* Render Replies */}
            {comentario.respostas && comentario.respostas.length > 0 && (
                <Box sx={{ ml: 6 }}>
                    {comentario.respostas.map((resposta: any) =>
                        renderComment(resposta, true),
                    )}
                </Box>
            )}
        </Box>
    );

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Comentários ({comentarios.length})
            </Typography>

            {comentariosQuery.isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {comentariosQuery.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    Erro ao carregar comentários.
                </Alert>
            )}

            {!comentariosQuery.isLoading &&
                !comentariosQuery.isError &&
                comentarios.length === 0 && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                    </Typography>
                )}

            {!comentariosQuery.isLoading &&
                !comentariosQuery.isError &&
                comentarios.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        {comentarios.map((comentario) =>
                            renderComment(comentario),
                        )}
                    </Box>
                )}

            <Divider sx={{ my: 2 }} />

            {/* Add Comment Form */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    placeholder="Escreva um comentário..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                    size="small"
                />
                <IconButton
                    color="primary"
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !commentText.trim()}
                    sx={{ mt: 0.5 }}
                >
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
}

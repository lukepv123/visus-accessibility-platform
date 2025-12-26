// apps/web/src/routes/_private/educador/disciplinas/$disciplina.tsx
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
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
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
// Kubb – disciplina + usuários da instituição + arquivos + publicações
import {
    useAddEstudanteToDisciplina,
    useCreatePublicacao,
    useDeletarArquivo,
    useDeletePublicacao,
    useGetEstudantesFromDisciplina,
    useGetPublicacoes,
    useGetUsuariosFromInstituicao,
    useListarArquivos,
    useObterComentariosDaPublicacao,
    useResponderComentario,
    useResponderPublicacao,
    useUploadArquivo,
    // ❌ NÃO usamos mais os hooks de tarefas do Kubb:
    // useGetTarefasByDisciplina,
    // useCreateTarefa,
    // useRemoveTarefa,
} from "@visus/api";
import React from "react";
import { useState } from "react";
// Auth
import { useAuth } from "../../../../contexts/AuthContext";

export const Route = createFileRoute(
    "/_private/educador/disciplinas/$disciplina",
)({
    component: EducadorDisciplinaEspecificaPage,
});

// Base da API (backend Spring Boot)
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

interface UsuarioInstituicao {
    id: number;
    nome: string;
    email: string;
    funcao: string;
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

// Helpers --------------------------------------------------

function isEstudanteRole(funcao?: string | null): boolean {
    if (!funcao) return false;
    return funcao.toLowerCase().includes("estudante");
}

// tentativa pragmática de descobrir a instituição do user logado
function guessInstituicaoIdFromUser(user: any): number | null {
    if (!user) return null;

    const candidates = [
        user.instituicaoId,
        user.institutionId,
        user.instituicao?.id,
        user.institution?.id,
    ];

    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

function getUsuarioIdFromUser(user?: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

// COMPONENTE ----------------------------------------

function EducadorDisciplinaEspecificaPage() {
    const [tab, setTab] = useState(0);

    // param "disciplina" é o ID numérico da disciplina
    const { disciplina } = Route.useParams();
    const disciplinaIdNumber = Number(disciplina);
    const hasDisciplinaId = !Number.isNaN(disciplinaIdNumber);

    // nome opcional vindo da query (?nome=...)
    const { nome } = Route.useSearch() as { nome?: string };
    const nomeDisciplina =
        nome ??
        (hasDisciplinaId ? `Disciplina #${disciplinaIdNumber}` : "Disciplina");

    const { user, token } = useAuth();

    // Config padrão de cliente Kubb com Authorization
    const authClientConfig = token
        ? ({
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "*/*",
              },
          } as const)
        : undefined;

    // Dialogs
    const [openPub, setOpenPub] = useState(false);
    const [openArq, setOpenArq] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [openStudent, setOpenStudent] = useState(false);

    // Upload publicações / arquivos
    const [pubFile, setPubFile] = useState<File | null>(null);
    const [arqFiles, setArqFiles] = useState<File[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    // Estado das publicações
    const [pubTitulo, setPubTitulo] = useState("");
    const [pubConteudo, setPubConteudo] = useState("");
    const [pubError, setPubError] = useState<string | null>(null);

    // Comments state
    const [commentText, setCommentText] = useState<Record<number, string>>({});
    const [replyText, setReplyText] = useState<Record<number, string>>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    // Estado das atividades (tarefas) – NOVO layout baseado em NovaTarefaPage
    const [taskTitulo, setTaskTitulo] = useState("");
    const [taskDescricao, setTaskDescricao] = useState("");
    const [taskPrazoData, setTaskPrazoData] = useState(""); // yyyy-MM-dd
    const [taskPrazoHora, setTaskPrazoHora] = useState(""); // HH:mm
    const [taskValorTotal, setTaskValorTotal] = useState("10"); // default 10 pts
    const [taskPermitirArquivoResposta, setTaskPermitirArquivoResposta] =
        useState<boolean>(true);
    const [taskError, setTaskError] = useState<string | null>(null);

    const canSubmitTask =
        taskTitulo.trim() &&
        taskDescricao.trim() &&
        taskPrazoData.trim() &&
        taskPrazoHora.trim() &&
        taskValorTotal.trim();

    const acceptTypes =
        "image/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt";

    const handlePubFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setPubFile(f);
    };

    const closePub = () => {
        setPubFile(null);
        setPubTitulo("");
        setPubConteudo("");
        setPubError(null);
        setOpenPub(false);
    };

    const handleArqFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files ? Array.from(e.target.files) : [];
        setArqFiles(list);
    };

    const removeArqFile = (idx: number) => {
        setArqFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const closeArq = () => {
        setArqFiles([]);
        setOpenArq(false);
        setUploadError(null);
    };

    const closeTaskDialog = () => {
        setTaskTitulo("");
        setTaskDescricao("");
        setTaskPrazoData("");
        setTaskPrazoHora("");
        setTaskValorTotal("10");
        setTaskPermitirArquivoResposta(true);
        setTaskError(null);
        setOpenTask(false);
    };

    // ---------------------------------------------
    // ARQUIVOS – Kubb (listar, upload, deletar)
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

    const arquivos = (arquivosQuery.data ?? []) as Arquivo[];

    const uploadArquivoMutation = useUploadArquivo({
        mutation: {
            mutationFn: async ({ disciplinaId, data, params }) => {
                if (!token) {
                    throw new Error("Sessão expirada. Faça login novamente.");
                }

                const formData = new FormData();

                const file = (data as any)?.arquivo as
                    | File
                    | Blob
                    | null
                    | undefined;
                if (!file) {
                    throw new Error("Nenhum arquivo informado para upload.");
                }

                formData.append("arquivo", file as Blob);

                const searchParams = new URLSearchParams();
                if (params?.descricao) {
                    searchParams.set("descricao", params.descricao);
                }
                if (params?.usuarioId != null) {
                    searchParams.set("usuarioId", String(params.usuarioId));
                }

                const base = API_BASE_URL.replace(/\/+$/, "");
                const url = `${base}/arquivos/upload/${disciplinaId}?${searchParams.toString()}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const text = await response.text().catch(() => "");
                    throw new Error(
                        text ||
                            `Erro ao enviar arquivo (status ${response.status})`,
                    );
                }

                const contentType = response.headers.get("content-type") ?? "";
                if (contentType.includes("application/json")) {
                    return (await response.json()) as any;
                }
                return (await response.text()) as any;
            },
        },
    });

    const deletarArquivoMutation = useDeletarArquivo({
        client: authClientConfig,
    });

    const isUploading = uploadArquivoMutation.isPending;

    const handleUploadFiles = async () => {
        try {
            setUploadError(null);

            if (!token) {
                setUploadError("Sessão expirada. Faça login novamente.");
                return;
            }

            if (!hasDisciplinaId) {
                setUploadError(
                    "Disciplina inválida (ID na URL está incorreto ou ausente).",
                );
                return;
            }

            if (arqFiles.length === 0) {
                setUploadError("Selecione pelo menos um arquivo.");
                return;
            }

            const usuarioId = getUsuarioIdFromUser(user as any);

            if (!usuarioId) {
                setUploadError(
                    "Não foi possível identificar o usuário logado.",
                );
                return;
            }

            for (const file of arqFiles) {
                await uploadArquivoMutation.mutateAsync({
                    disciplinaId: disciplinaIdNumber,
                    data: {
                        arquivo: file as any,
                    },
                    params: {
                        usuarioId: Number(usuarioId),
                        descricao: file.name,
                    },
                });
            }

            await arquivosQuery.refetch();

            setArqFiles([]);
            setOpenArq(false);
            setUploadError(null);
        } catch (error: any) {
            console.error("Erro ao enviar arquivo(s):", error);
            setUploadError(
                error?.message ?? "Erro ao enviar arquivo(s). Tente novamente.",
            );
        }
    };

    const handleDeleteArquivo = async (arquivoId: number) => {
        try {
            setDeleteError(null);

            if (!token) {
                setDeleteError("Sessão expirada. Faça login novamente.");
                return;
            }

            const usuarioId = getUsuarioIdFromUser(user as any);

            if (!usuarioId) {
                setDeleteError(
                    "Não foi possível identificar o usuário logado.",
                );
                return;
            }

            await deletarArquivoMutation.mutateAsync({
                arquivoId,
                params: {
                    usuarioId: Number(usuarioId),
                    isEducador: true,
                },
            });

            await arquivosQuery.refetch();
        } catch (error: any) {
            console.error("Erro ao excluir arquivo:", error);
            setDeleteError(
                error?.message ?? "Erro ao excluir arquivo. Tente novamente.",
            );
        }
    };

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

    const publicacoes = (publicacoesQuery.data ?? []) as Publicacao[];

    const createPublicacaoMutation = useCreatePublicacao({
        client: authClientConfig,
    });

    const deletePublicacaoMutation = useDeletePublicacao({
        client: authClientConfig,
    });

    const handleCreatePublicacao = async () => {
        try {
            setPubError(null);

            if (!token) {
                setPubError("Sessão expirada. Faça login novamente.");
                return;
            }

            if (!hasDisciplinaId) {
                setPubError(
                    "Disciplina inválida (ID na URL está incorreto ou ausente).",
                );
                return;
            }

            const educadorId = getUsuarioIdFromUser(user as any);
            if (!educadorId) {
                setPubError("Não foi possível identificar o educador logado.");
                return;
            }

            const tituloFinal = pubTitulo.trim() || "Publicação sem título";
            const conteudoFinal = pubConteudo.trim() || "";

            let caminhoAnexo: string | undefined;

            if (pubFile) {
                const formData = new FormData();
                formData.append("arquivo", pubFile);

                const searchParams = new URLSearchParams();
                searchParams.set("descricao", pubFile.name);
                searchParams.set("usuarioId", String(educadorId));

                const base = API_BASE_URL.replace(/\/+$/, "");
                const url = `${base}/arquivos/upload/${disciplinaIdNumber}?${searchParams.toString()}`;

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const text = await response.text().catch(() => "");
                    throw new Error(
                        text ||
                            `Erro ao enviar anexo da publicação (status ${response.status})`,
                    );
                }

                const contentType = response.headers.get("content-type") ?? "";
                let uploadJson: any = null;

                if (contentType.includes("application/json")) {
                    uploadJson = await response.json();
                }

                const arquivoId = uploadJson?.id;
                if (!arquivoId) {
                    throw new Error(
                        "Upload de anexo não retornou o ID do arquivo.",
                    );
                }

                caminhoAnexo = `/arquivos/download/${arquivoId}`;
            }

            await createPublicacaoMutation.mutateAsync({
                data: {
                    titulo: tituloFinal,
                    conteudo: conteudoFinal,
                    caminhoAnexo: caminhoAnexo ?? "",
                    disciplinaId: disciplinaIdNumber,
                    educadorId,
                },
            });

            await publicacoesQuery.refetch();
            closePub();
        } catch (error: any) {
            console.error("Erro ao criar publicação:", error);
            setPubError(
                error?.message ??
                    "Erro ao criar publicação. Verifique os dados e tente novamente.",
            );
        }
    };

    const handleDeletePublicacao = async (publicacaoId: number) => {
        try {
            setPubError(null);

            if (!token) {
                setPubError("Sessão expirada. Faça login novamente.");
                return;
            }

            await deletePublicacaoMutation.mutateAsync({ publicacaoId });
            await publicacoesQuery.refetch();
        } catch (error: any) {
            console.error("Erro ao excluir publicação:", error);
            setPubError(
                error?.message ??
                    "Erro ao excluir publicação. Tente novamente.",
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

            // Try to get filename from arquivos list if caminhoAnexo contains an arquivo ID
            let filename = "anexo";
            const arquivoIdMatch = trimmed.match(/\/arquivos\/download\/(\d+)/);
            if (arquivoIdMatch && arquivoIdMatch[1]) {
                const arquivoId = Number.parseInt(arquivoIdMatch[1], 10);
                const arquivo = arquivos.find((arq) => arq.id === arquivoId);
                if (arquivo?.nomeOriginal) {
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

    const estudantes = (estudantesQuery.data ?? []) as Estudante[];

    // ---------------------------------------------
    // LISTA DE USUÁRIOS DA INSTITUIÇÃO
    // ---------------------------------------------

    const instituicaoId = guessInstituicaoIdFromUser(user as any);

    const usuariosQuery = useGetUsuariosFromInstituicao(instituicaoId ?? 0, {
        query: {
            enabled: !!token && !!instituicaoId,
        },
        client: authClientConfig,
    });

    // ---------------------------------------------
    // VINCULAR ESTUDANTE POR E-MAIL
    // ---------------------------------------------

    const [emailEstudante, setEmailEstudante] = useState("");
    const [addStudentError, setAddStudentError] = useState<string | null>(null);

    const addEstudanteMutation = useAddEstudanteToDisciplina({
        client: authClientConfig,
    });

    const limparFormEstudante = () => {
        setEmailEstudante("");
        setAddStudentError(null);
    };

    const handleAddStudent = async () => {
        try {
            setAddStudentError(null);

            if (!token) {
                setAddStudentError("Sessão expirada. Faça login novamente.");
                return;
            }

            if (!hasDisciplinaId) {
                setAddStudentError(
                    "Disciplina inválida (ID na URL está incorreto ou ausente).",
                );
                return;
            }

            const email = emailEstudante.trim().toLowerCase();
            if (!email) {
                setAddStudentError("Informe o e-mail do estudante.");
                return;
            }

            if (!instituicaoId) {
                setAddStudentError(
                    "Não foi possível resolver a instituição do educador logado.",
                );
                return;
            }

            let lista: UsuarioInstituicao[] = [];

            if (!usuariosQuery.data) {
                const result = await usuariosQuery.refetch();
                if (result.error) {
                    throw result.error;
                }
                lista = (result.data ?? []) as UsuarioInstituicao[];
            } else {
                lista = usuariosQuery.data as unknown as UsuarioInstituicao[];
            }

            if (!Array.isArray(lista) || lista.length === 0) {
                setAddStudentError(
                    "Nenhum usuário encontrado na instituição para vincular.",
                );
                return;
            }

            const encontrado = lista.find(
                (u) => u.email && u.email.toLowerCase() === email,
            );

            if (!encontrado) {
                setAddStudentError(
                    "Nenhum usuário com esse e-mail na instituição.",
                );
                return;
            }

            if (!isEstudanteRole(encontrado.funcao)) {
                setAddStudentError(
                    "O usuário encontrado não é um Estudante. Só é possível vincular estudantes à disciplina.",
                );
                return;
            }

            await addEstudanteMutation.mutateAsync({
                id: disciplinaIdNumber,
                params: {
                    estudanteId: Number(encontrado.id),
                },
            });

            await estudantesQuery.refetch();
            limparFormEstudante();
            setOpenStudent(false);
        } catch (error: any) {
            console.error("Erro ao vincular estudante:", error);
            setAddStudentError(
                error?.message ??
                    "Erro ao vincular estudante. Verifique o e-mail e tente novamente.",
            );
        }
    };

    const isSavingStudent = addEstudanteMutation.isPending;

    // ---------------------------------------------
    // TAREFAS / ATIVIDADES – fetch manual
    // ---------------------------------------------

    const tarefasQuery = useQuery<Tarefa[]>({
        queryKey: ["tarefas", disciplinaIdNumber],
        enabled: hasDisciplinaId && !!token,
        queryFn: async () => {
            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }
            if (!hasDisciplinaId) {
                throw new Error("Disciplina inválida.");
            }

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/tarefas/disciplina/${disciplinaIdNumber}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(
                    text ||
                        `Erro ao carregar atividades (status ${res.status}).`,
                );
            }

            return (await res.json()) as Tarefa[];
        },
    });

    const tarefas = tarefasQuery.data ?? [];

    const createTarefaMutation = useMutation({
        mutationFn: async (payload: {
            titulo: string;
            conteudo: string;
            disciplinaId: number;
            autorId: number;
            dataExpiracao?: string;
            valorTotal?: number;
            permitirArquivoResposta?: boolean;
        }) => {
            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/tarefas`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(
                    text || `Erro ao criar atividade (status ${res.status}).`,
                );
            }

            return res.json();
        },
        onSuccess: () => {
            tarefasQuery.refetch();
        },
    });

    const removeTarefaMutation = useMutation({
        mutationFn: async (tarefaId: number) => {
            if (!token) {
                throw new Error("Sessão expirada. Faça login novamente.");
            }

            const base = API_BASE_URL.replace(/\/+$/, "");
            const url = `${base}/tarefas/${tarefaId}`;

            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(
                    text || `Erro ao excluir atividade (status ${res.status}).`,
                );
            }
        },
        onSuccess: () => {
            tarefasQuery.refetch();
        },
    });

    // CREATE TAREFA – USANDO MESMA LÓGICA DA TELA NOVA
    const handleCreateTarefa = async () => {
        try {
            setTaskError(null);

            if (!token) {
                setTaskError("Sessão expirada. Faça login novamente.");
                return;
            }

            if (!hasDisciplinaId) {
                setTaskError(
                    "Disciplina inválida (ID na URL está incorreto ou ausente).",
                );
                return;
            }

            const autorId = getUsuarioIdFromUser(user as any);
            if (!autorId) {
                setTaskError("Não foi possível identificar o educador logado.");
                return;
            }

            const titulo = taskTitulo.trim();
            const conteudo = taskDescricao.trim();

            if (!titulo) {
                setTaskError("Informe o título da atividade.");
                return;
            }
            if (!conteudo) {
                setTaskError("Informe o conteúdo / enunciado da atividade.");
                return;
            }
            if (!taskPrazoData || !taskPrazoHora) {
                setTaskError("Informe a data e o horário de expiração.");
                return;
            }
            if (!taskValorTotal.trim()) {
                setTaskError("Informe o valor total da atividade (pontos).");
                return;
            }

            const valorNumerico = Number(taskValorTotal.replace(",", "."));
            if (Number.isNaN(valorNumerico)) {
                setTaskError("Valor total inválido. Use apenas números.");
                return;
            }

            const combined = `${taskPrazoData}T${taskPrazoHora}`;
            const dataExpiracaoIso = new Date(combined).toISOString();

            await createTarefaMutation.mutateAsync({
                titulo,
                conteudo,
                disciplinaId: disciplinaIdNumber,
                autorId,
                dataExpiracao: dataExpiracaoIso,
                valorTotal: valorNumerico,
                permitirArquivoResposta: taskPermitirArquivoResposta,
            });

            closeTaskDialog();
        } catch (error: any) {
            console.error("Erro ao criar atividade:", error);
            setTaskError(
                error?.message ?? "Erro ao criar atividade. Tente novamente.",
            );
        }
    };

    const handleDeleteTarefa = async (tarefaId: number) => {
        try {
            setTaskError(null);

            if (!token) {
                setTaskError("Sessão expirada. Faça login novamente.");
                return;
            }

            await removeTarefaMutation.mutateAsync(tarefaId);
        } catch (error: any) {
            console.error("Erro ao excluir atividade:", error);
            setTaskError(
                error?.message ?? "Erro ao excluir atividade. Tente novamente.",
            );
        }
    };

    // ---------------------------------------------
    // COMMENTS
    // ---------------------------------------------

    const responderPublicacaoMutation = useResponderPublicacao({
        client: authClientConfig,
    });

    const responderComentarioMutation = useResponderComentario({
        client: authClientConfig,
    });

    const handleSubmitComment = async (publicacaoId: number) => {
        try {
            const text = commentText[publicacaoId]?.trim();
            if (!text) return;

            await responderPublicacaoMutation.mutateAsync({
                data: {
                    conteudo: text,
                },
                params: {
                    publicacaoId,
                },
            });

            setCommentText((prev) => ({ ...prev, [publicacaoId]: "" }));
            await publicacoesQuery.refetch();
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
        }
    };

    const handleSubmitReply = async (
        comentarioId: number,
    ) => {
        try {
            const text = replyText[comentarioId]?.trim();
            if (!text) return;

            await responderComentarioMutation.mutateAsync({
                data: {
                    conteudo: text,
                },
                params: {
                    comentarioId,
                },
            });

            setReplyText((prev) => ({ ...prev, [comentarioId]: "" }));
            setReplyingTo(null);
            await publicacoesQuery.refetch();
        } catch (error) {
            console.error("Erro ao enviar resposta:", error);
        }
    };

    // RENDER -------------------------------------------------

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4">{nomeDisciplina}</Typography>
                {/* <Typography color="text.secondary">
                    {horarioDisciplina}
                </Typography> */}
            </Box>

            {/* AVISO CASO O ID DA DISCIPLINA VENHA ERRADO */}
            {!hasDisciplinaId && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    ID de disciplina inválido na URL. Verifique a navegação a
                    partir da lista de disciplinas.
                </Alert>
            )}

            {/* ABAS */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Publicações" />
                <Tab label="Arquivos" />
                <Tab label="Estudantes" />
                <Tab label="Atividades" />
            </Tabs>

            {/* BOTÕES DE AÇÃO POR ABA */}
            <Box sx={{ mb: 3 }}>
                {tab === 0 && (
                    <Button
                        variant="contained"
                        onClick={() => setOpenPub(true)}
                    >
                        Nova publicação
                    </Button>
                )}

                {tab === 1 && (
                    <Button
                        variant="contained"
                        onClick={() => setOpenArq(true)}
                    >
                        Enviar arquivo
                    </Button>
                )}

                {tab === 2 && (
                    <Button
                        variant="contained"
                        onClick={() => setOpenStudent(true)}
                        disabled={!hasDisciplinaId}
                    >
                        Adicionar estudante
                    </Button>
                )}

                {tab === 3 && (
                    <Button
                        variant="contained"
                        onClick={() => setOpenTask(true)}
                    >
                        Criar atividade
                    </Button>
                )}
            </Box>

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
                                Nenhuma publicação criada para esta disciplina.
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
                                {publicacoes.map((p) => {
                                    const fileName =
                                        p.caminhoAnexo?.split(/[\\/]/).pop() ||
                                        "Abrir anexo";

                                    return (
                                        <Card key={p.id}>
                                            <CardHeader
                                                avatar={
                                                    <Avatar>
                                                        {(p.autor?.nome || "A")
                                                            .trim()
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </Avatar>
                                                }
                                                title={p.titulo}
                                                subheader={`${p.autor?.nome ?? "Autor desconhecido"} • ${new Date(
                                                    p.dataEnvio,
                                                ).toLocaleString()}`}
                                                action={
                                                    <IconButton
                                                        aria-label="Excluir publicação"
                                                        onClick={() =>
                                                            handleDeletePublicacao(
                                                                p.id,
                                                            )
                                                        }
                                                        disabled={
                                                            deletePublicacaoMutation.isPending
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                }}
                                            >
                                                {p.conteudo && (
                                                    <Typography variant="body2">
                                                        {p.conteudo}
                                                    </Typography>
                                                )}

                                                {p.caminhoAnexo && (
                                                    <Box sx={{ mt: 1 }}>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={
                                                                <AttachFileIcon />
                                                            }
                                                            onClick={() =>
                                                                handleOpenAnexo(
                                                                    p.caminhoAnexo,
                                                                )
                                                            }
                                                        >
                                                            {fileName}
                                                        </Button>
                                                    </Box>
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
                                                    publicacaoId={p.id!}
                                                    token={token}
                                                    authClientConfig={
                                                        authClientConfig
                                                    }
                                                    commentText={
                                                        commentText[p.id!] ||
                                                        ""
                                                    }
                                                    setCommentText={(text) =>
                                                        setCommentText(
                                                            (prev) => ({
                                                                ...prev,
                                                                [p.id!]: text,
                                                            }),
                                                        )
                                                    }
                                                    handleSubmitComment={async () => {
                                                        await handleSubmitComment(
                                                            p.id!,
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

                    {deleteError && (
                        <Alert
                            severity="error"
                            onClose={() => setDeleteError(null)}
                            sx={{ mb: 1 }}
                        >
                            {deleteError}
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
                                Nenhum arquivo enviado para esta disciplina.
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
                                            subheader={`Enviado por ${
                                                arq.enviadoPor || "—"
                                            } em ${new Date(arq.dataEnvio).toLocaleString()}`}
                                            action={
                                                <IconButton
                                                    aria-label="Excluir arquivo"
                                                    onClick={() =>
                                                        handleDeleteArquivo(
                                                            arq.id,
                                                        )
                                                    }
                                                    disabled={
                                                        deletarArquivoMutation.isPending
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
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

                    {taskError && (
                        <Alert
                            severity="error"
                            onClose={() => setTaskError(null)}
                            sx={{ mb: 1 }}
                        >
                            {taskError}
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
                                                    <IconButton
                                                        aria-label="Excluir atividade"
                                                        onClick={() =>
                                                            handleDeleteTarefa(
                                                                t.id,
                                                            )
                                                        }
                                                        disabled={
                                                            removeTarefaMutation.isPending
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {t.resumoConteudo ||
                                                        "Sem descrição."}
                                                </Typography>
                                                <Chip
                                                    label={status}
                                                    color={
                                                        status === "Aberta"
                                                            ? "primary"
                                                            : "default"
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

            {/* ------------------ DIALOGS ------------------ */}

            {/* Nova publicação */}
            <Dialog open={openPub} onClose={closePub} fullWidth maxWidth="sm">
                <DialogTitle>Nova publicação</DialogTitle>
                <DialogContent
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Título"
                        value={pubTitulo}
                        onChange={(e) => setPubTitulo(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Conteúdo"
                        placeholder="Escreva sua publicação..."
                        value={pubConteudo}
                        onChange={(e) => setPubConteudo(e.target.value)}
                    />

                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AttachFileIcon />}
                        >
                            Escolher arquivo (opcional)
                            <input
                                hidden
                                type="file"
                                accept={acceptTypes}
                                onChange={handlePubFileChange}
                            />
                        </Button>

                        {pubFile ? (
                            <Chip
                                sx={{ ml: 1, mt: { xs: 1, sm: 0 } }}
                                label={`${pubFile.name} (${Math.round(
                                    pubFile.size / 1024,
                                )} KB)`}
                                onDelete={() => setPubFile(null)}
                            />
                        ) : (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 1 }}
                            >
                                Formatos: imagens, PDF, Office, TXT. (Máx. 1
                                arquivo)
                            </Typography>
                        )}
                    </Box>

                    {pubError && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {pubError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePub}>Cancelar</Button>
                    <Button
                        variant="contained"
                        disabled={
                            createPublicacaoMutation.isPending ||
                            !hasDisciplinaId
                        }
                        onClick={handleCreatePublicacao}
                    >
                        {createPublicacaoMutation.isPending
                            ? "Publicando..."
                            : "Publicar"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Enviar arquivos */}
            <Dialog open={openArq} onClose={closeArq} fullWidth maxWidth="sm">
                <DialogTitle>Enviar arquivo</DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<AttachFileIcon />}
                        sx={{ mr: 1 }}
                    >
                        Selecionar arquivo(s)
                        <input
                            hidden
                            type="file"
                            multiple
                            accept={acceptTypes}
                            onChange={handleArqFilesChange}
                        />
                    </Button>

                    {arqFiles.length > 0 ? (
                        <Box
                            sx={{
                                mt: 1,
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            {arqFiles.map((f, i) => (
                                <Chip
                                    key={`${f.name}-${i}`}
                                    label={`${f.name} (${Math.round(f.size / 1024)} KB)`}
                                    onDelete={() => removeArqFile(i)}
                                    sx={{ maxWidth: 320 }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 1 }}
                        >
                            Você pode selecionar vários arquivos (imagens, PDF,
                            Office, TXT).
                        </Typography>
                    )}

                    {uploadError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {uploadError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeArq}>Cancelar</Button>
                    <Button
                        variant="contained"
                        disabled={
                            arqFiles.length === 0 ||
                            isUploading ||
                            !hasDisciplinaId
                        }
                        onClick={handleUploadFiles}
                    >
                        {isUploading ? "Enviando..." : "Enviar"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Vincular estudante por e-mail */}
            <Dialog
                open={openStudent}
                onClose={() => {
                    setOpenStudent(false);
                    limparFormEstudante();
                }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Vincular estudante à disciplina</DialogTitle>
                <DialogContent
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        type="email"
                        label="E-mail do estudante"
                        placeholder="exemplo@aluno.com"
                        value={emailEstudante}
                        onChange={(e) => setEmailEstudante(e.target.value)}
                    />

                    <Typography variant="body2" color="text.secondary">
                        Digite o e-mail de um usuário já cadastrado como{" "}
                        <strong>Estudante</strong> na instituição. Ele será
                        vinculado a esta disciplina.
                    </Typography>

                    {addStudentError && (
                        <Alert severity="error">{addStudentError}</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenStudent(false);
                            limparFormEstudante();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAddStudent}
                        disabled={isSavingStudent || !hasDisciplinaId}
                    >
                        {isSavingStudent
                            ? "Vinculando..."
                            : "Vincular estudante"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Nova atividade – FORM igual ao modelo da NovaTarefaPage */}
            <Dialog
                open={openTask}
                onClose={closeTaskDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Criar atividade</DialogTitle>
                <DialogContent
                    sx={{
                        mt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Título da atividade"
                        value={taskTitulo}
                        onChange={(e) => setTaskTitulo(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Conteúdo / Enunciado"
                        placeholder="Descreva a atividade que os estudantes deverão realizar..."
                        value={taskDescricao}
                        onChange={(e) => setTaskDescricao(e.target.value)}
                        required
                    />

                    {/* Data + Hora separados, igual ao modelo */}
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Data de expiração"
                            type="date"
                            value={taskPrazoData}
                            onChange={(e) => setTaskPrazoData(e.target.value)}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Horário de expiração"
                            type="time"
                            value={taskPrazoHora}
                            onChange={(e) => setTaskPrazoHora(e.target.value)}
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>

                    <TextField
                        label="Valor total (pontos)"
                        value={taskValorTotal}
                        onChange={(e) => {
                            const v = e.target.value.replace(",", ".");
                            if (/^\d*\.?\d*$/.test(v)) setTaskValorTotal(v);
                        }}
                        slotProps={{
                            htmlInput: { inputMode: "decimal" },
                        }}
                        fullWidth
                        required
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={taskPermitirArquivoResposta}
                                onChange={(e) =>
                                    setTaskPermitirArquivoResposta(
                                        e.target.checked,
                                    )
                                }
                            />
                        }
                        label="Permitir envio de arquivo como resposta"
                    />

                    {taskError && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {taskError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeTaskDialog}>Cancelar</Button>
                    <Button
                        variant="contained"
                        disabled={
                            createTarefaMutation.isPending ||
                            !hasDisciplinaId ||
                            !canSubmitTask
                        }
                        onClick={handleCreateTarefa}
                    >
                        {createTarefaMutation.isPending
                            ? "Criando..."
                            : "Criar tarefa"}
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
                                handleSubmitReply(comentario.id)
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

export default EducadorDisciplinaEspecificaPage;

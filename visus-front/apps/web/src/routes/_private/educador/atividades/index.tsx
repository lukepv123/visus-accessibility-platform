// apps/web/src/routes/_private/educador/atividades/index.tsx

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Alert,
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
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMutation, useQueries } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CorrecaoDialog } from "../-components/correcaoDialog";
// 👇 imports vindos do Kubb (@visus/api)
import {
    getTarefasByDisciplinaQueryOptions,
    useGetDisciplinasByEducador,
    useGetTarefaById,
    useRemoveTarefa,
    useUpdateTarefa,
} from "@visus/api";
import * as React from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { GradingOutlined } from "@mui/icons-material";

export const Route = createFileRoute("/_private/educador/atividades/")({
    component: EducadorAtividades,
});

// TIPOS ----------------------------------------------------

interface DisciplinaEducador {
    id: number;
    nome: string;
    descricao?: string;
    educadorResponsavel?: string;
    instituicao?: string;
}

interface Tarefa {
    id: number;
    titulo: string;
    resumoConteudo?: string;
    conteudo?: string; // pode vir em outro endpoint
    dataCriacao?: string;
    dataExpiracao?: string;
    valorTotal?: number;
    educadorResponsavel?: string;
    disciplinaId: number;
    disciplinaNome?: string;
    permitirArquivoResposta?: boolean;
}

function getUsuarioIdFromUser(user?: any): number | null {
    if (!user) return null;
    const candidates = [user.id, user.usuarioId, user.userId];
    const found = candidates.find(
        (v) => typeof v === "number" || typeof v === "string",
    );
    return found != null ? Number(found) : null;
}

// COMPONENTE ----------------------------------------------

export default function EducadorAtividades() {
    const { user, token } = useAuth();
    const educadorId = getUsuarioIdFromUser(user as any);

    // config padrão pro Kubb (headers com token)
    const authClientConfig = token
        ? ({
              headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "*/*",
              },
          } as const)
        : undefined;

    // Filtros
    const [searchTerm, setSearchTerm] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<
        "todas" | "abertas" | "encerradas"
    >("todas");
    const [disciplinaFilter, setDisciplinaFilter] =
        React.useState<string>("todas");

    // Estados para edição
    const [editingTask, setEditingTask] = React.useState<Tarefa | null>(null);
    const [editTitulo, setEditTitulo] = React.useState("");
    const [editConteudo, setEditConteudo] = React.useState("");
    const [editDataExpiracaoData, setEditDataExpiracaoData] =
        React.useState("");
    const [editDataExpiracaoHora, setEditDataExpiracaoHora] =
        React.useState("");
    const [editValorTotal, setEditValorTotal] = React.useState("0");
    const [editPermitirArquivoResposta, setEditPermitirArquivoResposta] =
        React.useState<boolean>(true);
    const [editError, setEditError] = React.useState<string | null>(null);

    const [globalError, setGlobalError] = React.useState<string | null>(null);

    
    // ---------------------- 1) DISCIPLINAS DO EDUCADOR (Kubb) ----------------------

    const disciplinasQuery = useGetDisciplinasByEducador(
        { educadorId: educadorId ?? 0 },
        {
            query: {
                enabled: !!token && !!educadorId,
            },
            client: authClientConfig,
        },
    );

    const disciplinas = React.useMemo(() => {
        const rawData = disciplinasQuery.data;
        // Ensure data is an array before using it
        if (!rawData || !Array.isArray(rawData)) {
            return [];
        }
        return rawData as DisciplinaEducador[];
    }, [disciplinasQuery.data]);

    // ---------------------- 2) TAREFAS POR DISCIPLINA (Kubb + useQueries) ---------

    const tarefasQueries = useQueries({
        queries:
            disciplinas.length > 0 && token && educadorId
                ? disciplinas.map((disc) =>
                      getTarefasByDisciplinaQueryOptions(
                          disc.id,
                          authClientConfig ?? {},
                      ),
                  )
                : [],
    });

    // Junta todas as tarefas em uma única lista, com nome da disciplina
    const tarefas: Tarefa[] = React.useMemo(() => {
        const list: Tarefa[] = [];

        disciplinas.forEach((disc, index) => {
            const q = tarefasQueries[index];
            const data = (q?.data ?? []) as any[];

            data.forEach((t) => {
                list.push({
                    ...t,
                    disciplinaId: t.disciplinaId ?? disc.id,
                    disciplinaNome: disc.nome,
                } as Tarefa);
            });
        });

        return list;
    }, [disciplinas, tarefasQueries]);

    // Lista de disciplinas para o filtro (todas as disciplinas, mesmo sem tarefas)
    const disciplinasOptions = React.useMemo(
        () =>
            disciplinas.map((d) => ({
                id: d.id,
                label: d.nome ?? `Disciplina #${d.id}`,
            })),
        [disciplinas],
    );

    // ---------------------- 3) TAREFA ESPECÍFICA (Kubb) ----------------------

    const [searchTarefaId, setSearchTarefaId] = React.useState<number | null>(null);

    const tarefaEspecificaQuery = useGetTarefaById(
        searchTarefaId as number, 
        {
            client: authClientConfig ?? {},
            query: {
                enabled: !!searchTarefaId && !!token,
                retry: false,
            }
        }
    );

    const [openCorrecao, setOpenCorrecao] = React.useState(false);
    const [correcaoTarefaId, setCorrecaoTarefaId] = React.useState<number | undefined>(undefined);

    const handleOpenCorrecao = (tarefaId: number) => {
        setCorrecaoTarefaId(tarefaId);
        setOpenCorrecao(true);
    };

    // ---------------------- ESTADO DE CARREGAMENTO / ERROS ------------------------

    const tarefasLoading =
        disciplinasQuery.isLoading ||
        (disciplinas.length > 0 && tarefasQueries.some((q) => q.isLoading));

    let queryErrorMessage: string | null = null;
    if (disciplinasQuery.isError) {
        queryErrorMessage =
            disciplinasQuery.error instanceof Error
                ? disciplinasQuery.error.message
                : "Erro ao carregar disciplinas do educador.";
    } else {
        const firstErrorQuery = tarefasQueries.find((q) => q.isError);
        if (firstErrorQuery) {
            const err: any = firstErrorQuery.error;
            queryErrorMessage =
                err?.message ??
                "Erro ao carregar atividades de uma ou mais disciplinas.";
        }
    }

    // ---------------------- FILTRO LOCAL DAS TAREFAS ------------------------------

    const filteredTarefas = React.useMemo(() => {
        const now = new Date();
        let list = [...tarefas];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter((t) => {
                const titulo = t.titulo?.toLowerCase() ?? "";
                const conteudo = (
                    t.conteudo ??
                    t.resumoConteudo ??
                    ""
                ).toLowerCase();
                return titulo.includes(term) || conteudo.includes(term);
            });
        }

        if (statusFilter !== "todas") {
            list = list.filter((t) => {
                if (!t.dataExpiracao) return statusFilter === "abertas";
                const exp = new Date(t.dataExpiracao);
                const isEncerrada = exp < now;
                return statusFilter === "encerradas"
                    ? isEncerrada
                    : !isEncerrada;
            });
        }

        if (disciplinaFilter !== "todas") {
            const idNum = Number(disciplinaFilter);
            list = list.filter((t) => t.disciplinaId === idNum);
        }

        // Ordena por data de expiração (mais próxima primeiro)
        list.sort((a, b) => {
            const da = a.dataExpiracao
                ? new Date(a.dataExpiracao).getTime()
                : 0;
            const db = b.dataExpiracao
                ? new Date(b.dataExpiracao).getTime()
                : 0;
            return da - db;
        });

        return list;
    }, [tarefas, searchTerm, statusFilter, disciplinaFilter]);

    // ---------------------- MUTATIONS: DELETE & UPDATE (Kubb) ---------------------

    const removeTarefaMutation = useRemoveTarefa({
        client: authClientConfig,
        mutation: {
            onSuccess: () => {
                // Depois de deletar, refaz todas as queries de tarefas
                tarefasQueries.forEach((q) => q.refetch());
            },
        },
    });

    const updateTarefaMutation = useUpdateTarefa({
        client: authClientConfig,
        mutation: {
            onSuccess: () => {
                tarefasQueries.forEach((q) => q.refetch());
            },
        },
    });

    // ---------------------- HANDLERS: DELETE --------------------------------------

    const handleDeleteTarefa = async (tarefaId: number) => {
        try {
            setGlobalError(null);

            if (!token) {
                setGlobalError("Sessão expirada. Faça login novamente.");
                return;
            }

            await removeTarefaMutation.mutateAsync({ id: tarefaId });
        } catch (error: any) {
            console.error("Erro ao excluir atividade:", error);
            setGlobalError(
                error?.message ?? "Erro ao excluir atividade. Tente novamente.",
            );
        }
    };

    // ---------------------- HANDLERS: EDIT ----------------------------------------

    const openEditDialog = (t: Tarefa) => {
        setEditingTask(t);
        setEditError(null);
        setEditTitulo(t.titulo ?? "");
        setEditConteudo(t.conteudo ?? t.resumoConteudo ?? "");

        if (t.dataExpiracao) {
            const d = new Date(t.dataExpiracao);
            const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16); // yyyy-MM-ddTHH:mm
            setEditDataExpiracaoData(local.slice(0, 10));
            setEditDataExpiracaoHora(local.slice(11, 16));
        } else {
            setEditDataExpiracaoData("");
            setEditDataExpiracaoHora("");
        }

        const valor = t.valorTotal ?? 0;
        setEditValorTotal(String(valor).replace(".", ","));
        setEditPermitirArquivoResposta(
            t.permitirArquivoResposta != null
                ? t.permitirArquivoResposta
                : true,
        );
    };

    const closeEditDialog = () => {
        setEditingTask(null);
        setEditError(null);
        setEditTitulo("");
        setEditConteudo("");
        setEditDataExpiracaoData("");
        setEditDataExpiracaoHora("");
        setEditValorTotal("0");
        setEditPermitirArquivoResposta(true);
    };

    const handleSaveEdit = async () => {
        try {
            setEditError(null);
            setGlobalError(null);

            if (!editingTask) return;
            if (!educadorId) {
                setEditError("Não foi possível identificar o educador logado.");
                return;
            }

            const titulo = editTitulo.trim();
            const conteudo = editConteudo.trim();

            if (!titulo) {
                setEditError("Informe o título da atividade.");
                return;
            }
            if (!conteudo) {
                setEditError("Informe o conteúdo / enunciado da atividade.");
                return;
            }

            let dataExpiracaoIso: string | undefined;
            if (editDataExpiracaoData && editDataExpiracaoHora) {
                const combined = `${editDataExpiracaoData}T${editDataExpiracaoHora}`;
                dataExpiracaoIso = new Date(combined).toISOString();
            }

            const valorNumerico = Number(editValorTotal.replace(",", "."));
            if (Number.isNaN(valorNumerico)) {
                setEditError("Valor total inválido. Use apenas números.");
                return;
            }

            await updateTarefaMutation.mutateAsync({
                id: editingTask.id,
                data: {
                    // ⚠️ Ajuste aqui se o DTO do UpdateTarefa for diferente
                    titulo,
                    conteudo,
                    disciplinaId: editingTask.disciplinaId,
                    dataExpiracao: dataExpiracaoIso,
                    valorTotal: valorNumerico,
                    permitirArquivoResposta: editPermitirArquivoResposta,
                    // se o backend exigir autorId, mantenha
                    autorId: educadorId,
                } as any,
            });

            closeEditDialog();
        } catch (error: any) {
            console.error("Erro ao atualizar atividade:", error);
            setEditError(
                error?.message ??
                    "Erro ao atualizar atividade. Tente novamente.",
            );
        }
    };

    // ---------------------- RENDER -----------------------------------------------

    const isLoading = tarefasLoading;
    const hasNoTarefas =
        !isLoading && filteredTarefas.length === 0 && !queryErrorMessage;

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                        Atividades
                    </Typography>
                    <Typography color="text.secondary">
                        Gerencie todas as atividades das suas disciplinas em um
                        só lugar.
                    </Typography>
                </Box>

                {/* Se quiser permitir criar a partir daqui, é só apontar para a rota correta */}
                {/* <Button
          variant="contained"
          component={Link}
          to="/educador/atividades/criar"
        >
          Nova atividade
        </Button> */}
            </Box>

            {/* ALERTAS GERAIS */}
            {globalError && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setGlobalError(null)}
                >
                    {globalError}
                </Alert>
            )}
            {queryErrorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {queryErrorMessage}
                </Alert>
            )}

            {/* FILTROS */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Filtros
                    </Typography>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        sx={{ alignItems: { md: "center" } }}
                    >
                        <TextField
                            fullWidth
                            label="Buscar por título / enunciado"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <TextField
                            select
                            label="Status"
                            size="small"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as
                                        | "todas"
                                        | "abertas"
                                        | "encerradas",
                                )
                            }
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="todas">Todas</MenuItem>
                            <MenuItem value="abertas">Abertas</MenuItem>
                            <MenuItem value="encerradas">Encerradas</MenuItem>
                        </TextField>

                        {disciplinasOptions.length > 0 && (
                            <TextField
                                select
                                label="Disciplina"
                                size="small"
                                value={disciplinaFilter}
                                onChange={(e) =>
                                    setDisciplinaFilter(e.target.value)
                                }
                                sx={{ minWidth: 200 }}
                            >
                                <MenuItem value="todas">Todas</MenuItem>
                                {disciplinasOptions.map((d) => (
                                    <MenuItem key={d.id} value={String(d.id)}>
                                        {d.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            {/* LISTA / CARREGAMENTO */}
            {isLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {hasNoTarefas && (
                <Typography color="text.secondary">
                    Nenhuma atividade encontrada para os filtros selecionados.
                </Typography>
            )}

            {!isLoading && filteredTarefas.length > 0 && (
                <Stack spacing={2}>
                    {filteredTarefas.map((t) => {
                        const expiracao = t.dataExpiracao
                            ? new Date(t.dataExpiracao)
                            : null;
                        const agora = new Date();
                        const status =
                            expiracao && expiracao < agora
                                ? "Encerrada"
                                : "Aberta";

                        const statusColor =
                            status === "Aberta" ? "primary" : "default";

                        const expiracaoText = expiracao
                            ? expiracao.toLocaleString()
                            : "Sem prazo";

                        const criadaEm = t.dataCriacao
                            ? new Date(t.dataCriacao).toLocaleString()
                            : null;

                        const disciplinaLabel =
                            t.disciplinaNome ?? `Disciplina #${t.disciplinaId}`;

                        const valorText =
                            t.valorTotal != null
                                ? `${t.valorTotal.toLocaleString("pt-BR", {
                                      maximumFractionDigits: 2,
                                  })} pts`
                                : "-";

                        return (
                            <Card key={t.id}>
                                <CardHeader
                                    title={t.titulo}
                                    subheader={
                                        <>
                                            {disciplinaLabel} • Prazo:{" "}
                                            {expiracaoText}
                                            {criadaEm
                                                ? ` • Criada em: ${criadaEm}`
                                                : ""}
                                        </>
                                    }
                                    action={
                                        <Stack direction="row" spacing={1}>
                                            <IconButton
                                                aria-label="Avaliar respostas"
                                                onClick={() => handleOpenCorrecao(t.id)}
                                            >
                                                <GradingOutlined />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Editar atividade"
                                                onClick={() =>
                                                    openEditDialog(t)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Excluir atividade"
                                                onClick={() =>
                                                    handleDeleteTarefa(t.id)
                                                }
                                                disabled={
                                                    removeTarefaMutation.isPending
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    }
                                />
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        justifyContent: "space-between",
                                        gap: 2,
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {t.resumoConteudo ||
                                                t.conteudo ||
                                                "Sem descrição."}
                                        </Typography>
                                    </Box>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{
                                            minWidth: 160,
                                            justifyContent: {
                                                xs: "flex-start",
                                                sm: "flex-end",
                                            },
                                        }}
                                    >
                                        <Chip
                                            label={status}
                                            color={statusColor}
                                        />
                                        <Chip
                                            label={valorText}
                                            variant="outlined"
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            )}

            {/* DIALOG DE EDIÇÃO */}
            <Dialog
                open={!!editingTask}
                onClose={closeEditDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Editar atividade</DialogTitle>
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
                        value={editTitulo}
                        onChange={(e) => setEditTitulo(e.target.value)}
                        required
                    />

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Conteúdo / Enunciado"
                        value={editConteudo}
                        onChange={(e) => setEditConteudo(e.target.value)}
                        required
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            label="Data de expiração"
                            type="date"
                            value={editDataExpiracaoData}
                            onChange={(e) =>
                                setEditDataExpiracaoData(e.target.value)
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Horário de expiração"
                            type="time"
                            value={editDataExpiracaoHora}
                            onChange={(e) =>
                                setEditDataExpiracaoHora(e.target.value)
                            }
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>

                    <TextField
                        label="Valor total (pontos)"
                        value={editValorTotal}
                        onChange={(e) => {
                            const v = e.target.value.replace(",", ".");
                            if (/^\d*\.?\d*$/.test(v)) setEditValorTotal(v);
                        }}
                        slotProps={{
                            htmlInput: { inputMode: "decimal" },
                        }}
                        fullWidth
                    />

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>
                            Permitir envio de arquivo como resposta
                        </Typography>
                        <Chip
                            label={editPermitirArquivoResposta ? "Sim" : "Não"}
                            color={
                                editPermitirArquivoResposta
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() =>
                                setEditPermitirArquivoResposta((prev) => !prev)
                            }
                        />
                    </Stack>

                    {editError && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {editError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditDialog}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        disabled={updateTarefaMutation.isPending}
                    >
                        {updateTarefaMutation.isPending
                            ? "Salvando..."
                            : "Salvar alterações"}
                    </Button>
                </DialogActions>
            </Dialog>

            <CorrecaoDialog 
                open={openCorrecao} 
                onClose={() => setOpenCorrecao(false)} 
                tarefaId={correcaoTarefaId}
            />
        </Box>
    );
}

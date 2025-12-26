// visus/apps/web/src/routes/_private/gestor/disciplinas.tsx
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Group as GroupIcon,
    Refresh as RefreshIcon,
    WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
// Kubb hooks
import {
    useCreateDisciplina,
    useGetDisciplinasByInstituicao,
    useGetEstudantesFromDisciplina,
    useRemoveEstudanteToDisciplina,
    useUpdateDisciplina,
} from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/gestor/disciplinas")({
    component: GestorDisciplinas,
});

// Tipos locais
type TipoUsuario = "ALUNO" | "EDUCADOR" | "GESTOR";

interface UsuarioInstituicao {
    id: number | string;
    nome: string;
    email?: string;
    tipoUsuario?: TipoUsuario;
}

interface DisciplinaLocal {
    id: number | string;
    nome: string;
    descricao?: string;
    idEducadorResponsavel?: number | string;
    /** 🔥 nome vindo direto da API: "educadorResponsavel": "Doja Educador" */
    educadorResponsavelNome?: string;
    idInstituicao?: number | string;
    totalAlunos?: number;
}

const API_BASE_URL = "http://localhost:8080"; // mesmo do usuários.tsx

export default function GestorDisciplinas() {
    const { user, token } = useAuth();
    const instituicaoId = user?.instituicao?.id
        ? Number(user.instituicao.id)
        : undefined;

    // -----------------------------
    // Estado de usuários (GET /usuarios)
    // -----------------------------
    const [usuariosSistema, setUsuariosSistema] = useState<any[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);

    // UI state
    const [searchNome, setSearchNome] = useState("");
    const [educadorFiltro, setEducadorFiltro] =
        useState<UsuarioInstituicao | null>(null);

    // Dialogs / forms
    const [disciplinaDialogOpen, setDisciplinaDialogOpen] = useState(false);
    const [editingDisciplina, setEditingDisciplina] =
        useState<DisciplinaLocal | null>(null);
    const [disciplinaFormNome, setDisciplinaFormNome] = useState("");
    const [disciplinaFormDescricao, setDisciplinaFormDescricao] = useState("");
    const [disciplinaFormEducador, setDisciplinaFormEducador] =
        useState<UsuarioInstituicao | null>(null);

    const [alunosDialogOpen, setAlunosDialogOpen] = useState(false);
    const [disciplinaAlunosTarget, setDisciplinaAlunosTarget] =
        useState<DisciplinaLocal | null>(null);
    const [alunosSelecionados, setAlunosSelecionados] = useState<
        UsuarioInstituicao[]
    >([]);
    const [alunosAtuaisIds, setAlunosAtuaisIds] = useState<(string | number)[]>(
        [],
    );

    // Deletion UI (note: backend doesn't have delete disciplina)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [disciplinaParaExcluir, setDisciplinaParaExcluir] =
        useState<DisciplinaLocal | null>(null);
    const [deleteAcknowledge, setDeleteAcknowledge] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    // -----------------------------
    // Hooks Kubb (API) com TOKEN
    // -----------------------------

    // 🔐 GET /disciplinas/instituicao com Authorization
    const disciplinasQuery = useGetDisciplinasByInstituicao?.(
        { instituicaoId: Number(instituicaoId) },
        {
            query: { enabled: !!instituicaoId && !!token },
            client: token
                ? {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
                : undefined,
        },
    );

    // 🔐 POST /disciplinas com Authorization
    const createDisciplinaMutation = useCreateDisciplina?.({
        client: token
            ? {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
            : undefined,
    });

    // 🔐 PUT /disciplinas/{id} com Authorization
    const updateDisciplinaMutation = useUpdateDisciplina?.({
        client: token
            ? {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
            : undefined,
    });

    // hook “factory” para GET /disciplinas/{id}/estudantes
    const getEstudantesFromDisciplina = useGetEstudantesFromDisciplina;

    // 🔐 DELETE /disciplinas/{id}/estudantes com Authorization
    const removeEstudanteMutation = useRemoveEstudanteToDisciplina?.({
        client: token
            ? {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              }
            : undefined,
    });

    // -----------------------------
    // GET /usuarios – mesma lógica da tela de usuários
    // -----------------------------
    function extrairInstituicaoId(usuarioBackend: any): number | null {
        if (!usuarioBackend) return null;

        const inst =
            usuarioBackend.instituicao ??
            usuarioBackend.instituicaoDTO ??
            (Array.isArray(usuarioBackend.instituicoes)
                ? usuarioBackend.instituicoes[0]
                : undefined);

        if (!inst) return null;

        const id = inst.id ?? inst.instituicaoId ?? inst.idInstituicao ?? null;
        return typeof id === "number" ? id : id != null ? Number(id) : null;
    }

    async function carregarUsuariosSistema(): Promise<any[]> {
        if (!token) return [];

        setLoadingUsuarios(true);
        try {
            const res = await fetch(`${API_BASE_URL}/usuarios`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`, // 🔐 já estava certo aqui
                },
            });

            if (!res.ok) {
                throw new Error(
                    `Falha ao buscar usuários do sistema (status ${res.status})`,
                );
            }

            const data = await res.json();
            const lista = Array.isArray(data) ? data : [];
            setUsuariosSistema(lista);
            return lista;
        } catch (err) {
            console.error("Erro ao carregar /usuarios:", err);
            abrirSnackbar(
                "Falha ao carregar lista de usuários do sistema (GET /usuarios).",
                "error",
            );
            return [];
        } finally {
            setLoadingUsuarios(false);
        }
    }

    useEffect(() => {
        if (!token) return;
        void carregarUsuariosSistema();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // -----------------------------
    // Map API data → local shapes
    // -----------------------------
    const disciplinasApi: DisciplinaLocal[] = useMemo(() => {
        const data = disciplinasQuery?.data;
        if (!data || !Array.isArray(data)) return [];

        return data.map((d: any) => ({
            id: d.id,
            nome: d.nome,
            descricao: d.descricao,
            // se o backend mandar id, pegamos; se não, fica null
            idEducadorResponsavel:
                d.idEducadorResponsavel ?? d.educadorResponsavelId ?? null,
            // 🔥 nome que vem na resposta: "educadorResponsavel": "Doja Educador"
            educadorResponsavelNome:
                d.educadorResponsavel ?? d.nomeEducador ?? null,
            idInstituicao: d.idInstituicao ?? instituicaoId ?? null,
            totalAlunos:
                d.totalAlunos ?? (d.estudantes ? d.estudantes.length : 0) ?? 0,
        }));
    }, [disciplinasQuery?.data, instituicaoId]);

    // 🔥 usuariosApi: usa /usuarios + filtra pela instituição do gestor
    const usuariosApi: UsuarioInstituicao[] = useMemo(() => {
        if (!instituicaoId) return [];

        const listaFiltrada = usuariosSistema.filter((u: any) => {
            const instIdUser = extrairInstituicaoId(u);
            return instIdUser === Number(instituicaoId);
        });

        return listaFiltrada.map((u: any) => {
            const rawRoles = u.roles ?? u.tipoUsuario ?? u.role;
            let tipoUsuario: TipoUsuario = "ALUNO";

            if (Array.isArray(rawRoles)) {
                const rolesUpper = rawRoles.map(
                    (r: string) => r?.toUpperCase?.() ?? "",
                );
                if (rolesUpper.some((r) => r.includes("EDUCADOR"))) {
                    tipoUsuario = "EDUCADOR";
                } else if (rolesUpper.some((r) => r.includes("GESTOR"))) {
                    tipoUsuario = "GESTOR";
                } else {
                    tipoUsuario = "ALUNO"; // ESTUDANTE → ALUNO
                }
            } else if (typeof rawRoles === "string") {
                const roleUpper = rawRoles.toUpperCase();
                if (roleUpper.includes("EDUCADOR")) {
                    tipoUsuario = "EDUCADOR";
                } else if (roleUpper.includes("GESTOR")) {
                    tipoUsuario = "GESTOR";
                } else {
                    tipoUsuario = "ALUNO";
                }
            }

            return {
                id: u.id,
                nome:
                    u.nome ?? u.nomeCompleto ?? u.nomeUsuario ?? u.email ?? "—",
                email: u.email ?? u.usuarioEmail ?? "",
                tipoUsuario,
            } as UsuarioInstituicao;
        });
    }, [usuariosSistema, instituicaoId]);

    // Local state fallback so UI remains usable if backend absent/empty
    const [disciplinasLocal, setDisciplinasLocal] = useState<DisciplinaLocal[]>(
        [],
    );
    useEffect(() => {
        if (disciplinasApi && disciplinasApi.length > 0) {
            setDisciplinasLocal(disciplinasApi);
        } else if (!disciplinasQuery) {
            setDisciplinasLocal((prev) =>
                prev.length === 0
                    ? [
                          {
                              id: "m-1",
                              nome: "Matemática - Exemplo",
                              descricao: "Descrição exemplo",
                              idEducadorResponsavel: "1",
                              educadorResponsavelNome: "Educador Exemplo 1",
                              totalAlunos: 0,
                          },
                          {
                              id: "m-2",
                              nome: "Português - Exemplo",
                              descricao: "Descrição exemplo",
                              idEducadorResponsavel: "2",
                              educadorResponsavelNome: "Educador Exemplo 2",
                              totalAlunos: 0,
                          },
                      ]
                    : prev,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disciplinasQuery?.data]);

    // Educadores = usuários com tipoUsuario "EDUCADOR"
    const educadores = useMemo(
        () =>
            usuariosApi.filter(
                (u) => (u.tipoUsuario ?? "ALUNO") === "EDUCADOR",
            ),
        [usuariosApi],
    );

    // Alunos = usuários com tipoUsuario "ALUNO"
    const alunos = useMemo(
        () => usuariosApi.filter((u) => (u.tipoUsuario ?? "ALUNO") === "ALUNO"),
        [usuariosApi],
    );

    const disciplinasFiltradas = useMemo(() => {
        return disciplinasLocal.filter((disc) => {
            const matchNome = disc.nome
                .toLowerCase()
                .includes(searchNome.toLowerCase().trim());

            const matchEducador =
                !educadorFiltro ||
                // match por ID (quando existir)
                String(disc.idEducadorResponsavel ?? "") ===
                    String(educadorFiltro.id ?? "") ||
                // ou match por nome vindo da API
                (disc.educadorResponsavelNome &&
                    disc.educadorResponsavelNome.toLowerCase() ===
                        educadorFiltro.nome.toLowerCase());

            return matchNome && matchEducador;
        });
    }, [disciplinasLocal, searchNome, educadorFiltro]);

    const totalAlunosTodasDisciplinas = useMemo(
        () =>
            disciplinasLocal.reduce((acc, d) => acc + (d.totalAlunos ?? 0), 0),
        [disciplinasLocal],
    );

    const deleteExpectedPhrase = disciplinaParaExcluir
        ? `deletar disciplina ${disciplinaParaExcluir.nome}`
        : "";
    const canConfirmDelete =
        deleteAcknowledge &&
        deleteConfirmText.trim() === (deleteExpectedPhrase || "").trim();

    // -----------------------------
    // Helpers / UI flows
    // -----------------------------
    function abrirSnackbar(
        message: string,
        severity: "success" | "error" | "info" = "success",
    ) {
        setSnackbar({ open: true, message, severity });
    }

    function resetMockOrRefetch() {
        if (disciplinasQuery?.refetch) {
            disciplinasQuery.refetch();
        }
        void carregarUsuariosSistema();
        abrirSnackbar("Recarregado do servidor.", "info");
    }

    // Create / Update
    async function salvarDisciplina() {
        // Regra: precisa ter nome + educador selecionado
        if (!disciplinaFormNome.trim() || !disciplinaFormEducador) {
            abrirSnackbar(
                "Preencha o nome e selecione o educador responsável.",
                "error",
            );
            return;
        }

        const payload = {
            nome: disciplinaFormNome.trim(),
            descricao: disciplinaFormDescricao.trim() || undefined,
            // 🔥 aqui vai o ID do educador selecionado no drop:
            idEducadorResponsavel: Number(disciplinaFormEducador.id),
            // 🔥 id da instituição
            idInstituicao: Number(instituicaoId ?? 0),
        };

        setDisciplinaDialogOpen(false);

        try {
            if (editingDisciplina) {
                // UPDATE
                if (updateDisciplinaMutation?.mutateAsync) {
                    await updateDisciplinaMutation.mutateAsync({
                        id: Number(editingDisciplina.id),
                        data: payload,
                    });
                    abrirSnackbar(
                        "Disciplina atualizada com sucesso.",
                        "success",
                    );
                    disciplinasQuery?.refetch?.();
                } else {
                    setDisciplinasLocal((prev) =>
                        prev.map((d) =>
                            d.id === editingDisciplina.id
                                ? { ...d, ...payload }
                                : d,
                        ),
                    );
                    abrirSnackbar("Disciplina atualizada (local).", "success");
                }
            } else {
                // CREATE
                if (createDisciplinaMutation?.mutateAsync) {
                    await createDisciplinaMutation.mutateAsync({
                        data: payload,
                    });
                    abrirSnackbar("Disciplina criada com sucesso.", "success");
                    disciplinasQuery?.refetch?.();
                } else {
                    const newId = `local-${Date.now()}`;
                    setDisciplinasLocal((prev) => [
                        ...prev,
                        {
                            id: newId,
                            nome: payload.nome,
                            descricao: payload.descricao,
                            idEducadorResponsavel:
                                payload.idEducadorResponsavel,
                            totalAlunos: 0,
                        },
                    ]);
                    abrirSnackbar("Disciplina criada (local).", "success");
                }
            }
        } catch (error: any) {
            console.error(error);
            abrirSnackbar(
                error?.message ?? "Erro ao salvar disciplina.",
                "error",
            );
        } finally {
            setEditingDisciplina(null);
            setDisciplinaFormNome("");
            setDisciplinaFormDescricao("");
            setDisciplinaFormEducador(null);
        }
    }

    function abrirDialogNovaDisciplina() {
        setEditingDisciplina(null);
        setDisciplinaFormNome("");
        setDisciplinaFormDescricao("");
        setDisciplinaFormEducador(null);
        setDisciplinaDialogOpen(true);
    }

    function abrirDialogEditarDisciplina(disc: DisciplinaLocal) {
        setEditingDisciplina(disc);
        setDisciplinaFormNome(disc.nome);
        setDisciplinaFormDescricao(disc.descricao ?? "");
        const educ = educadores.find(
            (e) => String(e.id) === String(disc.idEducadorResponsavel),
        );
        setDisciplinaFormEducador(educ ?? null);
        setDisciplinaDialogOpen(true);
    }

    function removerDisciplinaLocal(disc: DisciplinaLocal) {
        setDisciplinaParaExcluir(disc);
        setDeleteAcknowledge(false);
        setDeleteConfirmText("");
        setDeleteDialogOpen(true);
    }

    function confirmarExclusaoDisciplinaLocal() {
        if (!disciplinaParaExcluir) return;
        abrirSnackbar(
            "Atenção: exclusão permanente é apenas local — backend não suporta DELETE /disciplinas/:id",
            "info",
        );
        setDisciplinasLocal((prev) =>
            prev.filter((d) => d.id !== disciplinaParaExcluir.id),
        );
        setDeleteDialogOpen(false);
        setDisciplinaParaExcluir(null);
        setDeleteAcknowledge(false);
        setDeleteConfirmText("");
    }

    // ------- Gerenciar alunos (aplica somente remoções no servidor) -------
    async function abrirDialogAlunosDisciplina(disc: DisciplinaLocal) {
        setDisciplinaAlunosTarget(disc);
        setAlunosSelecionados([]);
        setAlunosAtuaisIds([]);

        if (!disc?.id) {
            setAlunosDialogOpen(true);
            return;
        }

        try {
            if (getEstudantesFromDisciplina && token) {
                const estudantesQuery = getEstudantesFromDisciplina(
                    Number(disc.id),
                    {
                        client: {
                            headers: {
                                Authorization: `Bearer ${token}`, // 🔐 aqui também
                            },
                        },
                    },
                );
                if (estudantesQuery?.data) {
                    const data = estudantesQuery.data as any[];
                    const selected = (data ?? []).map((s) => ({
                        id: s.id,
                        nome: s.nome,
                        email: s.email,
                    }));
                    setAlunosSelecionados(selected);
                    setAlunosAtuaisIds(selected.map((s) => s.id));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAlunosDialogOpen(true);
        }
    }

    function fecharDialogAlunosDisciplina() {
        setAlunosDialogOpen(false);
        setDisciplinaAlunosTarget(null);
        setAlunosSelecionados([]);
        setAlunosAtuaisIds([]);
    }

    // Save alunos: only removals are sent to the server (if hook available).
    async function salvarAlunosDisciplina() {
        if (!disciplinaAlunosTarget) return;

        const disciplinaId = Number(disciplinaAlunosTarget.id);

        const novosIdsSet = new Set(
            alunosSelecionados.map((a) => String(a.id)),
        );
        const atuaisSet = new Set(alunosAtuaisIds.map((id) => String(id)));

        const paraRemover: string[] = [];
        atuaisSet.forEach((id) => {
            if (!novosIdsSet.has(id)) paraRemover.push(id);
        });

        try {
            if (
                paraRemover.length > 0 &&
                removeEstudanteMutation?.mutateAsync
            ) {
                for (const estudanteId of paraRemover) {
                    await removeEstudanteMutation.mutateAsync({
                        id: disciplinaId,
                        params: { estudanteId: Number(estudanteId) },
                    });
                }
                abrirSnackbar("Remoções aplicadas no servidor.", "success");
            } else if (paraRemover.length > 0) {
                abrirSnackbar(
                    "Remoções aplicadas localmente (hook de remoção não disponível).",
                    "info",
                );
            } else {
                abrirSnackbar(
                    "Nenhuma alteração de matrícula detectada.",
                    "info",
                );
            }

            // Atualiza total localmente com o novo número de alunos selecionados
            const novoTotal = novosIdsSet.size;
            setDisciplinasLocal((prev) =>
                prev.map((d) =>
                    d.id === disciplinaAlunosTarget.id
                        ? { ...d, totalAlunos: novoTotal }
                        : d,
                ),
            );

            fecharDialogAlunosDisciplina();
        } catch (err) {
            console.error(err);
            abrirSnackbar("Erro ao atualizar alunos da disciplina.", "error");
        }
    }

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <Box sx={{ p: 4 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                        Disciplinas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie disciplinas, educadores e matrículas. (Gestor:
                        apenas remoção de alunos; matrícula/adição é
                        responsabilidade do educador.)
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    <Tooltip title="Recarregar">
                        <IconButton onClick={resetMockOrRefetch}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={abrirDialogNovaDisciplina}
                    >
                        Nova Disciplina
                    </Button>
                </Stack>
            </Stack>

            {/* Cards resumo */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Total de Disciplinas
                            </Typography>
                            <Typography variant="h5">
                                {disciplinasLocal.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                Total de Alunos (soma)
                            </Typography>
                            <Typography variant="h5">
                                {totalAlunosTodasDisciplinas}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* filtros */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                    >
                        <TextField
                            label="Pesquisar por nome"
                            size="small"
                            value={searchNome}
                            onChange={(e) => setSearchNome(e.target.value)}
                            sx={{ minWidth: 240 }}
                        />
                        <Autocomplete
                            options={educadores}
                            loading={loadingUsuarios}
                            size="small"
                            getOptionLabel={(option) =>
                                option ? `${option.nome} (${option.email})` : ""
                            }
                            value={educadorFiltro}
                            onChange={(_, value) => setEducadorFiltro(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Filtrar por Educador"
                                />
                            )}
                            sx={{ minWidth: 320 }}
                        />
                        <Button
                            variant="text"
                            onClick={() => {
                                setSearchNome("");
                                setEducadorFiltro(null);
                            }}
                        >
                            Limpar filtros
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* tabela */}
            <Card>
                <CardContent sx={{ p: 0 }}>
                    {disciplinasQuery?.isLoading ? (
                        <Box
                            sx={{
                                py: 6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : disciplinasFiltradas.length === 0 ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="text.secondary">
                                Nenhuma disciplina encontrada.
                            </Typography>
                        </Box>
                    ) : (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Educador Responsável</TableCell>
                                    <TableCell align="center">
                                        Total de Alunos
                                    </TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {disciplinasFiltradas.map((disciplina) => {
                                    const educ = educadores.find(
                                        (e) =>
                                            String(e.id) ===
                                            String(
                                                disciplina.idEducadorResponsavel,
                                            ),
                                    );
                                    const nomeEducadorApi =
                                        disciplina.educadorResponsavelNome;

                                    return (
                                        <TableRow
                                            key={String(disciplina.id)}
                                            hover
                                        >
                                            <TableCell>
                                                <Typography fontWeight={600}>
                                                    {disciplina.nome}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {disciplina.descricao ?? (
                                                    <Typography color="text.secondary">
                                                        —
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {educ ? (
                                                    <Stack spacing={0.5}>
                                                        <Typography>
                                                            {educ.nome}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {educ.email}
                                                        </Typography>
                                                    </Stack>
                                                ) : nomeEducadorApi ? (
                                                    // 🔥 fallback: usa o nome vindo da API
                                                    <Stack spacing={0.5}>
                                                        <Typography>
                                                            {nomeEducadorApi}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        ></Typography>
                                                    </Stack>
                                                ) : (
                                                    <Chip
                                                        label="Educador não encontrado"
                                                        size="small"
                                                        color="warning"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    icon={
                                                        <GroupIcon fontSize="small" />
                                                    }
                                                    label={
                                                        disciplina.totalAlunos ??
                                                        0
                                                    }
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    justifyContent="flex-end"
                                                >
                                                    <Tooltip title="Gerenciar alunos">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                abrirDialogAlunosDisciplina(
                                                                    disciplina,
                                                                )
                                                            }
                                                        >
                                                            <GroupIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                abrirDialogEditarDisciplina(
                                                                    disciplina,
                                                                )
                                                            }
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Remover">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                removerDisciplinaLocal(
                                                                    disciplina,
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* DIALOG – CRIAR / EDITAR */}
            <Dialog
                open={disciplinaDialogOpen}
                onClose={() => setDisciplinaDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
                    {editingDisciplina
                        ? "Editar Disciplina"
                        : "Nova Disciplina"}
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3, pt: 2, pb: 2 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Nome da Disciplina *"
                            value={disciplinaFormNome}
                            onChange={(e) =>
                                setDisciplinaFormNome(e.target.value)
                            }
                            fullWidth
                            autoFocus
                        />
                        <TextField
                            label="Descrição (opcional)"
                            value={disciplinaFormDescricao}
                            onChange={(e) =>
                                setDisciplinaFormDescricao(e.target.value)
                            }
                            fullWidth
                            multiline
                            minRows={3}
                        />
                        <Autocomplete
                            options={educadores}
                            loading={loadingUsuarios}
                            value={disciplinaFormEducador}
                            onChange={(_, value) =>
                                setDisciplinaFormEducador(value)
                            }
                            getOptionLabel={(option) =>
                                option ? `${option.nome} (${option.email})` : ""
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Educador Responsável *"
                                />
                            )}
                        />
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                            Regras: cada disciplina tem um educador responsável.
                            Nome deve ser único na instituição.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{ px: 3, py: 2, gap: 1.5, justifyContent: "flex-end" }}
                >
                    <Button onClick={() => setDisciplinaDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={salvarDisciplina} variant="contained">
                        {editingDisciplina
                            ? updateDisciplinaMutation?.isLoading
                                ? "Salvando..."
                                : "Salvar"
                            : createDisciplinaMutation?.isLoading
                              ? "Criando..."
                              : "Criar"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG – GERENCIAR ALUNOS (somente remoções aplicadas ao servidor) */}
            <Dialog
                open={alunosDialogOpen}
                onClose={fecharDialogAlunosDisciplina}
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
                    Gerenciar alunos da disciplina{" "}
                    {disciplinaAlunosTarget
                        ? `"${disciplinaAlunosTarget.nome}"`
                        : ""}
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3, pt: 2, pb: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Aqui você pode remover alunos da disciplina.
                            Observação: a adição/matrícula de alunos é
                            responsabilidade do educador e não é realizada nesta
                            tela.
                        </Typography>
                        <Autocomplete
                            multiple
                            options={alunos}
                            disableCloseOnSelect
                            getOptionLabel={(option) =>
                                option ? `${option.nome} (${option.email})` : ""
                            }
                            value={alunosSelecionados}
                            onChange={(_, value) =>
                                setAlunosSelecionados(value)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Alunos matriculados na disciplina"
                                    placeholder="Busque pelo nome ou e-mail"
                                />
                            )}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} key={String(option.id)}>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ width: "100%" }}
                                    >
                                        <Box>
                                            <Typography>
                                                {option.nome}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {option.email}
                                            </Typography>
                                        </Box>
                                        {selected && (
                                            <Chip
                                                label="Selecionado"
                                                size="small"
                                                color="primary"
                                            />
                                        )}
                                    </Stack>
                                </li>
                            )}
                        />
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                            Atenção: somente remoções são enviadas ao servidor.
                            Para matrículas (adição), utilize a tela do
                            educador.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{ px: 3, py: 2, gap: 1.5, justifyContent: "flex-end" }}
                >
                    <Button onClick={fecharDialogAlunosDisciplina}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={salvarAlunosDisciplina}
                        variant="contained"
                    >
                        Salvar alterações
                    </Button>
                </DialogActions>
            </Dialog>

            {/* DIALOG – EXCLUIR (apenas local, backend sem delete) */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <WarningAmberIcon color="error" />
                        <Typography component="span" variant="h6">
                            Excluir disciplina
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers sx={{ px: 3, pt: 2, pb: 2 }}>
                    <Stack spacing={2}>
                        <Typography variant="body2" component="div">
                            Você está prestes a excluir a disciplina{" "}
                            <Box
                                component="span"
                                fontWeight={700}
                                color="error.main"
                            >
                                {disciplinaParaExcluir?.nome ?? "—"}
                            </Box>
                            .
                        </Typography>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={deleteAcknowledge}
                                    onChange={(e) =>
                                        setDeleteAcknowledge(e.target.checked)
                                    }
                                    color="error"
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Estou ciente de que a exclusão será
                                    permanente.
                                </Typography>
                            }
                        />

                        <TextField
                            label="Para confirmar, digite a frase abaixo"
                            value={deleteConfirmText}
                            onChange={(e) =>
                                setDeleteConfirmText(e.target.value)
                            }
                            fullWidth
                            placeholder={
                                deleteExpectedPhrase ||
                                "deletar disciplina Nome da Disciplina"
                            }
                            error={
                                !!deleteConfirmText &&
                                deleteConfirmText.trim() !==
                                    (deleteExpectedPhrase || "").trim()
                            }
                            helperText={
                                deleteExpectedPhrase
                                    ? `Frase esperada: "${deleteExpectedPhrase}"`
                                    : "Selecione uma disciplina para ver a frase de confirmação."
                            }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{ px: 3, py: 2, gap: 1.5, justifyContent: "flex-end" }}
                >
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmarExclusaoDisciplinaLocal}
                        variant="contained"
                        color="error"
                        disabled={!canConfirmDelete}
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SNACKBAR */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    elevation={3}
                    variant="filled"
                    onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

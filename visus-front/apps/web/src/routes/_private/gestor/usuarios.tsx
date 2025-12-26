// apps/web/src/routes/_private/gestor/usuarios.tsx
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Info as InfoIcon,
    PersonAdd as PersonAddIcon,
    Person as PersonIcon,
    Refresh as RefreshIcon,
    School as SchoolIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
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
// hook Kubb para DELETE /instituicoes/{instituicaoId}/usuarios/{usuarioId}
import { useRemoveUsuarioFromInstituicao } from "@visus/api";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

import { UsuarioGridCard } from "../gestor/-components/userGridCard";
import { UsuarioListRow } from "../gestor/-components/userListRow";

export const Route = createFileRoute("/_private/gestor/usuarios")({
    component: GestorUsuarios,
});

type UserRole = "ESTUDANTE" | "EDUCADOR" | "GESTOR";

interface UsuarioInstituicao {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: UserRole;
    matricula?: string;
    cpf?: string;
    vinculoAtivo: boolean;
    avatarUrl?: string;
}

const API_BASE_URL = "http://localhost:8080"; // ajuste se seu backend estiver em outro host/porta

const getTipoUsuarioLabel = (tipo: UserRole): string => {
    switch (tipo) {
        case "ESTUDANTE":
            return "Estudante";
        case "EDUCADOR":
            return "Educador";
        case "GESTOR":
            return "Gestor";
        default:
            return tipo;
    }
};

export default function GestorUsuarios() {
    const { user, token } = useAuth();

    // 🔹 estado vindo do GET /usuarios
    const [usuariosSistema, setUsuariosSistema] = useState<any[]>([]);
    const [instituicaoIdFromApi, setInstituicaoIdFromApi] = useState<
        number | null
    >(null);
    const [loadingUsuariosSistema, setLoadingUsuariosSistema] = useState(false);

    // 🔹 estados da UI
    const [filtroBusca, setFiltroBusca] = useState("");
    const [filtroRole, setFiltroRole] = useState<UserRole | "TODOS">("TODOS");
    const [apenasVinculados, setApenasVinculados] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    const [dialogNovoUsuarioOpen, setDialogNovoUsuarioOpen] = useState(false);
    const [novoUsuarioEmail, setNovoUsuarioEmail] = useState("");
    const [novoUsuarioRole, setNovoUsuarioRole] =
        useState<UserRole>("ESTUDANTE"); // só informativo

    const [dialogDesvincularOpen, setDialogDesvincularOpen] = useState(false);
    const [usuarioSelecionado, setUsuarioSelecionado] =
        useState<UsuarioInstituicao | null>(null);
    const [textoConfirmacao, setTextoConfirmacao] = useState("");

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    // ✅ mutation Kubb para remover usuário da instituição (já com Authorization)
    const removeUsuarioMutation = useRemoveUsuarioFromInstituicao({
        client: {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        },
    });

    function abrirSnackbar(
        message: string,
        severity: "success" | "error" | "info" | "warning" = "success",
    ) {
        setSnackbar({ open: true, message, severity });
    }

    // 🔹 helper para extrair o id da instituição do usuário vindo do /usuarios
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

    // 🔹 carrega TODOS os usuários do sistema via GET /usuarios (backend)
    async function carregarUsuariosSistema(): Promise<any[]> {
        if (!token) return [];

        setLoadingUsuariosSistema(true);
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
                    `Falha ao buscar usuários do sistema (status ${res.status})`,
                );
            }

            const data = await res.json();
            const lista = Array.isArray(data) ? data : [];

            setUsuariosSistema(lista);

            // tenta achar o usuário logado nessa lista
            const authUserId = (user as any)?.id;
            const authUserEmail = (user as any)?.email?.toLowerCase?.();

            let usuarioLogadoBackend: any | undefined;

            if (authUserId != null) {
                usuarioLogadoBackend = lista.find(
                    (u: any) => Number(u.id) === Number(authUserId),
                );
            }

            if (!usuarioLogadoBackend && authUserEmail) {
                usuarioLogadoBackend = lista.find((u: any) => {
                    const emailApi = (u.email ?? u.usuarioEmail ?? "")
                        .toString()
                        .toLowerCase();
                    return emailApi === authUserEmail;
                });
            }

            const instId = extrairInstituicaoId(usuarioLogadoBackend);
            if (!instId) {
                console.warn(
                    "Não foi possível extrair id da instituição do usuário logado via /usuarios",
                );
            } else {
                setInstituicaoIdFromApi(instId);
            }

            return lista;
        } catch (err) {
            console.error("Erro ao carregar /usuarios:", err);
            abrirSnackbar(
                "Falha ao carregar lista de usuários do sistema (GET /usuarios).",
                "error",
            );
            return [];
        } finally {
            setLoadingUsuariosSistema(false);
        }
    }

    // 🔹 carrega /usuarios na montagem (ou quando login/token mudar)
    useEffect(() => {
        if (!user || !token) return;
        void carregarUsuariosSistema();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // 🔹 mapeia usuariosSistema -> apenas usuários que pertencem à instituição do gestor
    const usuarios: UsuarioInstituicao[] = useMemo(() => {
        if (!instituicaoIdFromApi) return [];

        const listaFiltrada = usuariosSistema.filter((u: any) => {
            const instIdUser = extrairInstituicaoId(u);
            return instIdUser === instituicaoIdFromApi;
        });

        return listaFiltrada.map((u: any) => ({
            id: Number(u.id),
            nome: u.nome ?? u.nomeCompleto ?? u.nomeUsuario ?? u.email ?? "—",
            email: u.email ?? u.usuarioEmail ?? "",
            tipoUsuario: (u.roles ??
                u.tipoUsuario ??
                u.role ??
                "ESTUDANTE") as UserRole,
            matricula: u.matricula ?? undefined,
            cpf: u.cpf ?? undefined,
            vinculoAtivo:
                typeof u.vinculoAtivo === "boolean" ? u.vinculoAtivo : true,
            avatarUrl: u.avatarUrl ?? u.foto ?? undefined,
        }));
    }, [usuariosSistema, instituicaoIdFromApi]);

    // 🔹 filtros em cima dos usuários da instituição
    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter((u) => {
            if (apenasVinculados && !u.vinculoAtivo) return false;
            if (filtroRole !== "TODOS" && u.tipoUsuario !== filtroRole)
                return false;

            const busca = filtroBusca.trim().toLowerCase();
            if (!busca) return true;

            return (
                (u.nome ?? "").toLowerCase().includes(busca) ||
                (u.email ?? "").toLowerCase().includes(busca) ||
                (u.matricula ?? "").toLowerCase().includes(busca) ||
                (u.cpf ?? "").toLowerCase().includes(busca)
            );
        });
    }, [usuarios, filtroBusca, filtroRole, apenasVinculados]);

    const totalUsuarios = usuarios.filter((u) => u.vinculoAtivo).length;
    const totalEstudantes = usuarios.filter(
        (u) => u.vinculoAtivo && u.tipoUsuario === "ESTUDANTE",
    ).length;
    const totalEducadores = usuarios.filter(
        (u) => u.vinculoAtivo && u.tipoUsuario === "EDUCADOR",
    ).length;
    const totalGestores = usuarios.filter(
        (u) => u.vinculoAtivo && u.tipoUsuario === "GESTOR",
    ).length;

    const handleResetFiltros = () => {
        setFiltroBusca("");
        setFiltroRole("TODOS");
        setApenasVinculados(true);
    };

    const handleAbrirNovoUsuario = () => setDialogNovoUsuarioOpen(true);
    const handleFecharNovoUsuario = () => {
        setDialogNovoUsuarioOpen(false);
        setNovoUsuarioEmail("");
        setNovoUsuarioRole("ESTUDANTE");
    };

    // 🔹 handler de vincular por e-mail:
    // usa SOMENTE GET /usuarios para descobrir:
    //  - id da instituição (já descoberto antes)
    //  - id do usuário cujo e-mail bate
    async function handleSalvarNovoUsuarioPorEmail() {
        if (!instituicaoIdFromApi) {
            abrirSnackbar(
                "Não foi possível determinar o id da instituição a partir de /usuarios.",
                "error",
            );
            return;
        }

        const email = novoUsuarioEmail.trim().toLowerCase();
        if (!email) {
            abrirSnackbar("Informe um e-mail válido.", "error");
            return;
        }

        try {
            // garante que temos a lista de /usuarios em memória
            let lista = usuariosSistema;
            if (!lista || lista.length === 0) {
                lista = await carregarUsuariosSistema();
            }

            // acha o usuário pelo e-mail (só em memória, com base no GET /usuarios)
            const usuarioAlvo = lista.find((u: any) => {
                const emailApi = (u.email ?? u.usuarioEmail ?? "")
                    .toString()
                    .toLowerCase();
                return emailApi === email;
            });

            if (!usuarioAlvo) {
                abrirSnackbar(
                    `Nenhum usuário encontrado para o e-mail "${novoUsuarioEmail}". Verifique se ele está cadastrado no sistema.`,
                    "error",
                );
                return;
            }

            const usuarioId = Number(usuarioAlvo.id);
            if (Number.isNaN(usuarioId)) {
                abrirSnackbar(
                    "Usuário encontrado, mas o id não é numérico. Verifique o backend.",
                    "error",
                );
                return;
            }

            // 🔥 Chama diretamente o endpoint de vínculo:
            // POST /instituicoes/{idInstituicao}/usuarios/{idUsuario}
            const res = await fetch(
                `${API_BASE_URL}/instituicoes/${instituicaoIdFromApi}/usuarios/${usuarioId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                },
            );

            if (!res.ok) {
                const texto = await res.text().catch(() => "");
                throw new Error(
                    `Falha ao vincular usuário (status ${res.status}) ${texto}`,
                );
            }

            // recarrega a lista dos usuários do sistema (e, por tabela, da instituição)
            await carregarUsuariosSistema();

            abrirSnackbar(
                `Usuário ${novoUsuarioEmail} vinculado com sucesso (id=${usuarioId}).`,
                "success",
            );
            handleFecharNovoUsuario();
        } catch (err: any) {
            console.error("Erro ao vincular usuário:", err);
            abrirSnackbar(
                err?.message ?? "Erro desconhecido ao vincular usuário.",
                "error",
            );
        }
    }

    const abrirDialogDesvincular = (usuario: UsuarioInstituicao) => {
        setUsuarioSelecionado(usuario);
        setTextoConfirmacao("");
        setDialogDesvincularOpen(true);
    };

    const fecharDialogDesvincular = () => {
        setDialogDesvincularOpen(false);
        setUsuarioSelecionado(null);
        setTextoConfirmacao("");
    };

    // 🔹 handler de DESVINCULAR usando o hook Kubb
    const handleDesvincularUsuario = async () => {
        if (!usuarioSelecionado) return;
        if (!instituicaoIdFromApi) {
            abrirSnackbar(
                "Instituição não encontrada (via /usuarios).",
                "error",
            );
            return;
        }

        try {
            await removeUsuarioMutation.mutateAsync({
                instituicaoId: Number(instituicaoIdFromApi),
                usuarioId: Number(usuarioSelecionado.id),
            });

            // recarrega lista com base no GET /usuarios
            await carregarUsuariosSistema();

            abrirSnackbar(
                `Usuário "${usuarioSelecionado.nome}" desvinculado.`,
                "success",
            );
            fecharDialogDesvincular();
        } catch (err: any) {
            console.error("Erro ao desvincular:", err);
            abrirSnackbar(
                err?.message ?? "Falha ao desvincular usuário.",
                "error",
            );
        }
    };

    const textoConfirmacaoEsperado = React.useMemo(() => {
        if (!usuarioSelecionado) return "";
        return `remover ${usuarioSelecionado.nome}`;
    }, [usuarioSelecionado]);

    const confirmacaoValida =
        !!usuarioSelecionado &&
        textoConfirmacao.trim().toLowerCase() ===
            textoConfirmacaoEsperado.toLowerCase();

    // 🔹 RENDER
    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box>
                    <Typography variant="h4" sx={{ mb: 3 }}>
                        Usuários da Instituição
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gerencie os estudantes, educadores e gestores vinculados
                        à instituição.
                    </Typography>
                    {loadingUsuariosSistema && (
                        <Typography variant="caption" color="text.secondary">
                            Carregando dados de usuários do sistema (GET
                            /usuarios)...
                        </Typography>
                    )}
                </Box>

                <Stack direction="row" alignItems="center">
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mr: 2 }}
                    >
                        <Tooltip title="Visualização em lista">
                            <IconButton
                                onClick={() => setViewMode("list")}
                                color={
                                    viewMode === "list" ? "primary" : "default"
                                }
                                size="small"
                            >
                                <ViewListIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Visualização em grid">
                            <IconButton
                                onClick={() => setViewMode("grid")}
                                color={
                                    viewMode === "grid" ? "primary" : "default"
                                }
                                size="small"
                            >
                                <ViewModuleIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleAbrirNovoUsuario}
                    >
                        Novo Usuário / Vincular
                    </Button>
                </Stack>
            </Stack>

            {/* Cards resumo */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <GroupIcon fontSize="small" />
                                <Typography variant="subtitle2">
                                    Usuários vinculados
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ mt: 1 }}>
                                {loadingUsuariosSistema ? "—" : totalUsuarios}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Total de contas ativas na instituição.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <SchoolIcon fontSize="small" />
                                <Typography variant="subtitle2">
                                    Estudantes
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ mt: 1 }}>
                                {loadingUsuariosSistema ? "—" : totalEstudantes}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Usuários com perfil de estudante.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <PersonIcon fontSize="small" />
                                <Typography variant="subtitle2">
                                    Educadores
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ mt: 1 }}>
                                {loadingUsuariosSistema ? "—" : totalEducadores}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Professores/educadores vinculados.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <AdminPanelSettingsIcon fontSize="small" />
                                <Typography variant="subtitle2">
                                    Gestores
                                </Typography>
                            </Stack>
                            <Typography variant="h4" sx={{ mt: 1 }}>
                                {loadingUsuariosSistema ? "—" : totalGestores}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Contas gestoras desta instituição.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtros */}
            <Card>
                <CardContent>
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", md: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={2}
                            flex={1}
                        >
                            <TextField
                                label="Buscar por nome, e-mail, matrícula ou CPF"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={filtroBusca}
                                onChange={(e) => setFiltroBusca(e.target.value)}
                            />

                            <TextField
                                select
                                label="Tipo de usuário"
                                size="small"
                                value={filtroRole}
                                onChange={(e) =>
                                    setFiltroRole(
                                        e.target.value as UserRole | "TODOS",
                                    )
                                }
                                SelectProps={{ native: true }}
                                sx={{ minWidth: 180 }}
                            >
                                <option value="TODOS">Todos</option>
                                <option value="ESTUDANTE">Estudante</option>
                                <option value="EDUCADOR">Educador</option>
                                <option value="GESTOR">Gestor</option>
                            </TextField>
                        </Stack>

                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            alignItems="center"
                            spacing={1}
                            sx={{ mt: { xs: 2, md: 0 } }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={apenasVinculados}
                                        onChange={(e) =>
                                            setApenasVinculados(
                                                e.target.checked,
                                            )
                                        }
                                        size="small"
                                    />
                                }
                                label="Apenas usuários vinculados"
                            />
                            <Tooltip title="Limpar filtros">
                                <IconButton onClick={handleResetFiltros}>
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Lista / Grid */}
            <Card>
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="h6">
                                Usuários vinculados
                            </Typography>
                            <Tooltip title="Esta lista representa os usuários associados à instituição atual.">
                                <InfoIcon fontSize="small" color="action" />
                            </Tooltip>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            {usuariosFiltrados.length} usuário(s) encontrados
                        </Typography>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {loadingUsuariosSistema ? (
                        <Box
                            sx={{
                                py: 6,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : viewMode === "list" ? (
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Usuário</TableCell>
                                    <TableCell>E-mail</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Matrícula</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>Vínculo</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usuariosFiltrados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ py: 2 }}
                                            >
                                                Nenhum usuário encontrado com os
                                                filtros atuais.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    usuariosFiltrados.map((usuario) => (
                                        <UsuarioListRow
                                            key={usuario.id}
                                            usuario={usuario}
                                            onDesvincular={() =>
                                                abrirDialogDesvincular(usuario)
                                            }
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <Grid container spacing={2}>
                            {usuariosFiltrados.length === 0 ? (
                                <Grid item xs={12}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="center"
                                        sx={{ py: 2 }}
                                    >
                                        Nenhum usuário encontrado com os filtros
                                        atuais.
                                    </Typography>
                                </Grid>
                            ) : (
                                usuariosFiltrados.map((usuario) => (
                                    <Grid item xs={12} md={6} key={usuario.id}>
                                        <UsuarioGridCard
                                            usuario={usuario}
                                            onDesvincular={() =>
                                                abrirDialogDesvincular(usuario)
                                            }
                                        />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Dialog – Vincular por e-mail */}
            <Dialog
                open={dialogNovoUsuarioOpen}
                onClose={handleFecharNovoUsuario}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Adicionar usuário à instituição (por e-mail)
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {/* <Typography variant="body2" color="text.secondary">
                            Informe o e-mail do usuário para vinculá-lo à
                            instituição atual. O sistema vai usar o GET{" "}
                            <code>/usuarios</code> para encontrar o id do
                            usuário e o id da instituição correta e, em seguida,
                            chamar o endpoint de vínculo.
                        </Typography> */}

                        <TextField
                            label="E-mail do usuário"
                            fullWidth
                            value={novoUsuarioEmail}
                            onChange={(e) =>
                                setNovoUsuarioEmail(e.target.value)
                            }
                            helperText="Informe o e-mail do usuário cadastrado no sistema."
                        />

                        <TextField
                            select
                            label="Perfil esperado"
                            fullWidth
                            value={novoUsuarioRole}
                            onChange={(e) =>
                                setNovoUsuarioRole(e.target.value as UserRole)
                            }
                            SelectProps={{ native: true }}
                        >
                            <option value="ESTUDANTE">Estudante</option>
                            <option value="EDUCADOR">Educador</option>
                            <option value="GESTOR">Gestor</option>
                        </TextField>

                        {/* <Alert severity="info" icon={<InfoIcon />}>
                            <Typography variant="body2">
                                A lógica é: carregar <code>GET /usuarios</code>,
                                achar o usuário pelo e-mail, pegar o{" "}
                                <code>id</code> dele, usar o <code>id</code> da
                                instituição descoberto também via{" "}
                                <code>/usuarios</code> e chamar:{" "}
                                <code>
                                    POST /instituicoes/{"{idInstituicao}"}
                                    /usuarios/
                                    {"{idUsuario}"}
                                </code>
                                .
                            </Typography>
                        </Alert> */}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharNovoUsuario}>Cancelar</Button>
                    <Button
                        variant="contained"
                        onClick={handleSalvarNovoUsuarioPorEmail}
                        disabled={!novoUsuarioEmail.trim()}
                    >
                        Vincular usuário
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog – Desvincular Usuário */}
            <Dialog
                open={dialogDesvincularOpen}
                onClose={fecharDialogDesvincular}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                    <WarningAmberIcon color="error" />
                    Desvincular usuário da instituição
                </DialogTitle>
                <DialogContent dividers sx={{ px: 4, py: 3 }}>
                    {usuarioSelecionado && (
                        <Stack spacing={2.5}>
                            <Typography variant="body2">
                                Você está prestes a{" "}
                                <strong>remover o vínculo</strong> do usuário:
                            </Typography>

                            <Alert
                                severity="warning"
                                sx={{ borderRadius: 2, p: 2 }}
                            >
                                <Typography variant="body2">
                                    <strong>{usuarioSelecionado.nome}</strong>
                                    <br />
                                    {usuarioSelecionado.email}
                                    <br />
                                    Tipo:{" "}
                                    {getTipoUsuarioLabel(
                                        usuarioSelecionado.tipoUsuario,
                                    )}
                                </Typography>
                            </Alert>

                            <Typography variant="body2">
                                Para confirmar a ação, digite exatamente:
                            </Typography>

                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: "background.default",
                                    fontFamily: "monospace",
                                    fontSize: 14,
                                    mt: 0.5,
                                }}
                            >
                                {textoConfirmacaoEsperado}
                            </Box>

                            <TextField
                                label="Confirmação"
                                fullWidth
                                value={textoConfirmacao}
                                onChange={(e) =>
                                    setTextoConfirmacao(e.target.value)
                                }
                                placeholder={textoConfirmacaoEsperado}
                                helperText="Esta ação é irreversível do ponto de vista da instituição. O usuário continuará existindo no sistema, mas não estará mais associado a esta instituição."
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={fecharDialogDesvincular}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDesvincularUsuario}
                        disabled={
                            !confirmacaoValida ||
                            removeUsuarioMutation.isPending
                        }
                    >
                        {removeUsuarioMutation.isPending
                            ? "Removendo..."
                            : "Confirmar desvinculação"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

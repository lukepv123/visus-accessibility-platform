// apps/web/src/routes/_private/gestor/relatorios.tsx

import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import ReportEducador, {
    type EducadorReportProps,
} from "../../_private/-components/report/reportEducador";
import ReportEstudante, {
    type EstudanteReportProps,
} from "../../_private/-components/report/reportEstudante";
// IMPORTS: componentes + tipos
import ReportGestor, {
    type GestorReportProps,
} from "../../_private/-components/report/reportGestor";

export const Route = createFileRoute("/_private/gestor/relatorios")({
    component: GestorRelatorios,
});

// ============================================================================
// MOCK DATA – EXEMPLOS COMO SE VIESSEM DOS ENDPOINTS DO BACKEND
// (sem requisição, apenas para gerar o PDF de teste)
// ============================================================================

const gestorMock: GestorReportProps = {
    institution: {
        nome: "FATEC São Caetano do Sul",
        cnpj: "12.345.678/0001-90",
        telefone: "(11) 4224-1234",
        email: "contato@fatecscs.edu.br",
        endereco: {
            logradouro: "Rua Bell Aliance",
            numero: "123",
            bairro: "Centro",
            cidade: "São Caetano do Sul",
            estado: "SP",
            cep: "09520-000",
        },
    },
    gestor: {
        nome: "Lucas Petenusso Viana",
        matricula: "G001",
        cargo: "Gestor Institucional",
        email: "lucas.gestor@fatec.sp.gov.br",
    },
    period: {
        start: "2025-02-01",
        end: "2025-06-30",
    },
    generatedAt: new Date().toISOString(),
    kpis: {
        totalStudents: 320,
        totalEducators: 24,
        totalDisciplines: 48,
        globalAverageGrade: 7.35,
        totalPosts: 210,
        totalResponses: 1320,
    },
    studentsByYear: [
        { anoEscolar: "PRIMEIRO_ANO_EM", count: 80 },
        { anoEscolar: "SEGUNDO_ANO_EM", count: 120 },
        { anoEscolar: "TERCEIRO_ANO_EM", count: 120 },
    ],
    studentsByPeriod: [
        { periodo: "MATUTINO", count: 180 },
        { periodo: "VESPERTINO", count: 90 },
        { periodo: "NOTURNO", count: 50 },
    ],
    studentsByGender: [
        { genero: "MASCULINO", count: 160 },
        { genero: "FEMININO", count: 150 },
        { genero: "OUTRO/NAO_INFORMAR", count: 10 },
    ],
    disciplinesSummary: [
        {
            id: 1,
            nome: "Matemática I",
            educadorNome: "Prof. João Silva",
            totalAlunos: 35,
            totalPostagens: 18,
            totalRespostas: 120,
            mediaNotas: 7.8,
        },
        {
            id: 2,
            nome: "Português I",
            educadorNome: "Profa. Maria Souza",
            totalAlunos: 32,
            totalPostagens: 15,
            totalRespostas: 110,
            mediaNotas: 7.2,
        },
    ],
    gradeDistribution: [
        { faixa: "0,0 – 4,9", quantidade: 60, percentual: 4.5 },
        { faixa: "5,0 – 6,9", quantidade: 260, percentual: 19.7 },
        { faixa: "7,0 – 8,9", quantidade: 760, percentual: 57.6 },
        { faixa: "9,0 – 10,0", quantidade: 240, percentual: 18.2 },
    ],
    engagementByDiscipline: [
        {
            disciplinaNome: "Matemática I",
            postagens: 18,
            respostas: 120,
            arquivos: 45,
        },
        {
            disciplinaNome: "Português I",
            postagens: 15,
            respostas: 110,
            arquivos: 36,
        },
    ],
    events: [
        {
            inicio: "2025-03-10T08:00:00",
            fim: "2025-03-10T09:30:00",
            titulo: "Prova bimestral – Matemática I",
            disciplinaNome: "Matemática I",
        },
        {
            inicio: "2025-04-05T19:00:00",
            fim: "2025-04-05T20:00:00",
            titulo: "Reunião de pais",
            disciplinaNome: "Institucional",
        },
    ],
    highlightStudents: [
        {
            tipo: "DESTAQUE",
            nome: "Ana Clara Santos",
            anoEscolar: "SEGUNDO_ANO_EM",
            mediaNotas: 9.1,
            respostasEnviadas: 42,
            observacao: "Desempenho consistente em todas as disciplinas.",
        },
        {
            tipo: "RISCO",
            nome: "Bruno Andrade",
            anoEscolar: "TERCEIRO_ANO_EM",
            mediaNotas: 5.1,
            respostasEnviadas: 12,
            observacao: "Baixo engajamento e notas abaixo da média.",
        },
    ],
    recommendations:
        "Priorizar acompanhamento dos alunos em risco, promover ações de reforço em disciplinas com maior concentração de notas baixas e manter as práticas bem-sucedidas nas turmas com maior engajamento.",
};

// --------------------------------------------------------------------------
// MOCK – Educador
// --------------------------------------------------------------------------

const educadorMock: EducadorReportProps = {
    institution: {
        nome: "FATEC São Caetano do Sul",
    },
    educador: {
        nome: "Prof. João Silva",
        matricula: "E123",
        email: "joao.silva@fatec.sp.gov.br",
        titulo: "Mestre em Matemática Aplicada",
        formacoes: [
            {
                titulo: "Licenciatura em Matemática",
                instituicao: "Universidade XYZ",
                dataInicio: "2015-02-01",
                dataConclusao: "2018-12-01",
                descricao: "Foco em educação matemática e didática.",
            },
            {
                titulo: "Mestrado em Matemática Aplicada",
                instituicao: "Universidade ABC",
                dataInicio: "2019-03-01",
                dataConclusao: "2021-02-28",
                descricao:
                    "Pesquisa em modelos matemáticos aplicados à educação.",
            },
        ],
    },
    period: {
        start: "2025-02-01",
        end: "2025-06-30",
    },
    generatedAt: new Date().toISOString(),
    kpis: {
        totalDisciplinas: 3,
        totalEstudantesUnicos: 95,
        mediaGeralTurmas: 7.6,
        totalPostagens: 45,
        totalRespostas: 320,
    },
    disciplinasResumo: [
        {
            id: 1,
            nome: "Matemática I",
            totalAlunos: 35,
            mediaNotas: 7.8,
            respostasRecebidas: 120,
            postagens: 18,
            arquivosPostagens: 25,
        },
        {
            id: 2,
            nome: "Matemática II",
            totalAlunos: 30,
            mediaNotas: 7.3,
            respostasRecebidas: 100,
            postagens: 14,
            arquivosPostagens: 20,
        },
        {
            id: 3,
            nome: "Estatística",
            totalAlunos: 30,
            mediaNotas: 7.9,
            respostasRecebidas: 100,
            postagens: 13,
            arquivosPostagens: 18,
        },
    ],
    desempenhoPorDisciplina: [
        {
            disciplinaId: 1,
            disciplinaNome: "Matemática I",
            alunos: [
                {
                    estudanteId: 101,
                    nome: "Ana Clara Santos",
                    anoEscolar: "SEGUNDO_ANO_EM",
                    mediaNotas: 9.2,
                    respostasEnviadas: 15,
                    ultimaNota: 9.5,
                    status: "OK",
                },
                {
                    estudanteId: 102,
                    nome: "Bruno Andrade",
                    anoEscolar: "TERCEIRO_ANO_EM",
                    mediaNotas: 5.0,
                    respostasEnviadas: 8,
                    ultimaNota: 4.5,
                    status: "RISCO",
                },
            ],
        },
    ],
    atividadesPorDisciplina: [
        {
            disciplinaId: 1,
            disciplinaNome: "Matemática I",
            postagens: 18,
            respostas: 120,
            respostasPorAluno: 3.4,
            arquivosRespostas: 40,
        },
        {
            disciplinaId: 2,
            disciplinaNome: "Matemática II",
            postagens: 14,
            respostas: 100,
            respostasPorAluno: 3.3,
            arquivosRespostas: 35,
        },
    ],
    eventos: [
        {
            inicio: "2025-03-10T08:00:00",
            titulo: "Prova bimestral – Matemática I",
            descricao: "Avaliação sobre funções e equações.",
            disciplinaNome: "Matemática I",
        },
        {
            inicio: "2025-04-02T10:00:00",
            titulo: "Entrega de trabalho – Estatística",
            descricao: "Trabalho em grupo sobre análise de dados.",
            disciplinaNome: "Estatística",
        },
    ],
    recomendacoes:
        "Reforçar acompanhamento de estudantes em risco, escalonar prazos de entrega ao longo do período e incentivar o uso de materiais complementares postados na plataforma.",
};

// --------------------------------------------------------------------------
// MOCK – Estudante
// --------------------------------------------------------------------------

const estudanteMock: EstudanteReportProps = {
    institution: {
        nome: "FATEC São Caetano do Sul",
    },
    estudante: {
        id: 101,
        nome: "Ana Clara Santos",
        matricula: "A2025001",
        email: "ana.clara@aluno.fatec.sp.gov.br",
        anoEscolar: "SEGUNDO_ANO_EM",
        periodo: "MATUTINO",
    },
    period: {
        start: "2025-02-01",
        end: "2025-06-30",
    },
    generatedAt: new Date().toISOString(),
    kpis: {
        mediaGeral: 8.7,
        disciplinasCursadas: 5,
        totalAvaliacoes: 22,
        dataUltimaAtividade: "2025-06-25",
    },
    desempenhoPorDisciplina: [
        {
            disciplinaId: 1,
            disciplinaNome: "Matemática I",
            educadorNome: "Prof. João Silva",
            mediaNotas: 9.2,
            avaliacoesRespondidas: 5,
            status: "OK",
        },
        {
            disciplinaId: 2,
            disciplinaNome: "Português I",
            educadorNome: "Profa. Maria Souza",
            mediaNotas: 8.5,
            avaliacoesRespondidas: 4,
            status: "OK",
        },
        {
            disciplinaId: 3,
            disciplinaNome: "História",
            educadorNome: "Prof. Carlos Lima",
            mediaNotas: 7.8,
            avaliacoesRespondidas: 4,
            status: "OK",
        },
        {
            disciplinaId: 4,
            disciplinaNome: "Física",
            educadorNome: "Profa. Renata Costa",
            mediaNotas: 7.2,
            avaliacoesRespondidas: 5,
            status: "OK",
        },
        {
            disciplinaId: 5,
            disciplinaNome: "Educação Física",
            educadorNome: "Prof. Rafael",
            mediaNotas: 9.0,
            avaliacoesRespondidas: 4,
            status: "OK",
        },
    ],
    historicoAvaliacoes: [
        {
            dataEnvio: "2025-03-10",
            disciplinaNome: "Matemática I",
            descricaoTarefa: "Prova bimestral 1",
            nota: 9.5,
            feedback: "Excelente desempenho, continue assim.",
        },
        {
            dataEnvio: "2025-04-05",
            disciplinaNome: "Português I",
            descricaoTarefa: "Redação dissertativa",
            nota: 8.3,
            feedback: "Boa argumentação, revisar coesão em alguns trechos.",
        },
        {
            dataEnvio: "2025-05-18",
            disciplinaNome: "Física",
            descricaoTarefa: "Lista de exercícios – Cinemática",
            nota: 7.0,
            feedback: "Rever conceitos de velocidade média.",
        },
    ],
    proximosEventos: [
        {
            inicio: "2025-07-02T08:00:00",
            disciplinaNome: "Matemática I",
            titulo: "Prova bimestral 2",
            descricao: "Conteúdo de funções quadráticas.",
        },
        {
            inicio: "2025-07-10T10:00:00",
            disciplinaNome: "História",
            titulo: "Entrega de trabalho em grupo",
            descricao: "Apresentação sobre Revolução Industrial.",
        },
    ],
    pontosFortes: [
        { disciplinaNome: "Matemática I", media: 9.2 },
        { disciplinaNome: "Educação Física", media: 9.0 },
    ],
    pontosAtencao: [{ disciplinaNome: "Física", media: 7.2 }],
    recomendacoesGerais:
        "Mantenha sua rotina de estudos em Matemática e Português e reserve tempo extra para revisar os conteúdos de Física. Planeje seus estudos com antecedência para as provas e trabalhos listados no calendário.",
    comentarioEducador:
        "Ana apresenta ótimo comprometimento e potencial. Recomendo apenas maior participação nas aulas de Física e envio antecipado das atividades para evitar correções em cima da hora.",
};

// ============================================================================
// OPÇÕES MOCK PARA FILTROS (Educadores / Estudantes)
// ============================================================================

type EducadorOption = {
    id: string;
    nome: string;
    email: string;
};

type EstudanteOption = {
    id: string;
    nome: string;
    email: string;
};

const educadoresOptions: EducadorOption[] = [
    {
        id: educadorMock.educador.matricula,
        nome: educadorMock.educador.nome,
        email: educadorMock.educador.email,
    },
    // aqui depois você pode preencher com outros educadores vindos do backend
];

const estudantesOptions: EstudanteOption[] = [
    {
        id: String(estudanteMock.estudante.id),
        nome: estudanteMock.estudante.nome,
        email: estudanteMock.estudante.email,
    },
    // idem: adicionar mais estudantes reais depois
];

// ============================================================================
// TIPAGEM PARA AÇÃO PENDENTE (CONFIRMAÇÃO)
// ============================================================================

type PendingAction =
    | { kind: "NONE" }
    | { kind: "DOWNLOAD_GESTOR"; url?: string }
    | { kind: "EMAIL_EDUCADORES_TODOS" }
    | { kind: "EMAIL_EDUCADOR_UNICO"; educadorId: string }
    | { kind: "EMAIL_ESTUDANTES_TODOS" }
    | { kind: "EMAIL_ESTUDANTE_UNICO"; estudanteId: string };

// ============================================================================
// COMPONENTE DA TELA – USA OS MOCKS PARA GERAR OS PDFs / ENVIOS
// ============================================================================

export default function GestorRelatorios() {
    const [selectedEducador, setSelectedEducador] =
        useState<EducadorOption | null>(null);
    const [selectedEstudante, setSelectedEstudante] =
        useState<EstudanteOption | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>({
        kind: "NONE",
    });
    const [confirmAcceptedTerms, setConfirmAcceptedTerms] = useState(false);

    // TODO: integrar com backend para envio de e-mails com o PDF em anexo
    const enviarRelatorioEducadores = async (
        modo: "TODOS" | "UNICO",
        educadorId?: string,
    ) => {
        console.log("[TODO] Enviar relatório de educadores por e-mail", {
            modo,
            educadorId,
            copiaParaGestor: gestorMock.gestor.email,
        });
        // Exemplo futuro:
        // await api.post("/relatorios/educadores/email", { modo, educadorId });
    };

    const enviarRelatorioEstudantes = async (
        modo: "TODOS" | "UNICO",
        estudanteId?: string,
    ) => {
        console.log("[TODO] Enviar relatório de estudantes por e-mail", {
            modo,
            estudanteId,
            copiaParaGestor: gestorMock.gestor.email,
        });
        // Exemplo futuro:
        // await api.post("/relatorios/estudantes/email", { modo, estudanteId });
    };

    const openConfirm = (action: Exclude<PendingAction, { kind: "NONE" }>) => {
        setPendingAction(action);
        setConfirmAcceptedTerms(false); // sempre resetar ao abrir
        setConfirmOpen(true);
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false);
        setPendingAction({ kind: "NONE" });
        setConfirmAcceptedTerms(false);
    };

    const handleConfirmAction = async () => {
        switch (pendingAction.kind) {
            case "DOWNLOAD_GESTOR":
                if (pendingAction.url) {
                    const link = document.createElement("a");
                    link.href = pendingAction.url;
                    link.download = "relatorio-gestor.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.warn(
                        "URL do PDF ainda não está pronta. Tente novamente.",
                    );
                }
                break;

            case "EMAIL_EDUCADORES_TODOS":
                await enviarRelatorioEducadores("TODOS");
                break;

            case "EMAIL_EDUCADOR_UNICO":
                await enviarRelatorioEducadores(
                    "UNICO",
                    pendingAction.educadorId,
                );
                break;

            case "EMAIL_ESTUDANTES_TODOS":
                await enviarRelatorioEstudantes("TODOS");
                break;

            case "EMAIL_ESTUDANTE_UNICO":
                await enviarRelatorioEstudantes(
                    "UNICO",
                    pendingAction.estudanteId,
                );
                break;

            case "NONE":
            default:
                break;
        }

        setConfirmOpen(false);
        setPendingAction({ kind: "NONE" });
        setConfirmAcceptedTerms(false);
    };

    const getConfirmMessage = () => {
        switch (pendingAction.kind) {
            case "DOWNLOAD_GESTOR":
                return "Tem certeza que deseja gerar e baixar o relatório do gestor?";

            case "EMAIL_EDUCADORES_TODOS":
                return (
                    "ATENÇÃO: Esta ação irá gerar e enviar relatórios para TODOS os educadores da instituição.\n\n" +
                    "- Essa operação pode consumir MUITO processamento do servidor e da fila de e-mails;\n" +
                    "- Pode demorar para ser concluída;\n" +
                    "- Deve ser utilizada apenas em situações realmente necessárias.\n\n" +
                    "Ao confirmar, você declara estar ciente de que esta ação é pesada, não poderá ser desfeita " +
                    "e que a equipe técnica não se responsabiliza por disparos acidentais ou uso indevido desta função.\n\n" +
                    "Tem certeza que deseja continuar?"
                );

            case "EMAIL_EDUCADOR_UNICO":
                return "Tem certeza que deseja gerar e enviar o relatório para o educador selecionado, com cópia para o e-mail do gestor?";

            case "EMAIL_ESTUDANTES_TODOS":
                return (
                    "ATENÇÃO: Esta ação irá gerar e enviar relatórios para TODOS os estudantes da instituição.\n\n" +
                    "- Essa operação pode consumir MUITO processamento do servidor e da fila de e-mails;\n" +
                    "- Pode demorar para ser concluída;\n" +
                    "- Deve ser utilizada apenas em situações realmente necessárias.\n\n" +
                    "Ao confirmar, você declara estar ciente de que esta ação é pesada, não poderá ser desfeita " +
                    "e que a equipe técnica não se responsabiliza por disparos acidentais ou uso indevido desta função.\n\n" +
                    "Tem certeza que deseja continuar?"
                );

            case "EMAIL_ESTUDANTE_UNICO":
                return "Tem certeza que deseja gerar e enviar o relatório para o estudante selecionado, com cópia para o e-mail do gestor?";

            case "NONE":
            default:
                return "";
        }
    };

    const isHeavyAction =
        pendingAction.kind === "EMAIL_EDUCADORES_TODOS" ||
        pendingAction.kind === "EMAIL_ESTUDANTES_TODOS";

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Relatórios
            </Typography>

            <Card>
                <CardContent>
                    <Stack spacing={3}>
                        {/* ========================== BLOCO GESTOR ========================== */}
                        <Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Relatório Institucional – Gestor
                            </Typography>

                            <PDFDownloadLink
                                document={<ReportGestor {...gestorMock} />}
                                fileName="relatorio-gestor.pdf"
                            >
                                {({ loading, url }) => (
                                    <Button
                                        variant="contained"
                                        disabled={loading}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            openConfirm({
                                                kind: "DOWNLOAD_GESTOR",
                                                url: url || undefined,
                                            });
                                        }}
                                    >
                                        {loading
                                            ? "Gerando relatório do gestor..."
                                            : "Baixar Relatório do Gestor"}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                        </Box>

                        {/* ====================== BLOCO EDUCADORES (EMAIL) ====================== */}
                        <Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Relatórios de Educadores (envio por e-mail)
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 2 }}
                            >
                                Os PDFs serão gerados e enviados para o e-mail
                                de cada educador, sempre com cópia (CC) para o
                                e-mail do gestor: {gestorMock.gestor.email}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                                alignItems="center"
                            >
                                <Autocomplete<
                                    EducadorOption,
                                    false,
                                    false,
                                    false
                                >
                                    options={educadoresOptions}
                                    sx={{ minWidth: 280, maxWidth: 360 }}
                                    getOptionLabel={(option) =>
                                        `${option.nome} (${option.email})`
                                    }
                                    filterOptions={
                                        (options, state) =>
                                            options
                                                .filter((opt) => {
                                                    const q =
                                                        state.inputValue.toLowerCase();
                                                    return (
                                                        opt.nome
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        opt.email
                                                            .toLowerCase()
                                                            .includes(q)
                                                    );
                                                })
                                                .slice(0, 10) // máximo 10 pessoas no dropdown
                                    }
                                    value={selectedEducador}
                                    onChange={(_, newValue) =>
                                        setSelectedEducador(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Educador"
                                            size="small"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    noOptionsText="Nenhum educador encontrado"
                                />

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        openConfirm({
                                            kind: "EMAIL_EDUCADORES_TODOS",
                                        })
                                    }
                                >
                                    Enviar para TODOS os educadores
                                </Button>

                                <Button
                                    variant="outlined"
                                    disabled={!selectedEducador}
                                    onClick={() =>
                                        selectedEducador &&
                                        openConfirm({
                                            kind: "EMAIL_EDUCADOR_UNICO",
                                            educadorId: selectedEducador.id,
                                        })
                                    }
                                >
                                    Enviar para educador selecionado
                                </Button>
                            </Stack>
                        </Box>

                        {/* ===================== BLOCO ESTUDANTES (EMAIL) ===================== */}
                        <Box>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Relatórios de Estudantes (envio por e-mail)
                            </Typography>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ mb: 2 }}
                            >
                                Os PDFs serão gerados e enviados para o e-mail
                                de cada estudante, sempre com cópia (CC) para o
                                e-mail do gestor: {gestorMock.gestor.email}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={2}
                                flexWrap="wrap"
                                alignItems="center"
                            >
                                <Autocomplete<
                                    EstudanteOption,
                                    false,
                                    false,
                                    false
                                >
                                    options={estudantesOptions}
                                    sx={{ minWidth: 280, maxWidth: 360 }}
                                    getOptionLabel={(option) =>
                                        `${option.nome} (${option.email})`
                                    }
                                    filterOptions={
                                        (options, state) =>
                                            options
                                                .filter((opt) => {
                                                    const q =
                                                        state.inputValue.toLowerCase();
                                                    return (
                                                        opt.nome
                                                            .toLowerCase()
                                                            .includes(q) ||
                                                        opt.email
                                                            .toLowerCase()
                                                            .includes(q)
                                                    );
                                                })
                                                .slice(0, 10) // máximo 10 pessoas no dropdown
                                    }
                                    value={selectedEstudante}
                                    onChange={(_, newValue) =>
                                        setSelectedEstudante(newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Estudante"
                                            size="small"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    noOptionsText="Nenhum estudante encontrado"
                                />

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        openConfirm({
                                            kind: "EMAIL_ESTUDANTES_TODOS",
                                        })
                                    }
                                >
                                    Enviar para TODOS os estudantes
                                </Button>

                                <Button
                                    variant="outlined"
                                    disabled={!selectedEstudante}
                                    onClick={() =>
                                        selectedEstudante &&
                                        openConfirm({
                                            kind: "EMAIL_ESTUDANTE_UNICO",
                                            estudanteId: selectedEstudante.id,
                                        })
                                    }
                                >
                                    Enviar para estudante selecionado
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* ========================= DIALOG DE CONFIRMAÇÃO ========================= */}
            <Dialog open={confirmOpen} onClose={handleCancelConfirm}>
                <DialogTitle
                    sx={
                        isHeavyAction
                            ? { color: "error.main", fontWeight: "bold" }
                            : undefined
                    }
                >
                    {isHeavyAction
                        ? "Ação pesada – confirme com atenção"
                        : "Confirmar ação"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ whiteSpace: "pre-line" }}>
                        {getConfirmMessage()}
                    </DialogContentText>

                    {isHeavyAction && (
                        <FormControlLabel
                            sx={{ mt: 2 }}
                            control={
                                <Checkbox
                                    checked={confirmAcceptedTerms}
                                    onChange={(e) =>
                                        setConfirmAcceptedTerms(
                                            e.target.checked,
                                        )
                                    }
                                />
                            }
                            label="Li e concordo com os termos acima e assumo responsabilidade por esta ação."
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancelConfirm}>Não</Button>
                    <Button
                        onClick={handleConfirmAction}
                        autoFocus
                        color={isHeavyAction ? "error" : "primary"}
                        disabled={isHeavyAction && !confirmAcceptedTerms}
                    >
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

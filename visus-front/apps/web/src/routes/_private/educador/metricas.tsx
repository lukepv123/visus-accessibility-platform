import { PictureAsPdf, TableChart } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
    CartesianGrid,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { AreaLineChartWidget } from "../-components/dashboard/areaLineChartWidget";
import { BarChartWidget } from "../-components/dashboard/barChartWidget";
import { ColumnChartWidget } from "../-components/dashboard/columnChartWidget";
import { KpiCard } from "../-components/dashboard/kpiCard";
import { LineChartWidget } from "../-components/dashboard/lineChartWidget";
import { PieChartWidget } from "../-components/dashboard/pieChartWidget";
import { RadarChartWidget } from "../-components/dashboard/radarChartWidget";

export const Route = createFileRoute("/_private/educador/metricas")({
    component: EducadorMetricas,
});

// ============================================================================
// MOCK DATA – VISÃO DO EDUCADOR (até ter o backend real)
// ============================================================================

const NOME_EDUCADOR = "Prof. João Silva";

// Turmas sob responsabilidade do educador
const turmasEducador = [
    {
        nome: "Matemática - 1º Ano A",
        totalAlunos: 32,
        mediaNotas: 7.8,
        tarefasAtrasadas: 5,
        satisfacaoEstudantes: 8.4,
    },
    {
        nome: "Matemática - 1º Ano B",
        totalAlunos: 30,
        mediaNotas: 8.2,
        tarefasAtrasadas: 3,
        satisfacaoEstudantes: 8.9,
    },
    {
        nome: "Matemática - 2º Ano",
        totalAlunos: 28,
        mediaNotas: 6.9,
        tarefasAtrasadas: 8,
        satisfacaoEstudantes: 7.2,
    },
];

const alunosRiscoEducador = [
    {
        nome: "Lucas P. Viana",
        turma: "Matemática - 2º Ano",
        media: 5.2,
        atrasos: 4,
        engajamento: 3,
    },
    {
        nome: "Maria Oliveira",
        turma: "Matemática - 1º Ano A",
        media: 5.8,
        atrasos: 3,
        engajamento: 5,
    },
    {
        nome: "Pedro Santos",
        turma: "Matemática - 1º Ano B",
        media: 6.1,
        atrasos: 2,
        engajamento: 4,
    },
];

const distribuicaoNotasPorTurma = [
    {
        nome: "Matemática - 1º Ano A",
        faixa0a4: 2,
        faixa4a7: 10,
        faixa7a10: 20,
    },
    {
        nome: "Matemática - 1º Ano B",
        faixa0a4: 1,
        faixa4a7: 8,
        faixa7a10: 21,
    },
    {
        nome: "Matemática - 2º Ano",
        faixa0a4: 4,
        faixa4a7: 14,
        faixa7a10: 10,
    },
];

const tarefasStatusPorTurma = [
    {
        nome: "Matemática - 1º Ano A",
        noPrazo: 42,
        atrasadas: 5,
        naoEntregues: 3,
    },
    {
        nome: "Matemática - 1º Ano B",
        noPrazo: 38,
        atrasadas: 3,
        naoEntregues: 1,
    },
    {
        nome: "Matemática - 2º Ano",
        noPrazo: 30,
        atrasadas: 8,
        naoEntregues: 5,
    },
];

const evolucaoMediaGeralEducador = [
    { periodo: "2025/1", media: 7.3 },
    { periodo: "2025/2", media: 7.6 },
    { periodo: "2026/1", media: 7.8 },
    { periodo: "2026/2", media: 8.0 },
];

const atrasoPresencaTempoTurmas = [
    { periodo: "2025/1", atraso: 14, presenca: 92 },
    { periodo: "2025/2", atraso: 16, presenca: 90 },
    { periodo: "2026/1", atraso: 12, presenca: 94 },
    { periodo: "2026/2", atraso: 10, presenca: 95 },
];

const engajamentoSemanalTurmas = [
    {
        turma: "Matemática - 1º Ano A",
        semanas: [80, 72, 65, 90],
    },
    {
        turma: "Matemática - 1º Ano B",
        semanas: [75, 70, 68, 82],
    },
    {
        turma: "Matemática - 2º Ano",
        semanas: [60, 55, 50, 70],
    },
];

const engajamentoAlunosEducador = [
    {
        nome: "Aluno A",
        turma: "Matemática - 1º Ano A",
        engajamento: 3,
        media: 5.5,
    },
    {
        nome: "Aluno B",
        turma: "Matemática - 1º Ano A",
        engajamento: 5,
        media: 7.0,
    },
    {
        nome: "Aluno C",
        turma: "Matemática - 1º Ano B",
        engajamento: 7,
        media: 8.2,
    },
    {
        nome: "Aluno D",
        turma: "Matemática - 2º Ano",
        engajamento: 9,
        media: 9.0,
    },
];

const conclusaoPorPeriodoTurmas = [
    { periodo: "2025/1", conclusao: 78 },
    { periodo: "2025/2", conclusao: 80 },
    { periodo: "2026/1", conclusao: 83 },
    { periodo: "2026/2", conclusao: 85 },
];

const conclusaoPCDvsNaoPCDTurmas = [
    { grupo: "PCD", conclusao: 76 },
    { grupo: "Não PCD", conclusao: 82 },
];

const tempoRespostaAcessibilidadeTurmas = [
    { periodo: "2025/1", dias: 7 },
    { periodo: "2025/2", dias: 6 },
    { periodo: "2026/1", dias: 5 },
    { periodo: "2026/2", dias: 4 },
];

const npsPorPeriodoEducador = [
    { periodo: "2025/1", nps: 30 },
    { periodo: "2025/2", nps: 35 },
    { periodo: "2026/1", nps: 40 },
    { periodo: "2026/2", nps: 45 },
];

const PIE_COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800"];

// ============================================================================
// COMPONENTE PRINCIPAL – DASHBOARD DO EDUCADOR
// ============================================================================

export default function EducadorMetricas() {
    // Filtro de período e de turma (turma === disciplina)
    const [periodoSelecionado, setPeriodoSelecionado] = useState<
        "30d" | "semestre"
    >("30d");
    const [turmaSelecionada, setTurmaSelecionada] = useState<string | "todas">(
        "todas",
    );

    // ===================== BASE FILTRADA POR TURMA =====================

    const turmasVisiveis =
        turmaSelecionada === "todas"
            ? turmasEducador
            : turmasEducador.filter((t) => t.nome === turmaSelecionada);

    const distribuicaoNotasVisivel =
        turmaSelecionada === "todas"
            ? distribuicaoNotasPorTurma
            : distribuicaoNotasPorTurma.filter(
                  (t) => t.nome === turmaSelecionada,
              );

    const tarefasStatusVisivel =
        turmaSelecionada === "todas"
            ? tarefasStatusPorTurma
            : tarefasStatusPorTurma.filter((t) => t.nome === turmaSelecionada);

    const alunosRiscoVisiveis =
        turmaSelecionada === "todas"
            ? alunosRiscoEducador
            : alunosRiscoEducador.filter((a) => a.turma === turmaSelecionada);

    const engajamentoSemanalVisivel =
        turmaSelecionada === "todas"
            ? engajamentoSemanalTurmas
            : engajamentoSemanalTurmas.filter(
                  (linha) => linha.turma === turmaSelecionada,
              );

    const engajamentoAlunosVisivel =
        turmaSelecionada === "todas"
            ? engajamentoAlunosEducador
            : engajamentoAlunosEducador.filter(
                  (a) => a.turma === turmaSelecionada,
              );

    // ===================== CÁLCULOS BASE (USANDO TURMAS FILTRADAS) =====================

    const totalTurmas = turmasVisiveis.length;
    const totalAlunosMinhasTurmas = turmasVisiveis.reduce(
        (acc, t) => acc + t.totalAlunos,
        0,
    );

    const somaPonderadaNotas = turmasVisiveis.reduce(
        (acc, t) => acc + t.mediaNotas * t.totalAlunos,
        0,
    );
    const mediaGeralNotasEducador =
        totalAlunosMinhasTurmas > 0
            ? somaPonderadaNotas / totalAlunosMinhasTurmas
            : 0;

    const totalTarefasAtrasadasEducador = turmasVisiveis.reduce(
        (acc, t) => acc + t.tarefasAtrasadas,
        0,
    );
    const totalTarefasEstimadoEducador = Math.max(
        totalTarefasAtrasadasEducador + 1,
        Math.round(totalTarefasAtrasadasEducador / 0.15),
    );
    const totalTarefasEntreguesEducador =
        totalTarefasEstimadoEducador - totalTarefasAtrasadasEducador;
    const taxaAtrasoEducador =
        (totalTarefasAtrasadasEducador / totalTarefasEstimadoEducador) * 100;

    const metaNota = 7;
    const turmasSaudaveis = turmasVisiveis.filter(
        (t) => t.mediaNotas >= metaNota && t.tarefasAtrasadas <= 3,
    ).length;
    const turmasCriticas = totalTurmas - turmasSaudaveis;
    const turmasAbaixoMeta = turmasVisiveis.filter(
        (t) => t.mediaNotas < metaNota,
    ).length;
    const percentualTurmasAbaixoMeta =
        totalTurmas > 0 ? (turmasAbaixoMeta / totalTurmas) * 100 : 0;

    const aprovadosTotal = distribuicaoNotasVisivel.reduce(
        (acc, t) => acc + t.faixa4a7 + t.faixa7a10,
        0,
    );
    const alunosAvaliadosTotal = distribuicaoNotasVisivel.reduce(
        (acc, t) => acc + t.faixa0a4 + t.faixa4a7 + t.faixa7a10,
        0,
    );
    const taxaAprovacaoMediaEducador =
        alunosAvaliadosTotal > 0
            ? (aprovadosTotal / alunosAvaliadosTotal) * 100
            : 0;

    const turmaMenorMedia =
        turmasVisiveis.length > 0
            ? turmasVisiveis.reduce((prev, curr) =>
                  curr.mediaNotas < prev.mediaNotas ? curr : prev,
              )
            : turmasEducador[0];

    const turmaMaisAtrasos =
        turmasVisiveis.length > 0
            ? turmasVisiveis.reduce((prev, curr) =>
                  curr.tarefasAtrasadas > prev.tarefasAtrasadas ? curr : prev,
              )
            : turmasEducador[0];

    const alunosEmRiscoEducadorCount = alunosRiscoVisiveis.length;
    const percentualAlunosRiscoEducador =
        totalAlunosMinhasTurmas > 0
            ? (alunosEmRiscoEducadorCount / totalAlunosMinhasTurmas) * 100
            : 0;

    const alunoMaisCriticoEducador =
        alunosRiscoVisiveis.length > 0
            ? alunosRiscoVisiveis.reduce((prev, curr) =>
                  curr.atrasos > prev.atrasos && curr.media < prev.media
                      ? curr
                      : prev,
              )
            : null;

    const riscoNotas = percentualTurmasAbaixoMeta;
    const riscoAtrasos = taxaAtrasoEducador;
    const riscoAlunos = percentualAlunosRiscoEducador;
    const indiceRiscoMinhasTurmas = Math.min(
        100,
        riscoNotas * 0.4 + riscoAtrasos * 0.35 + riscoAlunos * 0.25,
    );

    const taxaPresencaGeralTurmas = 93;
    const taxaParticipacaoOnlineTurmas = 78;
    const freqLoginsMediaTurmas = 4.3;
    const tempoUsoMedioHorasTurmas = 1.6;

    const taxaConclusaoTurmas = 82;
    const percAlunosOnTrackTurmas = 74;

    const adocaoAcessibilidadePctTurmas = 24;
    const taxaConclusaoPCDTurmas = 76;
    const taxaConclusaoNaoPCDTurmas = 82;
    const tempoMedioRespostaAcessibilidadeTurmas = 5;

    const csatEstudantesTurmas = 4.3;
    const npsAcademicoTurmas = 42;

    const dadosMediaPorTurma = turmasVisiveis.map((t) => ({
        nome: t.nome,
        media: t.mediaNotas,
    }));

    const dadosAtrasosPorTurma = turmasVisiveis.map((t) => ({
        nome: t.nome,
        atrasos: t.tarefasAtrasadas,
    }));

    const dadosPizzaSaudeTurmas = [
        { name: "Saudáveis", value: turmasSaudaveis },
        { name: "Críticas", value: turmasCriticas },
    ];

    const alunosRiscoPorTurma = Object.values(
        alunosRiscoVisiveis.reduce(
            (acc, a) => {
                if (!acc[a.turma]) {
                    acc[a.turma] = { turma: a.turma, quantidade: 0 };
                }
                acc[a.turma].quantidade += 1;
                return acc;
            },
            {} as Record<string, { turma: string; quantidade: number }>,
        ),
    );

    const atrasosXMediaPorTurma = turmasVisiveis.map((t) => ({
        turma: t.nome,
        atrasos: t.tarefasAtrasadas,
        media: t.mediaNotas,
    }));

    const turmaRadar = turmasVisiveis[0] ?? turmasEducador[0];
    const radarDataTurma = [
        {
            eixo: "Nota",
            valor: turmaRadar.mediaNotas * 10,
        },
        {
            eixo: "Presença",
            valor: taxaPresencaGeralTurmas,
        },
        {
            eixo: "Atrasos (invertido)",
            valor: Math.max(0, 100 - turmaRadar.tarefasAtrasadas * 5),
        },
        {
            eixo: "Conclusão",
            valor: taxaConclusaoTurmas,
        },
        {
            eixo: "Satisfação",
            valor: turmaRadar.satisfacaoEstudantes * 10,
        },
    ];

    const getHeatmapColor = (valor: number) => {
        const base = 0.2 + (valor / 100) * 0.6;
        return `rgba(33,150,243,${base})`;
    };

    const CHART_HEIGHT = 340;

    // ===================== STORYTELLING – TÍTULOS DINÂMICOS =====================

    const isTodasTurmas = turmaSelecionada === "todas";

    const tituloVisaoGeral = isTodasTurmas
        ? "Visão geral – minhas turmas"
        : "Visão geral – turma selecionada";

    const tituloDesempenho = isTodasTurmas
        ? "Como está o desempenho nas minhas turmas"
        : "Como está o desempenho da turma selecionada";

    const tituloTarefas = isTodasTurmas
        ? "Rotina de tarefas, atrasos e presença nas minhas turmas"
        : "Rotina de tarefas, atrasos e presença da turma selecionada";

    const tituloRisco = isTodasTurmas
        ? "Quem precisa de mais atenção nas minhas turmas"
        : "Quem precisa de mais atenção nesta turma";

    const tituloConclusao = isTodasTurmas
        ? "Conclusão e acessibilidade nas minhas turmas"
        : "Conclusão e acessibilidade na turma selecionada";

    const tituloExperiencia = isTodasTurmas
        ? "Como os estudantes avaliam minhas turmas"
        : "Como os estudantes avaliam esta turma";

    const subtituloTurmaSelecionada = !isTodasTurmas ? turmaSelecionada : null;

    // Handlers export
    const handleExportPdf = () => {
        console.log("Exportar dashboard do educador em PDF (placeholder)");
    };

    const handleExportExcel = () => {
        console.log("Exportar dados do educador em Excel (placeholder)");
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* HEADER: título + filtros + export */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                        Métricas
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Educador: <strong>{NOME_EDUCADOR}</strong>
                    </Typography>
                </Box>

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}
                >
                    {/* Filtro de turma (disciplina) */}
                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Turma / disciplina:
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 220 }}>
                            <Select
                                value={turmaSelecionada}
                                onChange={(e) =>
                                    setTurmaSelecionada(
                                        e.target.value as string | "todas",
                                    )
                                }
                            >
                                <MenuItem value="todas">
                                    Todas as turmas
                                </MenuItem>
                                {turmasEducador.map((t) => (
                                    <MenuItem key={t.nome} value={t.nome}>
                                        {t.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Filtro de período */}
                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Período:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant={
                                    periodoSelecionado === "30d"
                                        ? "contained"
                                        : "text"
                                }
                                onClick={() => setPeriodoSelecionado("30d")}
                            >
                                Últimos 30 dias
                            </Button>
                            <Button
                                size="small"
                                variant={
                                    periodoSelecionado === "semestre"
                                        ? "contained"
                                        : "text"
                                }
                                onClick={() =>
                                    setPeriodoSelecionado("semestre")
                                }
                            >
                                Semestre
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Exportações */}
                    <Paper
                        elevation={0}
                        variant="outlined"
                        sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            Exportar:
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PictureAsPdf />}
                                onClick={handleExportPdf}
                            >
                                PDF
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<TableChart />}
                                onClick={handleExportExcel}
                            >
                                Excel
                            </Button>
                        </Stack>
                    </Paper>
                </Stack>
            </Box>

            {/* ================================================================
         GRUPO 1 – VISÃO GERAL DAS MINHAS TURMAS
      ================================================================ */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ mb: subtituloTurmaSelecionada ? 0.5 : 2 }}
                            >
                                {tituloVisaoGeral}
                            </Typography>

                            {subtituloTurmaSelecionada && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Turma:{" "}
                                    <strong>{subtituloTurmaSelecionada}</strong>
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Aqui você enxerga o tamanho da sua operação,
                                onde estão os principais riscos e como suas
                                turmas se distribuem entre saudáveis e críticas.
                            </Typography>

                            {/*
                Ajuste: esconder "Turma com mais atrasos" quando houver filtro de turma.
                Montamos o array de KPIs dinamicamente e só incluímos esse card
                quando isTodasTurmas === true.
              */}
                            <Grid container spacing={2}>
                                {[
                                    {
                                        label: "Turmas ativas (filtro)",
                                        valor: totalTurmas,
                                    },
                                    {
                                        label: "Alunos nas minhas turmas (filtro)",
                                        valor: totalAlunosMinhasTurmas,
                                    },
                                    {
                                        label: "Média geral de notas",
                                        valor: mediaGeralNotasEducador.toFixed(
                                            1,
                                        ),
                                    },
                                    {
                                        label: "Alunos em risco (amostra)",
                                        valor: `${alunosEmRiscoEducadorCount} (${percentualAlunosRiscoEducador.toFixed(
                                            1,
                                        )}%)`,
                                    },
                                    isTodasTurmas
                                        ? {
                                              label: "Turma com mais atrasos",
                                              valor: `${turmaMaisAtrasos.nome} (${turmaMaisAtrasos.tarefasAtrasadas} atrasos)`,
                                          }
                                        : null,
                                    {
                                        label: "Índice de risco das minhas turmas",
                                        valor: `${indiceRiscoMinhasTurmas.toFixed(0)}/100`,
                                    },
                                ]
                                    .filter(
                                        (
                                            kpi,
                                        ): kpi is {
                                            label: string;
                                            valor: string | number;
                                        } => kpi !== null,
                                    )
                                    .map((kpi) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={4}
                                            key={kpi.label}
                                        >
                                            <KpiCard
                                                label={kpi.label}
                                                value={kpi.valor}
                                            />
                                        </Grid>
                                    ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ================================================================
         GRUPO 2 – DESEMPENHO ACADÊMICO POR TURMA
      ================================================================ */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ mb: subtituloTurmaSelecionada ? 0.5 : 2 }}
                            >
                                {tituloDesempenho}
                            </Typography>

                            {subtituloTurmaSelecionada && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Turma:{" "}
                                    <strong>{subtituloTurmaSelecionada}</strong>
                                </Typography>
                            )}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Veja em quais turmas as notas estão melhores,
                                onde há mais concentração de alunos com notas
                                baixas e como está a “saúde geral” da turma
                                escolhida.
                            </Typography>

                            <Grid container spacing={5}>
                                {/* Média por turma */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Média de notas por turma
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Compare a média de cada turma para
                                            identificar onde o desempenho está
                                            mais forte ou abaixo da meta.
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <ColumnChartWidget
                                                data={dadosMediaPorTurma}
                                                categoryKey="nome"
                                                series={[
                                                    {
                                                        dataKey: "media",
                                                        name: "Média",
                                                    },
                                                ]}
                                                yDomain={[0, 10]}
                                            />
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Turma com menor média:{" "}
                                            {turmaMenorMedia.nome} (
                                            {turmaMenorMedia.mediaNotas.toFixed(
                                                1,
                                            )}
                                            ).
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Distribuição de notas por turma */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Distribuição de notas por turma
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Entenda quantos alunos estão em cada
                                            faixa de nota (0–4, 4–7, 7–10) para
                                            avaliar o risco e o potencial de
                                            recuperação.
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <ColumnChartWidget
                                                data={distribuicaoNotasVisivel}
                                                categoryKey="nome"
                                                series={[
                                                    {
                                                        dataKey: "faixa0a4",
                                                        name: "Notas 0–4",
                                                        stackId: "a",
                                                    },
                                                    {
                                                        dataKey: "faixa4a7",
                                                        name: "Notas 4–7",
                                                        stackId: "a",
                                                    },
                                                    {
                                                        dataKey: "faixa7a10",
                                                        name: "Notas 7–10",
                                                        stackId: "a",
                                                    },
                                                ]}
                                            />
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Taxa média de aprovação estimada:{" "}
                                            {taxaAprovacaoMediaEducador.toFixed(
                                                1,
                                            )}
                                            %.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Radar – saúde de uma turma */}
                                <Grid item xs={12}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                            minWidth: 470,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Saúde da turma (perfil radar)
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Turma:{" "}
                                            <strong>{turmaRadar.nome}</strong>
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Combine nota, presença, atrasos,
                                            conclusão e satisfação para ter uma
                                            visão 360º da saúde acadêmica da
                                            turma.
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 1,
                                                height: CHART_HEIGHT,
                                                width: "100%",
                                            }}
                                        >
                                            <RadarChartWidget
                                                data={radarDataTurma}
                                                angleKey="eixo"
                                                valueKey="valor"
                                                valueLabel="Saúde"
                                                maxValue={100}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Saúde das turmas (saudáveis x críticas) */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Saúde das minhas turmas (saudáveis x
                                            críticas)
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Quantas turmas estão dentro de um
                                            padrão saudável e quantas exigem
                                            intervenção mais intensa.
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <PieChartWidget
                                                data={dadosPizzaSaudeTurmas}
                                                nameKey="name"
                                                valueKey="value"
                                                outerRadius={80}
                                                colors={PIE_COLORS}
                                            />
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Turmas saudáveis: {turmasSaudaveis}{" "}
                                            • Críticas: {turmasCriticas}.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Evolução da média geral (minhas turmas) */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1.5,
                                            minWidth: 260,
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            Evolução da média geral das minhas
                                            turmas
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Observe se, ao longo dos períodos, a
                                            sua prática está elevando o
                                            desempenho global.
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <LineChartWidget
                                                data={
                                                    evolucaoMediaGeralEducador
                                                }
                                                xKey="periodo"
                                                series={[
                                                    {
                                                        dataKey: "media",
                                                        name: "Média geral",
                                                    },
                                                ]}
                                                yDomain={[0, 10]}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* ================================================================
         GRUPO 3 – TAREFAS, ATRASOS E PRESENÇA
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {tituloTarefas}
                    </Typography>

                    {subtituloTurmaSelecionada && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Turma: <strong>{subtituloTurmaSelecionada}</strong>
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Esta seção mostra se a rotina de tarefas e a presença
                        estão sustentando o aprendizado ou se existe um acúmulo
                        de pendências.
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Taxa geral de atraso (filtro)",
                                valor: `${taxaAtrasoEducador.toFixed(1)}%`,
                            },
                            {
                                label: "Tarefas entregues (estimadas)",
                                valor: totalTarefasEntreguesEducador,
                            },
                            {
                                label: "Taxa de participação online (est.)",
                                valor: `${taxaParticipacaoOnlineTurmas}%`,
                            },
                            {
                                label: "Tempo médio de uso da plataforma",
                                valor: `${tempoUsoMedioHorasTurmas} h/dia`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Ranking de atrasos por turma */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Ranking de atrasos por turma
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Identifique rapidamente quais turmas mais
                                    acumulam atrasos e podem precisar de reforço
                                    na gestão de prazos.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <BarChartWidget
                                        data={[...dadosAtrasosPorTurma].sort(
                                            (a, b) => b.atrasos - a.atrasos,
                                        )}
                                        categoryKey="nome"
                                        series={[
                                            {
                                                dataKey: "atrasos",
                                                name: "Atrasos",
                                            },
                                        ]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Status de tarefas por turma */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Status das tarefas por turma
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Compare tarefas entregues no prazo,
                                    atrasadas e não entregues para avaliar
                                    disciplina e acompanhamento da turma.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={tarefasStatusVisivel}
                                        categoryKey="nome"
                                        series={[
                                            {
                                                dataKey: "noPrazo",
                                                name: "Entregues no prazo",
                                                stackId: "a",
                                            },
                                            {
                                                dataKey: "atrasadas",
                                                name: "Atrasadas",
                                                stackId: "a",
                                            },
                                            {
                                                dataKey: "naoEntregues",
                                                name: "Não entregues",
                                                stackId: "a",
                                            },
                                        ]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Atraso x presença ao longo do tempo (minhas turmas) */}
                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Taxa de atraso x taxa de presença (minhas
                                    turmas)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Veja se períodos com mais atrasos também
                                    apresentam queda de presença, indicando
                                    momentos críticos do calendário.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={atrasoPresencaTempoTurmas}
                                        xKey="periodo"
                                        series={[
                                            {
                                                dataKey: "atraso",
                                                name: "% atraso",
                                            },
                                            {
                                                dataKey: "presenca",
                                                name: "% presença",
                                            },
                                        ]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ================================================================
         GRUPO 4 – RISCO ESTUDANTIL & ENGAJAMENTO
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {tituloRisco}
                    </Typography>

                    {subtituloTurmaSelecionada && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Turma: <strong>{subtituloTurmaSelecionada}</strong>
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Aqui você enxerga onde concentrar seu tempo: quais
                        turmas e alunos pedem intervenção mais urgente e como
                        engajamento se relaciona com desempenho.
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Alunos em risco (filtro)",
                                valor: `${alunosEmRiscoEducadorCount} (${percentualAlunosRiscoEducador.toFixed(
                                    1,
                                )}%)`,
                            },
                            {
                                label: "Caso mais crítico",
                                valor: alunoMaisCriticoEducador
                                    ? `${alunoMaisCriticoEducador.nome} (${alunoMaisCriticoEducador.media.toFixed(
                                          1,
                                      )}, ${alunoMaisCriticoEducador.atrasos} atrasos)`
                                    : "-",
                            },
                            {
                                label: "Taxa de presença (minhas turmas)",
                                valor: `${taxaPresencaGeralTurmas}%`,
                            },
                            {
                                label: "Freq. média de logins",
                                valor: `${freqLoginsMediaTurmas.toFixed(1)}/sem.`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Alunos em risco por turma */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Alunos em risco por turma
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Veja em quais turmas há mais concentração de
                                    alunos em risco para planejar ações focadas.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={alunosRiscoPorTurma}
                                        categoryKey="turma"
                                        series={[
                                            {
                                                dataKey: "quantidade",
                                                name: "Alunos em risco",
                                            },
                                        ]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Atrasos x média por turma (dispersão) */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Atrasos x média de notas (por turma)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Cada ponto mostra uma turma. Quanto mais à
                                    direita e mais abaixo, maior o risco
                                    combinado de atraso e baixa média.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <ScatterChart>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                type="number"
                                                dataKey="atrasos"
                                                name="Atrasos"
                                                unit=""
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="media"
                                                name="Média"
                                                unit=""
                                                domain={[0, 10]}
                                            />
                                            <Tooltip
                                                cursor={{
                                                    strokeDasharray: "3 3",
                                                }}
                                            />
                                            <Scatter
                                                data={atrasosXMediaPorTurma}
                                                name="Turma"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Engajamento x desempenho por aluno */}
                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Engajamento x desempenho (meus alunos)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Relacione o nível de engajamento com a média
                                    de notas para entender o impacto da
                                    participação no resultado.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <ScatterChart>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                type="number"
                                                dataKey="engajamento"
                                                name="Engajamento"
                                                unit=""
                                            />
                                            <YAxis
                                                type="number"
                                                dataKey="media"
                                                name="Média"
                                                unit=""
                                                domain={[0, 10]}
                                            />
                                            <Tooltip
                                                cursor={{
                                                    strokeDasharray: "3 3",
                                                }}
                                            />
                                            <Scatter
                                                data={engajamentoAlunosVisivel}
                                                name="Aluno"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Heatmap de engajamento semanal */}
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Heatmap de engajamento semanal por turma
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Linhas = turmas, colunas = semanas, intensidade da cor =
                        nível de engajamento. Use para enxergar quedas de
                        engajamento ao longo do tempo.
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        {engajamentoSemanalVisivel.length > 0 && (
                            <>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Turma
                                        </Typography>
                                    </Grid>
                                    {engajamentoSemanalVisivel[0].semanas.map(
                                        (_, idx) => (
                                            <Grid
                                                item
                                                xs={Math.floor(
                                                    9 /
                                                        engajamentoSemanalVisivel[0]
                                                            .semanas.length,
                                                )}
                                                key={idx}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: "block",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Semana {idx + 1}
                                                </Typography>
                                            </Grid>
                                        ),
                                    )}
                                </Grid>

                                {engajamentoSemanalVisivel.map((linha) => (
                                    <Grid
                                        container
                                        key={linha.turma}
                                        sx={{ alignItems: "center", mt: 1 }}
                                    >
                                        <Grid item xs={3}>
                                            <Typography variant="body2">
                                                {linha.turma}
                                            </Typography>
                                        </Grid>
                                        {linha.semanas.map((valor, idx) => (
                                            <Grid
                                                item
                                                xs={Math.floor(
                                                    9 / linha.semanas.length,
                                                )}
                                                key={idx}
                                                sx={{ px: 0.5 }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: 26,
                                                        borderRadius: 1,
                                                        bgcolor:
                                                            getHeatmapColor(
                                                                valor,
                                                            ),
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: "#fff" }}
                                                    >
                                                        {valor}%
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                ))}
                            </>
                        )}
                    </Paper>
                </CardContent>
            </Card>

            {/* ================================================================
         GRUPO 5 – CONCLUSÃO & ACESSIBILIDADE
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {tituloConclusao}
                    </Typography>

                    {subtituloTurmaSelecionada && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Turma: <strong>{subtituloTurmaSelecionada}</strong>
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Conclusão de trilhas, uso de recursos de acessibilidade
                        e tempo de resposta mostram se a turma está avançando
                        bem e se os alunos PCD estão sendo apoiados.
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Taxa de conclusão nas minhas turmas",
                                valor: `${taxaConclusaoTurmas}%`,
                            },
                            {
                                label: "% de alunos no prazo (on track)",
                                valor: `${percAlunosOnTrackTurmas}%`,
                            },
                            {
                                label: "Adoção de recursos de acessibilidade",
                                valor: `${adocaoAcessibilidadePctTurmas}%`,
                            },
                            {
                                label: "Tempo médio de resposta (acessibilidade)",
                                valor: `${tempoMedioRespostaAcessibilidadeTurmas} dias`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Conclusão PCD x não PCD */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Conclusão PCD x não PCD (minhas turmas)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Compare o desempenho de alunos PCD e não PCD
                                    para garantir equidade e efetividade dos
                                    recursos oferecidos.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={conclusaoPCDvsNaoPCDTurmas}
                                        categoryKey="grupo"
                                        series={[
                                            {
                                                dataKey: "conclusao",
                                                name: "Conclusão",
                                            },
                                        ]}
                                        yDomain={[0, 100]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Conclusão por período (minhas turmas) */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Taxa de conclusão por período (minhas
                                    turmas)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Entenda se, de um semestre para outro, os
                                    alunos estão finalizando mais (ou menos)
                                    atividades e trilhas.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <AreaLineChartWidget
                                        data={conclusaoPorPeriodoTurmas}
                                        xKey="periodo"
                                        yKey="conclusao"
                                        name="Conclusão"
                                        yDomain={[0, 100]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ================================================================
         GRUPO 6 – EXPERIÊNCIA DOS ESTUDANTES COM O EDUCADOR
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {tituloExperiencia}
                    </Typography>

                    {subtituloTurmaSelecionada && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Turma: <strong>{subtituloTurmaSelecionada}</strong>
                        </Typography>
                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Aqui você entende como os estudantes percebem sua
                        prática: satisfação com as aulas e NPS acadêmico ao
                        longo do tempo.
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "CSAT – estudantes (minhas turmas)",
                                valor: `${csatEstudantesTurmas.toFixed(1)}/5`,
                            },
                            {
                                label: "NPS acadêmico (minhas turmas)",
                                valor: `${npsAcademicoTurmas}`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={4} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Satisfação dos estudantes por turma */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Satisfação dos estudantes por turma
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Entenda em quais turmas os alunos declaram
                                    estar mais satisfeitos com a experiência de
                                    aula.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={turmasVisiveis.map((t) => ({
                                            turma: t.nome,
                                            satisfacao: t.satisfacaoEstudantes,
                                        }))}
                                        categoryKey="turma"
                                        series={[
                                            {
                                                dataKey: "satisfacao",
                                                name: "Satisfação",
                                            },
                                        ]}
                                        yDomain={[0, 10]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Evolução do NPS das minhas turmas */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.5,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Evolução do NPS nas minhas turmas
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Acompanhe se, ao longo dos períodos, aumenta
                                    a proporção de alunos que recomendariam suas
                                    aulas.
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={npsPorPeriodoEducador}
                                        xKey="periodo"
                                        series={[
                                            { dataKey: "nps", name: "NPS" },
                                        ]}
                                        yDomain={[-100, 100]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

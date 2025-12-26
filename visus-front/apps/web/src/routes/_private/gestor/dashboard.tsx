import { PictureAsPdf, TableChart } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Paper,
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

export const Route = createFileRoute("/_private/gestor/dashboard")({
    component: GestorDashboard,
});

// ============================================================================
// MOCK DATA – AMOSTRA (até ter o backend real)
// ============================================================================

const disciplinas = [
    {
        nome: "Matemática - 1º Ano",
        educador: "Prof. João Silva",
        totalAlunos: 32,
        mediaNotas: 7.8,
        tarefasAtrasadas: 5,
        satisfacaoEstudantes: 8.4,
        satisfacaoEducador: 8.0,
    },
    {
        nome: "Português - 1º Ano",
        educador: "Profa. Ana Souza",
        totalAlunos: 30,
        mediaNotas: 8.2,
        tarefasAtrasadas: 2,
        satisfacaoEstudantes: 8.9,
        satisfacaoEducador: 8.6,
    },
    {
        nome: "História - 2º Ano",
        educador: "Prof. Carlos Lima",
        totalAlunos: 28,
        mediaNotas: 6.9,
        tarefasAtrasadas: 8,
        satisfacaoEstudantes: 7.2,
        satisfacaoEducador: 7.8,
    },
];

const alunosRisco = [
    {
        nome: "Lucas P. Viana",
        disciplina: "História - 2º Ano",
        media: 5.2,
        atrasos: 4,
        engajamento: 3,
    },
    {
        nome: "Maria Oliveira",
        disciplina: "Matemática - 1º Ano",
        media: 5.8,
        atrasos: 3,
        engajamento: 5,
    },
    {
        nome: "Pedro Santos",
        disciplina: "Português - 1º Ano",
        media: 6.1,
        atrasos: 2,
        engajamento: 4,
    },
];

const evolucaoMediaGeral = [
    { periodo: "2025/1", media: 7.3 },
    { periodo: "2025/2", media: 7.6 },
    { periodo: "2026/1", media: 7.8 },
    { periodo: "2026/2", media: 8.0 },
];

const distribuicaoNotasPorDisciplina = [
    {
        nome: "Matemática - 1º Ano",
        faixa0a4: 2,
        faixa4a7: 10,
        faixa7a10: 20,
    },
    {
        nome: "Português - 1º Ano",
        faixa0a4: 1,
        faixa4a7: 8,
        faixa7a10: 21,
    },
    {
        nome: "História - 2º Ano",
        faixa0a4: 4,
        faixa4a7: 14,
        faixa7a10: 10,
    },
];

const tarefasStatusPorDisciplina = [
    {
        nome: "Matemática - 1º Ano",
        noPrazo: 42,
        atrasadas: 5,
        naoEntregues: 3,
    },
    {
        nome: "Português - 1º Ano",
        noPrazo: 38,
        atrasadas: 2,
        naoEntregues: 1,
    },
    {
        nome: "História - 2º Ano",
        noPrazo: 30,
        atrasadas: 8,
        naoEntregues: 5,
    },
];

const atrasoPresencaTempo = [
    { periodo: "2025/1", atraso: 14, presenca: 92 },
    { periodo: "2025/2", atraso: 16, presenca: 90 },
    { periodo: "2026/1", atraso: 12, presenca: 94 },
    { periodo: "2026/2", atraso: 10, presenca: 95 },
];

const retencaoPorCoorte = [
    { periodo: "Ano 1", coorte2023: 100, coorte2024: 100 },
    { periodo: "Ano 2", coorte2023: 92, coorte2024: 95 },
    { periodo: "Ano 3", coorte2023: 87, coorte2024: 0 },
];

const conclusaoPorPeriodo = [
    { periodo: "2025/1", conclusao: 78 },
    { periodo: "2025/2", conclusao: 80 },
    { periodo: "2026/1", conclusao: 83 },
    { periodo: "2026/2", conclusao: 85 },
];

const engajamentoSemanal = [
    {
        disciplina: "Matemática",
        semanas: [80, 72, 65, 90],
    },
    {
        disciplina: "Português",
        semanas: [75, 70, 68, 82],
    },
    {
        disciplina: "História",
        semanas: [60, 55, 50, 70],
    },
];

const engajamentoAlunos = [
    { nome: "Aluno A", engajamento: 3, media: 5.5 },
    { nome: "Aluno B", engajamento: 5, media: 7.0 },
    { nome: "Aluno C", engajamento: 7, media: 8.2 },
    { nome: "Aluno D", engajamento: 9, media: 9.0 },
];

const satisfacaoEstudantesPorDisciplina = disciplinas.map((d) => ({
    disciplina: d.nome,
    satisfacao: d.satisfacaoEstudantes,
}));

const satisfacaoEducadoresPorArea = [
    { area: "Linguagens", satisfacao: 8.6 },
    { area: "Matemática", satisfacao: 8.0 },
    { area: "Ciências Humanas", satisfacao: 7.5 },
];

const npsPorPeriodo = [
    { periodo: "2025/1", nps: 32 },
    { periodo: "2025/2", nps: 38 },
    { periodo: "2026/1", nps: 42 },
    { periodo: "2026/2", nps: 48 },
];

const conclusaoPCDvsNaoPCD = [
    { grupo: "PCD", conclusao: 76 },
    { grupo: "Não PCD", conclusao: 82 },
];

const tempoRespostaAcessibilidade = [
    { periodo: "2025/1", dias: 7 },
    { periodo: "2025/2", dias: 6 },
    { periodo: "2026/1", dias: 5 },
    { periodo: "2026/2", dias: 4 },
];

const adocaoAcessibilidadePizza = [
    { name: "Usam recursos", value: 24 },
    { name: "Não usam", value: 76 },
];

const PIE_COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800"];

export default function GestorDashboard() {
    // ========================================================================
    // CÁLCULOS DE INDICADORES (baseados na amostra)
    // ========================================================================

    const totalEstudantes = disciplinas.reduce(
        (acc, d) => acc + d.totalAlunos,
        0,
    );
    const totalEducadores = new Set(disciplinas.map((d) => d.educador)).size;
    const totalDisciplinas = disciplinas.length;

    const relAlunoProfessor =
        totalEducadores > 0 ? totalEstudantes / totalEducadores : 0;

    // Média geral ponderada
    const somaPonderadaNotas = disciplinas.reduce(
        (acc, d) => acc + d.mediaNotas * d.totalAlunos,
        0,
    );
    const mediaGeralNotas =
        totalEstudantes > 0 ? somaPonderadaNotas / totalEstudantes : 0;

    // Atrasos
    const totalTarefasAtrasadas = disciplinas.reduce(
        (acc, d) => acc + d.tarefasAtrasadas,
        0,
    );
    const totalTarefasEstimado = Math.max(
        totalTarefasAtrasadas + 1,
        Math.round(totalTarefasAtrasadas / 0.15),
    );
    const totalTarefasEntregues = totalTarefasEstimado - totalTarefasAtrasadas;
    const taxaAtraso = (totalTarefasAtrasadas / totalTarefasEstimado) * 100;

    // Disciplinas saudáveis / críticas / abaixo da meta
    const metaNota = 7;
    const disciplinasSaudaveis = disciplinas.filter(
        (d) => d.mediaNotas >= metaNota && d.tarefasAtrasadas <= 3,
    ).length;
    const disciplinasCriticas = totalDisciplinas - disciplinasSaudaveis;
    const disciplinasAbaixoMeta = disciplinas.filter(
        (d) => d.mediaNotas < metaNota,
    ).length;

    const percentualDisciplinasAbaixoMeta =
        totalDisciplinas > 0
            ? (disciplinasAbaixoMeta / totalDisciplinas) * 100
            : 0;

    // Taxa de aprovação média (mock a partir da distribuição de notas)
    const aprovadosTotal = distribuicaoNotasPorDisciplina.reduce(
        (acc, d) => acc + d.faixa4a7 + d.faixa7a10,
        0,
    );
    const alunosAvaliadosTotal = distribuicaoNotasPorDisciplina.reduce(
        (acc, d) => acc + d.faixa0a4 + d.faixa4a7 + d.faixa7a10,
        0,
    );
    const taxaAprovacaoMedia =
        alunosAvaliadosTotal > 0
            ? (aprovadosTotal / alunosAvaliadosTotal) * 100
            : 0;

    // Disciplinas mais problemáticas
    const disciplinaMenorMedia = disciplinas.reduce((prev, curr) =>
        curr.mediaNotas < prev.mediaNotas ? curr : prev,
    );
    const disciplinaMaisAtrasos = disciplinas.reduce((prev, curr) =>
        curr.tarefasAtrasadas > prev.tarefasAtrasadas ? curr : prev,
    );

    // Risco estudantil
    const alunosEmRisco = alunosRisco.length;
    const percentualAlunosRisco =
        totalEstudantes > 0 ? (alunosEmRisco / totalEstudantes) * 100 : 0;

    const alunoMaisCritico = alunosRisco.reduce((prev, curr) =>
        curr.atrasos > prev.atrasos && curr.media < prev.media ? curr : prev,
    );

    // Índice de risco institucional (0–100) – combinação simples
    const riscoNotas = percentualDisciplinasAbaixoMeta; // 0–100
    const riscoAtrasos = taxaAtraso; // 0–100
    const riscoAlunos = percentualAlunosRisco; // 0–100
    const indiceRiscoInstitucional = Math.min(
        100,
        riscoNotas * 0.4 + riscoAtrasos * 0.35 + riscoAlunos * 0.25,
    );

    // Engajamento / presença – mocks
    const taxaPresencaGeral = 93;
    const taxaParticipacaoOnline = 78;
    const freqLoginsMedia = 4.3;
    const tempoUsoMedioHoras = 1.6;
    const adocaoPlataformaDocentes = 87;

    // Progresso / conclusão / retenção – mocks
    const taxaConclusaoDisciplinas = 82;
    const taxaRetencaoInstitucional = 88;
    const taxaEvasao = 12;
    const percAlunosOnTrack = 74;

    // Acessibilidade / inclusão – mocks
    const adocaoAcessibilidadePct = 24;
    const taxaConclusaoPCD = 76;
    const taxaConclusaoNaoPCD = 82;
    const tempoMedioRespostaAcessibilidade = 5; // dias

    // Satisfação / experiência – mocks
    const csatEstudantes = 4.3; // em 1–5
    const npsAcademico = 42;
    const satisfacaoEducadores = 4.1; // em 1–5

    // Dados derivados para gráficos
    const dadosMediaPorDisciplina = disciplinas.map((d) => ({
        nome: d.nome,
        media: d.mediaNotas,
    }));

    const dadosAtrasosPorDisciplina = disciplinas.map((d) => ({
        nome: d.nome,
        atrasos: d.tarefasAtrasadas,
    }));

    const dadosPizzaSaudeDisciplinas = [
        { name: "Saudáveis", value: disciplinasSaudaveis },
        { name: "Críticas", value: disciplinasCriticas },
    ];

    const alunosRiscoPorDisciplina = Object.values(
        alunosRisco.reduce(
            (acc, a) => {
                if (!acc[a.disciplina]) {
                    acc[a.disciplina] = {
                        disciplina: a.disciplina,
                        quantidade: 0,
                    };
                }
                acc[a.disciplina].quantidade += 1;
                return acc;
            },
            {} as Record<string, { disciplina: string; quantidade: number }>,
        ),
    );

    const atrasosXMediaPorDisciplina = disciplinas.map((d) => ({
        disciplina: d.nome,
        atrasos: d.tarefasAtrasadas,
        media: d.mediaNotas,
    }));

    // Radar health – disciplina selecionada (mock: primeira)
    const disciplinaRadar = disciplinas[0];
    const radarData = [
        {
            eixo: "Nota",
            valor: disciplinaRadar.mediaNotas * 10, // normalizado 0–100
        },
        {
            eixo: "Presença",
            valor: taxaPresencaGeral, // mock institucional
        },
        {
            eixo: "Atrasos (invertido)",
            valor: Math.max(0, 100 - disciplinaRadar.tarefasAtrasadas * 5),
        },
        {
            eixo: "Conclusão",
            valor: taxaConclusaoDisciplinas,
        },
        {
            eixo: "Satisfação",
            valor: disciplinaRadar.satisfacaoEstudantes * 10,
        },
    ];

    // Handlers export (placeholder)
    const handleExportPdf = () => {
        console.log("Exportar dashboard em PDF (placeholder)");
    };

    const handleExportExcel = () => {
        console.log("Exportar dados em Excel (placeholder)");
    };

    // Função auxiliar para heatmap
    const getHeatmapColor = (valor: number) => {
        const base = 0.2 + (valor / 100) * 0.6; // 0.2–0.8
        return `rgba(33,150,243,${base})`; // azul com variação de opacidade
    };

    const CHART_HEIGHT = 340; // mesma altura que você gostou no radar

    // Estado de filtro de período (UI)
    const [periodoSelecionado, setPeriodoSelecionado] = useState<
        "30d" | "semestre"
    >("30d");

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
                {/* Título e contexto */}
                <Box>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                        Dashboard Institucional
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Gestor responsável: <strong>Rafael Lima</strong>
                    </Typography>
                </Box>

                {/* Filtros + Exportações */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}
                >
                    {/* Bloco de filtros de período */}
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

                    {/* Bloco de exportação */}
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
         LINHA 1 – VISÃO INSTITUCIONAL
      ================================================================ */}
            <Grid container spacing={3}>
                {/* KPIs principais ocupando a linha toda */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Visão institucional – termômetro geral
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    {
                                        label: "Estudantes (amostra)",
                                        valor: totalEstudantes,
                                    },
                                    {
                                        label: "Educadores",
                                        valor: totalEducadores,
                                    },
                                    {
                                        label: "Disciplinas ativas",
                                        valor: totalDisciplinas,
                                    },
                                    {
                                        label: "Relação aluno/professor",
                                        valor: relAlunoProfessor.toFixed(1),
                                    },
                                    {
                                        label: "Média geral de notas",
                                        valor: mediaGeralNotas.toFixed(1),
                                    },
                                    {
                                        label: "Índice de risco institucional",
                                        valor: `${indiceRiscoInstitucional.toFixed(0)}/100`,
                                    },
                                ].map((kpi) => (
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
         LINHA 2 – DESEMPENHO ACADÊMICO POR DISCIPLINA (CARD ÚNICO)
      ================================================================ */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Desempenho acadêmico por disciplina
                            </Typography>

                            <Grid container spacing={5}>
                                {/* Média de notas por disciplina */}
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
                                            Média de notas por disciplina
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <ColumnChartWidget
                                                data={dadosMediaPorDisciplina}
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
                                            Menor média:{" "}
                                            {disciplinaMenorMedia.nome} (
                                            {disciplinaMenorMedia.mediaNotas.toFixed(
                                                1,
                                            )}
                                            ).
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Distribuição de notas por disciplina */}
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
                                            Distribuição de notas por disciplina
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <ColumnChartWidget
                                                data={
                                                    distribuicaoNotasPorDisciplina
                                                }
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
                                            {taxaAprovacaoMedia.toFixed(1)}%.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Saúde da disciplina (perfil radar) */}
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
                                            Saúde da disciplina (perfil radar)
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Disciplina:{" "}
                                            <strong>
                                                {disciplinaRadar.nome}
                                            </strong>
                                        </Typography>

                                        <Box
                                            sx={{
                                                mt: 1,
                                                height: CHART_HEIGHT,
                                                width: "100%",
                                            }}
                                        >
                                            <RadarChartWidget
                                                data={radarData}
                                                angleKey="eixo"
                                                valueKey="valor"
                                                valueLabel="Saúde"
                                                maxValue={100}
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Saúde das disciplinas (saudáveis x críticas) */}
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
                                            Saúde das disciplinas (saudáveis x
                                            críticas)
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <PieChartWidget
                                                data={
                                                    dadosPizzaSaudeDisciplinas
                                                }
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
                                            Disciplinas saudáveis:{" "}
                                            {disciplinasSaudaveis} • Críticas:{" "}
                                            {disciplinasCriticas}.
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Evolução da média geral */}
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
                                            Evolução da média geral
                                        </Typography>
                                        <Box sx={{ height: CHART_HEIGHT }}>
                                            <LineChartWidget
                                                data={evolucaoMediaGeral}
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
         LINHA 3 – ATRASOS, ENTREGAS E TAREFAS
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Atrasos, entregas e comportamento de tarefas
                    </Typography>

                    {/* KPIs do grupo 3 */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Taxa geral de atraso",
                                valor: `${taxaAtraso.toFixed(1)}%`,
                            },
                            {
                                label: "Tarefas entregues (estimadas)",
                                valor: totalTarefasEntregues,
                            },
                            {
                                label: "% tarefas corrigidas no prazo (SLA)",
                                valor: "84%", // mock
                            },
                            {
                                label: "Tempo médio de correção",
                                valor: "5,2 dias", // mock
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Ranking disciplinas com mais atrasos */}
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
                                    Ranking de atrasos por disciplina
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <BarChartWidget
                                        data={[
                                            ...dadosAtrasosPorDisciplina,
                                        ].sort((a, b) => b.atrasos - a.atrasos)}
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

                        {/* Status das tarefas por disciplina */}
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
                                    Status das tarefas por disciplina
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={tarefasStatusPorDisciplina}
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

                        {/* Linha dupla atraso x presença */}
                        <Grid item xs={12} md={12}>
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
                                    Taxa de atraso x taxa de presença
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={atrasoPresencaTempo}
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
         LINHA 4 – RISCO ESTUDANTIL & ENGAJAMENTO
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Risco estudantil & engajamento
                    </Typography>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Alunos em risco (amostra)",
                                valor: `${alunosEmRisco} (${percentualAlunosRisco.toFixed(
                                    1,
                                )}%)`,
                            },
                            {
                                label: "Caso mais crítico",
                                valor: alunoMaisCritico
                                    ? `${alunoMaisCritico.nome} (${alunoMaisCritico.media.toFixed(
                                          1,
                                      )}, ${alunoMaisCritico.atrasos} atrasos)`
                                    : "-",
                            },
                            {
                                label: "Adoção da plataforma (educadores)",
                                valor: `${adocaoPlataformaDocentes}%`,
                            },
                            {
                                label: "Taxa de presença geral",
                                valor: `${taxaPresencaGeral}%`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Barras – alunos em risco por disciplina */}
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
                                    Alunos em risco por disciplina
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={alunosRiscoPorDisciplina}
                                        categoryKey="disciplina"
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

                        {/* Dispersão – atrasos x média por disciplina */}
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
                                    Atrasos x média de notas (por disciplina)
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
                                                data={
                                                    atrasosXMediaPorDisciplina
                                                }
                                                name="Disciplina"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Dispersão – engajamento x desempenho por aluno */}
                        <Grid item xs={12} md={12}>
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
                                    Engajamento x desempenho (por aluno)
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
                                                data={engajamentoAlunos}
                                                name="Aluno"
                                            />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Heatmap – engajamento semanal por disciplina */}
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Heatmap de engajamento semanal por disciplina
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Linhas = disciplinas, colunas = semanas, intensidade da
                        cor = nível de engajamento.
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Grid container>
                            {/* Cabeçalho de semanas */}
                            <Grid item xs={3}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Disciplina
                                </Typography>
                            </Grid>
                            {engajamentoSemanal[0].semanas.map((_, idx) => (
                                <Grid
                                    item
                                    xs={Math.floor(
                                        9 /
                                            engajamentoSemanal[0].semanas
                                                .length,
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
                            ))}
                        </Grid>

                        {engajamentoSemanal.map((linha) => (
                            <Grid
                                container
                                key={linha.disciplina}
                                sx={{ alignItems: "center", mt: 1 }}
                            >
                                <Grid item xs={3}>
                                    <Typography variant="body2">
                                        {linha.disciplina}
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
                                                bgcolor: getHeatmapColor(valor),
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
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
                    </Paper>
                </CardContent>
            </Card>

            {/* ================================================================
         LINHA 5 – PROGRESSO, CONCLUSÃO E RETENÇÃO
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Progresso, conclusão e retenção
                    </Typography>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Taxa de conclusão de disciplinas",
                                valor: `${taxaConclusaoDisciplinas}%`,
                            },
                            {
                                label: "Taxa de retenção institucional",
                                valor: `${taxaRetencaoInstitucional}%`,
                            },
                            {
                                label: "Taxa de evasão/abandono",
                                valor: `${taxaEvasao}%`,
                            },
                            {
                                label: "% de alunos no prazo (on track)",
                                valor: `${percAlunosOnTrack}%`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Retenção por coorte */}
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
                                    Retenção por coorte
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={retencaoPorCoorte}
                                        xKey="periodo"
                                        series={[
                                            {
                                                dataKey: "coorte2023",
                                                name: "Coorte 2023",
                                            },
                                            {
                                                dataKey: "coorte2024",
                                                name: "Coorte 2024",
                                            },
                                        ]}
                                        yDomain={[0, 100]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Taxa de conclusão por período */}
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
                                    Taxa de conclusão por período
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <AreaLineChartWidget
                                        data={conclusaoPorPeriodo}
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
         LINHA 6 – ACESSIBILIDADE E INCLUSÃO
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Acessibilidade e inclusão
                    </Typography>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "Adoção de recursos de acessibilidade",
                                valor: `${adocaoAcessibilidadePct}%`,
                            },
                            {
                                label: "Taxa de conclusão – estudantes PCD",
                                valor: `${taxaConclusaoPCD}%`,
                            },
                            {
                                label: "Taxa de conclusão – estudantes não PCD",
                                valor: `${taxaConclusaoNaoPCD}%`,
                            },
                            {
                                label: "Tempo médio de resposta (acessibilidade)",
                                valor: `${tempoMedioRespostaAcessibilidade} dias`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Barras – conclusão PCD x não PCD */}
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
                                    Conclusão PCD x não PCD
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={conclusaoPCDvsNaoPCD}
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

                        {/* Linha – tempo de resposta acessibilidade */}
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
                                    Tempo médio de resposta a solicitações de
                                    acessibilidade
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={tempoRespostaAcessibilidade}
                                        xKey="periodo"
                                        series={[
                                            { dataKey: "dias", name: "Dias" },
                                        ]}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* ================================================================
         LINHA 7 – EXPERIÊNCIA & SATISFAÇÃO
      ================================================================ */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Experiência e satisfação – estudantes e educadores
                    </Typography>

                    {/* KPIs */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                label: "CSAT – estudantes",
                                valor: `${csatEstudantes.toFixed(1)}/5`,
                            },
                            {
                                label: "NPS acadêmico",
                                valor: `${npsAcademico}`,
                            },
                            {
                                label: "Satisfação dos educadores",
                                valor: `${satisfacaoEducadores.toFixed(1)}/5`,
                            },
                        ].map((kpi) => (
                            <Grid item xs={12} sm={6} md={4} key={kpi.label}>
                                <KpiCard label={kpi.label} value={kpi.valor} />
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {/* Barras – satisfação dos estudantes por disciplina */}
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
                                    Satisfação dos estudantes por disciplina
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={satisfacaoEstudantesPorDisciplina}
                                        categoryKey="disciplina"
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

                        {/* Barras – satisfação dos educadores por área */}
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
                                    Satisfação dos educadores por área
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <ColumnChartWidget
                                        data={satisfacaoEducadoresPorArea}
                                        categoryKey="area"
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

                        {/* Linha – evolução do NPS */}
                        <Grid item xs={12} md={12}>
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
                                    Evolução do NPS acadêmico
                                </Typography>
                                <Box sx={{ height: 260 }}>
                                    <LineChartWidget
                                        data={npsPorPeriodo}
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

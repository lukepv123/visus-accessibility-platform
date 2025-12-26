// reportGestor.tsx

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type React from "react";

const styles = StyleSheet.create({
    page: {
        padding: 32,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    section: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 6,
        fontWeight: "bold",
    },
    smallTitle: {
        fontSize: 11,
        marginBottom: 4,
        fontWeight: "bold",
    },
    text: {
        fontSize: 10,
        marginBottom: 3,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 2,
        marginTop: 4,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeaderCell: {
        flex: 1,
        padding: 4,
        backgroundColor: "#eee",
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontSize: 9,
        fontWeight: "bold",
    },
    tableCell: {
        flex: 1,
        padding: 4,
        borderTopWidth: 1,
        borderTopColor: "#000",
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontSize: 9,
    },
    lastCell: {
        borderRightWidth: 0,
    },
    kpiRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        // sem gap; usamos margin nos cards
        marginTop: 4,
    },
    kpiCard: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 4,
        padding: 6,
        marginRight: 6,
        marginBottom: 6,
        minWidth: 120,
    },
    kpiLabel: {
        fontSize: 9,
        fontWeight: "bold",
    },
    kpiValue: {
        fontSize: 11,
        marginTop: 2,
    },
});

type DateRange = {
    start: string; // ISO string ou yyyy-MM-dd
    end: string;
};

type Institution = {
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: {
        logradouro: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    };
};

type GestorInfo = {
    nome: string;
    matricula: string;
    cargo: string;
    email: string;
};

type GestorKpis = {
    totalStudents: number;
    totalEducators: number;
    totalDisciplines: number;
    globalAverageGrade: number | null;
    totalPosts: number;
    totalResponses: number;
};

type StudentsByYear = {
    anoEscolar: string;
    count: number;
};

type StudentsByPeriod = {
    periodo: string;
    count: number;
};

type StudentsByGender = {
    genero: string;
    count: number;
};

type DisciplineSummary = {
    id: string | number;
    nome: string;
    educadorNome: string;
    totalAlunos: number;
    totalPostagens: number;
    totalRespostas: number;
    mediaNotas?: number | null;
};

type GradeDistribution = {
    faixa: string; // ex: "0,0 – 4,9"
    quantidade: number;
    percentual: number;
};

type EngagementByDiscipline = {
    disciplinaNome: string;
    postagens: number;
    respostas: number;
    arquivos: number;
};

type EventItem = {
    inicio: string;
    fim: string;
    titulo: string;
    disciplinaNome?: string;
};

type HighlightStudent = {
    tipo: "DESTAQUE" | "RISCO";
    nome: string;
    anoEscolar: string;
    mediaNotas: number;
    respostasEnviadas: number;
    observacao?: string;
};

export type GestorReportProps = {
    institution: Institution;
    gestor: GestorInfo;
    period: DateRange;
    generatedAt: string;
    kpis: GestorKpis;
    studentsByYear: StudentsByYear[];
    studentsByPeriod: StudentsByPeriod[];
    studentsByGender: StudentsByGender[];
    disciplinesSummary: DisciplineSummary[];
    gradeDistribution: GradeDistribution[];
    engagementByDiscipline: EngagementByDiscipline[];
    events: EventItem[];
    highlightStudents: HighlightStudent[];
    recommendations?: string;
};

const formatDate = (value: string | undefined) => {
    if (!value) return "";
    // assume yyyy-MM-dd ou ISO
    return value.substring(0, 10).split("-").reverse().join("/");
};

const formatNumber = (value: number | null | undefined, decimals = 1) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(decimals).replace(".", ",");
};

export const ReportGestor: React.FC<GestorReportProps> = (props) => {
    const {
        institution,
        gestor,
        period,
        generatedAt,
        kpis,
        studentsByYear,
        studentsByPeriod,
        studentsByGender,
        disciplinesSummary,
        gradeDistribution,
        engagementByDiscipline,
        events,
        highlightStudents,
        recommendations,
    } = props;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Título / Capa */}
                <View style={styles.section}>
                    <Text style={styles.title}>
                        Relatório Institucional – Visão Geral
                    </Text>
                    <Text style={styles.text}>
                        Instituição: {institution.nome}
                    </Text>
                    <Text style={styles.text}>
                        Período analisado: {formatDate(period.start)} a{" "}
                        {formatDate(period.end)}
                    </Text>
                    <Text style={styles.text}>
                        Gestor destinatário: {gestor.nome}
                    </Text>
                    <Text style={styles.text}>
                        Data de geração: {formatDate(generatedAt)}
                    </Text>
                </View>

                {/* Seção 1 – Identificação da Instituição */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        1. Identificação da Instituição
                    </Text>
                    <Text style={styles.text}>
                        Este relatório apresenta uma visão consolidada da
                        instituição no período indicado, com foco em tamanho da
                        operação, desempenho acadêmico, engajamento digital e
                        pontos de atenção.
                    </Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeaderCell]}>Campo</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Valor
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Nome</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.nome}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>CNPJ</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.cnpj}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Telefone</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.telefone}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>E-mail</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.email}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Endereço</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.endereco.logradouro},{" "}
                                {institution.endereco.numero} -{" "}
                                {institution.endereco.bairro},{" "}
                                {institution.endereco.cidade} -{" "}
                                {institution.endereco.estado}, CEP{" "}
                                {institution.endereco.cep}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Seção 2 – Resumo Executivo / KPIs */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>2. Resumo Executivo</Text>
                    <Text style={styles.text}>
                        A seguir, são apresentados os principais indicadores
                        sintéticos que resumem a situação da instituição no
                        período.
                    </Text>

                    <View style={styles.kpiRow}>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Total de estudantes
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalStudents}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Total de educadores
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalEducators}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Total de disciplinas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalDisciplines}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Média global de notas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {formatNumber(kpis.globalAverageGrade, 2)}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Postagens de conteúdo
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalPosts}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Respostas de tarefas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalResponses}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Seção 3 – Indicadores da Comunidade Escolar */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>3. Comunidade Escolar</Text>

                    {/* 3.1 Distribuição por ano escolar */}
                    <Text style={styles.smallTitle}>
                        3.1 Distribuição de Estudantes por Ano Escolar
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Ano Escolar
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Qtde
                            </Text>
                        </View>
                        {studentsByYear.map((row, idx) => (
                            <View style={styles.tableRow} key={`year-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {row.anoEscolar}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {row.count}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* 3.2 Distribuição por período */}
                    <Text style={[styles.smallTitle, { marginTop: 8 }]}>
                        3.2 Distribuição de Estudantes por Período
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Período</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Qtde
                            </Text>
                        </View>
                        {studentsByPeriod.map((row, idx) => (
                            <View style={styles.tableRow} key={`period-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {row.periodo}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {row.count}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* 3.3 Distribuição por gênero */}
                    <Text style={[styles.smallTitle, { marginTop: 8 }]}>
                        3.3 Distribuição por Gênero (quando informado)
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Gênero</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Qtde
                            </Text>
                        </View>
                        {studentsByGender.map((row, idx) => (
                            <View style={styles.tableRow} key={`gender-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {row.genero}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {row.count}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 4 – Visão por Disciplinas */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        4. Visão por Disciplinas
                    </Text>
                    <Text style={styles.text}>
                        A tabela abaixo mostra o tamanho das turmas e o volume
                        de atividade em cada disciplina.
                    </Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>Educador</Text>
                            <Text style={styles.tableHeaderCell}>Alunos</Text>
                            <Text style={styles.tableHeaderCell}>
                                Postagens
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Respostas
                            </Text>
                        </View>
                        {disciplinesSummary.map((d) => (
                            <View style={styles.tableRow} key={String(d.id)}>
                                <Text style={styles.tableCell}>{d.nome}</Text>
                                <Text style={styles.tableCell}>
                                    {d.educadorNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.totalAlunos}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.totalPostagens}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {d.totalRespostas}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 5 – Desempenho Acadêmico (Notas) */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        5. Desempenho Acadêmico (Notas)
                    </Text>

                    <Text style={styles.smallTitle}>
                        5.1 Distribuição de Notas
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Faixa de Nota
                            </Text>
                            <Text style={styles.tableHeaderCell}>Qtde</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Percentual
                            </Text>
                        </View>
                        {gradeDistribution.map((g, idx) => (
                            <View style={styles.tableRow} key={`grade-${idx}`}>
                                <Text style={styles.tableCell}>{g.faixa}</Text>
                                <Text style={styles.tableCell}>
                                    {g.quantidade}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {formatNumber(g.percentual, 1)}%
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.text, { marginTop: 6 }]}>
                        A distribuição acima indica como as notas se concentram
                        em diferentes faixas. Uma concentração elevada na faixa
                        de notas baixas sugere necessidade de intervenção
                        pedagógica mais forte em turmas específicas.
                    </Text>
                </View>

                {/* Seção 6 – Engajamento Digital */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>6. Engajamento Digital</Text>
                    <Text style={styles.text}>
                        O engajamento é medido pelo volume de postagens,
                        respostas de tarefas e arquivos anexados nas
                        disciplinas.
                    </Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>
                                Postagens
                            </Text>
                            <Text style={styles.tableHeaderCell}>
                                Respostas
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Arquivos
                            </Text>
                        </View>
                        {engagementByDiscipline.map((e, idx) => (
                            <View style={styles.tableRow} key={`eng-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {e.disciplinaNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {e.postagens}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {e.respostas}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {e.arquivos}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 7 – Eventos */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        7. Eventos e Calendário Acadêmico
                    </Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Início</Text>
                            <Text style={styles.tableHeaderCell}>Fim</Text>
                            <Text style={styles.tableHeaderCell}>Título</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Disciplina
                            </Text>
                        </View>
                        {events.map((ev, idx) => (
                            <View style={styles.tableRow} key={`ev-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {formatDate(ev.inicio)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatDate(ev.fim)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {ev.titulo}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {ev.disciplinaNome || "-"}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 8 – Alunos em Destaque / Risco */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        8. Alunos em Destaque e em Risco
                    </Text>

                    <Text style={styles.smallTitle}>
                        8.1 Alunos em Destaque
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Nome</Text>
                            <Text style={styles.tableHeaderCell}>
                                Ano Escolar
                            </Text>
                            <Text style={styles.tableHeaderCell}>Média</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Respostas
                            </Text>
                        </View>
                        {highlightStudents
                            .filter((s) => s.tipo === "DESTAQUE")
                            .map((s, idx) => (
                                <View
                                    style={styles.tableRow}
                                    key={`dest-${idx}`}
                                >
                                    <Text style={styles.tableCell}>
                                        {s.nome}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {s.anoEscolar}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {formatNumber(s.mediaNotas, 2)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        {s.respostasEnviadas}
                                    </Text>
                                </View>
                            ))}
                    </View>

                    <Text style={[styles.smallTitle, { marginTop: 8 }]}>
                        8.2 Alunos em Risco (média baixa / pouco engajamento)
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Nome</Text>
                            <Text style={styles.tableHeaderCell}>
                                Ano Escolar
                            </Text>
                            <Text style={styles.tableHeaderCell}>Média</Text>
                            <Text style={styles.tableHeaderCell}>
                                Respostas
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Observação
                            </Text>
                        </View>
                        {highlightStudents
                            .filter((s) => s.tipo === "RISCO")
                            .map((s, idx) => (
                                <View
                                    style={styles.tableRow}
                                    key={`risk-${idx}`}
                                >
                                    <Text style={styles.tableCell}>
                                        {s.nome}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {s.anoEscolar}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {formatNumber(s.mediaNotas, 2)}
                                    </Text>
                                    <Text style={styles.tableCell}>
                                        {s.respostasEnviadas}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        {s.observacao || ""}
                                    </Text>
                                </View>
                            ))}
                    </View>
                </View>

                {/* Seção 9 – Recomendações */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        9. Recomendações e Próximos Passos
                    </Text>
                    <Text style={styles.text}>
                        {recommendations ||
                            "Com base nos indicadores apresentados, recomenda-se priorizar ações de reforço para os alunos em risco, revisar práticas pedagógicas em disciplinas com desempenho mais baixo e manter as estratégias bem-sucedidas nas turmas com maior engajamento e melhores resultados."}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default ReportGestor;

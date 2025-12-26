// reportEducador.tsx

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
        // 'gap' não é suportado pelo react-pdf; usamos margin nos cards
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
    start: string;
    end: string;
};

type Institution = {
    nome: string;
};

type Formacao = {
    titulo: string;
    instituicao: string;
    dataInicio?: string;
    dataConclusao?: string;
    descricao?: string;
};

type EducadorInfo = {
    nome: string;
    matricula: string;
    email: string;
    titulo?: string;
    formacoes?: Formacao[];
};

type EducadorKpis = {
    totalDisciplinas: number;
    totalEstudantesUnicos: number;
    mediaGeralTurmas: number | null;
    totalPostagens: number;
    totalRespostas: number;
};

type DisciplinaResumo = {
    id: string | number;
    nome: string;
    totalAlunos: number;
    mediaNotas?: number | null;
    respostasRecebidas: number;
    postagens: number;
    arquivosPostagens: number;
};

type DesempenhoAlunoDisciplina = {
    estudanteId: string | number;
    nome: string;
    anoEscolar: string;
    mediaNotas: number | null;
    respostasEnviadas: number;
    ultimaNota?: number | null;
    status?: "OK" | "RISCO";
};

type DesempenhoPorDisciplina = {
    disciplinaId: string | number;
    disciplinaNome: string;
    alunos: DesempenhoAlunoDisciplina[];
};

type AtividadesPorDisciplina = {
    disciplinaId: string | number;
    disciplinaNome: string;
    postagens: number;
    respostas: number;
    respostasPorAluno: number;
    arquivosRespostas: number;
};

type EventoEducador = {
    inicio: string;
    titulo: string;
    descricao?: string;
    disciplinaNome?: string;
};

export type EducadorReportProps = {
    institution: Institution;
    educador: EducadorInfo;
    period: DateRange;
    generatedAt: string;
    kpis: EducadorKpis;
    disciplinasResumo: DisciplinaResumo[];
    desempenhoPorDisciplina: DesempenhoPorDisciplina[];
    atividadesPorDisciplina: AtividadesPorDisciplina[];
    eventos: EventoEducador[];
    recomendacoes?: string;
};

const formatDate = (value: string | undefined) => {
    if (!value) return "";
    return value.substring(0, 10).split("-").reverse().join("/");
};

const formatNumber = (value: number | null | undefined, decimals = 1) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(decimals).replace(".", ",");
};

export const ReportEducador: React.FC<EducadorReportProps> = ({
    institution,
    educador,
    period,
    generatedAt,
    kpis,
    disciplinasResumo,
    desempenhoPorDisciplina,
    atividadesPorDisciplina,
    eventos,
    recomendacoes,
}) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Capa */}
                <View style={styles.section}>
                    <Text style={styles.title}>
                        Relatório de Turmas e Desempenho – Educador
                    </Text>
                    <Text style={styles.text}>Educador: {educador.nome}</Text>
                    <Text style={styles.text}>
                        Instituição: {institution.nome}
                    </Text>
                    <Text style={styles.text}>
                        Período analisado: {formatDate(period.start)} a{" "}
                        {formatDate(period.end)}
                    </Text>
                    <Text style={styles.text}>
                        Data de geração: {formatDate(generatedAt)}
                    </Text>
                </View>

                {/* Seção 1 – Perfil do Educador */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>1. Perfil do Educador</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Campo</Text>
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
                                {educador.nome}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Matrícula</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {educador.matricula}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>E-mail</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {educador.email}
                            </Text>
                        </View>
                        {educador.titulo && (
                            <View style={styles.tableRow}>
                                <Text style={styles.tableCell}>Título</Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {educador.titulo}
                                </Text>
                            </View>
                        )}
                    </View>

                    {educador.formacoes && educador.formacoes.length > 0 && (
                        <>
                            <Text style={[styles.smallTitle, { marginTop: 8 }]}>
                                1.1 Formações Acadêmicas
                            </Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeaderCell}>
                                        Título
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Instituição
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Início
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableHeaderCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        Conclusão
                                    </Text>
                                </View>
                                {educador.formacoes.map((f, idx) => (
                                    <View
                                        style={styles.tableRow}
                                        key={`form-${idx}`}
                                    >
                                        <Text style={styles.tableCell}>
                                            {f.titulo}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {f.instituicao}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {f.dataInicio
                                                ? formatDate(f.dataInicio)
                                                : "-"}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.lastCell,
                                            ]}
                                        >
                                            {f.dataConclusao
                                                ? formatDate(f.dataConclusao)
                                                : "-"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>

                {/* Seção 2 – Resumo Executivo */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        2. Resumo Executivo das Turmas
                    </Text>
                    <Text style={styles.text}>
                        Esta seção resume o alcance do educador em termos de
                        disciplinas, estudantes e desempenho médio das turmas.
                    </Text>

                    <View style={styles.kpiRow}>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Total de disciplinas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalDisciplinas}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Estudantes únicos
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalEstudantesUnicos}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Média geral das turmas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {formatNumber(kpis.mediaGeralTurmas, 2)}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Postagens criadas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalPostagens}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Respostas recebidas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalRespostas}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Seção 3 – Visão por Disciplina */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>3. Visão por Disciplina</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>
                                Total de Alunos
                            </Text>
                            <Text style={styles.tableHeaderCell}>
                                Média das Notas
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
                                Postagens
                            </Text>
                        </View>
                        {disciplinasResumo.map((d) => (
                            <View style={styles.tableRow} key={String(d.id)}>
                                <Text style={styles.tableCell}>{d.nome}</Text>
                                <Text style={styles.tableCell}>
                                    {d.totalAlunos}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatNumber(d.mediaNotas, 2)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.respostasRecebidas}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {d.postagens}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 4 – Desempenho dos Estudantes por Disciplina */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        4. Desempenho dos Estudantes por Disciplina
                    </Text>

                    {desempenhoPorDisciplina.map((disc) => (
                        <View
                            key={String(disc.disciplinaId)}
                            style={{ marginBottom: 10 }}
                        >
                            <Text style={styles.smallTitle}>
                                Disciplina: {disc.disciplinaNome}
                            </Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeaderCell}>
                                        Estudante
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Ano Escolar
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Média
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Respostas
                                    </Text>
                                    <Text style={styles.tableHeaderCell}>
                                        Última Nota
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableHeaderCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        Situação
                                    </Text>
                                </View>
                                {disc.alunos.map((a) => (
                                    <View
                                        style={styles.tableRow}
                                        key={String(a.estudanteId)}
                                    >
                                        <Text style={styles.tableCell}>
                                            {a.nome}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {a.anoEscolar}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {formatNumber(a.mediaNotas, 2)}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {a.respostasEnviadas}
                                        </Text>
                                        <Text style={styles.tableCell}>
                                            {a.ultimaNota !== undefined
                                                ? formatNumber(a.ultimaNota, 2)
                                                : "-"}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.lastCell,
                                            ]}
                                        >
                                            {a.status || "-"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Seção 5 – Engajamento nas Atividades */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        5. Engajamento nas Atividades
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
                            <Text style={styles.tableHeaderCell}>
                                Resp./Aluno
                            </Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Arquivos em Respostas
                            </Text>
                        </View>
                        {atividadesPorDisciplina.map((d) => (
                            <View
                                style={styles.tableRow}
                                key={String(d.disciplinaId)}
                            >
                                <Text style={styles.tableCell}>
                                    {d.disciplinaNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.postagens}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.respostas}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatNumber(d.respostasPorAluno, 2)}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {d.arquivosRespostas}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 6 – Eventos e Prazos */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        6. Eventos e Prazos Importantes
                    </Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Data</Text>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>Título</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Descrição
                            </Text>
                        </View>
                        {eventos.map((ev, idx) => (
                            <View style={styles.tableRow} key={`ev-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {formatDate(ev.inicio)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {ev.disciplinaNome || "-"}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {ev.titulo}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {ev.descricao || ""}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 7 – Recomendações Pedagógicas */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        7. Recomendações Pedagógicas
                    </Text>
                    <Text style={styles.text}>
                        {recomendacoes ||
                            "Recomenda-se reforçar o acompanhamento dos estudantes em situação de risco, revisar a distribuição de tarefas ao longo do período e ampliar estratégias bem-sucedidas observadas nas disciplinas com maior engajamento e melhor desempenho."}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default ReportEducador;

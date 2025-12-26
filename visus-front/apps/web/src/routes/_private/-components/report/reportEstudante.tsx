// reportEstudante.tsx

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
        // sem gap: react-pdf não suporta
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

type EstudanteInfo = {
    id: string | number;
    nome: string;
    matricula: string;
    email: string;
    anoEscolar: string;
    periodo: string;
};

type EstudanteKpis = {
    mediaGeral: number | null;
    disciplinasCursadas: number;
    totalAvaliacoes: number;
    dataUltimaAtividade?: string;
};

type DesempenhoDisciplinaAluno = {
    disciplinaId: string | number;
    disciplinaNome: string;
    educadorNome: string;
    mediaNotas: number | null;
    avaliacoesRespondidas: number;
    status?: "OK" | "RISCO";
};

type HistoricoAvaliacao = {
    dataEnvio: string;
    disciplinaNome: string;
    descricaoTarefa?: string;
    nota: number | null;
    feedback?: string;
};

type ProximoEventoAluno = {
    inicio: string;
    disciplinaNome: string;
    titulo: string;
    descricao?: string;
};

type PontoDisciplina = {
    disciplinaNome: string;
    media: number;
};

export type EstudanteReportProps = {
    institution: Institution;
    estudante: EstudanteInfo;
    period: DateRange;
    generatedAt: string;
    kpis: EstudanteKpis;
    desempenhoPorDisciplina: DesempenhoDisciplinaAluno[];
    historicoAvaliacoes: HistoricoAvaliacao[];
    proximosEventos: ProximoEventoAluno[];
    pontosFortes: PontoDisciplina[];
    pontosAtencao: PontoDisciplina[];
    recomendacoesGerais?: string;
    comentarioEducador?: string;
};

const formatDate = (value: string | undefined) => {
    if (!value) return "";
    return value.substring(0, 10).split("-").reverse().join("/");
};

const formatNumber = (value: number | null | undefined, decimals = 1) => {
    if (value === null || value === undefined) return "-";
    return value.toFixed(decimals).replace(".", ",");
};

export const ReportEstudante: React.FC<EstudanteReportProps> = ({
    institution,
    estudante,
    period,
    generatedAt,
    kpis,
    desempenhoPorDisciplina,
    historicoAvaliacoes,
    proximosEventos,
    pontosFortes,
    pontosAtencao,
    recomendacoesGerais,
    comentarioEducador,
}) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Capa */}
                <View style={styles.section}>
                    <Text style={styles.title}>
                        Relatório Individual de Desempenho – Estudante
                    </Text>
                    <Text style={styles.text}>Estudante: {estudante.nome}</Text>
                    <Text style={styles.text}>
                        Matrícula: {estudante.matricula}
                    </Text>
                    <Text style={styles.text}>
                        Ano escolar / Período: {estudante.anoEscolar} –{" "}
                        {estudante.periodo}
                    </Text>
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

                {/* Seção 1 – Identificação */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        1. Identificação do Estudante
                    </Text>
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
                                {estudante.nome}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Matrícula</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {estudante.matricula}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>E-mail</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {estudante.email}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Ano Escolar</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {estudante.anoEscolar}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Período</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {estudante.periodo}
                            </Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}>Instituição</Text>
                            <Text style={[styles.tableCell, styles.lastCell]}>
                                {institution.nome}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Seção 2 – Resumo Geral do Desempenho */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        2. Resumo Geral do Desempenho
                    </Text>
                    <View style={styles.kpiRow}>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Média geral das notas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {formatNumber(kpis.mediaGeral, 2)}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Disciplinas cursadas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.disciplinasCursadas}
                            </Text>
                        </View>
                        <View style={styles.kpiCard}>
                            <Text style={styles.kpiLabel}>
                                Avaliações respondidas
                            </Text>
                            <Text style={styles.kpiValue}>
                                {kpis.totalAvaliacoes}
                            </Text>
                        </View>
                        {kpis.dataUltimaAtividade && (
                            <View style={styles.kpiCard}>
                                <Text style={styles.kpiLabel}>
                                    Última atividade
                                </Text>
                                <Text style={styles.kpiValue}>
                                    {formatDate(kpis.dataUltimaAtividade)}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.text}>
                        Este resumo apresenta uma visão geral do seu desempenho
                        no período analisado. Nas seções seguintes, você verá
                        detalhes por disciplina, histórico de avaliações e
                        recomendações para melhorar.
                    </Text>
                </View>

                {/* Seção 3 – Visão por Disciplina */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>3. Visão por Disciplina</Text>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>Educador</Text>
                            <Text style={styles.tableHeaderCell}>Média</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Avaliações Respondidas
                            </Text>
                        </View>
                        {desempenhoPorDisciplina.map((d) => (
                            <View
                                style={styles.tableRow}
                                key={String(d.disciplinaId)}
                            >
                                <Text style={styles.tableCell}>
                                    {d.disciplinaNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {d.educadorNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatNumber(d.mediaNotas, 2)}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {d.avaliacoesRespondidas}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 4 – Histórico de Avaliações */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        4. Histórico de Avaliações
                    </Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeaderCell}>Data</Text>
                            <Text style={styles.tableHeaderCell}>
                                Disciplina
                            </Text>
                            <Text style={styles.tableHeaderCell}>
                                Descrição
                            </Text>
                            <Text style={styles.tableHeaderCell}>Nota</Text>
                            <Text
                                style={[
                                    styles.tableHeaderCell,
                                    styles.lastCell,
                                ]}
                            >
                                Feedback
                            </Text>
                        </View>
                        {historicoAvaliacoes.map((h, idx) => (
                            <View style={styles.tableRow} key={`hist-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {formatDate(h.dataEnvio)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {h.disciplinaNome}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {h.descricaoTarefa || ""}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatNumber(h.nota, 2)}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.lastCell]}
                                >
                                    {h.feedback || ""}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Seção 5 – Próximos Eventos */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>5. Próximos Eventos</Text>
                    <Text style={styles.text}>
                        Fique atento às datas abaixo para se organizar e evitar
                        atrasos em provas, entregas de trabalho e outras
                        atividades importantes.
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
                        {proximosEventos.map((ev, idx) => (
                            <View style={styles.tableRow} key={`ev-${idx}`}>
                                <Text style={styles.tableCell}>
                                    {formatDate(ev.inicio)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {ev.disciplinaNome}
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

                {/* Seção 6 – Pontos Fortes */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>6. Pontos Fortes</Text>
                    {pontosFortes.length === 0 ? (
                        <Text style={styles.text}>
                            Ainda não há destaque claro em disciplinas
                            específicas. Continue se dedicando para elevar suas
                            notas.
                        </Text>
                    ) : (
                        <>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeaderCell}>
                                        Disciplina
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableHeaderCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        Média
                                    </Text>
                                </View>
                                {pontosFortes.map((p, idx) => (
                                    <View
                                        style={styles.tableRow}
                                        key={`pf-${idx}`}
                                    >
                                        <Text style={styles.tableCell}>
                                            {p.disciplinaNome}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.lastCell,
                                            ]}
                                        >
                                            {formatNumber(p.media, 2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={[styles.text, { marginTop: 6 }]}>
                                Essas são as áreas em que você está se saindo
                                melhor. Procure manter seus hábitos de estudo
                                nessas disciplinas e, se possível, ajudar
                                colegas que estejam com mais dificuldade.
                            </Text>
                        </>
                    )}
                </View>

                {/* Seção 7 – Pontos de Atenção */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>7. Pontos de Atenção</Text>
                    {pontosAtencao.length === 0 ? (
                        <Text style={styles.text}>
                            Não há disciplinas em situação de alerta no período
                            analisado. Continue acompanhando as atividades e
                            mantendo sua dedicação.
                        </Text>
                    ) : (
                        <>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeaderCell}>
                                        Disciplina
                                    </Text>
                                    <Text
                                        style={[
                                            styles.tableHeaderCell,
                                            styles.lastCell,
                                        ]}
                                    >
                                        Média
                                    </Text>
                                </View>
                                {pontosAtencao.map((p, idx) => (
                                    <View
                                        style={styles.tableRow}
                                        key={`pa-${idx}`}
                                    >
                                        <Text style={styles.tableCell}>
                                            {p.disciplinaNome}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.tableCell,
                                                styles.lastCell,
                                            ]}
                                        >
                                            {formatNumber(p.media, 2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={[styles.text, { marginTop: 6 }]}>
                                Essas disciplinas indicam que você pode estar
                                com dificuldades. É importante tirar dúvidas com
                                o educador, revisar o conteúdo e organizar um
                                plano de estudo focado nelas.
                            </Text>
                        </>
                    )}
                </View>

                {/* Seção 8 – Recomendações / Comentários */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>
                        8. Recomendações para Melhorar
                    </Text>
                    <Text style={styles.text}>
                        {recomendacoesGerais ||
                            "Defina horários fixos de estudo durante a semana, acompanhe as postagens e materiais disponibilizados pelos educadores e procure não deixar atividades para a última hora. Se estiver com dificuldades em alguma disciplina, converse com seu professor(a) para alinhar um plano de recuperação."}
                    </Text>

                    <Text style={[styles.smallTitle, { marginTop: 8 }]}>
                        Comentários do Educador
                    </Text>
                    <Text style={styles.text}>
                        {comentarioEducador ||
                            "________________________________________\n________________________________________\n________________________________________"}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default ReportEstudante;

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/estudante/metricas")({
    component: EstudanteMetricas,
});

type Grade = {
    id: string;
    classTitle: string;
    assignment: string;
    score: number; // 0-10 scale
    max?: number;
    status?: "graded" | "missing" | "late" | "not_submitted";
};

const sampleGrades: Grade[] = [
    {
        id: "g1",
        classTitle: "Matemática - Álgebra I",
        assignment: "Lista 3",
        score: 9.2,
        max: 10,
        status: "graded",
    },
    {
        id: "g2",
        classTitle: "História - Brasil Contemporâneo",
        assignment: "Resenha",
        score: 7.8,
        max: 10,
        status: "graded",
    },
    {
        id: "g3",
        classTitle: "Biologia - Ecologia",
        assignment: "Questionário",
        score: 8.5,
        max: 10,
        status: "graded",
    },
    {
        id: "g4",
        classTitle: "Português - Literatura",
        assignment: "Trabalho",
        score: 0,
        max: 10,
        status: "missing",
    },
    {
        id: "g5",
        classTitle: "Matemática - Álgebra I",
        assignment: "Prova 1",
        score: 8.8,
        max: 10,
        status: "graded",
    },
];

function average(scores: Grade[]) {
    const graded = scores.filter(
        (s) => s.status === "graded" && typeof s.score === "number",
    );
    if (graded.length === 0) return 0;
    return (
        Math.round(
            (graded.reduce((acc, g) => acc + g.score, 0) / graded.length) * 10,
        ) / 10
    ); // one decimal
}

function SmallSparkline({ values }: { values: number[] }) {
    const w = 220;
    const h = 60;
    const max = Math.max(...values, 10);
    const min = Math.min(...values, 0);
    const points = values
        .map((v, i) => {
            const x = (i / (values.length - 1 || 1)) * w;
            const y = h - ((v - min) / (max - min || 1)) * h;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline
                fill="none"
                stroke="#3f51b5"
                strokeWidth={2}
                points={points}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function EstudanteMetricas() {
    const avg = average(sampleGrades);
    const total = sampleGrades.length;
    const missing = sampleGrades.filter((s) => s.status === "missing").length;
    const highest = sampleGrades.reduce(
        (acc, g) => (g.score > acc ? g.score : acc),
        0,
    );

    // simple monthly mock for sparkline (0-10 scale)
    const monthly = [7.2, 7.8, 8.1, 8.5, 8.8, avg];

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4">Notas e Métricas</Typography>
                <Typography color="text.secondary">
                    Visão geral das suas notas e desempenho por atividade
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                    mb: 3,
                }}
            >
                <Card>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Média
                        </Typography>
                        <Typography variant="h5">{avg.toFixed(1)}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <SmallSparkline values={monthly} />
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Total de atividades
                        </Typography>
                        <Typography variant="h5">{total}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Atividades avaliadas e pendentes
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Pendências
                        </Typography>
                        <Typography variant="h5">{missing}</Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Atividades sem entrega ou sem nota
                        </Typography>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Maior nota
                        </Typography>
                        <Typography variant="h5">
                            {highest.toFixed(1)}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Parabéns — continue assim
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Card>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h6">
                                Últimas avaliações
                            </Typography>
                            <Typography color="text.secondary">
                                Lista recente de atividades e notas
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Chip label={`Média: ${avg}`} color="primary" />
                        </Stack>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Disciplina</TableCell>
                                <TableCell>Atividade</TableCell>
                                <TableCell>Nota</TableCell>
                                <TableCell>Progresso</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sampleGrades.map((g) => (
                                <TableRow key={g.id}>
                                    <TableCell>{g.classTitle}</TableCell>
                                    <TableCell>{g.assignment}</TableCell>
                                    <TableCell>
                                        {g.status === "graded"
                                            ? `${g.score.toFixed(1)}/10`
                                            : "—"}
                                    </TableCell>
                                    <TableCell sx={{ width: 220 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={g.score * 10}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {g.status === "graded" && (
                                            <Chip
                                                label="Avaliadas"
                                                color="success"
                                                size="small"
                                            />
                                        )}
                                        {g.status === "missing" && (
                                            <Chip
                                                label="Pendente"
                                                color="warning"
                                                size="small"
                                            />
                                        )}
                                        {g.status === "late" && (
                                            <Chip
                                                label="Atrasada"
                                                color="error"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Box>
    );
}

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo, useState } from "react";

export const Route = createFileRoute("/_private/educador/correcao")({
    component: EducadorCorrecao,
});

type Submission = {
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
    dueDate?: string;
    content: string;
    grade?: number | null;
    feedback?: string;
};

const initialMock: Submission[] = [
    {
        id: "s1",
        studentName: "Mariana Silva",
        assignmentTitle: "Trabalho 1 - Matemática",
        submittedAt: "2025-11-14 10:23",
        dueDate: "2025-11-14 09:00",
        content: "Resposta: cálculo dos exercícios...",
        grade: null,
        feedback: "",
    },
    {
        id: "s2",
        studentName: "Carlos Pereira",
        assignmentTitle: "Trabalho 1 - Matemática",
        submittedAt: "2025-11-13 16:02",
        dueDate: "2025-11-14 09:00",
        content: "Segue meu trabalho em anexo (texto)...",
        grade: 8,
        feedback: "Bom trabalho, revise a questão 3",
    },
];

export default function EducadorCorrecao() {
    const [submissions, setSubmissions] = useState<Submission[]>(initialMock);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Submission | null>(null);
    const [draftGrade, setDraftGrade] = useState<string>("");
    const [draftFeedback, setDraftFeedback] = useState<string>("");

    const openSubmission = (s: Submission) => {
        setSelected(s);
        setDraftGrade(s.grade != null ? String(s.grade) : "");
        setDraftFeedback(s.feedback ?? "");
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
        setSelected(null);
    };

    const saveGrade = () => {
        if (!selected) return;
        setSubmissions((prev) =>
            prev.map((p) =>
                p.id === selected.id
                    ? {
                          ...p,
                          grade: draftGrade === "" ? null : Number(draftGrade),
                          feedback: draftFeedback,
                      }
                    : p,
            ),
        );
        closeDialog();
    };

    const parseDate = (value?: string) => {
        if (!value) return null;
        // Accept common 'YYYY-MM-DD HH:mm' or ISO formats
        const normalized = value.includes("T")
            ? value
            : value.replace(" ", "T");
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? null : d;
    };

    const isLate = (s: Submission) => {
        const submitted = parseDate(s.submittedAt);
        const due = parseDate(s.dueDate);
        if (!submitted || !due) return null;
        return submitted.getTime() > due.getTime();
    };

    const stats = useMemo(() => {
        const total = submissions.length;
        const graded = submissions.filter((s) => s.grade != null).length;
        const late = submissions.filter((s) => isLate(s)).length;
        const avg =
            graded > 0
                ? Math.round(
                      (submissions
                          .filter((s) => s.grade != null)
                          .reduce((sum, s) => sum + (s.grade ?? 0), 0) /
                          graded) *
                          100,
                  ) / 100
                : null;
        return { total, graded, avg, late };
    }, [submissions]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Correção de Atividades
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Card sx={{ minWidth: 180 }}>
                    <CardContent>
                        <Typography variant="subtitle2">Total</Typography>
                        <Typography variant="h6">{stats.total}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 180 }}>
                    <CardContent>
                        <Typography variant="subtitle2">Corrigidas</Typography>
                        <Typography variant="h6">{stats.graded}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 180 }}>
                    <CardContent>
                        <Typography variant="subtitle2">Média</Typography>
                        <Typography variant="h6">{stats.avg ?? "—"}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 180 }}>
                    <CardContent>
                        <Typography variant="subtitle2">Atrasadas</Typography>
                        <Typography variant="h6">{stats.late}</Typography>
                    </CardContent>
                </Card>
            </Stack>

            <Card>
                <CardContent>
                    <Typography color="textSecondary" sx={{ mb: 2 }}>
                        Lista de submissões
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Estudante</TableCell>
                                <TableCell>Atividade</TableCell>
                                <TableCell>Enviado em</TableCell>
                                <TableCell>Prazo</TableCell>{" "}
                                {/* <-- New column */}
                                <TableCell>Status</TableCell>
                                <TableCell>Nota</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {submissions.map((s) => (
                                <TableRow key={s.id} hover>
                                    <TableCell>{s.studentName}</TableCell>
                                    <TableCell>{s.assignmentTitle}</TableCell>
                                    <TableCell>{s.submittedAt}</TableCell>

                                    {/* New due date column */}
                                    <TableCell>{s.dueDate ?? "—"}</TableCell>

                                    <TableCell>
                                        {isLate(s) ? (
                                            <Chip
                                                label="Atrasado"
                                                color="error"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                label="No prazo"
                                                color="default"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {s.grade != null ? (
                                            <Chip
                                                label={String(s.grade)}
                                                color="success"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                label="Sem nota"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            size="small"
                                            onClick={() => openSubmission(s)}
                                        >
                                            Abrir
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
                <DialogTitle>Corrigir submissão</DialogTitle>
                <DialogContent dividers>
                    {selected && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 320px",
                                gap: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle2">
                                    Aluno
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    {selected.studentName}
                                </Typography>

                                <Typography variant="subtitle2">
                                    Atividade
                                </Typography>
                                <Typography sx={{ mb: 1 }}>
                                    {selected.assignmentTitle}
                                </Typography>

                                <Typography variant="subtitle2">
                                    Conteúdo submetido
                                </Typography>
                                <Card sx={{ mb: 1 }}>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            sx={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {selected.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box>
                                <TextField
                                    label="Nota"
                                    value={draftGrade}
                                    onChange={(e) =>
                                        setDraftGrade(e.target.value)
                                    }
                                    type="number"
                                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Feedback"
                                    value={draftFeedback}
                                    onChange={(e) =>
                                        setDraftFeedback(e.target.value)
                                    }
                                    multiline
                                    rows={8}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Fechar</Button>
                    <Button variant="contained" onClick={saveGrade}>
                        Salvar nota
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

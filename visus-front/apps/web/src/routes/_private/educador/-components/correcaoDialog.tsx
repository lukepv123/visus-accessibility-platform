import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { type TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import React, { useMemo, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useGetTarefaById, useAvaliarResposta } from "@visus/api";
import { useQueryClient } from "@tanstack/react-query";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Submission = {
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
    dueDate?: string;
    content: string;
    file?: { nome?: string; url?: string };
    grade?: number | null;
    feedback?: string;
};

interface CorrecaoDialogProps {
    open: boolean;
    onClose: () => void;
    tarefaId?: number;
}

export function CorrecaoDialog({ open, onClose, tarefaId }: CorrecaoDialogProps) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const authClient = useMemo(
        () =>
            token
                ? {
                      headers: {
                          Authorization: `Bearer ${token}`,
                      },
                  }
                : undefined,
        [token],
    );

    const avaliarRespostaMutation = useAvaliarResposta({
        client: authClient,
        mutation: {
            onSuccess: () => {
                // Invalidate and refetch the tarefa to get updated data
                queryClient.invalidateQueries({ 
                    queryKey: [{ url: '/tarefas/:id', params: { id: tarefaId } }] 
                });
            },
        },
    });

    // Buscando tarefa
    const { data: tarefa, isLoading: isLoadingTarefa } = useGetTarefaById(
        tarefaId as number,
        {
            query: {
                // Only fetch if dialog is open, we have an ID, and a token
                enabled: open && !!tarefaId && !!token,
            },
            client: authClient,
        },
    );

    const [submissions, setSubmissions] = useState<Submission[]>([]);

    React.useEffect(() => {
        if (tarefa && Array.isArray(tarefa.respostas)) {
            const mappedData: Submission[] = tarefa.respostas.map((item: any) => ({
                id: String(item.id),
                
                studentName: item.estudanteNome ?? "Aluno sem nome",
                assignmentTitle: tarefa.titulo ?? "Atividade",
                
                submittedAt: item.dataUpload ?? "",
                dueDate: tarefa.dataExpiracao,
                
                content: item.conteudoTexto ?? "",
                
                file: item.arquivo, 
                grade: item.nota,
                
                feedback: item.comentarioEducador
            }));
            setSubmissions(mappedData);
        } else {
            setSubmissions([]);
        }
    }, [tarefa]);
    
    // State for the INNER dialog (individual grading)
    const [innerOpen, setInnerOpen] = useState(false);
    const [selected, setSelected] = useState<Submission | null>(null);
    const [draftGrade, setDraftGrade] = useState<string>("");
    const [draftFeedback, setDraftFeedback] = useState<string>("");
    const [gradeError, setGradeError] = useState<string | null>(null);

    const openSubmission = (s: Submission) => {
        setSelected(s);
        setDraftGrade(s.grade != null ? String(s.grade) : "");
        setDraftFeedback(s.feedback ?? "");
        setGradeError(null);
        setInnerOpen(true);
    };

    const closeInnerDialog = () => {
        setInnerOpen(false);
        setSelected(null);
    };

    const saveGrade = async () => {
        if (!selected) return;
        
        setGradeError(null);

        // Validate grade
        const gradeValue = draftGrade === "" ? null : Number(draftGrade);
        
        if (gradeValue === null) {
            setGradeError("Por favor, informe uma nota.");
            return;
        }

        if (isNaN(gradeValue)) {
            setGradeError("Nota inválida. Use apenas números.");
            return;
        }

        // Get max grade from activity
        const maxGrade = tarefa?.valorTotal ?? 10;
        
        if (gradeValue < 0) {
            setGradeError("A nota não pode ser negativa.");
            return;
        }

        if (gradeValue > maxGrade) {
            setGradeError(`A nota não pode ser maior que ${maxGrade} (valor total da atividade).`);
            return;
        }

        try {
            // Call API to save grade
            await avaliarRespostaMutation.mutateAsync({
                id: Number(selected.id),
                data: {
                    respostaId: Number(selected.id),
                    nota: gradeValue,
                    comentario: draftFeedback || undefined,
                },
            });

            // Update local state
            setSubmissions((prev) =>
                prev.map((p) =>
                    p.id === selected.id
                        ? {
                              ...p,
                              grade: gradeValue,
                              feedback: draftFeedback,
                          }
                        : p,
                ),
            );
            
            closeInnerDialog();
        } catch (error: any) {
            console.error("Erro ao salvar nota:", error);
            setGradeError(
                error?.message ?? "Erro ao salvar nota. Tente novamente."
            );
        }
    };

    const parseDate = (value?: string) => {
        if (!value) return null;
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
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {isLoadingTarefa
                            ? "Carregando atividade..."
                            : `Correção: ${tarefa?.titulo ?? "Atividade"}`}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={onClose}>
                        Fechar
                    </Button>
                </Toolbar>
            </AppBar>

            <DialogContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Card sx={{ minWidth: 180 }}>
                        <CardContent>
                            <Typography variant="subtitle2">Total</Typography>
                            <Typography variant="h6">{stats.total}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 180 }}>
                        <CardContent>
                            <Typography variant="subtitle2">
                                Corrigidas
                            </Typography>
                            <Typography variant="h6">{stats.graded}</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 180 }}>
                        <CardContent>
                            <Typography variant="subtitle2">
                                Atrasadas
                            </Typography>
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
                                    <TableCell>Prazo</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Nota</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {submissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1" color="textSecondary">
                                                Nenhuma resposta encontrada para esta atividade.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    submissions.map((s) => (
                                        <TableRow key={s.id} hover>
                                            <TableCell>{s.studentName}</TableCell>
                                            <TableCell>{s.assignmentTitle}</TableCell>
                                            <TableCell>{s.submittedAt}</TableCell>
                                            <TableCell>{s.dueDate ?? "—"}</TableCell>
                                            <TableCell>
                                                {isLate(s) ? (
                                                    <Chip label="Atrasado" color="error" size="small" />
                                                ) : (
                                                    <Chip label="No prazo" color="default" size="small" />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {s.grade != null ? (
                                                    <Chip label={String(s.grade)} color="success" size="small" />
                                                ) : (
                                                    <Chip label="Sem nota" size="small" />
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button size="small" onClick={() => openSubmission(s)}>
                                                    Abrir
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog
                    open={innerOpen}
                    onClose={closeInnerDialog}
                    fullWidth
                    maxWidth="md"
                >
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
                                            {/* Text Content */}
                                            <Typography
                                                variant="body2"
                                                sx={{ whiteSpace: "pre-wrap", mb: 2 }}
                                            >
                                                {selected.content || (
                                                    <span style={{ fontStyle: "italic", color: "#888" }}>
                                                        Nenhum texto enviado.
                                                    </span>
                                                )}
                                            </Typography>

                                            {/* File Attachment Section */}
                                            {selected.file && selected.file.url && (
                                                <Box
                                                    sx={{
                                                        mt: 2,
                                                        pt: 2,
                                                        borderTop: "1px solid #eee",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Typography variant="caption" color="textSecondary">
                                                        Anexo:
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        href={selected.file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {selected.file.nome ?? "Baixar Arquivo"}
                                                    </Button>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Box>
                                    <TextField
                                        label={`Nota (máximo: ${tarefa?.valorTotal ?? 10})`}
                                        value={draftGrade}
                                        onChange={(e) => {
                                            setDraftGrade(e.target.value);
                                            setGradeError(null);
                                        }}
                                        type="number"
                                        inputProps={{
                                            min: 0,
                                            max: tarefa?.valorTotal ?? 10,
                                            step: 0.1,
                                        }}
                                        fullWidth
                                        sx={{ mb: 2 }}
                                        error={!!gradeError}
                                        helperText={gradeError}
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
                        <Button onClick={closeInnerDialog}>Cancelar</Button>
                        <Button 
                            variant="contained" 
                            onClick={saveGrade}
                            disabled={avaliarRespostaMutation.isPending}
                        >
                            {avaliarRespostaMutation.isPending ? "Salvando..." : "Salvar nota"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
}
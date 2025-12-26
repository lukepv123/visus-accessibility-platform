import {
    Box,
    Button,
    Container,
    FormControlLabel,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/_private/educador/atividades/criar")({
    component: NovaTarefaPage,
});

function NovaTarefaPage() {
    const router = useRouter();

    const disciplinas = [
        { id: "101", nome: "Matemática" },
        { id: "102", nome: "Português" },
        { id: "103", nome: "História" },
    ];

    const [disciplinaId, setDisciplinaId] = React.useState<string>("");
    const [titulo, setTitulo] = React.useState("");
    const [conteudo, setConteudo] = React.useState("");
    const [dataExpiracaoData, setDataExpiracaoData] =
        React.useState<string>("");
    const [dataExpiracaoHora, setDataExpiracaoHora] =
        React.useState<string>("");
    const [valorTotal, setValorTotal] = React.useState<string>("");
    const [permitirArquivoResposta, setPermitirArquivoResposta] =
        React.useState<boolean>(true);

    const canSubmit =
        disciplinaId.trim() &&
        titulo.trim() &&
        conteudo.trim() &&
        dataExpiracaoData.trim() &&
        dataExpiracaoHora.trim() &&
        valorTotal.trim();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const localIso = new Date(
            `${dataExpiracaoData}T${dataExpiracaoHora}`,
        ).toISOString();

        const payload = {
            titulo: titulo.trim(),
            conteudo: conteudo.trim(),
            disciplinaId: Number(disciplinaId),
            dataExpiracao: localIso,
            valorTotal: Number(valorTotal.replace(",", ".")),
            permitirArquivoResposta,
        };

        console.log("Criar tarefa (payload):", payload);
        router.navigate({ to: "/educador" });
    }

    return (
        // 👉 ocupa toda a largura da viewport
        <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
            {/* 👉 wrapper centralizado e mais largo */}
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={700}
                    gutterBottom
                >
                    Criar tarefa
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2, sm: 3 },
                        width: "100%", // ocupa toda a faixa do wrapper
                        borderRadius: 2,
                    }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            {/* DISCIPLINA */}
                            <TextField
                                select
                                label="Disciplina"
                                value={disciplinaId}
                                onChange={(e) =>
                                    setDisciplinaId(e.target.value)
                                }
                                fullWidth
                                required
                            >
                                {disciplinas.map((d) => (
                                    <MenuItem key={d.id} value={d.id}>
                                        {d.nome}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Título"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Conteúdo / Enunciado"
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                fullWidth
                                multiline
                                minRows={4}
                                required
                            />

                            {/* Data + Hora separados */}
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Data de expiração"
                                    type="date"
                                    value={dataExpiracaoData}
                                    onChange={(e) =>
                                        setDataExpiracaoData(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Horário de expiração"
                                    type="time"
                                    value={dataExpiracaoHora}
                                    onChange={(e) =>
                                        setDataExpiracaoHora(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Stack>

                            <TextField
                                label="Valor total (pontos)"
                                value={valorTotal}
                                onChange={(e) => {
                                    const v = e.target.value.replace(",", ".");
                                    if (/^\d*\.?\d*$/.test(v)) setValorTotal(v);
                                }}
                                slotProps={{
                                    htmlInput: { inputMode: "decimal" },
                                }}
                                fullWidth
                                required
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={permitirArquivoResposta}
                                        onChange={(e) =>
                                            setPermitirArquivoResposta(
                                                e.target.checked,
                                            )
                                        }
                                    />
                                }
                                label="Permitir envio de arquivo como resposta"
                            />

                            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!canSubmit}
                                >
                                    Criar tarefa
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        router.navigate({ to: "/educador" })
                                    }
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>

                {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Dica: você poderá editar esta tarefa depois para anexar materiais,
          ajustar o prazo ou os pontos.
        </Typography> */}
            </Box>
        </Container>
    );
}

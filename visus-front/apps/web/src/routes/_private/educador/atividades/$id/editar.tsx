// apps/web/src/routes/_private/educador/tarefas/$id/editar.tsx

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
import { createFileRoute, useParams, useRouter } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute(
    "/_private/educador/atividades/$id/editar",
)({
    component: EditarTarefaPage,
});

// util: quebra um ISO em {date:"YYYY-MM-DD", time:"HH:mm"}
function splitIso(iso: string) {
    const d = new Date(iso);
    const pad = (n: number) => `${n}`.padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
}

function EditarTarefaPage() {
    const { id } = useParams({
        from: "/_private/educador/atividades/$id/editar",
    });
    const router = useRouter();

    // mock de disciplinas (trocar por API real)
    const disciplinas = [
        { id: "101", nome: "Matemática" },
        { id: "102", nome: "Português" },
        { id: "103", nome: "História" },
    ];

    // --- estados do formulário ---
    const [disciplinaId, setDisciplinaId] = React.useState<string>("");
    const [titulo, setTitulo] = React.useState("");
    const [conteudo, setConteudo] = React.useState("");
    const [dataExpiracaoData, setDataExpiracaoData] = React.useState("");
    const [dataExpiracaoHora, setDataExpiracaoHora] = React.useState("");
    const [valorTotal, setValorTotal] = React.useState("");
    const [permitirArquivoResposta, setPermitirArquivoResposta] =
        React.useState(true);

    // carrega dados de exemplo (simulando fetch)
    React.useEffect(() => {
        // Exemplo fictício — troque por GET /tarefas/:id
        const exemplo = {
            id,
            titulo: "Redação: Consciência Ambiental",
            conteudo:
                "Escreva uma redação dissertativa-argumentativa de 20 a 30 linhas.",
            disciplinaId: 102,
            dataExpiracao: "2025-11-25T16:30:00.000Z",
            valorTotal: 10.0,
            permitirArquivoResposta: true,
        };

        const { date, time } = splitIso(exemplo.dataExpiracao);
        setDisciplinaId(String(exemplo.disciplinaId));
        setTitulo(exemplo.titulo);
        setConteudo(exemplo.conteudo);
        setDataExpiracaoData(date);
        setDataExpiracaoHora(time);
        setValorTotal(String(exemplo.valorTotal));
        setPermitirArquivoResposta(exemplo.permitirArquivoResposta);
    }, [id]);

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
            id, // importante para o update
            titulo: titulo.trim(),
            conteudo: conteudo.trim(),
            disciplinaId: Number(disciplinaId),
            dataExpiracao: localIso,
            valorTotal: Number(valorTotal.replace(",", ".")),
            permitirArquivoResposta,
        };

        // TODO: PUT /tarefas/:id com payload
        console.log("Atualizar tarefa:", payload);

        router.navigate({ to: "/educador" });
    }

    return (
        <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight={700}
                    gutterBottom
                >
                    Editar tarefa
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
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
                                    Salvar alterações
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

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    ID da tarefa: <b>{id}</b>
                </Typography>
            </Box>
        </Container>
    );
}

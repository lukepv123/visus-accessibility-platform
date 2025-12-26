// apps/web/src/routes/_private/gestor/instituicao/editar.tsx

import {
    Box,
    Button,
    Container,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
    getInstituicaoById,
    type InstituicaoDetailsDTO,
    updateInstituicao,
} from "@visus/api";
import * as React from "react";
import { useAuth } from "../../../../contexts/AuthContext";

export const Route = createFileRoute("/_private/gestor/instituicao/editar")({
    component: EditarInstituicaoPage,
});

// ---------- Utils (máscaras simples) ----------
const onlyDigits = (s: string) => s.replace(/\D/g, "");

function formatPhoneBR(s: string) {
    const d = onlyDigits(s).slice(0, 11); // (99) 99999-9999
    const p1 = d.slice(0, 2);
    const p2 = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
    const p3 = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
    if (!p2) return p1 ? `(${p1}` : "";
    if (!p3) return `(${p1}) ${p2}`;
    return `(${p1}) ${p2}-${p3}`;
}

function formatCNPJ(s: string) {
    const d = onlyDigits(s).slice(0, 14); // 99.999.999/9999-99
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 5);
    const p3 = d.slice(5, 8);
    const p4 = d.slice(8, 12);
    const p5 = d.slice(12, 14);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `/${p4}`;
    if (p5) out += `-${p5}`;
    return out;
}

function formatCEP(s: string) {
    const d = onlyDigits(s).slice(0, 8); // 99999-999
    const p1 = d.slice(0, 5);
    const p2 = d.slice(5, 8);
    return p2 ? `${p1}-${p2}` : p1;
}

const UFs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
];

// ---------- Página ----------
function EditarInstituicaoPage() {
    const router = useRouter();
    const { user, token } = useAuth();

    const instituicaoId = user?.instituicao?.id;

    // estados
    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [cnpj, setCnpj] = React.useState("");
    const [email, setEmail] = React.useState("");

    const [logradouro, setLogradouro] = React.useState("");
    const [numero, setNumero] = React.useState("");
    const [bairro, setBairro] = React.useState("");
    const [cidade, setCidade] = React.useState("");
    const [estado, setEstado] = React.useState("");
    const [cep, setCep] = React.useState("");

    // ---------- GET para carregar a instituição ----------
    React.useEffect(() => {
        if (!instituicaoId || !token) return;

        const load = async () => {
            try {
                const instituicao: InstituicaoDetailsDTO =
                    await getInstituicaoById(instituicaoId, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                setNome(instituicao.nome ?? "");
                setTelefone(formatPhoneBR(instituicao.telefone ?? ""));
                setCnpj(formatCNPJ(instituicao.cnpj ?? ""));
                setEmail(instituicao.email ?? "");

                setLogradouro(instituicao.endereco?.logradouro ?? "");
                setNumero(instituicao.endereco?.numero ?? "");
                setBairro(instituicao.endereco?.bairro ?? "");
                setCidade(instituicao.endereco?.cidade ?? "");
                setEstado(instituicao.endereco?.estado ?? "");
                setCep(formatCEP(instituicao.endereco?.cep ?? ""));
            } catch (err) {
                console.error("Erro ao buscar instituição:", err);
            }
        };

        load();
    }, [instituicaoId, token]);

    const canSubmit =
        nome.trim() &&
        telefone.trim() &&
        cnpj.trim() &&
        email.trim() &&
        logradouro.trim() &&
        numero.trim() &&
        bairro.trim() &&
        cidade.trim() &&
        estado.trim() &&
        cep.trim();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            nome: nome.trim(),
            telefone: onlyDigits(telefone),
            cnpj: onlyDigits(cnpj),
            email: email.trim(),
            endereco: {
                logradouro: logradouro.trim(),
                numero: numero.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                estado: estado.trim(),
                cep: onlyDigits(cep),
            },
        };

        try {
            if (!user?.instituicao?.id)
                throw new Error("ID da instituição não encontrado");

            await updateInstituicao(user.instituicao.id, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Instituição atualizada com sucesso");
            router.navigate({ to: "/gestor" });
        } catch (err) {
            console.error("Erro ao atualizar instituição:", err);
        }
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
                    Editar instituição
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
                >
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            <TextField
                                label="Nome da instituição"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                                fullWidth
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(
                                            formatPhoneBR(e.target.value),
                                        )
                                    }
                                    required
                                    fullWidth
                                    slotProps={{
                                        htmlInput: { inputMode: "numeric" },
                                    }}
                                    placeholder="(11) 99999-9999"
                                />
                                <TextField
                                    label="CNPJ"
                                    value={cnpj}
                                    onChange={(e) =>
                                        setCnpj(formatCNPJ(e.target.value))
                                    }
                                    required
                                    fullWidth
                                    slotProps={{
                                        htmlInput: { inputMode: "numeric" },
                                    }}
                                    placeholder="12.345.678/0001-90"
                                />
                            </Stack>

                            <TextField
                                label="E-mail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                slotProps={{
                                    htmlInput: { inputMode: "email" },
                                }}
                            />

                            <Typography variant="h6" sx={{ mt: 1 }}>
                                Endereço
                            </Typography>

                            <TextField
                                label="Logradouro"
                                value={logradouro}
                                onChange={(e) => setLogradouro(e.target.value)}
                                required
                                fullWidth
                            />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Número"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Bairro"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Stack>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <TextField
                                    label="Cidade"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    select
                                    label="Estado (UF)"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                    fullWidth
                                >
                                    {UFs.map((uf) => (
                                        <MenuItem key={uf} value={uf}>
                                            {uf}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>

                            <TextField
                                label="CEP"
                                value={cep}
                                onChange={(e) =>
                                    setCep(formatCEP(e.target.value))
                                }
                                required
                                fullWidth
                                slotProps={{
                                    htmlInput: { inputMode: "numeric" },
                                }}
                                placeholder="12345-678"
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
                                        router.navigate({ to: "/gestor" })
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
                    Dica: CNPJ, CEP e telefone são enviados sem pontuação
                    (somente dígitos).
                </Typography>
            </Box>
        </Container>
    );
}

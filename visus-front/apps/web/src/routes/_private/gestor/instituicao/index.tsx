// apps/web/src/routes/gestor/instituicao/index.tsx

import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import type * as React from "react";
import { useAuth } from "../../../../lib/hooks/useAuth";

export const Route = createFileRoute("/_private/gestor/instituicao/")({
    component: InstituicaoPage,
});

/* Helpers */
const onlyDigits = (s: string) => s.replace(/\D/g, "");

function formatPhoneBR(s: string) {
    const d = onlyDigits(s).slice(0, 11);
    const p1 = d.slice(0, 2);
    const p2 = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
    const p3 = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
    if (!p2) return p1 ? `(${p1}` : "";
    if (!p3) return `(${p1}) ${p2}`;
    return `(${p1}) ${p2}-${p3}`;
}

function formatCNPJ(s: string) {
    const d = onlyDigits(s).slice(0, 14);
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
    const d = onlyDigits(s).slice(0, 8);
    const p1 = d.slice(0, 5);
    const p2 = d.slice(5, 8);
    return p2 ? `${p1}-${p2}` : p1;
}

/* Tipos */
type Instituicao = {
    nome: string;
    telefone: string;
    cnpj: string;
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

function InstituicaoPage() {
    const router = useRouter();
    const { user } = useAuth();
    // user.instituicao is either null or an object
    const instituicao = user?.instituicao ?? null;

    const goEditar = () =>
        router.navigate({ to: "/gestor/instituicao/editar" });
    const goCriar = () => router.navigate({ to: "/gestor/instituicao/criar" });

    return (
        <Container maxWidth={false} disableGutters sx={{ py: 4 }}>
            <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3 } }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h4" component="h1" fontWeight={700}>
                        Instituição
                    </Typography>
                    {instituicao ? (
                        <Button
                            variant="outlined"
                            onClick={goEditar}
                            component={Link}
                            to="/gestor/instituicao/editar"
                        >
                            Editar
                        </Button>
                    ) : null}
                </Stack>

                {/* Carregando */}
                {instituicao === undefined && (
                    <Paper
                        variant="outlined"
                        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
                    >
                        <Typography color="text.secondary">
                            Carregando informações…
                        </Typography>
                    </Paper>
                )}

                {/* Sem instituição */}
                {instituicao === null && (
                    <Paper
                        variant="outlined"
                        sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}
                    >
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Nenhuma instituição vinculada ao seu perfil foi
                            encontrada.
                        </Alert>
                        <Button
                            variant="contained"
                            onClick={goCriar}
                            component={Link}
                            to="/gestor/instituicao/criar"
                        >
                            Cadastrar instituição
                        </Button>
                    </Paper>
                )}

                {/* Com instituição */}
                {instituicao && (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: { xs: 2, sm: 3 },
                            borderRadius: 3,
                            bgcolor: (t) => t.palette.action.hover,
                            borderColor: "divider",
                        }}
                    >
                        {/* Título + Chip */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <Typography variant="h5" fontWeight={700}>
                                {instituicao.nome}
                            </Typography>
                            <Chip
                                size="small"
                                color="primary"
                                label="Ativa"
                                variant="outlined"
                            />
                        </Stack>

                        {/* Contatos */}
                        <SectionTitle>Dados e contato</SectionTitle>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={4}>
                                <InfoCard
                                    icon={<BusinessIcon fontSize="small" />}
                                    label="CNPJ"
                                    value={formatCNPJ(instituicao.cnpj)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoCard
                                    icon={<PhoneIcon fontSize="small" />}
                                    label="Telefone"
                                    value={
                                        <a
                                            href={`tel:${onlyDigits(instituicao.telefone)}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {formatPhoneBR(
                                                instituicao.telefone,
                                            )}
                                        </a>
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoCard
                                    icon={<EmailIcon fontSize="small" />}
                                    label="E-mail"
                                    value={
                                        <a
                                            href={`mailto:${instituicao.email}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            {instituicao.email}
                                        </a>
                                    }
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Endereço */}
                        <SectionTitle>
                            <LocationOnIcon
                                fontSize="small"
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: 6,
                                }}
                            />
                            Endereço
                        </SectionTitle>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <LabeledText
                                    label="Logradouro"
                                    value={`${instituicao.endereco.logradouro}, ${instituicao.endereco.numero}`}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LabeledText
                                    label="Bairro"
                                    value={instituicao.endereco.bairro}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LabeledText
                                    label="Cidade/UF"
                                    value={`${instituicao.endereco.cidade} - ${instituicao.endereco.estado}`}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LabeledText
                                    label="CEP"
                                    value={formatCEP(instituicao.endereco.cep)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                )}
            </Box>
        </Container>
    );
}

/* Subcomponentes visuais */

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
        >
            {children}
        </Typography>
    );
}

function InfoCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <Box
            sx={(t) => ({
                p: 2,
                borderRadius: 2,
                bgcolor: t.palette.background.paper,
                border: 1,
                borderColor: t.palette.divider,
                height: "100%",
            })}
        >
            <Stack spacing={0.5}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                    }}
                >
                    {icon}
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {value}
                </Typography>
            </Stack>
        </Box>
    );
}

function LabeledText({ label, value }: { label: string; value: string }) {
    return (
        <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{value}</Typography>
        </Stack>
    );
}

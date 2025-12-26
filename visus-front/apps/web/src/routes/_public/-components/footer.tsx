import {
    Box,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";

function NavItem({
    to,
    children,
    external,
}: {
    to: string;
    children: React.ReactNode;
    external?: boolean;
}) {
    // Navegação interna (TanStack) vs link externo
    if (!external) {
        return (
            <Box
                component={Link}
                to={to}
                sx={{
                    display: "inline-block",
                    color: "text.secondary",
                    textDecoration: "none",
                    py: 0.5,
                    "&:hover": {
                        color: "text.primary",
                        textDecoration: "underline",
                    },
                }}
            >
                {children}
            </Box>
        );
    }
    return (
        <Box
            component="a"
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
                display: "inline-block",
                color: "text.secondary",
                textDecoration: "none",
                py: 0.5,
                "&:hover": {
                    color: "text.primary",
                    textDecoration: "underline",
                },
            }}
        >
            {children}
        </Box>
    );
}

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={(t) => ({
                mt: "auto",
                borderTop: 1,
                borderColor: t.palette.divider,
                bgcolor: t.palette.background.paper,
            })}
        >
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Grid container spacing={4}>
                    {/* Marca */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={1.5}>
                            <Box
                                component={Link}
                                to="/"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                                aria-label="Visus — página inicial"
                            >
                                <Box
                                    component="img"
                                    src="/src/assets/logo.svg"
                                    alt=""
                                    aria-hidden
                                    sx={{ height: 28, width: "auto" }}
                                />
                                <Typography variant="h6" fontWeight={700}>
                                    Visus
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Plataforma de comunicação acadêmica com foco em
                                acessibilidade.
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Produto */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            gutterBottom
                        >
                            Produto
                        </Typography>
                        <Stack spacing={0.5}>
                            <NavItem to="/recursos">Recursos</NavItem>
                            <NavItem to="/acessibilidade">
                                Acessibilidade
                            </NavItem>
                            <NavItem to="/instituicoes">
                                Para instituições
                            </NavItem>
                        </Stack>
                    </Grid>

                    {/* Suporte */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            gutterBottom
                        >
                            Suporte
                        </Typography>
                        <Stack spacing={0.5}>
                            <NavItem to="/ajuda">Central de ajuda</NavItem>
                            <NavItem to="/contato">Contato</NavItem>
                            <NavItem to="/status">Status</NavItem>
                            {/* Externo (exemplo) */}
                            {/* <NavItem to="https://docs.seuapp.com" external>Documentação</NavItem> */}
                        </Stack>
                    </Grid>

                    {/* Conta */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            gutterBottom
                        >
                            Conta
                        </Typography>
                        <Stack spacing={0.5}>
                            <NavItem to="/_public/login">Entrar</NavItem>
                            <NavItem to="/_public/cadastro">
                                Criar conta
                            </NavItem>
                            <NavItem to="/_public/recuperar-senha">
                                Recuperar senha
                            </NavItem>
                        </Stack>
                    </Grid>

                    {/* Legal */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            gutterBottom
                        >
                            Legal
                        </Typography>
                        <Stack spacing={0.5}>
                            <NavItem to="/privacidade">
                                Privacidade (LGPD)
                            </NavItem>
                            <NavItem to="/termos">Termos de uso</NavItem>
                            <NavItem to="/acessibilidade">
                                Declaração de acessibilidade
                            </NavItem>
                        </Stack>
                    </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 3, md: 4 } }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                >
                    <Typography variant="body2" color="text.secondary">
                        © {year} Visus. Todos os direitos reservados.
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <NavItem to="/privacidade">Privacidade</NavItem>
                        <NavItem to="/termos">Termos</NavItem>
                        <NavItem to="/contato">Contato</NavItem>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;

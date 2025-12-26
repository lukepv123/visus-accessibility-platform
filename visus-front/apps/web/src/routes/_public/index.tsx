import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { createFileRoute, Link } from "@tanstack/react-router";

function SkipLink() {
    return (
        <Box
            component="a"
            href="#conteudo"
            sx={{
                position: "absolute",
                left: -9999,
                top: "auto",
                width: 1,
                height: 1,
                overflow: "hidden",
                zIndex: -1,
                "&:focus": {
                    position: "static",
                    width: "auto",
                    height: "auto",
                    m: 1,
                    px: 1,
                    py: 0.5,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                    borderRadius: 1,
                    zIndex: 1200,
                },
            }}
        >
            Pular para o conteúdo
        </Box>
    );
}

function Hero() {
    return (
        <Box
            component="section"
            sx={(t) => ({
                bgcolor: t.palette.background.paper,
                borderBottom: 1,
                borderColor: t.palette.divider,
                py: { xs: 4, md: 6 },
            })}
        >
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <Typography variant="h3" fontWeight={700}>
                        Comunicação acadêmica acessível para todos.
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        maxWidth={720}
                    >
                        Plataforma web para alunos, educadores e gestores, com
                        foco em acessibilidade, alto contraste e navegação por
                        teclado.
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            to="/cadastro"
                        >
                            Criar conta grátis
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            to="#funcionalidades"
                        >
                            Ver funcionalidades
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

function ValueProps() {
    const items = [
        {
            title: "Alto contraste",
            desc: "Temas claro/escuro e opção de contraste elevado baseados nos seus tokens.",
        },
        {
            title: "Conteúdos acessíveis",
            desc: "Textos claros, rótulos de campos e componentes com semântica correta.",
        },
        {
            title: "Navegação por teclado",
            desc: "Ordem lógica de foco e indicadores visíveis em todos os componentes.",
        },
    ];

    return (
        <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    component="h2"
                    fontWeight={700}
                    gutterBottom
                >
                    Funcionalidades
                </Typography>
                <Grid container spacing={3}>
                    {items.map((it) => (
                        <Grid key={it.title} item xs={12} md={4}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        gutterBottom
                                    >
                                        {it.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {it.desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

function FeatureBand({
    title,
    desc,
    imageSrc,
    imageAlt = "",
    reverse = false,
}: {
    title: string;
    desc: string;
    imageSrc?: string;
    imageAlt?: string;
    reverse?: boolean;
}) {
    return (
        <Box
            component="section"
            sx={(t) => ({
                py: { xs: 6, md: 10 },
                borderTop: 1,
                borderColor: t.palette.divider,
            })}
        >
            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={4}
                    alignItems="center"
                    sx={{ flexWrap: { xs: "wrap", lg: "nowrap" } }}
                >
                    {/* Texto */}
                    <Grid
                        item
                        xs={12}
                        lg={6}
                        sx={{
                            // em telas pequenas: se reverse, texto vai abaixo (2)
                            // em telas grandes: se reverse, texto vai para a direita (2)
                            order: { xs: reverse ? 2 : 1, lg: reverse ? 2 : 1 },
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h4" fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography color="text.secondary">
                                {desc}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                {/* <Button component={Link} to="/recursos" variant="outlined">
                  Ver recursos
                </Button>
                <Button component={Link} to="/_public/login" variant="text">
                  Entrar
                </Button> */}
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Imagem */}
                    <Grid
                        item
                        xs={12}
                        lg={6}
                        sx={{
                            // em telas pequenas: se reverse, imagem vai acima (1)
                            // em telas grandes: se reverse, imagem vai para a esquerda (1)
                            order: { xs: reverse ? 1 : 2, lg: reverse ? 1 : 2 },
                        }}
                    >
                        {imageSrc ? (
                            <Box
                                component="img"
                                src={imageSrc}
                                alt={imageAlt}
                                sx={(t) => ({
                                    display: "block",
                                    width: "100%",
                                    height: { xs: 220, md: 320 },
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: t.palette.divider,
                                    boxShadow: t.shadows[1],
                                    "@media (prefers-reduced-motion: no-preference)":
                                        {
                                            transition: "transform .2s ease",
                                            "&:hover": {
                                                transform: "scale(1.01)",
                                            },
                                        },
                                })}
                            />
                        ) : (
                            <Box
                                aria-hidden
                                sx={(t) => ({
                                    width: "100%",
                                    height: { xs: 220, md: 320 },
                                    borderRadius: 2,
                                    bgcolor: t.palette.action.hover,
                                    border: 1,
                                    borderColor: t.palette.divider,
                                })}
                            />
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function FinalCTA() {
    return (
        <Box
            component="section"
            sx={(t) => ({
                py: { xs: 6, md: 10 },
                borderTop: 1,
                borderColor: t.palette.divider,
                bgcolor: t.palette.background.paper,
            })}
        >
            <Container maxWidth="lg">
                <Stack spacing={2} alignItems="flex-start">
                    <Typography variant="h4" fontWeight={700}>
                        Pronto para começar?
                    </Typography>
                    <Typography color="text.secondary" maxWidth={720}>
                        Crie sua conta e experimente uma experiência de
                        comunicação pensada para acessibilidade desde o primeiro
                        clique.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/_public/cadastro"
                        >
                            Criar conta
                        </Button>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/_public/login"
                        >
                            Entrar
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

function Home() {
    return (
        <>
            <SkipLink />
            <main id="conteudo">
                <Hero />
                <FeatureBand
                    title="Salas e mensagens acessíveis"
                    desc="Organize conversas por turma, disciplina ou projeto, com componentes focáveis e atalhos de teclado."
                    imageSrc="/src/assets/ivan-aleksic-PDRFeeDniCk-unsplash.jpg"
                    imageAlt="Ambiente de sala de aula"
                />
                <FeatureBand
                    title="Aulas e materiais"
                    desc="Agenda clara, envio de arquivos e conteúdos com rótulos e mensagens de erro descritivas."
                    imageSrc="/src/assets/unseen-studio-s9CC2SKySJM-unsplash.jpg"
                    imageAlt="Pessoa fazendo atividade"
                    reverse
                />
                <div id="funcionalidades">
                    <ValueProps />
                </div>
                <FinalCTA />
            </main>
        </>
    );
}

export const Route = createFileRoute("/_public/")({
    component: Home,
});

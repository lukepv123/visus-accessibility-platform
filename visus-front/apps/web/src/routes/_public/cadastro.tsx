// apps/web/src/routes/_public/cadastro.tsx
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    ClickAwayListener,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grow,
    IconButton,
    InputAdornment,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
// 👇 imports vindos do Kubb (@visus/api)
import {
    type RegisterDTO,
    registerDTOAnoEscolarEnum,
    registerDTOGeneroEnum,
    registerDTOPeriodoEnum,
    registerDTOUserTypeEnum,
    useRegister,
} from "@visus/api";
import * as React from "react";

type Perfil = "Aluno" | "Educador" | "Gestor";
const perfis: Perfil[] = ["Aluno", "Educador", "Gestor"];

const perfilToUserType: Record<Perfil, keyof typeof registerDTOUserTypeEnum> = {
    Aluno: "ESTUDANTE",
    Educador: "EDUCADOR",
    Gestor: "GESTOR",
};

const maskCPF = (v: string) =>
    v
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) =>
    v
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");

const anosEscolares = [
    { label: "1º Fundamental", value: registerDTOAnoEscolarEnum.PRIMEIRO_ANO },
    { label: "2º Fundamental", value: registerDTOAnoEscolarEnum.SEGUNDO_ANO },
    { label: "3º Fundamental", value: registerDTOAnoEscolarEnum.TERCEIRO_ANO },
    { label: "4º Fundamental", value: registerDTOAnoEscolarEnum.QUARTO_ANO },
    { label: "5º Fundamental", value: registerDTOAnoEscolarEnum.QUINTO_ANO },
    { label: "6º Fundamental", value: registerDTOAnoEscolarEnum.SEXTO_ANO },
    { label: "7º Fundamental", value: registerDTOAnoEscolarEnum.SETIMO_ANO },
    { label: "8º Fundamental", value: registerDTOAnoEscolarEnum.OITAVO_ANO },
    { label: "9º Fundamental", value: registerDTOAnoEscolarEnum.NONO_ANO },
    { label: "1º Médio", value: registerDTOAnoEscolarEnum.PRIMEIO_ANO_EM },
    { label: "2º Médio", value: registerDTOAnoEscolarEnum.SEGUNDO_ANO_EM },
    { label: "3º Médio", value: registerDTOAnoEscolarEnum.TERCEIRO_ANO_EM },
] as const;

const generos = [
    { label: "Masculino", value: "MASCULINO" },
    { label: "Feminino", value: "FEMININO" },
    { label: "Outro", value: "OUTRO" },
    { label: "Prefiro não informar", value: "NAO_INFORMAR" },
] as const;

const periodos = [
    { label: "Matutino", value: "MATUTINO" },
    { label: "Vespertino", value: "VESPERTINO" },
    { label: "Noturno", value: "NOTURNO" },
] as const;

function PerfilSplitButton({
    value,
    onChange,
    label = "Selecionar perfil",
    disabled = false,
}: {
    value: Perfil;
    onChange: (perfil: Perfil) => void;
    label?: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const selectedIndex = React.useMemo(() => perfis.indexOf(value), [value]);

    const handleToggle = () => setOpen((prev) => !prev);
    const handleClose = (event: Event) => {
        if (anchorRef.current?.contains(event.target as HTMLElement)) return;
        setOpen(false);
    };
    const handleItemClick = (_: unknown, index: number) => {
        onChange(perfis[index]);
        setOpen(false);
    };

    return (
        <>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Selecionar perfil de cadastro"
            >
                <Button
                    onClick={() => setOpen(false)}
                    aria-label={`${label}: ${perfis[selectedIndex]}`}
                    sx={{ textTransform: "none" }}
                    disabled={disabled}
                >
                    {perfis[selectedIndex]}
                </Button>
                <Button
                    size="small"
                    aria-controls={open ? "perfil-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="menu"
                    aria-label={label}
                    onClick={handleToggle}
                    disabled={disabled}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>

            <Popper
                sx={{ zIndex: 1200 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === "bottom"
                                    ? "center top"
                                    : "center bottom",
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="perfil-menu" autoFocusItem>
                                    {perfis.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={index === selectedIndex}
                                            onClick={(e) =>
                                                handleItemClick(e, index)
                                            }
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

function CadastroPage() {
    const navigate = useNavigate();

    // ❌ antes: tinha onSuccess sempre indo pro /login
    // ✅ agora: vamos controlar o redirect manualmente no handleSubmit
    const {
        mutateAsync: doRegister,
        isPending: isLoading,
        error,
    } = useRegister();

    const [localError, setLocalError] = React.useState<string | null>(null);

    const [perfil, setPerfil] = React.useState<Perfil>("Aluno");

    // comuns
    const [nome, setNome] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [mostrarSenha, setMostrarSenha] = React.useState(false);

    // aluno + educador + gestor (compartilhados)
    const [cpf, setCpf] = React.useState("");
    const [matriculaAluno, setMatriculaAluno] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [dataNascimento, setDataNascimento] = React.useState("");
    const [periodo, setPeriodo] = React.useState<
        "" | (typeof periodos)[number]["value"]
    >("");
    const [anoEscolar, setAnoEscolar] = React.useState<
        "" | (typeof anosEscolares)[number]["value"]
    >("");
    const [genero, setGenero] = React.useState<
        "" | (typeof generos)[number]["value"]
    >("");

    // educador
    const [titulo, setTitulo] = React.useState("");

    // gestor
    const [cargo, setCargo] = React.useState("");

    const canSubmitCommon = nome.trim() && email.trim() && senha.trim();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (!canSubmitCommon) {
            setLocalError("Preencha nome, e-mail e senha.");
            return;
        }

        const dtoBase: Partial<RegisterDTO> = {
            nome: nome.trim(),
            email: email.trim(),
            senha: senha,
            userType: registerDTOUserTypeEnum[perfilToUserType[perfil]],
        };

        let dto: RegisterDTO;

        if (perfil === "Aluno") {
            if (
                !cpf ||
                !matriculaAluno ||
                !telefone ||
                !dataNascimento ||
                !periodo ||
                !anoEscolar ||
                !genero
            ) {
                setLocalError(
                    "Preencha todos os campos obrigatórios de Aluno.",
                );
                return;
            }
            dto = {
                ...dtoBase,
                cpf,
                matricula: Number(matriculaAluno),
                telefone,
                dataNascimento,
                periodo: registerDTOPeriodoEnum[periodo],
                anoEscolar: registerDTOAnoEscolarEnum[anoEscolar],
                genero: registerDTOGeneroEnum[genero],
            } as RegisterDTO;
        } else if (perfil === "Educador") {
            if (!cpf || !telefone || !dataNascimento || !genero || !titulo) {
                setLocalError(
                    "Preencha CPF, telefone, gênero, data de nascimento e título para Educador.",
                );
                return;
            }
            dto = {
                ...dtoBase,
                cpf,
                telefone,
                dataNascimento,
                genero: registerDTOGeneroEnum[genero],
                titulo,
            } as RegisterDTO;
        } else {
            // Gestor – sem matrícula
            if (!cpf || !telefone || !dataNascimento || !genero || !cargo) {
                setLocalError(
                    "Preencha CPF, telefone, gênero, data de nascimento e cargo para Gestor.",
                );
                return;
            }
            dto = {
                ...dtoBase,
                cpf,
                telefone,
                dataNascimento,
                genero: registerDTOGeneroEnum[genero],
                cargo,
            } as RegisterDTO;
        }

        try {
            await doRegister({ data: dto });

            // ✅ pós-sucesso: redireciono dependendo do perfil
            if (perfil === "Gestor") {
                navigate({ to: "/gestor/instituicao/criar" });
            } else {
                navigate({ to: "/login" });
            }
        } catch {
            // erro já cai no `error` do hook; não fazemos nada aqui
        }
    }

    const apiError = (error as any)?.message ?? null;

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Stack spacing={3}>
                <Typography variant="h4">Cadastro</Typography>

                {(localError || apiError) && (
                    <Alert severity="error">{localError ?? apiError}</Alert>
                )}

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">Perfil:</Typography>
                    <PerfilSplitButton
                        value={perfil}
                        onChange={setPerfil}
                        disabled={isLoading}
                    />
                </Stack>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        {/* comuns */}
                        <TextField
                            label="Nome completo"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            fullWidth
                            required
                            autoComplete="name"
                            disabled={isLoading}
                        />

                        <TextField
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            autoComplete="email"
                            disabled={isLoading}
                            slotProps={{ input: { inputMode: "email" } }}
                        />

                        <TextField
                            label="Senha"
                            type={mostrarSenha ? "text" : "password"}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            fullWidth
                            required
                            disabled={isLoading}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    mostrarSenha
                                                        ? "Ocultar senha"
                                                        : "Mostrar senha"
                                                }
                                                onClick={() =>
                                                    setMostrarSenha((s) => !s)
                                                }
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                edge="end"
                                            >
                                                {mostrarSenha ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                        {/* aluno */}
                        {perfil === "Aluno" && (
                            <Stack spacing={2}>
                                <TextField
                                    label="CPF"
                                    value={cpf}
                                    onChange={(e) =>
                                        setCpf(maskCPF(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{
                                        input: { inputMode: "numeric" },
                                    }}
                                />

                                <TextField
                                    label="Matrícula"
                                    value={matriculaAluno}
                                    onChange={(e) =>
                                        setMatriculaAluno(
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{
                                        input: { inputMode: "numeric" },
                                    }}
                                />

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                >
                                    <FormLabel id="periodo">Período</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="periodo"
                                        value={periodo}
                                        onChange={(e) =>
                                            setPeriodo(e.target.value as any)
                                        }
                                    >
                                        {periodos.map((p) => (
                                            <FormControlLabel
                                                key={p.value}
                                                value={p.value}
                                                control={<Radio />}
                                                label={p.label}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                >
                                    <FormLabel>Ano escolar</FormLabel>
                                    <Select
                                        value={anoEscolar}
                                        onChange={(e) =>
                                            setAnoEscolar(e.target.value as any)
                                        }
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Selecione…</em>
                                        </MenuItem>
                                        {anosEscolares.map((a) => (
                                            <MenuItem
                                                key={a.value}
                                                value={a.value}
                                            >
                                                {a.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(maskPhone(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ input: { inputMode: "tel" } }}
                                />

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                >
                                    <FormLabel>Gênero</FormLabel>
                                    <Select
                                        value={genero}
                                        onChange={(e) =>
                                            setGenero(e.target.value as any)
                                        }
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Selecione…</em>
                                        </MenuItem>
                                        {generos.map((g) => (
                                            <MenuItem
                                                key={g.value}
                                                value={g.value}
                                            >
                                                {g.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Data de nascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) =>
                                        setDataNascimento(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Stack>
                        )}

                        {/* educador */}
                        {perfil === "Educador" && (
                            <Stack spacing={2}>
                                <TextField
                                    label="CPF"
                                    value={cpf}
                                    onChange={(e) =>
                                        setCpf(maskCPF(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{
                                        input: { inputMode: "numeric" },
                                    }}
                                />

                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(maskPhone(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ input: { inputMode: "tel" } }}
                                />

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                >
                                    <FormLabel>Gênero</FormLabel>
                                    <Select
                                        value={genero}
                                        onChange={(e) =>
                                            setGenero(e.target.value as any)
                                        }
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Selecione…</em>
                                        </MenuItem>
                                        {generos.map((g) => (
                                            <MenuItem
                                                key={g.value}
                                                value={g.value}
                                            >
                                                {g.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Data de nascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) =>
                                        setDataNascimento(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />

                                <TextField
                                    label="Título"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                />
                            </Stack>
                        )}

                        {/* gestor */}
                        {perfil === "Gestor" && (
                            <Stack spacing={2}>
                                <TextField
                                    label="CPF"
                                    value={cpf}
                                    onChange={(e) =>
                                        setCpf(maskCPF(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{
                                        input: { inputMode: "numeric" },
                                    }}
                                />

                                <TextField
                                    label="Telefone"
                                    value={telefone}
                                    onChange={(e) =>
                                        setTelefone(maskPhone(e.target.value))
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ input: { inputMode: "tel" } }}
                                />

                                <FormControl
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                >
                                    <FormLabel>Gênero</FormLabel>
                                    <Select
                                        value={genero}
                                        onChange={(e) =>
                                            setGenero(e.target.value as any)
                                        }
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>Selecione…</em>
                                        </MenuItem>
                                        {generos.map((g) => (
                                            <MenuItem
                                                key={g.value}
                                                value={g.value}
                                            >
                                                {g.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Data de nascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(e) =>
                                        setDataNascimento(e.target.value)
                                    }
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />

                                <TextField
                                    label="Cargo"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    fullWidth
                                    required
                                    disabled={isLoading}
                                />
                            </Stack>
                        )}

                        <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading || !canSubmitCommon}
                            >
                                {isLoading ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    "Criar conta"
                                )}
                            </Button>
                            <Button
                                component={Link}
                                to="/"
                                variant="outlined"
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                <Typography color="text.secondary" variant="body2">
                    Já possui conta?{" "}
                    <Button component={Link} to="/login" size="small">
                        Entrar
                    </Button>
                </Typography>
            </Stack>
        </Container>
    );
}

export const Route = createFileRoute("/_public/cadastro")({
    component: CadastroPage,
});

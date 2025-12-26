// apps/web/src/routes/_private/-components/users/UsuarioGridCard.tsx

import { Link as LinkIcon, LinkOff as LinkOffIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import React from "react";

export type UserRole = "ESTUDANTE" | "EDUCADOR" | "GESTOR";

export interface UsuarioInstituicaoCard {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: UserRole;
    matricula?: string;
    cpf?: string;
    vinculoAtivo: boolean;
    avatarUrl?: string;
}

export interface UsuarioGridCardProps {
    usuario: UsuarioInstituicaoCard;
    onDesvincular: () => void;
}

const getTipoUsuarioLabel = (tipo: UserRole): string => {
    switch (tipo) {
        case "ESTUDANTE":
            return "Estudante";
        case "EDUCADOR":
            return "Educador";
        case "GESTOR":
            return "Gestor";
        default:
            return tipo;
    }
};

export function UsuarioGridCard({
    usuario,
    onDesvincular,
}: UsuarioGridCardProps) {
    return (
        <Card
            variant="outlined"
            sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
                bgcolor: "background.paper",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar
                        alt={usuario.nome}
                        src={usuario.avatarUrl}
                        sx={{
                            width: 72,
                            height: 72,
                            boxShadow: 1,
                            border: "2px solid #ffffff",
                        }}
                    />

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                            {usuario.nome}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Visus · {getTipoUsuarioLabel(usuario.tipoUsuario)}
                            {usuario.matricula
                                ? ` · Matrícula ${usuario.matricula}`
                                : ""}
                            {usuario.cpf ? ` · CPF ${usuario.cpf}` : ""}
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block" }}
                            >
                                Email
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 500,
                                    wordBreak: "break-all",
                                }}
                            >
                                {usuario.email}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                            {usuario.vinculoAtivo ? (
                                <Chip
                                    label="Vinculado à instituição"
                                    color="success"
                                    size="small"
                                    icon={<LinkIcon fontSize="small" />}
                                />
                            ) : (
                                <Chip
                                    label="Sem vínculo"
                                    color="default"
                                    size="small"
                                    icon={<LinkOffIcon fontSize="small" />}
                                />
                            )}
                        </Box>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        mt: 2.5,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <Tooltip title="Desvincular usuário da instituição">
                        <span>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<LinkOffIcon />}
                                disabled={!usuario.vinculoAtivo}
                                onClick={onDesvincular}
                            >
                                Desvincular
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </CardContent>
        </Card>
    );
}

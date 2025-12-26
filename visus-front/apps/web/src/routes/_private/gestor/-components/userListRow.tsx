// apps/web/src/routes/_private/-components/users/UsuarioListRow.tsx

import { Link as LinkIcon, LinkOff as LinkOffIcon } from "@mui/icons-material";
import {
    Avatar,
    Chip,
    IconButton,
    Stack,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import React from "react";

export type UserRole = "ESTUDANTE" | "EDUCADOR" | "GESTOR";

export interface UsuarioInstituicaoRow {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: UserRole;
    matricula?: string;
    cpf?: string;
    vinculoAtivo: boolean;
    avatarUrl?: string;
}

export interface UsuarioListRowProps {
    usuario: UsuarioInstituicaoRow;
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

export function UsuarioListRow({
    usuario,
    onDesvincular,
}: UsuarioListRowProps) {
    return (
        <TableRow hover>
            <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                        alt={usuario.nome}
                        src={usuario.avatarUrl}
                        sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2">{usuario.nome}</Typography>
                </Stack>
            </TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>
                <Chip
                    label={getTipoUsuarioLabel(usuario.tipoUsuario)}
                    size="small"
                    variant="outlined"
                />
            </TableCell>
            <TableCell>{usuario.matricula ?? "-"}</TableCell>
            <TableCell>{usuario.cpf ?? "-"}</TableCell>
            <TableCell>
                {usuario.vinculoAtivo ? (
                    <Chip
                        label="Vinculado"
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
            </TableCell>
            <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Desvincular usuário da instituição">
                        <span>
                            <IconButton
                                color="error"
                                disabled={!usuario.vinculoAtivo}
                                onClick={onDesvincular}
                            >
                                <LinkOffIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
    );
}

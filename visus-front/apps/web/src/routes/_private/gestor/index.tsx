// apps/web/src/routes/_private/gestor/index.tsx

import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
// 👇 Importa o hook gerado pelo Kubb (@visus/api)
import {
    useGetDisciplinasByInstituicao,
    useGetUsuariosFromInstituicao,
} from "@visus/api";
import * as React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { ChipList, MetricCard } from "../-components/MetricCard";

export const Route = createFileRoute("/_private/gestor/")({
    component: GestorHome,
});

export default function GestorHome() {
    const { user, token, refreshUser } = useAuth();

    // Use user data directly as it already contains gestor info
    const gestor = user;
    const isLoading = !user;

    // Debug auth state
    React.useEffect(() => {
        console.log('Auth state:', { user, token, hasInstituicao: !!user?.instituicao });
    }, [user, token]);

    // Get instituicao ID from gestor (user)
    const instituicaoId = gestor?.instituicao?.id;

    // Debug logging
    React.useEffect(() => {
        console.log('Using user as gestor:', { 
            gestor, 
            instituicaoId,
        });
    }, [gestor, instituicaoId]);

    // Fetch disciplines
    const { data: disciplinas, isLoading: loadingDisciplinas } =
        useGetDisciplinasByInstituicao(
            { instituicaoId: instituicaoId || 0 },
            {
                query: {
                    enabled: !!instituicaoId && !!token,
                    refetchOnMount: true,
                    refetchOnWindowFocus: true,
                    refetchInterval: 5000, // Auto-refetch every 5 seconds
                    staleTime: 0, // Always fetch fresh data
                },
                client: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            },
        );

    // Debug logging for disciplinas
    React.useEffect(() => {
        console.log('Disciplinas data:', disciplinas);
        console.log('Disciplinas loading:', loadingDisciplinas);
    }, [disciplinas, loadingDisciplinas]);

    // Fetch users
    const { data: usuarios, isLoading: loadingUsuarios } =
        useGetUsuariosFromInstituicao(instituicaoId || 0, {
            query: {
                enabled: !!instituicaoId && !!token,
                refetchOnMount: true,
                refetchOnWindowFocus: true,
                refetchInterval: 5000, // Auto-refetch every 5 seconds
                staleTime: 0, // Always fetch fresh data
            },
            client: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

    // Debug logging for usuarios
    React.useEffect(() => {
        console.log('Usuarios data:', usuarios);
        console.log('Usuarios loading:', loadingUsuarios);
    }, [usuarios, loadingUsuarios]);

    // Calculate metrics
    const totalDisciplinas = disciplinas?.length || 0;
    const totalUsuarios = usuarios?.length || 0;

    const educadores = React.useMemo(() => {
        if (!usuarios) return [];
        return usuarios.filter(
            (u) =>
                u.funcao?.toLowerCase().includes("educador") ||
                u.funcao?.toLowerCase().includes("professor"),
        );
    }, [usuarios]);

    const estudantes = React.useMemo(() => {
        if (!usuarios) return [];
        return usuarios.filter((u) =>
            u.funcao?.toLowerCase().includes("estudante"),
        );
    }, [usuarios]);

    const gestores = React.useMemo(() => {
        if (!usuarios) return [];
        return usuarios.filter((u) =>
            u.funcao?.toLowerCase().includes("gestor"),
        );
    }, [usuarios]);

    const isLoadingData = isLoading || loadingDisciplinas || loadingUsuarios;

    // Show loading while fetching gestor data
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Bem-vindo, {user?.nome?.split(" ")[0] ?? "Gestor"}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Visão geral da instituição{" "}
                {gestor?.instituicao?.nome || "sua instituição"}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: 2,
                }}
            >
                <MetricCard
                    title="Disciplinas"
                    subtitle={
                        `${totalDisciplinas} ${totalDisciplinas === 1 ? "disciplina" : "disciplinas"} cadastradas`
                    }
                    avatarLetter="D"
                    avatarColor="primary.main"
                    isLoading={isLoadingData}
                    actionLabel="Gerenciar disciplinas"
                    actionLink="/gestor/disciplinas"
                >
                    <ChipList
                        items={disciplinas?.slice(0, 4) || []}
                        isLoading={isLoadingData}
                        renderChip={(d, idx) => (
                            <Chip
                                key={d.id || idx}
                                label={d.nome || "Sem nome"}
                                size="small"
                            />
                        )}
                        emptyMessage="Nenhuma disciplina cadastrada"
                    />
                </MetricCard>

                <MetricCard
                    title="Usuários"
                    subtitle={
                        `${totalUsuarios} ${totalUsuarios === 1 ? "usuário" : "usuários"} no total`
                    }
                    avatarLetter="U"
                    avatarColor="secondary.main"
                    isLoading={isLoadingData}
                    actionLabel="Gerenciar usuários"
                    actionLink="/gestor/usuarios"
                >
                    {!isLoadingData && (
                        <>
                            <Chip
                                label={`Estudantes: ${estudantes.length}`}
                                color="info"
                                size="small"
                            />
                            <Chip
                                label={`Educadores: ${educadores.length}`}
                                color="success"
                                size="small"
                            />
                            <Chip
                                label={`Gestores: ${gestores.length}`}
                                color="warning"
                                size="small"
                            />
                        </>
                    )}
                </MetricCard>

            </Box>
        </Box>
    );
}

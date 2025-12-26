import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import React from "react";

interface MetricCardProps {
    title: string;
    subtitle: string | React.ReactNode;
    avatarLetter: string;
    avatarColor: string;
    isLoading?: boolean;
    actionLabel?: string;
    actionLink?: string;
    children?: React.ReactNode;
}

export function MetricCard({
    title,
    subtitle,
    avatarLetter,
    avatarColor,
    isLoading = false,
    actionLabel,
    actionLink,
    children,
}: MetricCardProps) {
    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Avatar sx={{ bgcolor: avatarColor }}>
                        {avatarLetter}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">{title}</Typography>
                        <Typography color="text.secondary">
                            {isLoading ? (
                                <CircularProgress size={16} sx={{ ml: 1 }} />
                            ) : (
                                subtitle
                            )}
                        </Typography>
                    </Box>
                </Box>

                {children && (
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                        }}
                    >
                        {children}
                    </Box>
                )}
            </CardContent>
            {actionLabel && actionLink && (
                <CardActions>
                    <Button component={Link} to={actionLink} size="small">
                        {actionLabel}
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

interface ChipListProps {
    items: any[];
    isLoading: boolean;
    renderChip: (item: any, index: number) => React.ReactNode;
    emptyMessage?: string;
}

export function ChipList({
    items,
    isLoading,
    renderChip,
    emptyMessage = "Nenhum item encontrado",
}: ChipListProps) {
    if (isLoading) {
        return <CircularProgress size={24} />;
    }

    if (items.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                {emptyMessage}
            </Typography>
        );
    }

    return <>{items.map(renderChip)}</>;
}

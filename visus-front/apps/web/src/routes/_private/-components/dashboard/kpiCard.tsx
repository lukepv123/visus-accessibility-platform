import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type KpiCardProps = {
    label: string;
    value: ReactNode;
    helperText?: string;
    align?: "left" | "center" | "right";
    onClick?: () => void;
};

/**
 * KPI card com visual mais moderno: bordas arredondadas,
 * sombra suave e tipografia clean.
 */
export function KpiCard({
    label,
    value,
    helperText,
    align = "left",
    onClick,
}: KpiCardProps) {
    const clickable = Boolean(onClick);

    return (
        <Card
            elevation={0}
            onClick={onClick}
            sx={{
                position: "relative",
                cursor: clickable ? "pointer" : "default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                background:
                    "linear-gradient(135deg, rgba(249,250,251,0.9), rgba(243,244,246,0.9))",
                boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
                transition: "all 0.2s ease",
                "&:hover": clickable
                    ? {
                          boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
                          transform: "translateY(-3px)",
                          borderColor: "primary.light",
                      }
                    : {},
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: 2,
                    borderTop: "3px solid",
                    borderColor: "primary.main",
                    opacity: 0.9,
                },
            }}
        >
            <CardContent
                sx={{
                    position: "relative",
                    py: 1.8,
                    px: 2,
                    textAlign: align,
                }}
            >
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    noWrap
                    sx={{ fontSize: 11, letterSpacing: 0.3 }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{ mt: 0.5, fontWeight: 600, color: "text.primary" }}
                >
                    {value}
                </Typography>
                {helperText && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 0.75, fontSize: 11 }}
                    >
                        {helperText}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

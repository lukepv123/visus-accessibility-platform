import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/gestor/equipes")({
    component: GestorEquipes,
});

export default function GestorEquipes() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Equipes
            </Typography>
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        Gerencie equipes e atribua membros
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }}>
                        Nova Equipe
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

import { Box, Card, CardContent, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/gestor/ajuda")({
    component: GestorAjuda,
});

export default function GestorAjuda() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Ajuda
            </Typography>
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        Encontre respostas e suporte aqui
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

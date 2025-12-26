import { Box, Card, CardContent, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/educador/ajuda")({
    component: EducadorAjuda,
});

export default function EducadorAjuda() {
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

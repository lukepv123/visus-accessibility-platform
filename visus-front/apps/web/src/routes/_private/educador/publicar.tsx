import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/educador/publicar")({
    component: EducadorPublicar,
});

export default function EducadorPublicar() {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Publicar
            </Typography>
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        Publique conteúdo para suas turmas
                    </Typography>
                    <Button variant="contained" sx={{ mt: 2 }}>
                        Novo Conteúdo
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import {
    Alert,
    AlertTitle,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

export function ScreenReaderQuickReference() {
    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AccessibilityNewIcon color="primary" />
                <Typography variant="h6">
                    Guia Rápido: Leitor de Tela
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Como Usar</AlertTitle>O leitor de tela lê
                automaticamente os elementos quando você navega pelo teclado ou
                clica com o mouse.
            </Alert>

            {/* Keyboard Shortcuts */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                    }}
                >
                    <KeyboardIcon />
                    <Typography variant="subtitle1" fontWeight="bold">
                        Atalhos de Teclado
                    </Typography>
                </Box>

                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>Atalho</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Ação</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <code
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        Ctrl+Shift+S
                                    </code>
                                </TableCell>
                                <TableCell>Parar a leitura atual</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <code
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        Ctrl+Shift+R
                                    </code>
                                </TableCell>
                                <TableCell>
                                    Ler o elemento atual novamente
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <code
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        Ctrl+Shift+H
                                    </code>
                                </TableCell>
                                <TableCell>
                                    Navegar para o próximo título
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <code
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        Tab
                                    </code>
                                </TableCell>
                                <TableCell>
                                    Próximo elemento interativo
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <code
                                        style={{
                                            backgroundColor: "#f5f5f5",
                                            padding: "2px 6px",
                                            borderRadius: "3px",
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        Shift+Tab
                                    </code>
                                </TableCell>
                                <TableCell>
                                    Elemento interativo anterior
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Tips */}
            <Paper sx={{ p: 2 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Dicas de Navegação
                </Typography>

                <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
                    <li>
                        <Typography variant="body2">
                            <strong>Use Tab</strong> para navegar entre botões,
                            links e campos de formulário
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Use setas</strong> dentro de listas, menus e
                            componentes complexos
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Pressione Enter</strong> para ativar botões
                            e links
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Pressione Espaço</strong> para
                            marcar/desmarcar checkboxes
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Navegue por títulos</strong> (Ctrl+Shift+H)
                            para pular seções rapidamente
                        </Typography>
                    </li>
                    <li>
                        <Typography variant="body2">
                            <strong>Ajuste a velocidade</strong> nas
                            configurações se a leitura estiver muito rápida ou
                            lenta
                        </Typography>
                    </li>
                </Box>
            </Paper>

            <Alert severity="success" sx={{ mt: 3 }}>
                <AlertTitle>Indicador Visual</AlertTitle>
                Quando o leitor de tela está ativo, você verá um contorno azul
                brilhante ao redor do elemento focado, facilitando acompanhar
                visualmente a navegação.
            </Alert>
        </Box>
    );
}

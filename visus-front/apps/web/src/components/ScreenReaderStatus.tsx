import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Box, Button, Chip } from "@mui/material";
import { useAccessibility } from "../contexts/AccessibilityContext";

/**
 * Small widget that can be added to any page to show screen reader status
 * and provide quick access to toggle it
 */
export function ScreenReaderStatus() {
    const { settings, setSettings, speak } = useAccessibility();

    const handleToggle = () => {
        const newState = !settings.screenReader;
        setSettings((s) => ({ ...s, screenReader: newState }));
        speak(
            newState ? "Leitor de tela ativado" : "Leitor de tela desativado",
        );
    };

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Chip
                icon={
                    settings.screenReader ? <VolumeUpIcon /> : <VolumeOffIcon />
                }
                label={
                    settings.screenReader ? "Leitor Ativo" : "Leitor Inativo"
                }
                color={settings.screenReader ? "primary" : "default"}
                size="small"
                onClick={handleToggle}
                aria-label={`Leitor de tela ${settings.screenReader ? "ativado" : "desativado"}. Clique para alternar.`}
                sx={{ cursor: "pointer" }}
            />
        </Box>
    );
}

/**
 * Example component showing how to use the accessibility context
 * in any component to access speak function
 */
export function AccessibleButton({ children, onClick, ...props }: any) {
    const { speak } = useAccessibility();

    const handleClick = (e: any) => {
        speak(`Botão ${children} pressionado`);
        onClick?.(e);
    };

    return (
        <Button onClick={handleClick} {...props}>
            {children}
        </Button>
    );
}

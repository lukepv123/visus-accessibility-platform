import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
    Alert,
    AlertTitle,
    Box,
    Button,
    FormControlLabel,
    Slider,
    Stack,
    Switch,
    Typography,
    useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { ScreenReaderQuickReference } from "../../../components/ScreenReaderQuickReference";
import { useAccessibility } from "../../../contexts/AccessibilityContext";
import { useColorMode } from "../../../theme-toggle";

export default function Acessibilidade() {
    const { toggle } = useColorMode();
    const theme = useTheme();
    const themeMode = theme.palette.mode; // "light" | "dark"

    // Use the global accessibility context
    const { settings, setSettings, resetSettings, speak, stop, isSupported } =
        useAccessibility();

    useEffect(() => {
        if (settings.highContrast && themeMode !== "dark") {
            toggle();
            return;
        }

        if (!settings.highContrast && themeMode !== settings.mode) {
            toggle();
        }
    }, [settings.highContrast, themeMode, settings.mode, toggle]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Acessibilidade
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Ajuste opções de acessibilidade para melhorar sua experiência.
            </Typography>

            {!isSupported && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <AlertTitle>Leitor de tela não disponível</AlertTitle>
                    Seu navegador não suporta síntese de voz. O leitor de tela
                    não funcionará.
                </Alert>
            )}

            <Stack spacing={3} sx={{ maxWidth: 720 }}>
                {/* Screen Reader Section */}
                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {settings.screenReader ? (
                            <VolumeUpIcon />
                        ) : (
                            <VolumeOffIcon />
                        )}
                        Leitor de Tela (TalkBack)
                    </Typography>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.screenReader}
                                onChange={(_, v) => {
                                    setSettings((s) => ({
                                        ...s,
                                        screenReader: v,
                                    }));
                                    if (v) {
                                        speak("Leitor de tela ativado");
                                    } else {
                                        stop();
                                    }
                                }}
                                disabled={!isSupported}
                            />
                        }
                        label="Ativar modo leitor de tela"
                    />

                    {settings.screenReader && (
                        <Box
                            sx={{
                                mt: 2,
                                pl: 2,
                                borderLeft: "3px solid",
                                borderColor: "primary.main",
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Atalhos de teclado:
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                sx={{ mb: 1 }}
                            >
                                • <strong>Ctrl+Shift+S</strong>: Parar leitura
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                sx={{ mb: 1 }}
                            >
                                • <strong>Ctrl+Shift+R</strong>: Ler elemento
                                atual
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                sx={{ mb: 2 }}
                            >
                                • <strong>Ctrl+Shift+H</strong>: Navegar para
                                próximo título
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <Typography gutterBottom>
                                    Velocidade da fala:{" "}
                                    {settings.speechRate.toFixed(1)}x
                                </Typography>
                                <Slider
                                    value={settings.speechRate}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    onChange={(_, v) =>
                                        setSettings((s) => ({
                                            ...s,
                                            speechRate: v as number,
                                        }))
                                    }
                                    aria-label="Velocidade da fala"
                                    sx={{ width: 360 }}
                                />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>
                                    Tom da voz:{" "}
                                    {settings.speechPitch.toFixed(1)}
                                </Typography>
                                <Slider
                                    value={settings.speechPitch}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    onChange={(_, v) =>
                                        setSettings((s) => ({
                                            ...s,
                                            speechPitch: v as number,
                                        }))
                                    }
                                    aria-label="Tom da voz"
                                    sx={{ width: 360 }}
                                />
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography gutterBottom>
                                    Volume:{" "}
                                    {Math.round(settings.speechVolume * 100)}%
                                </Typography>
                                <Slider
                                    value={settings.speechVolume}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    onChange={(_, v) =>
                                        setSettings((s) => ({
                                            ...s,
                                            speechVolume: v as number,
                                        }))
                                    }
                                    aria-label="Volume"
                                    sx={{ width: 360 }}
                                />
                            </Box>

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                    speak(
                                        "Este é um teste do leitor de tela. Velocidade, tom e volume configurados.",
                                    )
                                }
                                sx={{ mt: 2 }}
                            >
                                Testar Voz
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Quick Reference Guide */}
                {settings.screenReader && (
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                        }}
                    >
                        <ScreenReaderQuickReference />
                    </Box>
                )}

                {/* Visual Settings */}
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Configurações Visuais
                </Typography>

                <Box>
                    <Typography gutterBottom>
                        Tamanho do texto: {settings.fontSize}px
                    </Typography>
                    <Slider
                        value={settings.fontSize}
                        min={12}
                        max={24}
                        step={1}
                        onChange={(_, v) =>
                            setSettings((s) => ({
                                ...s,
                                fontSize: v as number,
                            }))
                        }
                        aria-label="Tamanho do texto"
                        sx={{ width: 360 }}
                    />
                </Box>

                <Box>
                    <Typography gutterBottom>
                        Zoom da página: {settings.zoom}%
                    </Typography>
                    <Slider
                        value={settings.zoom}
                        min={80}
                        max={150}
                        step={5}
                        onChange={(_, v) =>
                            setSettings((s) => ({ ...s, zoom: v as number }))
                        }
                        aria-label="Zoom da página"
                        sx={{ width: 360 }}
                    />
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.bold}
                            onChange={(_, v) =>
                                setSettings((s) => ({ ...s, bold: v }))
                            }
                        />
                    }
                    label="Fonte em negrito"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.highContrast}
                            onChange={(_, v) =>
                                setSettings((s) => ({ ...s, highContrast: v }))
                            }
                        />
                    }
                    label="Alto contraste"
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            speak("Configurações salvas com sucesso");
                        }}
                    >
                        Salvar
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            resetSettings();
                            speak("Configurações redefinidas para o padrão");
                        }}
                    >
                        Redefinir para padrão
                    </Button>
                </Box>

                <Box
                    aria-live="polite"
                    sx={{ position: "absolute", left: -9999 }}
                >
                    {settings.screenReader
                        ? "Modo leitor de tela ativado"
                        : "Modo leitor de tela desativado"}
                </Box>
            </Stack>
        </Box>
    );
}

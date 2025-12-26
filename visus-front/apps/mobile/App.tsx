// apps/mobile/App.tsx

// 👇 Tokens compartilhados do monorepo
import { dark as tokensDark, light as tokensLight } from "@visus/theme";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useMemo, useState } from "react";
import { View } from "react-native";
import {
    Button,
    Card,
    MD3DarkTheme,
    MD3LightTheme,
    Provider as PaperProvider,
    Text,
} from "react-native-paper";

// Mapeia seus tokens → chaves do tema MD3 do Paper
function mapTokensToPaperColors(
    tokens: typeof tokensLight,
    base: typeof MD3LightTheme,
) {
    return {
        ...base.colors,
        // Principais
        primary: tokens.primary.bg,
        onPrimary: tokens.primary.fg,

        background: tokens.bg.primary,
        surface: tokens.bg.surface,
        onSurface: tokens.text.primary,

        // Variante de surface e contornos
        surfaceVariant: tokens.bg.surfaceAlt,
        outline: tokens.border.strong,

        // Estados (mínimo necessário pra começar)
        error: tokens.status.danger.fg,
        // você pode mapear success/warning/info para secondary/tertiary conforme precisar
        secondary: tokens.link.default,
    };
}

export default function App() {
    console.log("App is rendering");
    const [darkMode, setDarkMode] = useState(false);

    const theme = useMemo(() => {
        console.log("Theme tokens:", { tokensDark, tokensLight });
        if (darkMode) {
            return {
                ...MD3DarkTheme,
                colors: mapTokensToPaperColors(tokensDark, MD3DarkTheme),
            };
        }
        return {
            ...MD3LightTheme,
            colors: mapTokensToPaperColors(tokensLight, MD3LightTheme),
        };
    }, [darkMode]);

    return (
        <PaperProvider theme={theme}>
            <StatusBar style={darkMode ? "light" : "dark"} />

            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.background,
                    padding: 16,
                    justifyContent: "center",
                }}
            >
                <Text variant="headlineMedium" style={{ marginBottom: 12 }}>
                    Visus — Tema MD3 (tokens compartilhados)
                </Text>

                <Button mode="contained" onPress={() => setDarkMode((v) => !v)}>
                    Alternar claro/escuro
                </Button>

                <Card style={{ marginTop: 16 }}>
                    <Card.Content>
                        <Text variant="titleMedium" style={{ marginBottom: 6 }}>
                            Cartão de exemplo
                        </Text>
                        <Text>
                            As cores deste cartão (fundo, textos e botão) vêm de
                            @visus/theme.
                        </Text>
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    );
}

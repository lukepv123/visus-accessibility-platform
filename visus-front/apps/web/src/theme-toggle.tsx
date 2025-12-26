import { CssBaseline, ThemeProvider } from "@mui/material";
import {
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { darkTheme, lightTheme } from "./theme";

// Chave para salvar no localStorage
const COLOR_MODE_KEY = "color_mode";

interface ColorModeContextType {
    toggle: () => void;
    mode: "light" | "dark";
}

// Passe o tipo genérico para createContext
const ColorModeCtx = createContext<ColorModeContextType>({
    toggle: () => {},
    mode: "light",
});

export const useColorMode = () => useContext(ColorModeCtx);

export function ThemeRoot({ children }: { children: ReactNode }) {
    // Inicializar com o valor salvo no localStorage
    const [mode, setMode] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "light";

        try {
            const saved = localStorage.getItem(COLOR_MODE_KEY);
            if (saved === "dark" || saved === "light") {
                return saved;
            }
        } catch (e) {
            console.warn("Erro ao ler tema do localStorage:", e);
        }

        return "light";
    });

    // Salvar no localStorage sempre que o modo mudar
    useEffect(() => {
        try {
            localStorage.setItem(COLOR_MODE_KEY, mode);
        } catch (e) {
            console.warn("Erro ao salvar tema no localStorage:", e);
        }
    }, [mode]);

    // Ouvir mudanças na preferência do sistema
    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const handleChange = (e: MediaQueryListEvent) => {
            // Opcional: seguir automaticamente a preferência do sistema
            // setMode(e.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const theme = useMemo(() => {
        const base = mode === "light" ? lightTheme : darkTheme;

        return {
            ...base,
            typography: {
                ...base.typography,
                allVariants: {
                    ...base.typography,
                    h1: { fontWeight: "var(--a11y-font-weight)" },
                    h2: { fontWeight: "var(--a11y-font-weight)" },
                    h3: { fontWeight: "var(--a11y-font-weight)" },
                    h4: { fontWeight: "var(--a11y-font-weight)" },
                    h5: { fontWeight: "var(--a11y-font-weight)" },
                    h6: { fontWeight: "var(--a11y-font-weight)" },
                    subtitle1: { fontWeight: "var(--a11y-font-weight)" },
                    subtitle2: { fontWeight: "var(--a11y-font-weight)" },
                    body1: { fontWeight: "var(--a11y-font-weight)" },
                    body2: { fontWeight: "var(--a11y-font-weight)" },
                    button: { fontWeight: "var(--a11y-font-weight)" },
                    caption: { fontWeight: "var(--a11y-font-weight)" },
                    overline: { fontWeight: "var(--a11y-font-weight)" },
                },
            },
        };
    }, [mode]);

    const toggle = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ColorModeCtx.Provider value={{ toggle, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeCtx.Provider>
    );
}

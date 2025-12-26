import { createTheme } from "@mui/material/styles";
import { dark, light } from "@visus/theme";

const typographyOverrides = {
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
};

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: { main: light.primary.bg, contrastText: light.primary.fg },
        background: { default: light.bg.primary, paper: light.bg.surface },
        text: { primary: light.text.primary, secondary: light.text.secondary },
        success: { main: light.status.success.fg },
        error: { main: light.status.danger.fg },
        warning: { main: light.status.warning.fg },
        info: { main: light.status.info.fg },
    },
    typography: typographyOverrides,
    shape: { borderRadius: 12 },
    components: {
        // MuiFocusVisible: {}, // só para lembrar: o MUI já gerencia focus-visible
        MuiButton: { defaultProps: { size: "large" } },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: dark.primary.bg, contrastText: dark.primary.fg },
        background: { default: dark.bg.primary, paper: dark.bg.surface },
        text: { primary: dark.text.primary, secondary: dark.text.secondary },
        success: { main: dark.status.success.fg },
        error: { main: dark.status.danger.fg },
        warning: { main: dark.status.warning.fg },
        info: { main: dark.status.info.fg },
    },
    typography: typographyOverrides,
    shape: { borderRadius: 12 },
    components: {
        MuiButton: { defaultProps: { size: "large" } },
    },
});

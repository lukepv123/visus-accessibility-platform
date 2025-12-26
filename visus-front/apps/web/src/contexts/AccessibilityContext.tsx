import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useFocusIndicator } from "../lib/hooks/useFocusIndicator";
import { useScreenReader } from "../lib/hooks/useScreenReader";

const LS_KEY = "a11y_settings_v1";

export type AccessibilitySettings = {
    screenReader: boolean;
    fontSize: number; // px
    zoom: number; // percent
    bold: boolean;
    highContrast: boolean;
    mode: "light" | "dark";
    speechRate: number;
    speechPitch: number;
    speechVolume: number;
};

const defaultSettings: AccessibilitySettings = {
    screenReader: false,
    fontSize: 16,
    zoom: 100,
    bold: false,
    highContrast: false,
    mode: "light",
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
};

function applySettings(s: AccessibilitySettings) {
    try {
        // font size
        document.documentElement.style.fontSize = `${s.fontSize}px`;

        // zoom (uses non-standard zoom but works in most browsers)
        // apply on body to scale layout
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        document.body.style.zoom = `${s.zoom}%`;

        // bold fonts and high contrast via body classes
        if (s.bold) document.body.classList.add("a11y-bold");
        else document.body.classList.remove("a11y-bold");

        if (s.highContrast) document.body.classList.add("a11y-high-contrast");
        else document.body.classList.remove("a11y-high-contrast");

        // screen reader mode flag
        if (s.screenReader)
            document.body.setAttribute("data-a11y-screenreader", "true");
        else document.body.removeAttribute("data-a11y-screenreader");
    } catch (_e) {
        // fail silently
    }
}

function ensureStyles() {
    const id = "a11y-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
        :root {
            --a11y-font-weight: 400;
        }

        body.a11y-bold {
            --a11y-font-weight: 700;
        }

        body.a11y-high-contrast { 
            background: #000 !important; 
            color: #fff !important; 
        }

        body.a11y-high-contrast a { 
            color: #4fc3f7 !important; 
        }

        [data-a11y-screenreader="true"] *:focus {
            outline: 3px solid #1976d2 !important;
        }
    `;
    document.head.appendChild(style);
}

interface AccessibilityContextValue {
    settings: AccessibilitySettings;
    setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
    resetSettings: () => void;
    speak: (text: string, interrupt?: boolean) => void;
    stop: () => void;
    isSupported: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
    null,
);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
        } catch (_e) {}
        return defaultSettings;
    });

    // Initialize screen reader with current settings
    const { speak, stop, isSupported } = useScreenReader({
        enabled: settings.screenReader,
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        volume: settings.speechVolume,
        lang: "pt-BR",
    });

    // Initialize focus indicator
    useFocusIndicator({
        enabled: settings.screenReader,
        showTooltip: true,
        color: settings.highContrast ? "#4fc3f7" : "#1976d2",
        width: 3,
    });

    useEffect(() => {
        ensureStyles();
        applySettings(settings);
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(settings));
        } catch (_e) {}
    }, [settings]);

    const resetSettings = () => {
        setSettings(defaultSettings);
    };

    const value: AccessibilityContextValue = {
        settings,
        setSettings,
        resetSettings,
        speak,
        stop,
        isSupported,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error(
            "useAccessibility must be used within AccessibilityProvider",
        );
    }
    return context;
}

import { useEffect } from "react";

interface FocusIndicatorOptions {
    enabled: boolean;
    color?: string;
    width?: number;
    showTooltip?: boolean;
}

export function useFocusIndicator(options: FocusIndicatorOptions) {
    useEffect(() => {
        if (!options.enabled) return;

        const color = options.color || "#1976d2";
        const width = options.width || 3;

        // Create a floating indicator element
        let indicator: HTMLDivElement | null = null;
        let tooltip: HTMLDivElement | null = null;

        const createIndicator = () => {
            indicator = document.createElement("div");
            indicator.id = "a11y-focus-indicator";
            indicator.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.15s ease-out;
        border: ${width}px solid ${color};
        border-radius: 4px;
        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 0 10px ${color};
        display: none;
      `;
            document.body.appendChild(indicator);

            if (options.showTooltip) {
                tooltip = document.createElement("div");
                tooltip.id = "a11y-focus-tooltip";
                tooltip.style.cssText = `
          position: fixed;
          pointer-events: none;
          z-index: 10001;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-family: sans-serif;
          display: none;
          max-width: 200px;
          word-wrap: break-word;
        `;
                document.body.appendChild(tooltip);
            }
        };

        const updateIndicator = (element: Element) => {
            if (!indicator) return;

            const rect = element.getBoundingClientRect();

            indicator.style.display = "block";
            indicator.style.left = `${rect.left - width}px`;
            indicator.style.top = `${rect.top - width}px`;
            indicator.style.width = `${rect.width}px`;
            indicator.style.height = `${rect.height}px`;

            if (tooltip && options.showTooltip) {
                const label =
                    element.getAttribute("aria-label") ||
                    element.getAttribute("title") ||
                    (element instanceof HTMLInputElement
                        ? element.placeholder
                        : "") ||
                    element.textContent?.trim().substring(0, 50) ||
                    element.tagName.toLowerCase();

                tooltip.textContent = label;
                tooltip.style.display = "block";
                tooltip.style.left = `${rect.left}px`;
                tooltip.style.top = `${rect.top - 25}px`;
            }
        };

        const hideIndicator = () => {
            if (indicator) indicator.style.display = "none";
            if (tooltip) tooltip.style.display = "none";
        };

        const handleFocus = (event: FocusEvent) => {
            const target = event.target;
            if (target instanceof Element) {
                updateIndicator(target);
            }
        };

        const handleBlur = () => {
            hideIndicator();
        };

        const handleScroll = () => {
            const focused = document.activeElement;
            if (focused && focused !== document.body) {
                updateIndicator(focused);
            }
        };

        createIndicator();
        document.addEventListener("focus", handleFocus, true);
        document.addEventListener("blur", handleBlur, true);
        document.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);

        return () => {
            document.removeEventListener("focus", handleFocus, true);
            document.removeEventListener("blur", handleBlur, true);
            document.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);

            if (indicator) indicator.remove();
            if (tooltip) tooltip.remove();
        };
    }, [options.enabled, options.color, options.width, options.showTooltip]);
}

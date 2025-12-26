import { useCallback, useEffect, useRef } from "react";

interface ScreenReaderOptions {
    enabled: boolean;
    rate?: number;
    pitch?: number;
    volume?: number;
    lang?: string;
}

interface ElementInfo {
    text: string;
    role: string;
    tag: string;
    state?: string;
}

export function useScreenReader(options: ScreenReaderOptions) {
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const lastFocusedElementRef = useRef<Element | null>(null);

    useEffect(() => {
        if ("speechSynthesis" in window) {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const stop = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
    }, []);

    const speak = useCallback(
        (text: string, interrupt = true) => {
            if (!synthRef.current || !options.enabled || !text.trim()) return;

            if (interrupt) {
                stop();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.rate ?? 1;
            utterance.pitch = options.pitch ?? 1;
            utterance.volume = options.volume ?? 1;
            utterance.lang = options.lang ?? "pt-BR";

            currentUtteranceRef.current = utterance;
            synthRef.current.speak(utterance);
        },
        [
            options.enabled,
            options.rate,
            options.pitch,
            options.volume,
            options.lang,
            stop,
        ],
    );

    const getElementInfo = useCallback((element: Element): ElementInfo => {
        const tagName = element.tagName.toLowerCase();
        const role = element.getAttribute("role") || "";
        const ariaLabel = element.getAttribute("aria-label");
        const ariaDescribedBy = element.getAttribute("aria-describedby");

        // Get text content
        let text = ariaLabel || "";

        if (!text) {
            if (
                element instanceof HTMLInputElement ||
                element instanceof HTMLTextAreaElement
            ) {
                text = element.value || element.placeholder || "";
            } else if (element instanceof HTMLImageElement) {
                text = element.alt || "Imagem sem descrição";
            } else if (element instanceof HTMLAnchorElement) {
                text = element.textContent || element.href || "";
            } else {
                text = element.textContent || "";
            }
        }

        // Add description if available
        if (ariaDescribedBy) {
            const descElement = document.getElementById(ariaDescribedBy);
            if (descElement) {
                text += ". " + descElement.textContent;
            }
        }

        // Get state information
        let state = "";
        const ariaChecked = element.getAttribute("aria-checked");
        const ariaExpanded = element.getAttribute("aria-expanded");
        const ariaSelected = element.getAttribute("aria-selected");
        const ariaDisabled = element.getAttribute("aria-disabled");

        if (element instanceof HTMLInputElement) {
            if (element.type === "checkbox" || element.type === "radio") {
                state = element.checked ? "marcado" : "desmarcado";
            }
            if (element.disabled) {
                state += " desabilitado";
            }
        } else {
            if (ariaChecked === "true") state = "marcado";
            else if (ariaChecked === "false") state = "desmarcado";

            if (ariaExpanded === "true") state += " expandido";
            else if (ariaExpanded === "false") state += " recolhido";

            if (ariaSelected === "true") state += " selecionado";

            if (ariaDisabled === "true") state += " desabilitado";
        }

        return {
            text: text.trim(),
            role: role || getImplicitRole(tagName),
            tag: tagName,
            state: state.trim(),
        };
    }, []);

    const getImplicitRole = (tagName: string): string => {
        const roleMap: Record<string, string> = {
            button: "botão",
            a: "link",
            input: "campo de entrada",
            textarea: "área de texto",
            select: "caixa de seleção",
            img: "imagem",
            h1: "título nível 1",
            h2: "título nível 2",
            h3: "título nível 3",
            h4: "título nível 4",
            h5: "título nível 5",
            h6: "título nível 6",
            nav: "navegação",
            main: "conteúdo principal",
            header: "cabeçalho",
            footer: "rodapé",
            aside: "barra lateral",
            article: "artigo",
            section: "seção",
            form: "formulário",
            table: "tabela",
            ul: "lista",
            ol: "lista numerada",
            li: "item de lista",
        };
        return roleMap[tagName] || "";
    };

    const announceElement = useCallback(
        (element: Element) => {
            const info = getElementInfo(element);
            const parts: string[] = [];

            if (info.role) {
                parts.push(info.role);
            }

            if (info.text) {
                parts.push(info.text);
            }

            if (info.state) {
                parts.push(info.state);
            }

            const announcement = parts.join(", ");
            if (announcement) {
                speak(announcement);
            }
        },
        [getElementInfo, speak],
    );

    const handleFocus = useCallback(
        (event: FocusEvent) => {
            if (!options.enabled) return;

            const target = event.target;
            if (
                target instanceof Element &&
                target !== lastFocusedElementRef.current
            ) {
                lastFocusedElementRef.current = target;
                announceElement(target);
            }
        },
        [options.enabled, announceElement],
    );

    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (!options.enabled) return;

            const target = event.target;
            if (target instanceof Element) {
                announceElement(target);
            }
        },
        [options.enabled, announceElement],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!options.enabled) return;

            // Ctrl+Shift+S to stop speaking
            if (event.ctrlKey && event.shiftKey && event.key === "S") {
                event.preventDefault();
                stop();
                speak("Leitura interrompida");
                return;
            }

            // Ctrl+Shift+R to read current element
            if (event.ctrlKey && event.shiftKey && event.key === "R") {
                event.preventDefault();
                const focused = document.activeElement;
                if (focused) {
                    announceElement(focused);
                }
                return;
            }

            // Ctrl+Shift+H to navigate to next heading
            if (event.ctrlKey && event.shiftKey && event.key === "H") {
                event.preventDefault();
                const headings = Array.from(
                    document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
                );

                // Make all headings focusable
                headings.forEach((h) => {
                    if (!h.hasAttribute("tabindex")) {
                        h.setAttribute("tabindex", "-1");
                    }
                });

                const currentFocus = document.activeElement;
                let nextHeading: Element | null = null;

                // Find the next heading after the current focus
                if (currentFocus) {
                    const currentRect = currentFocus.getBoundingClientRect();

                    // Find headings that come after the current element in document order
                    for (const heading of headings) {
                        const headingRect = heading.getBoundingClientRect();

                        // Check if heading comes after current focus (vertically or by DOM order)
                        if (
                            headingRect.top > currentRect.top ||
                            (headingRect.top === currentRect.top &&
                                headingRect.left > currentRect.left)
                        ) {
                            nextHeading = heading;
                            break;
                        }
                    }

                    // If no heading found after, try from the beginning
                    if (!nextHeading && headings.length > 0) {
                        const currentIndex = headings.indexOf(
                            currentFocus as Element,
                        );
                        if (
                            currentIndex >= 0 &&
                            currentIndex < headings.length - 1
                        ) {
                            nextHeading = headings[currentIndex + 1];
                        }
                    }
                }

                // If still no heading found, use the first one
                if (!nextHeading && headings.length > 0) {
                    nextHeading = headings[0];
                }

                if (nextHeading instanceof HTMLElement) {
                    nextHeading.focus();
                    nextHeading.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                    announceElement(nextHeading);
                } else {
                    speak("Nenhum próximo título encontrado");
                }
                return;
            }

            // Announce some key actions
            const keyAnnouncements: Record<string, string> = {
                Enter: "Enter pressionado",
                Escape: "Escape pressionado",
                Tab: event.shiftKey ? "Tab anterior" : "Próximo Tab",
            };

            const announcement = keyAnnouncements[event.key];
            if (announcement && event.altKey) {
                speak(announcement, false);
            }
        },
        [options.enabled, stop, speak, announceElement],
    );

    useEffect(() => {
        if (!options.enabled) {
            stop();
            return;
        }

        // Make all headings focusable for keyboard navigation
        const makeHeadingsFocusable = () => {
            const headings = document.querySelectorAll(
                "h1, h2, h3, h4, h5, h6",
            );
            headings.forEach((heading) => {
                if (!heading.hasAttribute("tabindex")) {
                    heading.setAttribute("tabindex", "-1");
                }
            });
        };

        // Initial setup
        makeHeadingsFocusable();

        // Watch for new headings added dynamically
        const observer = new MutationObserver(() => {
            makeHeadingsFocusable();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Add event listeners
        document.addEventListener("focus", handleFocus, true);
        document.addEventListener("click", handleClick, true);
        document.addEventListener("keydown", handleKeyDown, true);

        // Announce activation
        speak(
            "Leitor de tela ativado. Use Ctrl+Shift+S para parar, Ctrl+Shift+R para ler elemento atual, Ctrl+Shift+H para próximo título",
        );

        return () => {
            observer.disconnect();
            document.removeEventListener("focus", handleFocus, true);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            stop();
        };
    }, [options.enabled, handleFocus, handleClick, handleKeyDown, speak, stop]);

    return {
        speak,
        stop,
        announceElement,
        isSupported: "speechSynthesis" in window,
    };
}

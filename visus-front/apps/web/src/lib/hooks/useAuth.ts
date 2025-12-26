import { useCallback, useEffect, useState } from "react";
import { authStorage, isTokenExpired } from "../api/auth";
import { authApi } from "../api/client";
import type {
    AuthenticationDTO,
    LoginResponseDTO,
    RegisterDTO,
    UsuarioDetailsDTO,
} from "../api/types";

interface AuthState {
    user: UsuarioDetailsDTO | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UseAuthReturn extends AuthState {
    login: (credentials: AuthenticationDTO) => Promise<void>;
    register: (userData: RegisterDTO) => Promise<void>;
    logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [state, setState] = useState<AuthState>(() => {
        const token = authStorage.getToken();
        const user = authStorage.getUser();

        // Check if token is expired
        if (token && isTokenExpired(token)) {
            authStorage.clear();
            return {
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        }

        return {
            user: user,
            token: token,
            isAuthenticated: !!token && !!user,
            isLoading: false,
            error: null,
        };
    });

    // Check token expiration on mount and set up interval
    useEffect(() => {
        if (!state.token) return;

        const checkTokenExpiration = () => {
            if (isTokenExpired(state.token)) {
                logout();
            }
        };

        // Check immediately
        checkTokenExpiration();

        // Check every 5 minutes
        const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [state.token]);

    const login = useCallback(
        async (credentials: AuthenticationDTO): Promise<void> => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                const response: LoginResponseDTO =
                    await authApi.login(credentials);

                authStorage.setToken(response.token);
                authStorage.setUser(response.usuario);

                setState({
                    user: response.usuario,
                    token: response.token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Object && "message" in error
                        ? (error as Record<string, unknown>).message
                        : "Erro ao realizar login";

                setState({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: String(errorMessage),
                });

                throw error;
            }
        },
        [],
    );

    const register = useCallback(
        async (userData: RegisterDTO): Promise<void> => {
            setState((prev) => ({ ...prev, isLoading: true, error: null }));

            try {
                await authApi.register(userData);

                // After successful registration, optionally log in the user
                // For now, just clear the form state
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                }));
            } catch (error) {
                const errorMessage =
                    error instanceof Object && "message" in error
                        ? (error as Record<string, unknown>).message
                        : "Erro ao realizar cadastro";

                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: String(errorMessage),
                }));

                throw error;
            }
        },
        [],
    );

    const logout = useCallback((): void => {
        authStorage.clear();
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        login,
        register,
        logout,
    };
};

import type {
    InstituicaoDetailsDTO,
    LoginMutationRequest,
    LoginMutationResponse,
} from "@visus/api";
import { getGestorById, useLogin } from "@visus/api";
import type React from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { authStorage, isTokenExpired } from "../lib/api/auth";

interface User {
    id: number;
    nome: string;
    email: string;
    roles?: string[];
    userType?: string;
    instituicao?: InstituicaoDetailsDTO | null;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginMutationRequest) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => authStorage.getUser());
    const [token, setToken] = useState<string | null>(() =>
        authStorage.getToken(),
    );
    const [isLoading, setIsLoading] = useState(false);

    // Kubb-generated login mutation
    const loginMutation = useLogin({
        mutation: {
            onSuccess: (response: LoginMutationResponse) => {
                // Extract token and user from response
                const tokenValue = (response as any).token || "";
                const userData = (response as any).usuario;

                // Store in localStorage
                authStorage.setToken(tokenValue);
                authStorage.setUser(userData);

                // Update state
                setToken(tokenValue);
                setUser(userData as User);
                setIsLoading(false);
            },
            onError: (error) => {
                console.error("Login error:", error);
                setIsLoading(false);
                authStorage.clear();
                setToken(null);
                setUser(null);
            },
        },
    });

    // Check token expiration on mount and periodically
    useEffect(() => {
        const checkAuth = () => {
            const storedToken = authStorage.getToken();
            if (storedToken && isTokenExpired(storedToken)) {
                logout();
            }
        };

        checkAuth();
        const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, []);

    const login = useCallback(
        async (credentials: LoginMutationRequest) => {
            setIsLoading(true);
            await loginMutation.mutateAsync({ data: credentials });
        },
        [loginMutation],
    );

    const logout = useCallback(() => {
        authStorage.clear();
        setToken(null);
        setUser(null);
        setIsLoading(false);
    }, []);

    const refreshUser = useCallback(async () => {
        const currentUser = authStorage.getUser();
        const currentToken = authStorage.getToken();

        if (!currentUser?.id || !currentToken) {
            return;
        }

        try {
            const updatedGestor = await getGestorById(currentUser.id, {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            const updatedUser = {
                ...currentUser,
                instituicao: updatedGestor.instituicao || null,
            };

            authStorage.setUser(updatedUser);
            setUser(updatedUser as User);
        } catch (error) {
            console.error("Failed to refresh user data:", error);
        }
    }, []);

    const isAuthenticated = !!token && !!user && !isTokenExpired(token || "");

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated,
        isLoading: isLoading || loginMutation.isPending,
        login,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

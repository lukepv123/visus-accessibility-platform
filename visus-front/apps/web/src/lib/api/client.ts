import { API_ENDPOINTS, apiConfig, getAuthHeaders } from "./config";
import type {
    ApiError,
    AuthenticationDTO,
    LoginResponseDTO,
    RegisterDTO,
} from "./types";

class ApiClient {
    private baseURL: string;
    private timeout: number;

    constructor(baseURL: string, timeout: number = 10000) {
        this.baseURL = baseURL;
        this.timeout = timeout;
    }

    private buildUrl(endpoint: string): string {
        return `${this.baseURL}${endpoint}`;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        // Handle 204 No Content
        if (response.status === 204) {
            return null as T;
        }

        if (!response.ok) {
            let errorData: ApiError = {
                status: response.status,
                message: `HTTP ${response.status}`,
            };

            try {
                const data = await response.json();
                errorData = {
                    status: response.status,
                    message:
                        data.message || data.error || `HTTP ${response.status}`,
                    error: data.error,
                };
            } catch (e) {
                // Unable to parse error response
            }

            throw errorData;
        }

        // Try to parse JSON, if fails return response as-is
        try {
            return await response.json();
        } catch {
            return response as unknown as T;
        }
    }

    async get<T = unknown>(endpoint: string, token?: string): Promise<T> {
        const url = this.buildUrl(endpoint);
        const headers = getAuthHeaders(token);

        const response = await fetch(url, {
            method: "GET",
            headers,
        });

        return this.handleResponse<T>(response);
    }

    async post<T = unknown>(
        endpoint: string,
        body: unknown,
        token?: string,
    ): Promise<T> {
        const url = this.buildUrl(endpoint);
        const headers = getAuthHeaders(token);

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });

        return this.handleResponse<T>(response);
    }

    async put<T = unknown>(
        endpoint: string,
        body: unknown,
        token?: string,
    ): Promise<T> {
        const url = this.buildUrl(endpoint);
        const headers = getAuthHeaders(token);

        const response = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
        });

        return this.handleResponse<T>(response);
    }

    async delete<T = unknown>(endpoint: string, token?: string): Promise<T> {
        const url = this.buildUrl(endpoint);
        const headers = getAuthHeaders(token);

        const response = await fetch(url, {
            method: "DELETE",
            headers,
        });

        return this.handleResponse<T>(response);
    }
}

export const apiClient = new ApiClient(apiConfig.baseURL, apiConfig.timeout);

// Auth API
export const authApi = {
    login: (credentials: AuthenticationDTO): Promise<LoginResponseDTO> =>
        apiClient.post<LoginResponseDTO>(API_ENDPOINTS.auth.login, credentials),

    register: (
        userData: RegisterDTO,
    ): Promise<{ id: number; [key: string]: unknown }> =>
        apiClient.post(API_ENDPOINTS.auth.register, userData),
};

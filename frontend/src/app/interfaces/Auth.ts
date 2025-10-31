export interface RegisterBody {
    name: string;
}

export interface AuthResponse {
    accessToken: string;
    email: string;
    displayName: string;
    refreshToken: string;
}

export interface User{
    email: string;
    displayName: string;
}

export interface VerifyTokenResponse {
    valid: boolean;
    email: string;
    displayName: string;
    message?: string;
}
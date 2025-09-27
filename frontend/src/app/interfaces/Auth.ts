export interface RegisterBody {
    name: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    displayName: string;
}

export interface User{
    email: string;
    displayName: string;
}
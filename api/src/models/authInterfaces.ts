export interface AuthDataDto {
  name: string;
}

export interface AuthData {
  email: string;
  name: string;
  password: string;
}

export interface TokenVerifyDto {
  valid: boolean;
  email?: string;
  displayName?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

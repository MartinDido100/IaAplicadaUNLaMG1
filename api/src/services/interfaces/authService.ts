import type {
  AuthData,
  RefreshTokenDto,
  TokenVerifyDto,
  UserDto,
} from "../../models/index.js";

export interface AuthService {
  login(user: AuthData): Promise<UserDto>;
  signup(user: AuthData): Promise<UserDto>;
  verifyToken(token: string): Promise<TokenVerifyDto>;
  refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }>;
  logout(email: string): Promise<void>;
}

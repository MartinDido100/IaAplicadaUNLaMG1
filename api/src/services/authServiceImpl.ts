import type { AuthData, RefreshTokenDto, TokenVerifyDto, User, UserDto } from "../models/index.js";
import type { AuthService } from "./index.js";
import { generateToken, Constants, NotFoundException, auth, verifyToken } from "../utils/index.js";
import type { AuthRepository, UserRepository } from "../repositories/index.js";

export class AuthServiceImpl implements AuthService {

  constructor(private readonly userRepository: UserRepository, private readonly authRepository: AuthRepository) {}

  async login(data: AuthData): Promise<UserDto> {
    const firebaseUser = await this.userRepository.getUserByEmail(data.email);
    if (!firebaseUser) {
      throw new NotFoundException("User not found");
    }
    const accessToken = this.generateAccessToken(data.email);
    const refreshToken = this.generateRefreshToken(data.email);

    await this.authRepository.saveRefreshToken(firebaseUser.id, refreshToken);

    return { accessToken, refreshToken, email: data.email, displayName: data.name || "" };
  }

  async signup(data: AuthData): Promise<UserDto> {
    let uid: string;

    let firebaseUser: User | null = await this.userRepository.getUserByEmail(data.email);
    console.log("Firebase User:", firebaseUser); // Debugging line
    if (!firebaseUser) {
      firebaseUser = await this.userRepository.createUser(data.email, data.name || "");
    }

    const accessToken = this.generateAccessToken(data.email);
    const refreshToken = this.generateRefreshToken(data.email);

    await this.authRepository.saveRefreshToken(firebaseUser.id, refreshToken);

    return { accessToken, refreshToken, email: data.email, displayName: data.name };
  }

  async verifyToken(token: string): Promise<TokenVerifyDto> {
    try {
      const decoded = verifyToken(token) as { email: string };
      const firebaseUser = await this.userRepository.getUserByEmail(decoded.email);

      if (!firebaseUser) {
        return { valid: false };
      }

      return {
        valid: true,
        email: decoded.email,
        displayName: firebaseUser.displayName,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  async refreshAccessToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyToken(refreshTokenDto.refreshToken) as { email: string };
      const firebaseUser = await this.userRepository.getUserByEmail(decoded.email);
      if (!firebaseUser) {
        throw new NotFoundException("User not found");
      }

      const refreshAccessToken = await this.authRepository.getRefreshToken(firebaseUser.id);
      
      if (!refreshAccessToken || refreshAccessToken !== refreshTokenDto.refreshToken) {
        throw new NotFoundException("Invalid refresh token");
      }
      const accessToken = this.generateAccessToken(decoded.email);
      
      return { accessToken };
    } catch (error) {
      throw new NotFoundException("Invalid or expired refresh token");
    }
  }

  async logout(email: string): Promise<void> {
    const firebaseUser = await this.userRepository.getUserByEmail(email);
    if (firebaseUser) {
      await this.authRepository.saveRefreshToken(firebaseUser.id, "");
    }
  }

  private generateAccessToken(email: string): string {
    return generateToken({ email, type: "access" }, Constants.ACCESS_TOKEN_EXPIRATION)
  }

  private generateRefreshToken(email: string): string {
    return generateToken({ email, type: "refresh" }, Constants.REFRESH_TOKEN_EXPIRATION);
  }
}

import axios from "axios";
import type {
  AuthData,
  RefreshTokenDto,
  TokenVerifyDto,
  User,
  UserDto,
} from "../models/index.js";
import type { AuthRepository, UserRepository } from "../repositories/index.js";
import {
  Constants,
  NotFoundException,
  UnauthorizedException,
  auth,
  generateToken,
  verifyToken,
} from "../utils/index.js";
import type { AuthService } from "./index.js";

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async login(data: AuthData): Promise<UserDto> {
    try {
      const response = await axios.post(
        Constants.FIREBASE_API_URL,
        {
          email: data.email,
          password: data.password,
          returnSecureToken: true,
        },
        { headers: { "Content-Type": "application/json" } },
      );

      const { idToken, refreshToken, localId, email } = response.data;
      const decoded = await auth.verifyIdToken(idToken);

      const accessToken = this.generateAccessToken(decoded.email!);
      const customRefreshToken = this.generateRefreshToken(decoded.email!);

      await this.authRepository.saveRefreshToken(localId, customRefreshToken);

      return {
        accessToken,
        refreshToken,
        email,
        displayName: decoded.name || "",
      };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new UnauthorizedException("Invalid email or password");
      }
      throw new NotFoundException("Failed to log in user");
    }
  }

  async signup(data: AuthData): Promise<UserDto> {
    let firebaseUser: User | null = await this.userRepository.getUserByEmail(
      data.email,
    );
    console.log("Firebase User:", firebaseUser); // Debugging line
    if (!firebaseUser) {
      firebaseUser = await this.userRepository.createUser(
        data.email,
        data.name || "",
        data.password,
      );
    }

    const accessToken = this.generateAccessToken(data.email);
    const refreshToken = this.generateRefreshToken(data.email);

    await this.authRepository.saveRefreshToken(firebaseUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      email: data.email,
      displayName: data.name,
    };
  }

  async verifyToken(token: string): Promise<TokenVerifyDto> {
    try {
      const decoded = verifyToken(token) as { email: string };
      const firebaseUser = await this.userRepository.getUserByEmail(
        decoded.email,
      );

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

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyToken(refreshTokenDto.refreshToken) as {
        email: string;
      };
      const firebaseUser = await this.userRepository.getUserByEmail(
        decoded.email,
      );
      if (!firebaseUser) {
        throw new NotFoundException("User not found");
      }

      const refreshAccessToken = await this.authRepository.getRefreshToken(
        firebaseUser.id,
      );

      if (
        !refreshAccessToken ||
        refreshAccessToken !== refreshTokenDto.refreshToken
      ) {
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
    return generateToken(
      { email, type: "access" },
      Constants.ACCESS_TOKEN_EXPIRATION,
    );
  }

  private generateRefreshToken(email: string): string {
    return generateToken(
      { email, type: "refresh" },
      Constants.REFRESH_TOKEN_EXPIRATION,
    );
  }
}

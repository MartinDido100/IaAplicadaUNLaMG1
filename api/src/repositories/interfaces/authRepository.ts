export interface AuthRepository {
  saveRefreshToken(uid: string, refreshToken: string): Promise<void>;
  getRefreshToken(uid: string): Promise<string | null>;
}

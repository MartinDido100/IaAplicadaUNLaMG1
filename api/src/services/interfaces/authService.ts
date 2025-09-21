import type { AuthDataDto, TokenDto } from "../../models/index.js";

export interface AuthService {
  login(user: AuthDataDto): TokenDto;
  signup(user: AuthDataDto): TokenDto;
}

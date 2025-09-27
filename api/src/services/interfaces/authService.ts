import type { AuthDataDto, UserDto } from "../../models/index.js";

export interface AuthService {
  login(user: AuthDataDto): Promise<UserDto>;
  signup(user: AuthDataDto): Promise<UserDto>;
}

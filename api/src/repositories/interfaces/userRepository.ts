import type { User } from "../../models/index.js";

export interface UserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(
    email: string,
    displayName: string,
    password: string,
  ): Promise<User>;
}

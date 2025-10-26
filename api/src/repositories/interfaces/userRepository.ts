import type { PreferenceDto, PreferencesHistoryDto, User } from "../../models/index.js";

export interface UserRepository {
  getUserByEmail(email: string): Promise<User | null>;
  createUser(email: string, displayName: string, password: string): Promise<User>;
  getUserPreferences(email: string): Promise<PreferencesHistoryDto[]>;
  saveUserPreference(email: string, preference: PreferenceDto): Promise<void>;
}

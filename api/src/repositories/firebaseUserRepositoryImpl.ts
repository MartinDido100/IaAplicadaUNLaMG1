import { UserRecord } from "firebase-admin/auth";
import type { PreferenceDto, PreferencesHistoryDto, User, UserPreferenceDto } from "../models/index.js";
import { auth, db } from "../utils/firebaseClient.js";
import { DependencyException } from "../utils/index.js";
import type { UserRepository } from "./interfaces/userRepository.js";
import { log } from "debug";

export class FirebaseUserRepositoryImpl implements UserRepository {
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRecord: UserRecord = await auth.getUserByEmail(email);

      return userRecord
        ? { id: userRecord.uid, email: userRecord.email!!, displayName: userRecord.displayName!! }
        : null;
    } catch (error: any) {
      throw new DependencyException("User not found");
    }
  }

  public async createUser(email: string, displayName: string, password: string): Promise<User> {
    try {
      const userRecord: UserRecord = await auth.createUser({ email, displayName, password });
      return { id: userRecord.uid, email: userRecord.email!!, displayName };
    } catch (error) {
      log("Error creating user:", error);
      throw new DependencyException("Failed to create user");
    }
  }

  async saveUserPreference(email: string, preference: PreferenceDto): Promise<void> {
    try {
      log("Saving user preference for:", email);
      
      const userPreference: UserPreferenceDto = {
        email,
        tmdbId: preference.tmdbId,
        name: preference.name,
        date: new Date().toISOString(),
      };
  
      await db.collection("preferences").add(userPreference);
      
      log("Preference saved successfully");
    } catch (error) {
      log("Error saving user preference:", error);
      throw new DependencyException("Failed to save user preference");
    }
  }
  
  async getUserPreferences(email: string): Promise<PreferencesHistoryDto[]> {
    try {
      log("Getting user preferences for:", email);
      
      // Query sin orderBy para evitar necesidad de índice
      // El índice puede tardar varios minutos en estar disponible después de crearlo
      const snapshot = await db
        .collection("preferences")
        .where("email", "==", email)
        .get();
  
      const preferences: UserPreferenceDto[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            email: data.email,
            tmdbId: data.tmdbId,
            name: data.name,
            date: data.date,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
  
      log("Retrieved preferences count:", preferences.length);
      
      return [{ preferences }];
    } catch (error) {
      log("Error getting user preferences:", error);
      throw new DependencyException("Failed to get user preferences");
    }
  }
}

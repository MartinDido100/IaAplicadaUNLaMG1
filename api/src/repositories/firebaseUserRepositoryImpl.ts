import type { UserRepository } from "./interfaces/userRepository.js";
import type { AuthData, User } from "../models/index.js";
import { auth, db } from "../utils/firebaseClient.js";
import { UserRecord } from "firebase-admin/auth";
import { DependencyException, NotFoundException } from "../utils/index.js";

export class FirebaseUserRepositoryImpl implements UserRepository {

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRecord: UserRecord | null = await auth.getUserByEmail(email);

      return userRecord ? { id: userRecord.uid, email: userRecord.email!!, displayName: userRecord.displayName!! } : null;
    } catch (error) {
      throw new DependencyException("User not found");
    }
  }

  public async createUser(email: string, displayName: string): Promise<User> {
    try {
      const userRecord: UserRecord = await auth.createUser({
        email,
        displayName,
      });
      return { id: userRecord.uid, email: userRecord.email!!, displayName };
    } catch (error) {
      throw new DependencyException("Failed to create user");
    }
  }
}
import { UserRecord } from "firebase-admin/auth";
import type { User } from "../models/index.js";
import { auth } from "../utils/firebaseClient.js";
import { DependencyException } from "../utils/index.js";
import type { UserRepository } from "./interfaces/userRepository.js";

export class FirebaseUserRepositoryImpl implements UserRepository {
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userRecord: UserRecord | null = await auth.getUserByEmail(email);

      return userRecord
        ? {
            id: userRecord.uid,
            email: userRecord.email!!,
            displayName: userRecord.displayName!!,
          }
        : null;
    } catch (error) {
      throw new DependencyException("User not found");
    }
  }

  public async createUser(
    email: string,
    displayName: string,
    password: string,
  ): Promise<User> {
    try {
      const userRecord: UserRecord = await auth.createUser({
        email,
        displayName,
        password,
      });
      return { id: userRecord.uid, email: userRecord.email!!, displayName };
    } catch (error) {
      throw new DependencyException("Failed to create user");
    }
  }
}

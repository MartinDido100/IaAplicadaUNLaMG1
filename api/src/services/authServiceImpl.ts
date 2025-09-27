import { UserRecord } from "firebase-admin/auth";
import jwt from "jsonwebtoken";
import type { AuthData, UserDto } from "../models/index.js";
import { auth, db } from "../utils/firebaseClient.js";
import { Constants, NotFoundException } from "../utils/index.js";
import type { AuthService } from "./interfaces/authService.js";

export class AuthServiceImpl implements AuthService {
  async login(data: AuthData): Promise<UserDto> {
    try {
      const firebaseUser: UserRecord | null = await this.getUserByEmail(
        data.email,
      );

      if (!firebaseUser) {
        throw new NotFoundException("User not found");
      }

      await this.updateUserLogs(data, firebaseUser.uid);

      const token = this.generateToken(data.email);

      return {
        token,
        email: data.email,
        displayName: firebaseUser.displayName || "",
      };
    } catch (error) {
      throw new NotFoundException("User not found");
    }
  }

  async signup(data: AuthData): Promise<UserDto> {
    let uid: string;

    let firebaseUser = await this.getUserByEmail(data.email);
    console.log("Firebase User:", firebaseUser); // Debugging line
    if (!firebaseUser) {
      firebaseUser = await auth.createUser({
        email: data.email,
        displayName: data.name,
      });
    }
    uid = firebaseUser.uid;

    await this.updateUserLogs(data, uid);

    const token = this.generateToken(data.email);

    return { token, email: data.email, displayName: data.name };
  }

  private generateToken(email: string): string {
    return jwt.sign({ id: email }, Constants.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  private async getUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      return (await auth.getUserByEmail(email)) || null;
    } catch (error) {
      return null;
    }
  }

  private async updateUserLogs(data: AuthData, uid: string): Promise<void> {
    const userData: any = {
      email: data.email,
      updatedAt: new Date(),
    };

    // Agregar displayName solo si está definido
    if (data.name) {
      userData.displayName = data.name;
    }

    await db.collection("users").doc(uid).set(userData, { merge: true });
  }
}

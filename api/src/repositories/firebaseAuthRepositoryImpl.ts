import { db } from "../utils/firebaseClient.js";
import type { AuthRepository } from "./interfaces/authRepository.js";

export class FirebaseAuthRepositoryImpl implements AuthRepository {
  async saveRefreshToken(uid: string, refreshToken: string): Promise<void> {
    await db.collection("sessions").doc(uid).set(
      {
        refreshToken,
        refreshTokenCreatedAt: new Date(),
      },
      { merge: true },
    );
  }

  async getRefreshToken(uid: string): Promise<string | null> {
    const sessionDoc = await db.collection("sessions").doc(uid).get();
    return sessionDoc.exists ? sessionDoc.data()?.refreshToken || null : null;
  }
}

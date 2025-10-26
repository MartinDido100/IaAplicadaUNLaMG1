import dotenv from "dotenv";
import type { StringValue } from "ms";
dotenv.config();

export class Constants {
  static JWT_SECRET: string = process.env.JWT_SECRET!;
  static JWT_REFRESH_SECRET: string =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!;
  static ACCESS_TOKEN_EXPIRATION: StringValue = "15m";
  static REFRESH_TOKEN_EXPIRATION: StringValue = "7d";
  static FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY!;
  static FIREBASE_API_URL: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_API_KEY}`;
  static FIREBASE_SIGNUP_URL: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.FIREBASE_API_KEY}`;
  static GEMINI_API_KEY: string = process.env.GEMINI_API_KEY!;
  static GEMINI_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.GEMINI_API_KEY}`;
  static TMDB_TOKEN: string = process.env.TMDB_TOKEN!;
  static GROQ_API_KEY: string = process.env.GROQ_API_KEY!;
  static GROQ_API_URL: string = "https://api.groq.com/openai/v1/chat/completions";
  static CORS_WHITELIST: string[] =
    process.env.CORS_WHITELIST != null
      ? process.env.CORS_WHITELIST.split(", ")
      : [];
}

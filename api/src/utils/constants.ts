import dotenv from "dotenv";
dotenv.config();

export class Constants {
  static JWT_SECRET: string = process.env.JWT_SECRET!;
  static JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "1h"; // Valor por defecto
  static GEMINI_API_KEY: string = process.env.GEMINI_API_KEY || "jhaksjkasjak";
  static GEMINI_API_URL: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.GEMINI_API_KEY}`;
  static TMDB_TOKEN: string = process.env.TMDB_TOKEN!;
  static CORS_WHITELIST: string[] =
    process.env.CORS_WHITELIST != null
      ? process.env.CORS_WHITELIST.split(", ")
      : [];
}

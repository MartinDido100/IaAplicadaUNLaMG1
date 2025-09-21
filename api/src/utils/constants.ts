export class Constants {
  static JWT_SECRET: string = process.env.JWT_SECRET!;
  static JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '1h'; // Valor por defecto
  static GEMINI_API_KEY: string = process.env.GEMINI_API_KEY!;
  static GEMINI_API_URL: string =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.GEMINI_API_KEY}`;
  static TMDB_TOKEN: string = process.env.TMDB_TOKEN!;
}

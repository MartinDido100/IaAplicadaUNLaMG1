export enum Duration {
  SHORT = "corta",
  MEDIUM = "media",
  LONG = "larga",
}

export enum Audience {
  CHILDREN = "niños",
  FAMILY = "familia",
  TEENS = "adolescentes",
  ADULTS = "adultos",
}

export enum Mood {
  HAPPY = "feliz",
  SAD = "triste",
  EXCITED = "emocionado",
  ROMANTIC = "romántico",
  SCARY = "aterrador",
  REFLECTIVE = "reflexivo",
  INSPIRED = "inspirado",
  EPIC = "epico",
}

export interface RecommendationPromptDto {
  textPrompt: string;
  genres: string[];
  moods: Mood[];
  audiences: Audience[];
  durations: Duration[];
}

export interface RecommendationOutput {
  recommendedMovies: string[];
}

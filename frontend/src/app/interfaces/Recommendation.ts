import { Movie } from "./Movie";

export interface RecommendationPrompt {
    textPrompt: string;
    genres: string[];
    mood: Mood[];
    audience: Audience[];
    duration: Duration[];
}

export enum Duration {
    SHORT = "corta",
    MEDIUM = "media",
    LONG = "larga"
}

export enum Audience {
    CHILDREN = "niños",
    FAMILY = "familia",
    TEENS = "adolescentes",
    ADULTS = "adultos"
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

export interface RecommendationResponse {
    movies: Movie[];
}

export interface Preference {
    name: string;
    date: string;
    email: string;
    tmdbId: number;
}

export interface PreviousSelectionsResponse {
    preferences: Preference[];
}
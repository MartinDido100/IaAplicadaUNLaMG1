export interface RecommendationPrompt {
    textPrompt: string;
    genres: string[];
    mood: Mood[];
    audience: Audience[];
    duration: Duration[];
}

export enum Duration {
    SHORT = "short",
    MEDIUM = "medium",
    LONG = "long"
}

export enum Audience {
    CHILDREN = "children",
    FAMILY = "family",
    TEENS = "teens",
    ADULTS = "adults"
}

export enum Mood {
    HAPPY = "happy",
    SAD = "sad",
    EXCITED = "excited",
    ROMANTIC = "romantic",
    SCARY = "scary",
    REFLECTIVE = "reflective",
    INSPIRED = "inspired",
    EPIC = "epic",
}
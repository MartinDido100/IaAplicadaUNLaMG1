import type {
  PreferenceDto,
  PreferencesHistoryDto,
  RecommendationDto,
  RecommendationPromptDto,
} from "../../models/index.js";

export interface MovieRecommendationService {
  recommendMovies(promptParameters: RecommendationPromptDto): Promise<RecommendationDto>;
  saveUserPreference(email: string, preference: PreferenceDto): Promise<void>;
  getUserPreferences(email: string): Promise<PreferencesHistoryDto[]>;
}

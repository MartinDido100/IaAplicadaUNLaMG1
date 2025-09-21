import type { RecommendationOutput, RecommendationPromptDto } from "../../models/movieRecommendation.js";

export interface MovieRecommendationService {
  recommendMovies(promptParameters: RecommendationPromptDto): Promise<RecommendationOutput>;
}
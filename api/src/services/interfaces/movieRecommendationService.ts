import type {
  RecommendationDto,
  RecommendationPromptDto,
} from "../../models/index.js";

export interface MovieRecommendationService {
  recommendMovies(
    promptParameters: RecommendationPromptDto,
  ): Promise<RecommendationDto>;
}

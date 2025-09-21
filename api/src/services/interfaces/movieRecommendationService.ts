import type { RecommendationDto } from "../../models/movie.js";
import type { RecommendationPromptDto } from "../../models/movieRecommendation.js";

export interface MovieRecommendationService {
  recommendMovies(
    promptParameters: RecommendationPromptDto,
  ): Promise<RecommendationDto>;
}

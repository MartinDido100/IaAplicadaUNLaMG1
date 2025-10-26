import type { RecommendationOutput } from "../../models/index.js";

export interface EngineService {
  getRecommendation(): Promise<RecommendationOutput>;
}
import type { RecommendationOutput } from "../../models/index.js";

export interface EngineService {
  getRecommendation(prompt: string): Promise<RecommendationOutput>;
}
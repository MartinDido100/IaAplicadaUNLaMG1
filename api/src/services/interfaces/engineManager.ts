import type { EngineService } from "./index.js";

export interface EngineManager {
  getRecommendationEngine(name: string): EngineService;
}
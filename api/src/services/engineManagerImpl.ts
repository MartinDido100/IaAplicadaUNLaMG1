import { GeminiEngineService, type EngineManager, type EngineService } from "./index.js";

export class EngineManagerImpl implements EngineManager {
  public getRecommendationEngine(name: string): EngineService {
    switch (name) {
      case "gemini":
        return new GeminiEngineService();
      default:
        throw new Error(`Engine "${name}" not supported.`);
    }
  }
}
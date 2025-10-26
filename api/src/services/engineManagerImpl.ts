import { GeminiEngineService, GroqEngineService, type EngineManager, type EngineService } from "./index.js";

export class EngineManagerImpl implements EngineManager {
  public getRecommendationEngine(name: string): EngineService {
    switch (name) {
      case "gemini":
        return new GeminiEngineService();
      case "groq":
        return new GroqEngineService();
      default:
        throw new Error(`Engine "${name}" not supported.`);
    }
  }
}
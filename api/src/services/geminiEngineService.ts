import type { AxiosResponse } from "axios";
import { Constants } from "../utils/index.js";
import { log } from "debug";
import axios from "axios";
import type { EngineService } from "./index.js";
import type { RecommendationOutput } from "../models/recommendationInterfaces.js";

export class GeminiEngineService implements EngineService {
  async getRecommendation(prompt: string): Promise<RecommendationOutput> {
    const response: AxiosResponse = await axios.post(
      Constants.GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } },
    );
    log("Method called: axios.post to Gemini API");

    if (response.status !== 200) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const recommendationOutput: RecommendationOutput = this.parseGeminiResponse(
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null,
    );
    log("Method called: parseGeminiResponse");

    return recommendationOutput;
  }

  private parseGeminiResponse(responseText: string): RecommendationOutput {
    if (!responseText) {
      throw new Error("Empty answer from Gemini.");
    }
    const jsonMatch: RegExpMatchArray | null = responseText.match(/\{[\s\S]*\}/);
    const jsonStr: string = jsonMatch ? jsonMatch[0] : responseText;
    const parsed: RecommendationOutput = JSON.parse(jsonStr);

    return parsed;
  }
}
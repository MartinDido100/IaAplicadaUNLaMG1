import type { AxiosResponse } from "axios";
import { Constants } from "../utils/index.js";
import { log } from "debug";
import axios from "axios";
import type { EngineService } from "./index.js";
import type { RecommendationOutput } from "../models/recommendationInterfaces.js";

export class GeminiEngineService implements EngineService {
  async getRecommendation(): Promise<RecommendationOutput> {
    console.time("Step 2: Gemini API Request");
    const response: AxiosResponse = await axios.post(
      Constants.GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } },
    );
    log("Method called: axios.post to Gemini API");
    console.timeEnd("Step 2: Gemini API Request");

    if (response.status !== 200) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    console.time("Step 3: Parse Gemini Response");
    const recommendationOutput: RecommendationOutput = this.parseGeminiResponse(
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null,
    );
    log("Method called: parseGeminiResponse");
    console.timeEnd("Step 3: Parse Gemini Response");

    return recommendationOutput;
  }

  private parseGeminiResponse(responseText: string): RecommendationOutput {
    if (!responseText) {
      throw new Error("Respuesta vacía de Gemini.");
    }
    const jsonMatch: RegExpMatchArray | null = responseText.match(/\{[\s\S]*\}/);
    const jsonStr: string = jsonMatch ? jsonMatch[0] : responseText;
    const parsed: RecommendationOutput = JSON.parse(jsonStr);

    return parsed;
  }
}
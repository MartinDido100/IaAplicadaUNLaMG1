import axios from "axios";
import type { RecommendationOutput } from "../models/index.js";
import type { EngineService } from "./interfaces/index.js";
import { Constants } from "../utils/constants.js";

export class GroqEngineService implements EngineService {
  async getRecommendation(prompt: string): Promise<RecommendationOutput> {
    const response = await axios.post(
      Constants.GROQ_API_URL,
      {
        model: "llama-3.1-8b-instant", 
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${Constants.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    return this.parseGroqResponse(reply);
  }

  private parseGroqResponse(responseText: string): RecommendationOutput {
    if (!responseText) {
      throw new Error("Empty answer from Groq.");
    }

    const jsonMatch: RegExpMatchArray | null = responseText.match(/\{[\s\S]*\}/);
    const jsonStr: string = jsonMatch ? jsonMatch[0] : responseText;

    const parsed: RecommendationOutput = JSON.parse(jsonStr);
    return parsed;
  }
}

import type {
  Movie,
  RecommendationDto,
  RecommendationOutput,
  RecommendationPromptDto,
} from "../models/index.js";
import { Constants } from "../utils/index.js";
import type { MovieRecommendationService } from "./interfaces/index.js";

import type { AxiosResponse } from "axios";
import axios from "axios";
import type { TmdbService } from "./tmdbService.js";

export class GeminiRecommenderServiceImpl
  implements MovieRecommendationService
{
  constructor(private readonly tmdbService: TmdbService) {}

  async recommendMovies(
    promptParameters: RecommendationPromptDto,
  ): Promise<RecommendationDto> {
    const prompt: string = this.createPrompt(promptParameters);

    const response: AxiosResponse = await axios.post(
      Constants.GEMINI_API_URL,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } },
    );

    if (response.status !== 200) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const recommendationOutput: RecommendationOutput = this.parseGeminiResponse(
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null,
    );

    const tmdbResponse = await this.tmdbService.findMoviesByImdbIds(
      recommendationOutput.movies,
    );
    const movies: Movie[] = tmdbResponse.response.filter(
      (movie): movie is Movie => movie !== null,
    );

    return { movies };
  }

  private createPrompt(promptParameters: RecommendationPromptDto): string {
    return [
      "Eres un recomendador de cine conciso.",
      `Prompt del usuario: "${promptParameters.textPrompt}".`,
      `Estados de ánimo que generará la pelicula: ${promptParameters.moods?.length ? promptParameters.moods.join(", ") : ""}`,
      `Géneros solicitados: ${promptParameters.genres?.length ? promptParameters.genres.join(", ") : ""}`,
      `Audiencias objetivo: ${promptParameters.audiences?.length ? promptParameters.audiences.join(", ") : ""}`,
      `Duraciones aproximadas: ${promptParameters.durations?.length ? promptParameters.durations.join(", ") : ""}`,
      "En base a estos parámetros de entrada, selecciona 5 películas que estén tanto entre las mejor rankeadas en IMDb (Top Rated) como entre las que están en tendencia actualmente (Trending).",
      "Devuelve SOLO un JSON válido con este formato:",
      `{"movies":[{"title":"<título>","date":"<aaaa-mm-dd>","imdbId":"<id de IMDb>","reason":"<por qué es adecuada>"}]}`,
      "No agregues texto fuera del JSON.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  private parseGeminiResponse(responseText: string): RecommendationOutput {
    if (!responseText) {
      throw new Error("Respuesta vacía de Gemini.");
    }
    const jsonMatch: RegExpMatchArray | null =
      responseText.match(/\{[\s\S]*\}/);
    const jsonStr: string = jsonMatch ? jsonMatch[0] : responseText;
    const parsed: RecommendationOutput = JSON.parse(jsonStr);

    return parsed;
  }
}

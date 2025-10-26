import type {
  Movie,
  PreferenceDto,
  PreferencesHistoryDto,
  RecommendationDto,
  RecommendationOutput,
  RecommendationPromptDto,
} from "../models/index.js";
import type { EngineManager, EngineService, MovieRecommendationService } from "./interfaces/index.js";
import debug from "debug";
import type { TmdbService } from "./tmdbService.js";
import type { UserRepository } from "../repositories/index.js";

const log = debug("app:movieRecommendationServiceImpl");

export class MovieRecommendationServiceImpl implements MovieRecommendationService {
  private engineService: EngineService;

  constructor(private readonly tmdbService: TmdbService, private readonly engineManager: EngineManager, private readonly userRepository: UserRepository) {
    this.engineService = engineManager.getRecommendationEngine("gemini");
  }

  async recommendMovies(email: string, promptParameters: RecommendationPromptDto): Promise<RecommendationDto> {
    // Adding time measurement for performance analysis
    console.time("Total Processing Time");

    console.time("Step 1: Generate Prompt");
    const preferencesHistory = await this.getUserPreferences(email);
    log("Method called: getUserPreferences");
    const prompt: string = this.createPrompt(promptParameters, preferencesHistory);
    log("Method called: createPrompt");
    console.timeEnd("Step 1: Generate Prompt");

    let recommendationOutput: RecommendationOutput
    try {
      recommendationOutput = await this.engineService.getRecommendation();
    } catch (error) {
      log("Error getting recommendation from gemini engine service:", error);
      this.engineService = this.engineManager.getRecommendationEngine("chatGPT");
      recommendationOutput = await this.engineService.getRecommendation();
    }

    console.time("Step 4: TMDb Service Call");
    const tmdbResponse = await this.tmdbService.findMoviesByImdbIds(
      recommendationOutput.movies,
    );
    log("Method called: findMoviesByImdbIds");
    log(
      "Number of promises processed in TMDb Service:",
      recommendationOutput.movies.length,
    );
    console.timeEnd("Step 4: TMDb Service Call");

    if (tmdbResponse.response && tmdbResponse.response.length < 5) {
      console.time("Step 5: TMDb Fallback Call");
      this.tmdbService.findMoviesByName(recommendationOutput.movies);
      log("Method called: findMoviesByName");
      console.timeEnd("Step 5: TMDb Fallback Call");
    }

    console.time("Step 6: Filter Movies");
    const movies: Movie[] = tmdbResponse.response.filter(
      (movie): movie is Movie => movie !== null,
    );
    log("Filtering completed. Number of valid movies:", movies.length);
    console.timeEnd("Step 6: Filter Movies");

    console.timeEnd("Total Processing Time");

    return { movies };
  }

  private createPrompt(promptParameters: RecommendationPromptDto, preferencesHistory: PreferencesHistoryDto[]): string {
    return [
      "Eres un recomendador de cine conciso.",
      `Prompt del usuario: "${promptParameters.textPrompt}".`,
      `Estados de ánimo que generará la pelicula: ${promptParameters.moods?.length ? promptParameters.moods.join(", ") : ""}`,
      `Géneros solicitados: ${promptParameters.genres?.length ? promptParameters.genres.join(", ") : ""}`,
      `Audiencias objetivo: ${promptParameters.audiences?.length ? promptParameters.audiences.join(", ") : ""}`,
      `Duraciones aproximadas: ${promptParameters.durations?.length ? promptParameters.durations.join(", ") : ""}`,
      `Preferencias del usuario: ${preferencesHistory.flatMap((history: PreferencesHistoryDto) => history.preferences).map((pref) => pref.name).join(", ")}`,
      "En base a estos parámetros de entrada, selecciona 5 películas que estén tanto entre las mejor rankeadas en IMDb (Top Rated) como entre las que están en tendencia actualmente (Trending).",
      "Si los parámetros de entrada del usuario incluyen un tipo de película que coincida con alguna de las películas registradas en su historial, selecciona al menos una recomendación que pertenezca a la misma saga o franquicia que una de esas películas.",
      "Devuelve SOLO un JSON válido con este formato:",
      `{"movies":[{"title":"<título>","date":"<aaaa-mm-dd>","imdbId":"<id de IMDb>","reason":"<por qué es adecuada>"}]}`,
      "No agregues texto fuera del JSON.",
    ].filter(Boolean).join("\n");
  }

  async saveUserPreference(email: string, preference: PreferenceDto): Promise<void> {
    await this.userRepository.saveUserPreference(email, preference);
  }

  async getUserPreferences(email: string): Promise<PreferencesHistoryDto[]> {
    return await this.userRepository.getUserPreferences(email);
  }
}

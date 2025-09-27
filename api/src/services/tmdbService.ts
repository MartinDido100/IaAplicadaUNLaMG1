import type { AxiosResponse } from "axios";
import type { Movie } from "../models/movie.js";
import type { RecommendedMovie } from "../models/movieRecommendation.js";
import { tmdbClient } from "../utils/index.js";

export class TmdbService {
  constructor() {}

  async findMoviesByImdbIds(recommendedMovies: RecommendedMovie[]) {
    // Adding detailed time measurements for each step
    console.time("Overall Execution");

    // Adding detailed logs to identify potential bottlenecks
    console.log(
      "Starting findMoviesByImdbIds with recommendedMovies:",
      recommendedMovies,
    );

    console.time("Step 1: Creating Promises");
    const promises = recommendedMovies.map((movie) => {
      console.log(`Creating promise for movie with IMDb ID: ${movie.imdbId}`);
      return tmdbClient.get(`/find/${movie.imdbId}`, {
        params: { external_source: "imdb_id" },
      });
    });
    console.log("Number of promises created:", promises.length);
    console.timeEnd("Step 1: Creating Promises");

    console.time("Step 2: API Requests");
    const results = await Promise.allSettled(promises);
    console.log("Number of API requests processed:", results.length);
    console.timeEnd("Step 2: API Requests");

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Request ${index} succeeded.`);
      } else {
        console.error(`Request ${index} failed.`);
      }
    });

    console.time("Step 3: Processing Results");
    const response = await Promise.all(
      results.map(async (res, i) => {
        if (res.status === "fulfilled") {
          const rawData = res.value.data;
          console.log(`Processing result ${i}.`);
          const movieData = rawData.movie_results?.[0];
          if (!movieData) {
            console.warn(`No movie_results found for result ${i}.`);
            return null;
          }
          return this.mapToMovie(movieData);
        } else {
          console.error(`Skipping result ${i} due to error.`);
          throw new Error(`Error fetching movie`);
        }
      }),
    );
    console.log("Number of results processed:", response.length);
    console.timeEnd("Step 3: Processing Results");

    console.timeEnd("Overall Execution");

    return { response };
  }

  async findMoviesByName(recommendedMovies: RecommendedMovie[]) {
    const promises: Promise<AxiosResponse>[] = recommendedMovies.map((movie) =>
      tmdbClient.get("/search/movie", {
        params: { query: movie.title },
      }),
    );

    const response = await this.handlePromises(promises);

    return { response };
  }

  private async handlePromises(promises: Promise<AxiosResponse>[]) {
    const results = await Promise.allSettled(promises);
    const response = await Promise.all(
      results.map(async (res, i) => {
        if (res.status === "fulfilled") {
          const rawData = res.value.data;

          // Extraer el primer resultado de movie_results si existe
          const movieData = rawData.movie_results?.[0];
          if (!movieData) {
            console.warn("No movie_results found for", rawData);
            return null;
          }

          return this.mapToMovie(movieData);
        } else {
          throw new Error(`Error fetching movie`);
        }
      }),
    );
    return response;
  }

  private mapToMovie(rawData: any): Movie | null {
    try {
      if (!rawData || typeof rawData.id !== "number") {
        console.warn("Invalid movie data: missing or invalid id", rawData);
        return null;
      }

      // Mapear con valores por defecto para campos opcionales
      const movie: Movie = {
        adult: Boolean(rawData.adult),
        backdrop_path: rawData.backdrop_path || "",
        belongs_to_collection: this.mapCollection(
          rawData.belongs_to_collection,
        ),
        budget: Number(rawData.budget) || 0,
        genres: this.mapGenres(rawData.genres),
        homepage: rawData.homepage || "",
        id: rawData.id,
        imdb_id: rawData.imdb_id || "",
        origin_country: Array.isArray(rawData.origin_country)
          ? rawData.origin_country
          : [],
        original_language: rawData.original_language || "",
        original_title: rawData.original_title || "",
        overview: rawData.overview || "",
        popularity: Number(rawData.popularity) || 0,
        poster_path: rawData.poster_path || "",
        production_companies: this.mapProductionCompanies(
          rawData.production_companies,
        ),
        production_countries: this.mapProductionCountries(
          rawData.production_countries,
        ),
        release_date: rawData.release_date || "",
        revenue: Number(rawData.revenue) || 0,
        runtime: Number(rawData.runtime) || 0,
        spoken_languages: this.mapSpokenLanguages(rawData.spoken_languages),
        status: rawData.status || "",
        tagline: rawData.tagline || "",
        title: rawData.title || "",
        video: Boolean(rawData.video),
        vote_average: Number(rawData.vote_average) || 0,
        vote_count: Number(rawData.vote_count) || 0,
      };

      return movie;
    } catch (error) {
      console.error("Error mapping movie data:", error, rawData);
      return null;
    }
  }

  private mapCollection(rawCollection: any): any {
    if (!rawCollection || typeof rawCollection !== "object") {
      return null;
    }

    return {
      id: Number(rawCollection.id) || 0,
      name: rawCollection.name || "",
      poster_path: rawCollection.poster_path || "",
      backdrop_path: rawCollection.backdrop_path || "",
    };
  }

  private mapGenres(rawGenres: any): any[] {
    if (!Array.isArray(rawGenres)) {
      return [];
    }

    return rawGenres
      .filter((genre) => genre && typeof genre.id === "number")
      .map((genre) => ({
        id: genre.id,
        name: genre.name || "",
      }));
  }

  private mapProductionCompanies(rawCompanies: any): any[] {
    if (!Array.isArray(rawCompanies)) {
      return [];
    }

    return rawCompanies
      .filter((company) => company && typeof company.id === "number")
      .map((company) => ({
        id: company.id,
        logo_path: company.logo_path || "",
        name: company.name || "",
        origin_country: company.origin_country || "",
      }));
  }

  private mapProductionCountries(rawCountries: any): any[] {
    if (!Array.isArray(rawCountries)) {
      return [];
    }

    return rawCountries
      .filter((country) => country && country.iso_3166_1)
      .map((country) => ({
        iso_3166_1: country.iso_3166_1,
        name: country.name || "",
      }));
  }

  private mapSpokenLanguages(rawLanguages: any): any[] {
    if (!Array.isArray(rawLanguages)) {
      return [];
    }

    return rawLanguages
      .filter((lang) => lang && lang.iso_639_1)
      .map((lang) => ({
        english_name: lang.english_name || "",
        iso_639_1: lang.iso_639_1,
        name: lang.name || "",
      }));
  }

  async processMovies(recommendedMovies: RecommendedMovie[]) {
    // Adding time measurement for performance analysis
    console.time("Total Processing Time");

    const imdbResponse = await this.findMoviesByImdbIds(recommendedMovies);
    console.log("IMDB Response:", imdbResponse);

    // Assuming the main processing function is here
    console.time("Main Processing");
    // Call the main processing logic
    console.timeEnd("Main Processing");

    console.timeEnd("Total Processing Time");
  }
}

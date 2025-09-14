import type { Movie } from '../models/index.js';

export interface IMovieService {
  getMovieById(movieId: number): Promise<Movie | null>;
}

export class MovieService implements IMovieService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TMDB_TOKEN || '';
    if (!this.apiKey) {
      console.warn('TMDB API Key not provided. Movie service may not work correctly.');
    }
  }

  async getMovieById(movieId: number): Promise<Movie | null> {
    try {
      if (!this.apiKey) {
        throw new Error('TMDB API Key is required');
      }

      const url = `${this.baseUrl}/movie/${movieId}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; 
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData = await response.json();
      
      // Validar y mapear la respuesta de forma segura
      const movieData = this.mapToMovie(rawData);
      return movieData;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      throw error;
    }
  }

  private mapToMovie(rawData: any): Movie | null {
    try {
      // Validar campos obligatorios
      if (!rawData || typeof rawData.id !== 'number') {
        console.warn('Invalid movie data: missing or invalid id');
        return null;
      }

      // Mapear con valores por defecto para campos opcionales
      const movie: Movie = {
        adult: Boolean(rawData.adult),
        backdrop_path: rawData.backdrop_path || '',
        belongs_to_collection: this.mapCollection(rawData.belongs_to_collection),
        budget: Number(rawData.budget) || 0,
        genres: this.mapGenres(rawData.genres),
        homepage: rawData.homepage || '',
        id: rawData.id,
        imdb_id: rawData.imdb_id || '',
        origin_country: Array.isArray(rawData.origin_country) ? rawData.origin_country : [],
        original_language: rawData.original_language || '',
        original_title: rawData.original_title || '',
        overview: rawData.overview || '',
        popularity: Number(rawData.popularity) || 0,
        poster_path: rawData.poster_path || '',
        production_companies: this.mapProductionCompanies(rawData.production_companies),
        production_countries: this.mapProductionCountries(rawData.production_countries),
        release_date: rawData.release_date || '',
        revenue: Number(rawData.revenue) || 0,
        runtime: Number(rawData.runtime) || 0,
        spoken_languages: this.mapSpokenLanguages(rawData.spoken_languages),
        status: rawData.status || '',
        tagline: rawData.tagline || '',
        title: rawData.title || '',
        video: Boolean(rawData.video),
        vote_average: Number(rawData.vote_average) || 0,
        vote_count: Number(rawData.vote_count) || 0
      };

      return movie;
    } catch (error) {
      console.error('Error mapping movie data:', error);
      return null;
    }
  }

  private mapCollection(rawCollection: any): any {
    if (!rawCollection || typeof rawCollection !== 'object') {
      return null;
    }

    return {
      id: Number(rawCollection.id) || 0,
      name: rawCollection.name || '',
      poster_path: rawCollection.poster_path || '',
      backdrop_path: rawCollection.backdrop_path || ''
    };
  }

  private mapGenres(rawGenres: any): any[] {
    if (!Array.isArray(rawGenres)) {
      return [];
    }

    return rawGenres
      .filter(genre => genre && typeof genre.id === 'number')
      .map(genre => ({
        id: genre.id,
        name: genre.name || ''
      }));
  }

  private mapProductionCompanies(rawCompanies: any): any[] {
    if (!Array.isArray(rawCompanies)) {
      return [];
    }

    return rawCompanies
      .filter(company => company && typeof company.id === 'number')
      .map(company => ({
        id: company.id,
        logo_path: company.logo_path || '',
        name: company.name || '',
        origin_country: company.origin_country || ''
      }));
  }

  private mapProductionCountries(rawCountries: any): any[] {
    if (!Array.isArray(rawCountries)) {
      return [];
    }

    return rawCountries
      .filter(country => country && country.iso_3166_1)
      .map(country => ({
        iso_3166_1: country.iso_3166_1,
        name: country.name || ''
      }));
  }

  private mapSpokenLanguages(rawLanguages: any): any[] {
    if (!Array.isArray(rawLanguages)) {
      return [];
    }

    return rawLanguages
      .filter(lang => lang && lang.iso_639_1)
      .map(lang => ({
        english_name: lang.english_name || '',
        iso_639_1: lang.iso_639_1,
        name: lang.name || ''
      }));
  }

  // Método adicional para buscar películas por título (opcional)
  async searchMovies(query: string): Promise<Movie[]> {
    try {
      if (!this.apiKey) {
        throw new Error('TMDB API Key is required');
      }

      const url = `${this.baseUrl}/search/movie?query=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawResults = data.results || [];
      
      // Mapear cada resultado de forma segura
      const mappedMovies = rawResults
        .map((rawMovie: any) => this.mapToMovie(rawMovie))
        .filter((movie: Movie | null) => movie !== null) as Movie[];
      
      return mappedMovies;
    } catch (error) {
      console.error(`Error searching movies with query "${query}":`, error);
      throw error;
    }
  }
}

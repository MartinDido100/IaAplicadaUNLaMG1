import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Genre, Movie, MovieApiResponse } from '../interfaces/Movie';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiHeaders = new HttpHeaders({
    Authorization: `Bearer ${environment.movieApiToken}`,
  });
  genres = signal<Genre[]>([]);

  getPopularMovies() {
    const url = `${environment.movieApiUrl}/movie/popular`;
    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders }).pipe(
      map(response => response.results.map(movie => {
        return { ...movie, poster_path: `${environment.imageBaseUrl}${movie.poster_path}` };
      }).slice(0, 4)),
    );
  }

  getTopRatedMovies() {
    const url = `${environment.movieApiUrl}/movie/top_rated`;
    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders }).pipe(
      map(response => response.results.map(movie => {
        return { ...movie, poster_path: `${environment.imageBaseUrl}${movie.poster_path}` };
      }).slice(0, 4)),
    );
  }

  getGenres() {
    const url = `${environment.movieApiUrl}/genre/movie/list`;
    const queryParams = {
      language: 'es'
    };
    return this.http.get<{ genres: { id: number; name: string }[] }>(url, { headers: this.apiHeaders, params: queryParams }).pipe(
      map(response => response.genres),
      tap(genres => this.genres.set(genres))
    );
  }
}

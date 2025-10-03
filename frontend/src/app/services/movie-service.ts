import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Genre, MovieApiResponse } from '../interfaces/Movie';
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
  private readonly languageParams = {
    language: 'es'
  };

  getImage(posterPath: string): string {
    return `${environment.imageBaseUrl}${posterPath}`;
  }

  getPopularMovies() {
    const url = `${environment.movieApiUrl}/movie/popular`;
    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders, params: this.languageParams }).pipe(
      map(response => response.results.slice(0, 5))
    );
  }

  getTopRatedMovies() {
    const url = `${environment.movieApiUrl}/movie/top_rated`;
    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders, params: this.languageParams }).pipe(
      map(response => response.results.slice(0, 5)),
    );
  }

  getGenres() {
    const url = `${environment.movieApiUrl}/genre/movie/list`;
    return this.http.get<{ genres: { id: number; name: string }[] }>(url, { headers: this.apiHeaders, params: this.languageParams }).pipe(
      map(response => response.genres),
      tap(genres => this.genres.set(genres))
    );
  }
}

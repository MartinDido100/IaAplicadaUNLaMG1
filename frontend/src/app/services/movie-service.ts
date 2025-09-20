import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie, MovieApiResponse } from '../interfaces/Movie';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiHeaders = new HttpHeaders({
    Authorization: `Bearer ${environment.movieApiToken}`,
  });

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
}

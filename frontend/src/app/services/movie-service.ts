import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  
  getMovieList(page: number = 1, genreId?: number, year?: number) {
    let queryParams = new HttpParams();

    queryParams = queryParams.set('language', 'es');
    queryParams = queryParams.set('sort_by', 'popularity.desc');
    queryParams = queryParams.set('page', page.toString());

    if (genreId) {
      queryParams = queryParams.set('with_genres', genreId.toString());
    }
    
    if (year) {
      queryParams = queryParams.set('primary_release_year', year.toString());
    }

    const url = `${environment.movieApiUrl}/discover/movie`;

    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders, params: queryParams })  
  }

  getByQuery(query: string, page: number = 1) {
    // https://api.themoviedb.org/3/search/movie?query=shrek&include_adult=false&language=es&page=1
    let queryParams = new HttpParams();
    queryParams = queryParams.set('language', 'es');
    queryParams = queryParams.set('query', query);
    queryParams = queryParams.set('page', page.toString());

    const url = `${environment.movieApiUrl}/search/movie`;

    return this.http.get<MovieApiResponse>(url, { headers: this.apiHeaders, params: queryParams })  
  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie } from '../interfaces/Movie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly http = inject(HttpClient);

  getMovies() {
    const url = `${environment.movieApiUrl}movie/11`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${environment.movieApiToken}`,
    });

    return this.http.get<Movie>(url, { headers });
  }
}

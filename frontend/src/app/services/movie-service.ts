import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie } from '../interfaces/Movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUri = 'https://api.themoviedb.org/3/';
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYTA2ZjliM2VhNjA4ZGYyYzI0ZDhhZDI0Mjk4ODE2MyIsIm5iZiI6MTc1NzcyMTUxNy4xMjk5OTk5LCJzdWIiOiI2OGM0YjNhZDkxYjI0MGNmYzA0NDJiOWYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.UvMDHDX435jHmuyu_cszk6Nprde7HXSUrK0AhVDZOaE';

  private readonly http = inject(HttpClient);

  getMovies() {
    const url = `${this.apiUri}movie/11`;
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.http.get<Movie>(url, { headers });
  }
}

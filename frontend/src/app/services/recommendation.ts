import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PreviousSelectionsResponse, RecommendationPrompt, RecommendationResponse } from '../interfaces/Recommendation';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly http = inject(HttpClient);

  getRecommendations(prompt: RecommendationPrompt) {
    const url = `${environment.apiUrl}/recommendations`
    return this.http.post<RecommendationResponse>(url,prompt).pipe(
      map(response => {
        response.movies.sort((a, b) => b.vote_average - a.vote_average);
        return response;
      })
    ); 
  }

  saveSelection(movieId: number, name: string) {
    const url = `${environment.apiUrl}/recommendations/preferences/`;
    return this.http.put(url, { tmdbId: movieId, name });
  }

  getPreviousSelections() {
    const url = `${environment.apiUrl}/recommendations/preferences/`;
    return this.http.get<PreviousSelectionsResponse[]>(url);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RecommendationPrompt, RecommendationResponse } from '../interfaces/Recommendation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly http = inject(HttpClient);

  getRecommendations(prompt: RecommendationPrompt) {
    const url = `${environment.apiUrl}/recommendations`
    return this.http.post<RecommendationResponse>(url,prompt); 
  }
}
